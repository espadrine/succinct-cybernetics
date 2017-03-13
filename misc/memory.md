# Memory

Memory is either **volatile** (requires constant power) or persistent, random-access (**RAM**) or sequential, read-only (**ROM**) or writable, and has varying costs, durability and transfer speeds.

As far as speed is concerned, it is important to distinguish **latency** (duration between the request and the start of the response) and **throughput** (amount of bits per second).
For instance, the fastest way to transmit 20 TB across the globe is on SD cards by cargo plane: even on 1 Gbps Ethernet, it takes 44 hours, while a plane takes 22 hours.
Planes have tremendous throughput, but their latency is 22 hours, while Ethernet will be around 100 ms.

## CPU

The CPU has **registers** to store memory for computation. They are as fast as the processor (about 1 cycle per read or write), but there are about 16 64-bit registers (and 16 128-bit registers for floating point computation).
(There are a handful of other registers for SIMD, SSE, …)

The CPU also has caches with varying latencies and amounts: **L1** (0.5 ns), **L2** (7 ns), sometimes **L3**, altogether worth about 3 MB on laptops.

## Main Memory

The main location of volatile storage; 100 ns latency, 20 GB/s. When a process is run, its code and data are located in the RAM. The memory given to a process is separated into five **segments**:

- The **stack** stores local variables of all function calls leading to and including the currently executed function. All local variables of a function are destroyed when the function ends.
- The **heap** stores data dynamically allocated and deallocated by the program, pointed to by a **pointer** on the stack or on the heap. It is useful to manage a common data structure from several functions, but the indirection is slower than accessing data on the stack.
  - In glibc, allocation here is performed by `malloc()` and deallocation by `free()`.
  - In *reference counting*, each object on the heap stores an integer that keeps track of the number of pointers on the stack and on the heap pointing to it. When that object reaches zero, it decrements the reference counts of the objects it has pointers to, and gets deallocated. When done automatically (without explicity incrementing and decrementing the reference count), since reference cycles would prevent reference counts from ever reaching zero (eg. stack pointer → A(1) → B(1), then set a pointer in B to A: stack pointer → A(2) → B(1) → A(2), then pop the stack: A(1) → B(1) → A(1)), it is common to rely on explicit weak references (that don't contribute to the reference count; here, we would set the B → A reference as a weak reference). Another approach is to set them to be garbage-collected through mark-and-sweep.
  - In tracing GC (*garbage collection*), a heuristic determines when deallocation is needed, at which point an algorithm is run to flag all unreachable heap objects, and then deallocates them.
- The **data** contains statically allocated data (ie. created when the program starts, destroyed when it ends): global variables, string constants… The ones that are not initialized at startup are in **BSS** (Block Started by Symbol).
- The **text** stores the code as executable machine instructions.

    ┌──────┬──────┬─────┬──────────────────────┬─────────┬──────────────────────┐
    │ text │ data │ bss │ heap (grows right) → │ (empty) │ ← stack (grows left) │
    └──────┴──────┴─────┴──────────────────────┴─────────┴──────────────────────┘

Each program has its own read, write, and execute access to parts of memory, enforced by the operating system, which can terminate the program with a **segmentation fault** if it does an unauthorized operation.

The process' memory relies on **virtual memory**: it normally lives on volatile storage. However, when main memory becomes scarce, some *memory pages* (fixed blocks of virtual memory) are *swapped*: they are transfered to auxiliary memory (ie, storage drives) to make room in main memory.

**Primary storage** refers to registers, CPU caches, and main memory.

## Secondary Storage

**Auxiliary memory** persists data for a few years without being powered.

- **Hard Disk Drive** (HDD for short): rotating disk coated with magnetic material, with a magnetic head moving from the edge to the center of the disk to go to a particular memory position.
- **Solid State Drive** (SSD, Flash Storage): integrated circuit, where bits are stored in transistor cells as trapped electrons on an insulator.

The counterpart: transfer speeds are much lower than RAM.

- HDD: 100 MB/s, 10 ms latency, but it pays that latency every time it needs to move to a completely different location on disk.
- SSD: 1 GB/s, 30 μs latency.

The data persists until your computer gets wet, or until your laptop hits the ground too hard. Even without those momentary lapses of judgements, drives are probabilistic, not absolute.

First, full drive failures happen:
- HDD: [50% failure after 6 years](https://www.backblaze.com/blog/how-long-do-disk-drives-last/).
  Yearly rolling failure rate: [5%](https://www.backblaze.com/blog/hard-drive-reliability-q3-2015/).
- SSD: 10 years.
  Yearly rolling failure rate: [4 to 30%](https://users.ece.cmu.edu/~omutlu/pub/flash-memory-failures-in-the-field-at-facebook_sigmetrics15.pdf).

Even worse, bitrot (ie. a random change of a bit from 0 to 1 or vice-versa) happens. HDD are exposed to a huge amount of cosmic radiation than can impact their magnetic material. It happens maybe once a year? In addition to that, SSD are made of 1- or 2-bit floating-gate transistors that have a very predictable wear. Eventually, they return the wrong value.

### File system

Disk storage is typically organized hierarchically, as a tree of files: leafs contain blobs of bytes, while their ancestors in the tree, directories, associate each child with a name.

#### Disk Layout

Typically, on Linux, macOS and similar Unix operating systems, each file has an **inode** stored on disk, which includes the following information:

- Which device is it on?
- What user owns it? What group owns it?
- What are its permissions? (Can the user read it? write to it? execute it? How about the group's users? How about other users?)
- What type of file is it? (regular, directory, link, socket, device, FIFO… Along with the permissions, they are stored as six octal digits in `st_mode`)
- When was it last modified (`ctime`)? When was the content last modified (`mtime`)? When was it last accessed (`atime`)?
- It also contains pointers to fixed-sized **blocks** on disk holding the file's content. Reading the file gets the bytes from those blocks one after the other.

Traditional file systems (eg. Linux' ext3, ufs) typically have inodes include a dozen pointers to blocks holding content (direct blocks). If the file is too big to fit in those blocks, it uses a couple of pointers from the inode to blocks holding pointers to blocks holding content (indirect blocks). If the file is still too big, it uses another pointer from the inode to blocks holding pointers to blocks holding pointers to blocks holding content (double indirect blocks).

More modern designs (Linux' [ext4], macOS' HFS) rely on **extents** for content storage: contiguous blocks. Instead of the inode holding a pointer to the start of a block, it has a pointer to the start of the extent, and the number of blocks that the extent covers. It also has a field to determine whether the extent contains the file's content, or pointers to other extents. Having contiguous blocks reduces the amount of indexing data (eg, only one pointer and the number "4" to say we have a 4-block extent, instead of four pointers to four blocks), and it avoids making hard drives seek to new locations on-disk after each block is read (which can cost 10 ms every time).

Because newly created extents may not fit between existing extents, the file system needs to deal with that *external fragmentation*. Among the tricks used to fight this, *delayed allocation* (aka. allocate-on-flush) is a technique that aggregates information about all file writes across the file system for a few seconds in something called the journal, and writes (*flushes*) them all at once to the disk in a way that avoids leaving small unused spaces between extents.

An alternative technique to journaling, *copy-on-write* (COW), used by Linux' btrfs and macOS' APFS, never directly edits existing extents: instead, it writes to a brand-new extent, and then makes the inode point to the new extent.

[ext4]: https://ext4.wiki.kernel.org/index.php/Ext4_Design

#### File Operation

When a process needs to access a file, it opens it with its path (eg. `/home/user/file`) and with flags determining how it can be manipulated (one of `O_RDONLY` (read-only access), `O_RDWR` (read and write access), `O_WRONLY` (write), and optionally `O_CREAT` (create the file if it doesn't exist), `O_APPEND` (only write at the end of the file), etc.).

The system then gives an integer to the process: the **file descriptor**. The list of file descriptors a process has can be obtained with `ls /proc/<process_id>/fd`. The process uses the file descriptor to interact with the file.

The file descriptor has a cursor determining where it starts reading from, which is initially at the start (or the end, for `O_APPEND`). When you read a number of bytes from the file, the cursor moves forward by that amount. You can change the position of the cursor with `lseek()`. When you write bytes to a file, it inserts them at the cursor position.

Once the file is dealt with, it must be closed, to allow the operating system to release resources.

### Disk arrays

Storing data in a single location is dangerous, as the drive may fail. Regularly copying the data to another drive (making a **backup**) is common: when the drive fails, it can be replaced and the data copied from the backup. That can be done by physically mounting the backup drive and using `cp`, or `rsync`, or by using `rsync` over the network to a remote backup server (rsync avoids resending data that is already backed up), or by using `btrfs send` over SSH, (which also avoids resending data in more subtle ways).

However, when the drive fails, the data stops being available in the meantime. More importantly, corrupted data goes undetected, as the drive won't complain, and the corruption will blindly be copied to the backup.

Instead of an only-connected-for-backup external or remote drive, your computer can have two permanently connected drives. You can use the second drive exactly as if it was a backup. It contains a perfect copy of the content. That way, if one drive fails, your data is still safe, and is still available while the second is replaced. This is called **RAID1**.

To automatically correct bitrot, you can use a setup of multiple drives where consecutive blocks are distributed across drives (**data striping**, improves the time needed to read extents), and you also distribute parity information across drives. That parity information lets you detect and correct corruption in the data. This is called **RAID5**, and it also has all the pros of RAID1, except that it requires using at least three drives.

## Internet storage

Data persistence is not guaranteed even with those protections. A fire may destroy a whole building. Single-computer drive arrays are not enough. To support copying and synchronizing of data over long distances, the use of Internet storage is necessary. It has multiple facets:

- Replication: every piece of data must be in at least two different buildings, preferably in different cities. The **replication factor** is the number of long-distance copies.
- Distribution: having all of the data be replicated in all locations burns egress, bandwidth, and disk usage, all of which is costly. Therefore, each piece of data is only located on a subset of the nodes. Determining which nodes are used is either manual or relies on a distributed hash table (**DHT**).
- Synchronization: if multiple nodes allow updating the data, writes between those nodes can conflict, in which case a conflict resolution system or some kind of CAP compromise is required. The **CAP theorem** states that when a partition (P) in the network occurs (ie, some nodes can't communicate with others), the system must choose between maintaining consistency (C, the guarantee that reads return the most recent write) by making requests wait until the network recovers, or maintaining availability (A) by responding to requests immediately.
- Parallelism: a piece of data can be **striped** over multiple nodes, so that reading it will be faster.
- **Deduplication**: to use less disk space, the network can detect pieces of data that hold the same content, and only store it once (at the replication factor).
- **Byzantine fault-tolerance**: while having multiple copies protects against having a data center being destroyed or cut off, some Internet storage need to assume that some nodes may be malicious. The system then needs to protect data and updates of non-malicious nodes up until half of the nodes become malicious.

Common solutions include [GlusterFS] (pieces of data are at the file level), [CephFS] (at the block level), Hadoop HDFS, Amazon S3.

[GlusterFS]: https://www.gluster.org/
[CephFS]: http://ceph.com/

Within the same datacenter, you can expect 500 μs of latency; across the planet, about 100 ms.
