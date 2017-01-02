# Networks

Computers [communicate](./information.md) to reach a goal. For instance, you
contact Youtube to see cat videos, Youtube responds to gain advertising revenue.

A **network** can be represented with a graph where vertices are processing 
machines and edges are transmission links. Examples of networks include the 
Internet, telephones, and walkie-talkies.

## Protocols

Certain documents (typically, standards and Requests For Comments (RFCs)) set
the way in which information is transmitted through the network, first as bits,
then as higher-level concepts. They can depend on the existence of lower-level
protocols, forming a *protocol stack*. The **OSI model** theorizes the layers
that a protocol stack is made of:

- Physical: transmission of bits through a medium (eg: Ethernet PHY chip for
  100BASE-TX),
- Data link: transmission of frames mostly between adjacent nodes, to determine
  the start and end of messages (eg: MAC, PPP),
- Network: transmission of packets for routing across the graph (eg: IP),
- Transport: transmission of segments, so applications on both endpoints can
  exchange messages with given reliability guarantees (eg: TCP, UDP, ICMP
  (ping)),
- Session: setup and recognition of endpoints across messages,
- Presentation: encoding of data (charset, compression, encryption) (eg: TLS,
  HTTP with MIME to some extent),
- Application: serialization of data structures (eg: HTTP (documents), NTP
  (time), SMTP (email), FTP (file)).

Let's focus on a typical stack.

### HTTP

**HyperText Transfer Protocol** ([HTTP][]) is an application-layer and
presentation-layer protocol designed for client-server document transmission.
For instance, to request the main page of an HTTP server on your computer:

    GET / HTTP/1.1
    Host: localhost:1234
    Accept: text/html

[HTTP]: https://tools.ietf.org/html/rfc2616

(Each newline is made of two bytes: 0x0D and 0x0A, aka. CR-LF; it ends with two
newlines). The server may respond:

    HTTP/1.1 200 OK
    Content-Type: text/html
    Date: Sat, 31 Dec 2016 15:31:45 GMT
    Connection: keep-alive
    Transfer-Encoding: chunked

    7E
    <!doctype html>
    <html>
     <head>
      <meta charset=utf-8>
      <title> This is HTML </title>
     </head>
     <body></body>
    </html>

    0

This response includes an [HTML][] file that the HTTP client (for instance, a
browser, like Firefox or Google Chrome) will read as instructions on how to lay
out a page, which determines the pixels to display, the animations to show, the
interactions to execute when the user moves or clicks the mouse, the sounds to
play, etc.

[HTML]: https://html.spec.whatwg.org/multipage/

All requests have a first line with a method (`GET`), a path (`/`), and a
protocol (`HTTP/1.1`), optionally followed by headers mapping header names
(`Accept`) to their value (`text/html`). Requests may also carry data.

Responses have a first line with a protocol (`HTTP/1.1`), a code (`200 OK`;
codes starting with 1 are informational, 2 for success, 3 for redirection, 4 for
client errors, 5 for server errors). Responses usually carry data (here, the
HTML file), and also have headers explaining what the data is, how it is encoded
(charset, compression), what time it is, whether to use caching, how to store
session information (through cookies) and so on.

As mentioned, HTTP includes presentation-layer "protocols" in headers, such as
**Multipurpose Internet Mail Extensions** ([MIME][]) in `Content-Type`, to
specify the file `<type>/<subtype>` (eg. `text/plain`), or whether it
recursively contains subfiles with [`multipart/form-data`][form-data], with each
subfile specifying their own headers:

    POST /upload HTTP/1.1
    Host: localhost:1234
    Content-Length: 882
    Content-Type: multipart/form-data; boundary=random0ACxeUx4Nxqy3roVtMxrAw

    --random0ACxeUx4Nxqy3roVtMxrAw
    Content-Disposition: form-data; name="name-of-first-part"
    Content-Type: text/plain

    This first file contains normal plain text.
    --random0ACxeUx4Nxqy3roVtMxrAw
    Content-Disposition: form-data; name="multiple-images"; filename="image.svg"
    Content-Type: image/svg+xml; charset=UTF-8

    <?xml version="1.0" encoding="UTF-8"?>
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="20">
      <text x="10" y="15">This is an image</text>
    </svg>
    --random0ACxeUx4Nxqy3roVtMxrAw
    Content-Disposition: form-data; name="multiple-images"; filename="image.png"
    Content-Type: image/png
    Content-Transfer-Encoding: base64

    iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACx
    jwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY2BgYAAAAAQAAVzN/2kAAAAASUVO
    RK5CYII=
    --random0ACxeUx4Nxqy3roVtMxrAw--

(Note that our use of base64 in image.png is deprecated; in real life, it would
be replaced by the binary data directly.)

[MIME]: https://tools.ietf.org/html/rfc2045
[form-data]: https://tools.ietf.org/html/rfc7578

HTTPS is HTTP transmitted over a TLS connection: all the HTTP data, including
headers, is encrypted to prevent intermediate nodes on the network from reading
or modifying the content, which is necessary when transmitting identification or
banking information, and to avoid being fooled into performing dangerous acts.

### TCP

**Transmission Control Protocol** ([TCP][]) is a transport-layer protocol to
ensure that all sent segments are received uncorrupted in the same order. That
is achieved by reordering received segments and resending corrupted ones.
When using IP, it cuts its segments into pieces that fit in a packet.

1. The server starts to listen to a port.
2. The client starts to connect with a SYN.
3. The server informs the client that it received it with a SYN+ACK.
4. The client sends an ACK.
5. The server and the client can now send a series of packets to each other
   full-duplex, and they ACK each reception if all previously received packets
   have been received in order.
6. The client sends a FIN.
7. The server sends a FIN+ACK (or an ACK followed by a FIN).
8. The client sends an ACK. (The connection stays open until it times out.)

A TCP header includes:

- source port in 2 bytes,
- destination port in 2 bytes,
- sequence number in 4 bytes:
  - in a SYN, this is the client Initial Sequence Number (ISN), picked usually
    randomly,
  - otherwise it is (server ISN) + 1 + number of bytes previously sent, ensuring
    that packets can be reordered to obtain the original segment.
- acknowledgement number in 4 bytes:
  - in a SYN-ACK, this is (client ISN) + 1, and the server sequence number is
    picked.
  - in an ACK, this is (server ISN) + number of bytes received + 1, which is the
    expected next sequence number to be received from the server.
- data offset in 4 bits, the size of the TCP header in 32-bit words (defaults to
  5),
- 000 (reserved),
- flags in 9 bits: NS, CWR, ECE, URG (read urgent pointer), ACK (acknowledge
  reception of data or SYN), PSH (push buffered data received to the
  application), RST (reset connection), SYN (synchronize sequence number, only
  used in the initial handshake), FIN (end of data, only used in the final
  handshake),
- window size in 2 bytes, allowing flow and congestion control,
- checksum in 2 bytes to check header and data corruption,
- urgent pointer in 2 bytes pointing to a sequence number,
- options (if the data offset is > 5, zero-padded) eg. maximum segment size, or
  window scale,
- payload.

[TCP]: https://tools.ietf.org/html/rfc793

### IP

**Internet Protocol** ([IP][]) is a network-layer protocol that ensures that
packets go to their destination despite having to transit through several
machines on the way.
It also cuts the packets into fragments that fit in the link-layer frame.
There are two major versions of IP in use: IPv4 is the most used, and is slowly
replaced by IPv6.

IPv4 headers have the following fields:

- version in 4 bits,
- Internet Header Length (IHL) in 4 bits, as a number of 32-bit words,
- Quality of Service (QoS) in 1 byte: ranks packet priority; it is typically cut
  into 6 bits of Differentiated Services Code Point (DSCP) and 2 bits of
  Explicit Congestion Notification (ECN),
- length of the packet in bytes, in 2 bytes,
- identification tag in 2 bytes, to reconstruct the packet from multiple
  fragments,
- 0 in 1 bit,
- Don't Fragment (DF) in 1 bit, if the packet can be fragmented,
- Multiple Fragments (Mf) in 1 bit, if the rest of the packet is in subsequent
  fragments,
- fragment offset in 13 bits, identifying the position of the fragment in the
  packet,
- Time To Live (TTL) in 1 byte: the number of remaining nodes in the network
  graph that the packet is allowed to go though; each node decrements that
  number and drops the packet if it reaches 0, avoiding infinite loops,
- protocol of the payload in 8 bits (TCP, UDP, ICMP, etc.),
- header checksum in 16 bits to detect corruption,
- source IP address in 32 bits,
- destination IP address in 32 bits,
- payload (eg, TCP content).

Fragmenting the packet and reordering it at the other end was designed for cases
where the packet must be transmitted over a link which cannot hold the whole
packet (typically, the maximum Ethernet frame size, or when the destination
doesn't have enough memory to hold the packet).

However, TCP can cut its segments into arbitrarily sized packets to fit in an
Ethernet frame, and fragmentation makes packet analysis harder as the tail
fragments don't hold the TCP segment headers. Besides, Path MTU (Maximum
Transportation Unit) Discovery (PMTUD) allows determining the size of the
physical-layer frame in a path through the network. As a result, IPv6 disallows
fragmenting packets within the path, requiring the sender to either form its
packets at the right size (for TCP), or to form its fragments at the right size
(for UDP and ICMP, which cannot cut their data into multiple packets).

Note that packets can be lost, duplicated, received out of order, or corrupted
without the IP layer noticing. It is up to TCP to prevent that from happening.

IP addresses segment the network into increasingly smaller subnetworks, with
**routers** processing packets in and across networks. They can be gained from
the **Dynamic Host Configuration Protocol** (DHCP), auto-assigned, or manually
set.

IPv4 addresses fit in 4 bytes, commonly written in dot-separated decimal, eg.
`172.16.254.1`. To denote a subnetwork (which has adjacent numbers), we use
Classless Inter-Domain Routing (CIDR) notation: `<network address>/<bitmask
(number of leading bits that stay the same for all addresses)>`. For instance,
192.168.2.0/24 includes addresses from 192.168.2.0 to 192.168.2.255, although
you cannot use the address ending in .0 (network address), used to identify the
network, nor that ending in .255 (broadcast address), used to broadcast to all
devices on the network.

There are special ranges of addresses:

- 10.0.0.0/8, 172.16.0.0/12 and 192.168.0.0/16 for private networks (ie,
  not globally routable; they are typically behind a Network Address Translator
  (NAT)),
- 0.0.0.0/8 for "no address", used as source address when getting an IP address,
- 100.64.0.0/10 "shared address space", similar to private networks, but for
  Carrier-Grade NAT (CGN),
- 127.0.0.0/8 for loopback (sending network data within a single node), most
  notably 127.0.0.1 (which the localhost hostname usually resolves to),
- 169.254.0.0/16 for IP assignment between link-local, autoconf/zeroconf
  addresses,
- 192.0.0.0/24 for IANA,
- 192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24 are reserved for testing and
  examples in documentation,
- 192.88.99.0/24 for IPv6-to-IPv4 anycast routers for backwards compatibility,
- 198.18.0.0/15 for network performance testing,
- 224.0.0.0/4 for IP multicast,
- 240.0.0.0/4 blocked for historical reasons,
- 255.255.255.255 for broadcast.

IPv6 addresses fit in 16 bytes, with pairs of bytes represented as
colon-separated hexadecimal numbers, with adjacent zeros replaced by `::` once
in the address.

- unicast has a ≥ 48-bit routing prefix, a ≤ 16-bit subnet id defined by the
  network administrator, and a 64-bit interface identifier obtained either by
  DHCPv6, the MAC address, random, or manually.
- :: for unspecified address.
- ::1 for localhost,
- fe80::/64 for link-local communication; cannot be routed; all other addresses
  in fe80::/10 are disabled,
- fc00::/7 for Unique Local Addresses (ULAs), similar to private networks:
  - fc00::/8 for arbitrary allocation,
  - fd00::/8 for random allocation (with a 40-bit pseudorandom number).
- ff00::/8 for multicast, with 4 flag bits (reserved, rendezvous, prefix,
  transient) and 4 scope bits:
  - general multicast has a 112-bit group ID, including:
    - ff01::1 to all interface-local nodes,
    - ff02::1 to all link-local nodes,
    - ff01::2 to all interface-local routers,
    - ff02::2 to all link-local routers,
    - ff05::2 to all site-local routers,
    - ff0X::101 to all NTP servers,
    - ff05::1:3 to all DHCP servers.
  - ff02::1:ff00:0/104 sollicited-node multicast has a link-local scope and a
    24-bit unicast address,
  - unicast-prefix-based multicast has a 64-bit network prefix (= routing prefix
    + subnet id) and a 32-bit group ID.
- ::ffff:0:0/96 (IPv4-mapped IPv6 addresses), ::ffff:0:0:0/96 (IPv4-translated
  addresses in the Stateless IP/ICMP Translation (SIIT) protocol), 64:ff9b:://96
  (automatic IPv4/IPv6 translation), 2002::/16 (6to4) for transitioning from
  IPv4,
- 2001::/29 thru 2001:01f8::/29 for IANA special purposes (tunneling,
  benchmarking, ORCHIDv2),
- 2001:db8::/32 for examples in documentation,
- 0100::/64 to discard traffic.

Some IP addresses can be mapped to a name (eg, `en.wikipedia.org` →
91.198.174.192) by using the **Domain Name System** (DNS), a naming system for
Internet entities. Companies that can allocate a new domain name are called
**registrars**. They publish their information as zone files, and allow
authenticated editing of those files by the domain name owners as part of a
business arrangement.

    ; Example zone file.
    $ORIGIN example.com..
    $TTL 1h
    ; Indicates that the owner is admin@example.com.
    example.com. IN SOA   ns.example.com. admin.example.com. (2017011201 1d 2h 4w 1h)
    example.com. IN NS    ns  ; Indicates that ns.example.com is our nameserver.
    example.com. IN MX    10 mail.example.com.
    example.com. IN A     91.198.174.192        ; IPv4 address
                    AAAA  2001:470:1:18::118    ; IPv6 address
    ns           IN A     91.198.174.1          ; ns.example.com
    www          IN CNAME example.com.          ; www.example.com = example.com


[IP]: https://tools.ietf.org/html/rfc791

*While HTTP requires TCP which requires IP, lower layer protocols are usually
interchangeable.*

### Ethernet

At the link layer, communication mostly happens directly between two adjacent
nodes.

Among link-layer protocols, **Ethernet** (aka. LAN, IEEE 802.3) is a link-layer
protocol for transiting frames through a wire between two machines. A frame
includes:

- preamble: 7 bytes to ensure we know this is a frame, not a lower-level header,
  and to synchronize clocks (it contains alternating 0s and 1s),
- Start of Frame Delimiter (SFD): 1 byte to break the pattern of the preamble
  and mark the start of the frame metadata,
- destination **Media Access Control** (MAC) address of the target machine: each
  machine knows the MAC address of all machines it is directly connected to.
  Among its 6 bytes, it contains two special bits:
  - the Universal vs. Local (U/L) bit is 0 if the MAC is separated in 3 bytes
    identifying the network card's constructor (Organisationally Unique
    Identifier, OUI), and 3 bytes arbitrarily but uniquely assigned by the
    constructor for each card (Network Interface Controller, NIC).
  - the Unicast vs. Multicast bit is 0 if the frame must only be processed by a
    single linked machine.
- source MAC address,
- EtherType indicates what protocol is used in the payload (eg, 0x86DD for
  IPv6); if the value is < 1536, it represents the payload size in bytes,
- payload: up to 1500 bytes of data from the layer above, typically IP,
- Frame Check Sequence (FCS, implemented using a **Cyclic-Redundancy Check**
  (CRC)): 4 bytes that verify that the frame is not corrupted; if it is, it is
  dropped and upper layers may have to re-send it.
- Interpacket gap: not really part of the frame, those 12 bytes of idle line
  transmission are padding to avoid having frames right next to each other.

Ethernet relies on **repeaters** to transmit data over long distances, as the
physical layer usually relies on cables that have a maximum length. Multiple
machines are connected to the same repeater, creating a star topology.
**Bridges** are smarter machines that remembers source MAC addresses, and uses
that to avoid sending frames to machines that are not the recipient according to
the frame. **Switches** are smarter, programmable machines that detect and block
corrupted packets.

An alternative to Ethernet is **WiFi** (aka. WLAN, IEEE 802.11), a common
wireless protocol.

### 100BASE-TX

**100BASE-TX** (part of IEEE 802.3u, aka. Fast Ethernet) is a physical-layer
protocol. It defines using RJ45, which uses an 8P8C (8 position 8 contact)
connector with TIA/EIA-568B, ie. having eight copper wires with pin 1 through 8:
white-orange, orange, white-green, blue, white-blue, green, white-brown, brown.
x / white-x wires form pairs 1 through 4: blue, orange, green, brown, each
twisted together at different rates in the cable. Orange pins 1 (TX+) and 2
(TX-) transmit bits; green pins 3 (RX+) and 6 (RX-) receive bits, which makes
this full-duplex.

From left to right on the female Ethernet connector:

    pin   1         2         3       4       5        6        7        8
    ┌────────────┬──────┬───────────┬────┬──────────┬─────┬───────────┬─────┐
    │white-orange│orange│white-green│blue│white-blue│green│white-brown│brown│
    └────────────┴──────┴───────────┴────┴──────────┴─────┴───────────┴─────┘
          TX+       TX-      RX+                      RX-

Bits are first encoded with 4B5B: each 4 bits are encoded as 5 bits according to
a predetermined mapping that prevents having too many consecutive zeros, which
would make locating individual bits harder, as clocks are not perfectly
synchronized. 4B5B also has five extra 5-bit codes: one to indicate that no data
is sent (Idle = 11111, which in NRZI means systematically alternating the
current), two to indicate that we will start sending data (Start of Stream Data
= SSD), two to indicate that we stop sending data (End of Stream Data = ESD).

    Bits: 0100 0111  (ASCII G)
    4B5B: 0101001111

Bit transmission relies on Non-Return-to-Zero/Inverted (NRZI): a 1 is
represented by a change from 0 volts to 1 volt or back for TX+, from 0 volts to
-1 volts or back for TX-. A 0 is no change in voltage. The receiver subtracts
TX- from TX+: `(TX+ + noise) - (TX- - noise) = 0V or 2V` which together with the
previous voltage, determines bits. On top of that, Multilevel Threshold-3
(MLT-3) is used: it halves the transfer frequency by alternating positive and
negative voltages.

    4B5B:         0  1  0  1  0  0  1  1  1  1
    MLT-3 TX+:  0  0  1  1  0  0  0 -1  0  1  0 (in volts)
    MLT-3 TX-:  0  0 -1 -1  0  0  0  1  0 -1  0 (in volts)


The wires go up to 100 metres. They are twisted with Cat5 Unshielded Twisted
Pair (UTP; no electromagnetic protection, but the twisting protects information
from noise sources). In 100BASE-TX, 100 means data goes at 100 Mbit/s, T means
twisted pair, X means that bits are encoded with 4B5B.

The resulting overhead looks like this:

    ┌─────┬─────┬────────────┬───────────┬────────────┬─────────────┬──────┬─────┬─────┐
    │ SSD │ SFD │ MAC header │ IP header │ TCP header │ HTTP header │ data │ FCS │ ESD │
    └─────┴─────┴────────────┴───────────┴────────────┴─────────────┴──────┴─────┴─────┘
    │     │                  │           │            │     application    │     │     │
    │     │                  │           │            └────────────────────┤     │     │
    │     │                  │           │            transport            │     │     │
    │     │                  │           └─────────────────────────────────┤     │     │
    │     │                  │                   network                   │     │     │
    │     │                  └─────────────────────────────────────────────┘     │     │
    │     │                                 link                                 │     │
    │     └──────────────────────────────────────────────────────────────────────┘     │
    │                                     physical                                     │
    └──────────────────────────────────────────────────────────────────────────────────┘

## Layouts

**Distributed** systems are products that rely on having multiple computing
units communicating.

**Client-server** (aka. Star) architectures have a special computing unit, the
server, which receives requests from any number of computing units (clients),
processes the request, and sends a response to each request.
Examples include HTTP and display servers.

**Three-tier** architectures separate nodes into three types:
- Presentation: reads user input and displays the User Interface (UI).
  Typically, laptops or phones.
- Application: executes user queries and moves data.
- Data: manages data, typically through Create-Read-Update-Delete (CRUD)
  Application Programming Interfaces (APIs), typically with
  Atomicity-Consistency-Isolation-Durability (ACID) guarantees.

**N-tier** is what happens when the three-tier application layer gets sublayers.

**Decentralized** architectures can sustain the loss of any node.
Examples include Distributed Hash Tables (DHT).

**Peer-to-peer** (P2P) architectures can sustain the loss of any number of
nodes, as long as there is still at least one node.
Examples include Bittorrent, Bitcoin, Infinit file system.
