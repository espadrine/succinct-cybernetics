# Physical Networks

The physical connection between your device and the Internet looks like this:

    ┌────────┐ WiFi ┌────────┐ FTTH ┌─────────────────┐ Fiber ┌──────────┐
    │ Device ├──────┤ Router ├──────┤ ISP OLT/Routers ├───────┤ Repeater ├──┐
    └────────┘  4G  └────────┘      └─────────────────┘       └──────────┘  │
                                                                            │
    ┌────────┐ CAT6a ┌───────────────────┐ Fiber ┌────────┐ Submarine Fiber │
    │ Server ├───────┤ Datacenter Switch ├───────┤ Router ├─────────────────┘
    └────────┘       └───────────────────┘       └────────┘

## Media

EM radiation.

antenna dipole.

AM/FM.

### Wireless

#### WiFi

An alternative to Ethernet is **WiFi** (aka. WLAN, IEEE 802.11), a common
wireless protocol.

#### 4G

### Wired

Standard Ethernet cable names are of the form
`<Speed><Signaling>-<Hardware>[<Encoding>]`, eg. 1000BASE-T.

1. **Speed** is in Megabits per second, or in Gbps if it ends in G
   (eg. 10GBASE-SR).
2. **Signaling** is how information is sent:
   - BASE is **baseband** (line coding: on a clock,
     we send bits by switching between two values (voltage, photon burst).
   - BROAD is **broadband**: multiple frequency bands are used.
3. **Hardware**:
   - 2: Coaxial cable that can reach ~200 meters.
   - 5: Coaxial cable that can reach ~500 meters.
   - T: Twisted Pairs.
   - F: Fiber; E: Extended fiber ()
4. **Encoding**

#### Fiber

A 

Most widely-used for long-distance, because:

- Light is the fastest known particle,
- Signals propagate for very long distances with little degradation.

#### Copper

But moving electrons cause magnetic fields,
which can induce currents in nearby conductive wires,
and alter their signal: that is called “**crosstalk**”.

##### Twisted Pairs

TS568A vs. TS568B / Straigh-trhough vs. Crossover

##### Coaxial

#### Submarine cables

> **History:** The first transatlantic cable was 7 copper wires
> coated with gutta-percha for electrical isolation,
> wound in a helix with tarred hemp and an iron-strands sheath for strength.
> It was laid in 1858, a long shipping expedition which involved
> having to grapple the cable on the sea bed when it unexpectedly broke.
> Unsurprisingly, it degraded after a month.

## Connectors

### RJ45 / 8P8C

### USB

## Links

- [Fiber Optics in the LAN and Data Center][FOLDC]

[FOLDC]: https://www.youtube.com/watch?v=fRKT6Z9rgUw
