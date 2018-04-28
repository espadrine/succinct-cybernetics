# Engineering

1. Define the desired features of a solution for your problem.
2. Break the problem into tractable subproblems.
3. Make the simplest working solution to each subproblem.
4. Compute all limits of your solution (performance, storage… even if the
   results are astronomically high).
5. Research the mathematical and physical laws causing those limits.
6. Improve the implementation.
7. When that is no longer enough, improve the design.

## Example problem: image store

1. We add images with `POST /images` which returns a string ID, and
   `GET /images/ID` returns the image.
2. We must generate unique IDs, store the image, associate an ID to a
   location in the store, get the image from its ID.
3. Generate the ID by incrementing a global variable, keep a vector of pointers
   to images in the heap, fetch an image by looking it up in the vector at the
   ID's index.
4. Limits:
   - Storage costs are about 6 €/GB and the maximum amount of images is about
   600 GB (about 0.6 million photos) since we must have a single server.
   - A 1 MB image takes about 10 ms gigabit ethernet throughput + 50 μs RAM
   throughput (unnoticeable) = 10 ms to load.
   (cf. [memory limits](./memory.md).)
   - The probability of data loss in a given year on a server with
   99.999% SLA for operating system uptime with a 3-min reboot (ie, averaging
   1.8 reboots a year) can be computed from a [Poisson](./statistics.md)
   distribution as 1-exp(-1.8) (about 0.8).
5. The price limit is about the diminishing returns of economies of scale of
   DRAM production and the infrastructure of its construction and distribution.
   The amount limit is about efficiently packing DRAM on a single board for
   cloud providers. The probability limit is about electrical volatility of DRAM
   state.

The latter is the primary issue to address. We can store images on disk instead,
on a drive mounted on /img, with the file name equal to the hex representation
of the 64-bit ID, eg. /img/000000000000000c for ID 12.

(Depending on how the file system deals with directories with a large number of
files, you may need to segment the key space: /img/a0/00000000000000a0 for ID
160, /img/ef/00000000deadbeef for ID 3735928559.)

- Storage reaches 40 €/TB, the maximum (still single-server) is about 100 TB
  (about 100 million photos).
- A 1 MB image takes 10 ms gigabit ethernet throughput + 10 ms disk throughput +
  10 ms disk latency = 30 ms.
- The probability of loss in a given year (aka. annualized failure rate) for a
  disk averaging 0.02 failures a year is `1-exp(-0.02)` (about 0.02).

Going with an SSD instead yields:
- 250 €/TB, maxing out at about 100 TB.
- A 1 MB image takes about 10 ms gigabit ethernet throughput + 1 μs drive
  throughput + 30 μs drive latency = 10 ms.
- The annualized failure rate is about 0.007.

From then on, you can increase by synchronizing multiple servers. A master
server holds a persisted map from ID to the storage server where the image is
stored, loads the data from there to RAM and transits it through.

When storing an image, the master server sends the image to the storage server
(10 ms) and they simultaneously write to drive: the image for the storage server
(30 μs latency + 1 μs throughput) and the mapping from ID to the storage server
for the master server.

Both when posting and getting the image, the image can be buffered instead of
being fully loaded by the metadata server and then transmitted, which reduces
image loading latency (time-to-first-byte) to just 500 μs round trip between
servers within a datacenter + 50 μs SSD latency = 550 μs. The full image will
still be loaded after 10 ms.

Buffering also reduces the amount of RAM necessary to the number of concurrent
requests multiplied by the size of the buffer, plus the mapping between ID and
storage server.

To reduce the RAM cost, the mapping can be put on disk with a **key-value
store** (eg. [RocksDB](http://rocksdb.org/)) without affecting latency (a write
is about 60 μs, a read 8 μs).

The new bottleneck is the storage of the mapping from ID to storage server.
- We can reach about 100 TB drive ÷ (64 bits ID + 32 bits index of storage
  server) = 8 trillion images (ignoring the overhead of storing into SST files).
- The death of the drive causes complete loss of the data, and it is still at an
  AFR of 0.7%.

We can mitigate the latter through backups. If we do them every B hours, get
P posts per hour and recover in R hours, we will lose 0.7 × (B + R) × P ÷ (P ×
8760) percent of posts a year (eg. a 99.9999% SLA for hourly backups with 100
posts per second and 2-minute recovery).
**Streaming replication** can get our SLA very high.

Individual storage servers can also fail, so we can replicate: we save images
to two servers in parallel, and we fetch it from the first server that is not
dead. The probability that any two replicas die within the time it takes to
rereplicate (say, 1h) is very low, 1-(1-8×10^-7)^I (where I is the number of
images), but at a million images, a loss is as likely as a coin toss.
**Trireplication** brings it down to 1-(1-6×10^-13)^I; you need a trillion
images for a loss to again be a coin toss.

(Another issue is that of [bitrot](./memory.md). A solution used in GFS (Google
File System) is to check for corruption by computing a checksum, and fetching
from one of the other two replicas if it doesn't match the stored checksum. Its
successor Colossus doesn't trireplicate, but stores a replica off-site and a
Reed-Solomon erasure code on a separate server in the datacenter. If a
corruption is found, the data is replaced by its remote replica.)

The new bottleneck is the throughput of image posts, since they all go through a
single server. Write frequency reaches 100 kHz [in some benchmarks][badger].

[badger]: https://blog.dgraph.io/post/badger/

To solve that, we rely on a **distributed key-value store**, such as etcd or
FoundationDB, which distribute writes through automatic segmentation of the key
space into chunks each assigned to a server, and through coordination of that
repartition and of writes by using Paxos or [Raft][] (two similar
[consensus algorithms](./synchronization.md)).

[Raft]: https://raft.github.io/

Since there is no longer a single writer, we can no longer generate IDs by
incrementing a counter. We can solve this by generating 64-bit IDs that are the
bitwise concatenation of the 32-bit ID of the master server and a 32-bit counter
incremented on that server.

The write latency goes up a bit because the consensus algorithm typically
requires two round trips between the servers (1 ms).

From then on, the next bottleneck is the gateway server your client is connected
to: it has a limit in the number of concurrent requests it supports (the C10k
problem). It can probably handle 10k concurrent requests, and each request takes
10 ms, which computes to a request frequency of 1 MHz.

We can change the requirements to have the gateway redirect you to a random
master server, which ultimately will be bottlenecked by the fact that
coordination of the distributed key-value store requires all servers to keep
some information about all other servers. That coordination also has hidden
costs beyond thousands of master servers relating to gossip protocols,
clock skew, and datacenter management.

At that point, we can store on the order of 1k servers × 100 TB ÷ (64-bit ID +
3 × 32-bit storage server ID) = 5 quadrillion images.
The storage servers can still hold them with a 32-bit ID: their limit is at 2^32
servers × 100 TB ÷ 1 MB = 42 quadrillion images.

The next step is then to use a **Distributed Hash Table** (DHT), wherein each
server (and client) only need to know a subset of all servers, and they get the
value of a key typically in log(N) hops, where N is the number of servers. The
latency is then at 10 + log(N) × L ms (with L the average latency between two
servers: 1 ms within a city, but it rises up fast when going to other cities).

At that point, since serveurs are no longer assigned an incrementing ID, image
IDs are randomly generated, typically 128 bits (**UUID**), or obtained by
[hashing][] the image (**content-addressing**).

[hashing]: ./cryptography.md

This is the design used by most object stores, such as S3, Ceph, GlusterFS,
Bittorrent, or IPFS, and related databases, such as Cassandra and Dynamo.

Then we reach the limit of Earth's surface area. The problem then involves the
severe latency of interplanetary communication (13 minutes on average for light
from Earth to reach Mars).
