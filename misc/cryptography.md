# Cryptography

## One-way function

**One-way functions** are such that:

- `one-way(input)` is computed in [polynomial-time](../Complexity.md)
- All randomized polynomial-time functions `inverse(output)` such that
  `inverse(one-way(input))` have on average a near-zero probability to
  return `input` as the result of the computation of `inverse`.

In practice, cryptanalysis can discover new ways to find the input from the
output which changes the estimated probability, or machines can become more
powerful than planned. As a result, it is necessary to stay up-to-date to
correctly estimate risk.

### Hash

A **Hash** is a one-way function returning a fixed-sized (typically small)
output such that the following functions are computationally too hard:
- `collision() = (m1, m2)` such that `hash(m1) = hash(m2)`
- `preimage` such that `preimage(hash(m)) = m`
- `second_preimage(m1) = m2` such that `hash(m1) = hash(m2)`

It is useful to uniquely identify a large message in a small amount of memory
(typically 64 bits (weak), 128 bits, or 256 bits) so that checking identity is
fast.

A regular NIST competition is performed to select a good hash function: the
Secure Hash Algorithm (SHA).

SHA-0 and SHA-1 are considered broken; some SHA-2 constructions have dangerous
properties (vulnerability to *length-extension attacks*) that require the use of
the HMAC algorithm for message authentication (but SHA-512/256 (ie. SHA-512
truncated to 256 bits) does not), and SHA-3 is the latest as of 2018 (and does
not have the SHA-2 issues).

Famous non-SHA cryptographic hash functions include BLAKE2, Kangaroo12.

Famous non-cryptographic hash functions include Zobrist (eg. to detect unique
states in a game), FNV, CityHash, MurmurHash, SipHash (for hash tables).

**Universal hash functions** TODO

### Message Authentication Code

A **Message Authentication Code** (MAC) can assert the following properties if
you share a secret with a given entity:
- **authentication**: the message was validated by a given entity,
- **integrity**: the message was not modified by a different entity.

It can be done with a hash; it is then called **keyed hash function**.
Modern hash functions such as SHA-3 or BLAKE2 offer this functionality this way:
- `mac = authentify(message, key) = hash(key + message)` (`+` is string
  concatenation),
- `verify(message, mac, key) = authentify(message, key) == mac`.

Older hashes suffer from *length-extension attacks* with this approach. However,
they can be used by relying on the **HMAC** algorithm:
- `authentify(message, key) = hash((rehash(key)^outerPad) +
  hash((rehash(key)^innerPad) + message))` where `^` is XOR, the pads are fixed
  and the size of the hash block, and `rehash` depends on the hash size.

### Key derivation function

One use of cryptographic hash functions is to store password, but only via a
metafunction called a **key derivation function** that performs **key
stretching** (passing a low-[entropy][] password through the hash function in a
loop a large number of times) and salting (putting a known random prefix to
protect against *rainbow attacks*).

Famous key derivation functions include PBKDF2, bcrypt, scrypt and Argon2,
ordered by date of creation and increased confidence in security. They typically
have a stretching parameter to increase their complexity so that the same
algorithm can be used when computers get better at brute-forcing passwords.

[entropy]: ./information.md

(Note that key stretching is only about low entropy: large-enough purely-random
passwords hashed through a cryptographic hash cannot be brute-forced. For
instance, a 256-bit BLAKE2 of a 128-bit CSPRNG output has 256/2 = 128 bits of
security. Brute-forcing it would require `2^127` attempts on average. Computers
take at best 1 ns to perform an elementary operation, and `2^127` ns is 4 times
the age of the known universe. Parallelizing would cost 20 septillion € of
machines to brute-force a typical hash in 100 years, if Earth had enough
material to build the computers. It goes down to 1 million € with 64 bits of
security, which is why 128 bits are used when security matters, eg. with
UUIDv4.)

## Randomness

Humans are terrible at estimating randomness, and machines (and cryptographers)
are pretty good at exploiting weaknesses in randomness.

A good random source obeys certain *statistical* characteristics to ensure that
the probability of someone predicting its output is near zero.
(See for instance the [NIST randomness recommandation][].)

[NIST randomness recommandation]: https://csrc.nist.gov/projects/random-bit-generation

One option is to gather and privately store data from physical events that are
very hard for someone else to control, such as electric or atmospheric noise,
or time noise in the occurrence of events in a booting operating system.

Another is to make a **pseudo-random** number generator (PRNG), such that
`random = prng(seed)` is a function that yields a bit (or a fixed-sized list of
bits, as a number) every time it is called, such that:

- it yields the same sequence of bits given the same seed,
- the sequence of bits obeys the statistical characteristics we talked about.

Cryptographically-Secure PRNG (CSPRNG) are designed more carefully but are
typically slower.

Examples: arc4random (based on a leaked version of the RC4 cipher), ChaCha20.

Examples of non-cryptographically-secure: LCG, XorShift, Mersenne Twister, PCG
(in order of quality against predictability).

Typically, on Unix systems, `/dev/urandom` is a CSPRNG fed with a pool of
entropy from boot-time randomness extracted from the operating system.

## Symmetric-key ciphers

Cipher that defines two functions `encrypt(msg, key)` and `decrypt(msg, key)` such that:

- `decrypt(encrypt(msg, key), key) = msg`
- `encrypt` is a one-way function (and often `decrypt` too).

**Reciprocal ciphers** are such that `decrypt = encrypt`, eg. the Enigma machine.

Two common designs: stream and block ciphers.

### Stream ciphers

They use a construct where every bit of information is encrypted
one at a time; you give it the next bit of message, you instantly get the next
bit of ciphertext out.

One-time pad TODO

RC4

### Block ciphers

TODO

AES

## Asymmetrical cryptography

Cipher that defines three functions `public, private = keys(random)`,
`encryptPublic(msg, public)`, `encryptPrivate(msg, private)`, such that:

- `encryptPrivate(encryptPublic(msg, public), private) = msg`
- `encryptPublic(encryptPrivate(msg, private), public) = msg`
- `encryptPublic` and `encryptPrivate` are one-way functions.

```
┌───────────┐ ─ encryptPublic  → ┌───────────┐
│ message 1 │                    │ message 2 │
└───────────┘ ← encryptPrivate ─ └───────────┘
```

Most ciphers rely on one of two common mathematically difficult problems to
enforce the one-way constraint:
- factoring primes (RSA)
- elliptic curves (ECDSA, ed25519).

### Key exchange

Encryption gets very computationally expensive for large (> 128 bit) messages.
Since the goal of asymmetric encryption is to allow secure communication over a
public channel without needing a shared secret (the issue with symmetric
ciphers), this is limiting.

**Diffie-Hellman** is a protocol that lets two parties A and B obtain a shared
secret over a public channel. That secret can then be used as the key of a
symmetric cipher.

1. They each generate public and private keys with the same parameters (the
   modulo portion for RSA, the domain parameters for elliptic curves)..
2. They agree on a base message `m`.
3. A sends `encryptPrivate(m, privateA)`, and B sends `encryptPrivate(m,
   privateB)`.
4. A computes `secret = encrypPrivate(encryptPrivate(m, privateB), privateA)`
   and b `secret = encryptPrivate(encryptPrivate(m, privateA), privateB)`, whose
   equality results from commutativity in underlying math.
5. `secret` is now shared exclusively between A and B.

Advice for the common values to choose is detailed in
[RFC 5114](https://tools.ietf.org/html/rfc5114).

Another more expensive solution:
1. They each generate public and private keys and B sends its public key.
2. A computes `secret = encryptPrivate(m, privateA)` with a random `m`.
3. A sends `encryptPublic(secret, publicB)`.
4. B alone can compute
   `secret = encryptPrivate(encryptPublic(secret, publicB), privateB)`.
5. `secret` is now shared exclusively between A and B.

Systems which generate a new random secret key for every new session are said to
have **forward secrecy**.

### Digital signature

**Digital signatures** associated with a message give the following guarantees:
- **authentication**: the message was validated by a given entity,
- **non-repudiation**: the message cannot be un-validated by that entity,
- **integrity**: the message was not modified by a different entity.

Unlike a MAC, it does not require a shared secret, just shared public keys.

It relies on two functions, `sign()` and `verify()`, and a public/private key
pair, such that:
- `verify(message, sign(message, private), public) = true` and all other
  parameter combinations yield `false`.

Usually:
- `sign(message, private) = encryptPrivate(hash(message), private)`
- `verify(message, signature, public) = encryptPublic(signature, public) ==
  hash(message)`

## Going further

- [Serious Cryptography](https://seriouscrypto.com)
