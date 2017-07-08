# Synchronization

[Concurrency](./concurrency.md) is about imparting and gathering work from
multiple actors (typically on a single machine).

This is about ensuring the correct operation of actors working together.
In particular, to work with each other, actors must maintain a common
understanding of the world.

See [this](https://github.com/aphyr/distsys-class) for now; I'll try to make
something denser.

**Work in progress**.

## Network

Graph of actors communicating

CSP, Actor model

## Actors

What can go wrong: crash, recovery, corruption, byzantine, heterogenous

## Communication

What can go wrong: slow (latency / bandwidth), lost, corrupted, sent multiple
times

TCP, UDP ([network](./network.md))

## Clock

[time](./time.md), posix time, GPS, atomic clock, ntp

lamport clock

vector clock

## Consistency, Availability, Partition

CAP theorem:
Network partition will happen, got to choose between consistency (read your
writes) and availability (answer without waiting)

levels of consistency

CRUD [data](./data.md)

ACID

## Data transmission

RPC calls.
SOAP (XML) / REST (JSON): trees of data.
Protocol buffers. Captn Proto.

GraphQL and the problem of transmitting object graph

old-school CP (relational) databases (eg. MySQL, postgreSQL, etc.):
single-server writes, distributed reads through WAL streaming replication (hot standby server, vs. warm standby server), failover

eventual consistency

total operation order

operational transformation

CRDT

Consensus: Paxos

DHT

Merkle tree (git, bitcoin)

Proof of work (byzantine failure, bitcoin)

## Architectural building blocks

[data](./data.md)

Key-Value store
(LSM tree on each node, DHT for replication / distribution)
Store small (100K) blobs. High read and write volumes.

block, object store, distributed file system (eg. Ceph, S3, GlusterFS, GTFS)
Store large (M, G, etc.) blobs. Low read volume.

Cache (redis, memcached), typically in-memory.
Increases read speeds.

SQL database: relational data.
Typically low number of machines (one writer machine many readers).

Big data: when a single machine can't handle the write volume or data size.
Typically requires switching to an AP system, sometimes NoSQL (column (Cassandra), key-value (Riak, Dynamo), graph (Neo4J), document (MongoDB))
Note that it is extreme; often, simply performing indexing on the right SQL
column is enough.
Also, new-generation SQL systems like Spanner and CockroachDB support CP with
larger numbers of writer machines.

Message queue (AMQP eg. RabbitMQ, Kafka)
AMQP: protocol on top of TCP to distribute messages:
- Direct exchange: send message to all queues listening to that key, and they'll
  deliver it to one consumer
- Fanout exchange: send to all queues bound to it
- Topic exchange: sned to all queues set to receive a given key
PubSub

Log/Search (ElasticSearch): pull data from all machines and index it.
No rewrites, large amount of data, high read volume.

Log/Aggregate: log on each machine, merge data upon reading
Very high write volume, very low read volume.

Immutable core, mutable shell (eg. Plan9 file system fossil)

## Advice

Allow failure (chaos monkey), backup, redundancy, failover, monitoring, logging

Protocols: version, upgrade

SLA
