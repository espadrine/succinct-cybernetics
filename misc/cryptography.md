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

Ron Rivest’s MD5 is broken; SHA-0 and SHA-1 are considered broken; some SHA-2
constructions have dangerous properties (vulnerability to *length-extension
attacks*) that require the use of the HMAC algorithm for message authentication
(but SHA-512/256 (ie. SHA-512 truncated to 256 bits) does not), and Joan
Daemen’s SHA-3 is the latest as of 2018 (and does not have the SHA-2 issues).

Famous non-SHA cryptographic hash functions include BLAKE2 (derived from SHA
finalist BLAKE, itself derived from djb’s ChaCha20), Kangaroo12 (derived from
SHA-3).

Famous non-cryptographic hash functions include Zobrist (eg. to detect unique
states in a game), FNV, CityHash, MurmurHash, SipHash (for hash tables).

**Universal hash functions** TODO

### Message Authentication Code

A **Message Authentication Code** (MAC) can assert the following properties if
you share a secret key with a given entity:
- **authentication**: the message was validated by a keyholder,
- **integrity**: the message was not modified by a non-keyholder.

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

Another common MAC is *Poly1305*.

### Key derivation function

One use of cryptographic hash functions is to store password, but only via a
metafunction called a **key derivation function** (KDF) that performs **key
stretching** (passing a low-[entropy][] password through the hash function in a
loop a large number of times) and salting (putting a known random prefix to
protect against *rainbow attacks*).

Famous KDFs include PBKDF2, bcrypt, scrypt and Argon2, ordered by date of
creation and increased confidence in security. They typically have a stretching
parameter to increase their complexity so that the same algorithm can be used
when computers get better at brute-forcing passwords.

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
(See for instance the [NIST randomness recommendation][].)

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
typically slower. They are usually instances of a **pseudorandom function
family** (PRF).

Examples: arc4random (based on a leaked version of the RC4 cipher), AES-CTR,
ChaCha20 (eg. in Linux’ /dev/urandom).

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

The *Vigenère cipher* survived hundreds of years of cryptanalysis, earning it
the name of “chiffre indéchiffrable” (indecipherable). While Babbage broke it by
noticing repeated sequences in the plaintext exhibited repeated sequences in the
ciphertext, it inspired the creation of the only provably unbreakable cipher,
the *one-time pad*.

The **one-time pad** simply performs modular addition on each symbol (in the
case of bits, this corresponds to a XOR with the secret key). It requires a
perfectly random secret key of a size equal to the plaintext that is never
reused.  *Claude Shannon* proved [information-theoretically](./information.md)
that it is unbreakable (the only such cipher known to date), as for all
plaintexts, there is a key that yields a given ciphertext. Practical risks in
managing the key caused it to fall into disuse.

Ron Rivest designed the **RC4** (Rivest Cipher 4) as a proprietary algorithm for
the RSA Security company. Following an anonymous online description, it was
reverse-engineered. To avoid trademark conflicts, many systems adopted it as
*ARC4*, and a derived CSPRNG was called *arc4random*. It was a common cipher in
SSL/TLS and WEP/WPA, until a 2015 flaw was discovered.

Daniel J. Bernstein (djb) designed *Salsa20* for the eSTREAM competition (a
follow-up to the NESSIE competition where all stream ciphers submitted were
broken). Many servers switched from RC4 to a derived cipher, **ChaCha20**, along
with djb’s Poly1305 MAC, to have authenticated encryption ([RFC 7905][]).

[RFC 7905]: https://tools.ietf.org/html/rfc7905

### Block ciphers

A block cipher, by contrast with a stream cipher, can only encrypt a fixed
number of bits (its *block size*).

Most block ciphers are **product ciphers**: the generation of an encrypted block
relies on repeating an operation (typically performing substitutions
(**s-boxes**) and permutations (**p-boxes**)) multiple times by linking the
output of one to the input of the next in a sophisticated *network* which
increases security every time. (They achieve that by distributing the impact of
each input bit to output bits, producing statistically more random output.)

The number of times the network is repeated is called the number of **rounds**.
Typical cryptanalysis first tries to break a cipher with a lower number of
rounds. If they find a better algorithm than brute-force on all rounds, the
cipher is considered *broken*, but the algorithm typically requires impractical
amounts of time and memory. If it achieves a scale close to human lives and
memory close to that of a country, it is considered *practically broken*.

The US government’s NBS (ancestor to NIST) requested proposals for a cipher. IBM
proposed **DES** (Data Encryption Standard), a 64-bit block cipher (based on a
Feistel network), whose s-boxes were then tweaked by NSA and key size reduced to
56 bits before publication.

When DES’s key size became dangerously close to brute-force-worthy, 3DES was
produced, but it was very slow. NIST organized a more open competition, **AES**
(Advanced Encryption Standard). The finalist, Vincent Rijmen and Joan Daemen’s
Rijndael, is a 128-bit block cipher based on a SP-network, with three variants:
128-, 192-, 256-bit keys (with 10, 12, or 14 rounds). It was rebaptized AES when
it won.

### Block modes

Block modes convert a block cipher into a stream cipher by breaking the
plaintext into blocks and encrypting each block with the cipher and a parameter
that depends on the processing of previous blocks.

The lack of use of that parameter, eg. by encrypting each block individually
(*ECB* mode), falls to shifted plaintext analysis: identical plaintext blocks
will have identical ciphertext blocks.

**CBC** (Cipher Block Chaining) for instance XORs each block of plaintext with
the ciphertext of the previous block. Diffie and Hellman also designed **CTR**
(Counter) mode, which XORs the plaintext with an encrypted **nonce** (a unique
input) that is incremented for every block.

    Parameters: key, nonce, plaintext.
    ciphertext block 1 = encrypt(nonce + 0, key) XOR (plaintext block 1)
    ciphertext block 2 = encrypt(nonce + 1, key) XOR (plaintext block 2)
    etc.

When the parameter for each block is obtained from the previous block, the first
block needs an initial parameter. It must be unique (ie. a nonce, “number used
once”), so that encrypting twice the same message does not yield the same
ciphertext, which would leak information. Often, it needs to be random in a
cryptographically-secure way. That first parameter is called an **initialization
vector**. It must be sent along with the ciphertext so it can be deciphered.

Those ciphers only ensure **confidentiality** (the message can only be read by
keyholders), but they lack:
- **authentication**: the message was validated by a keyholder,
- **integrity**: the message was not modified by a non-keyholder.

The lack of those guarantees can allow a non-keyholder to tamper with the
encrypted content unnoticed. The decrypted plaintext would then contain
planted or substituted information.

**Authenticated Encryption** (AE) offer authentication and integrity by adding a
MAC. For instance, **GCM** (Galois Counter mode) converts a block cipher to an
authenticated stream cipher which encrypts in counter mode and also produces a
fixed-sized tag (a MAC) for the whole message.

There are three variants of AE: **Encrypt-then-MAC** (EtM), which hashes
encrypted data, **Encrypt-and-MAC** (E&M), which hashes plaintext data, and
**MAC-then-Encrypt** (MtE), which encrypts hashed plaintext data.

EtM is considered the most secure. MtE, for instance, has caused vulnerabilities
such as Lucky13 in the way it interacts with padding.

Usually, you can also insert non-encrypted metadata along with the ciphertext,
which you wish to include for integrity in the AE MAC. That design is called
**Authenticated Encryption with Associated Data** (AEAD). For instance, GCM mode
supports that.

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
- factoring primes (**RSA**),
- elliptic curves (**EC**, eg. NIST P-256 (aka secp256r1), or Curve25519). The
  keys are typically smaller (eg. 256-bit, compare to 4096 bits for RSA).

**RSA** (Rivest, Shamir, Adleman) was the first public-key cryptosystem, and
shows how to encrypt data in its original formulation. However, it is usually
used as **RSAES-OAEP** ([RFC 2437][]) for use in encryption, detailing the
proper use of padding by relying on a hash function.

[RFC 2437]: https://tools.ietf.org/html/rfc2437

Elliptic curves don’t by themselves have an encryption algorithm, but **ECIES**
(Elliptic Curve Integrated Encryption Scheme) combines an EC, a *KDF*, a *MAC*,
and a *symmetric encryption scheme* to encrypt data just with a public key.

### Key exchange

Encryption is much more computationally expensive than symmetric schemes for
large (> 400 bytes) messages. Since the goal of asymmetric encryption is to
allow secure communication over a public channel without needing a shared secret
(the issue with symmetric ciphers), this is limiting.

A **key exchange** is a protocol where two entities communicate in public,
resulting in them generating a secret key that only they know.

**Diffie-Hellman** is a key exchange that lets two parties A and B obtain a
shared secret over a public channel. That secret can then be used as the key of
a symmetric cipher.

1. They each generate public and private keys with the same parameters (the
   modulo portion for RSA, the domain parameters for elliptic curves (ECDH)).
2. They agree on a base message `m`.
3. A sends `encryptPrivate(m, privateA)`, and B sends `encryptPrivate(m,
   privateB)`.
4. A computes `secret = encrypPrivate(encryptPrivate(m, privateB), privateA)`
   and b `secret = encryptPrivate(encryptPrivate(m, privateA), privateB)`, whose
   equality results from commutativity in underlying math.
5. `secret` is now shared exclusively between A and B.

Advice for the common values to choose is detailed in
[RFC 5114](https://tools.ietf.org/html/rfc5114).

Daniel J. Bernstein’s **X25519** is a famous ECDH using Curve25519 (picked by
djb for that use).

Systems which generate a new random secret key for every new session are said to
have **forward secrecy**.

### Digital signature

**Digital signatures** associated with a message give the following guarantees:
- **authentication**: the message was validated by a keyholder,
- **non-repudiation**: the message cannot be un-validated by the keyholder,
- **integrity**: the message was not modified by a non-keyholder.

Unlike a MAC, it does not require a shared secret, just shared public keys.

It relies on two functions, `sign()` and `verify()`, and a public/private key
pair, such that:
- `verify(message, sign(message, private), public) = true` and all other
  parameter combinations yield `false` with high probability.

For RSA, this is achieved this way:
- `sign(message, private) = encryptPrivate(hash(message), private)`
- `verify(message, signature, public) = encryptPublic(signature, public) ==
  hash(message)`

In practice, **RSASSA-PKCS1-v1\_5** defines an RSA signature scheme for a given
hash.

**RSASSA-PSS** defines another RSA signature scheme for a given hash, mask
generation formula, and a randomly generated salt of a given size. Both of those
schemes are defined in [RFC 3447][].

[RFC 3447]: https://tools.ietf.org/html/rfc3447

**ECDSA** (Elliptic Curve Digital Signature Algorithm) achieves that scheme,
given any EC and a hash.

Daniel J. Bernstein’s **EdDSA** is another digital signature scheme relying on
Edwards curves (such as Curve25519), and tends to be faster than ECDSA. The
primary example is ed25519, which is included in OpenSSH.

## Going further

- [Serious Cryptography](https://seriouscrypto.com)
