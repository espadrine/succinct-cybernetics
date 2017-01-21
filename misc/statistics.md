# Statistics

## Probabilities

- Ω: set of elementary events (exclusive outcomes)
- F: set of events; σ-algebra (closed set of all subsets) of Ω
- prob: function from F to [0,1]
- prob(Ω) = 1
- prob(∅) = 0
- prob(Ω\A) = 1 - prob(A)
- prob(A∪B) = prob(A) + prob(B) - prob(A∩B)  *(think overlapping disks)*
- A, B disjoint ⇔ prob(A∩B) = 0  *(non-overlapping disks)*
- prob(∪Ai) = Σ{r=1…n} (-1)^(r+1) Σ{i1≤ir} prob(Ai1∩…∩Air)
- prob(∪Ai) ≤ Σ prob(Ai)
- Ai pairwise disjoint ⇒ prob(∪Ai) = Σ prob(Ai)  *(partition of a disk)*
- prob(∩Ai) = Π prob(Ai)
- prob(∩Ai) = Π{i=2…} prob(Ai|A1∩…∩A{i-1}) prob(A1)
- A1⊂A2⊂… ⇒ prob(An) → prob(∪Ai)
- A1⊃A2⊃… ⇒ prob(An) → prob(∩Ai)
- prob(A|B) = prob(A∩B) / prob(B)
- A, B independent ⇔ prob(A|B) = prob(A)
- A∈∪Bi ⇒ prob(A) = Σ prob(A∩Bi)
- prob(A|B) = prob(B|A) prob(A) / prob(B)  *(Bayes' theorem)*
- Ai partition of Ω ⇒ prob(Ai|B) = prob(B|Ai) prob(Ai) / (Σj prob(B|Aj) prob(Aj))

## Distributions

A **random variable** (RV) is a function from Ω to ℝ. *(eg. winnings)*

The **indicator function** is a RV such that I(A) = 1 if A, otherwise 0.

A **mass function** for a RV X is fX: x → prob(X=x).

- fX(x) ≥ 0
- ∫ℝ fX(x) dx = 1

The **expected value** E[X] = Σ x fX(x).

- E[g(X)] = Σ{x∈X} g(x) fX(x)
- E[aX+b] = a E[X] + b
- (E[X])^2 ≤ E[X^2]  *(Cauchy-Schwarz inequality)*
- prob(X=a) = 1 ⇒ E[X] = a
- prob(a < X ≤ b) = 1 ⇒ a < E[X] ≤ b
- if X∈ℕ, r≥2, E[X] < ∞:
  - E[X] = Σ prob(X≥x)
  - E[X(X-1)…(X-r+1)] = r Σ{x=r…∞} (x-1)…(x-r+1) prob(X=x)

The **variance** var(X) = E[(X-E[X])^2].

- var(aX+b) = a^2 var(X)
- var(X) = 0 ⇒ X constant

The **covariance** cov(X,Y) = E[XY] E[X] E[Y]

- cov(X,Y) = E[(X-E[X])(Y-E[Y])]
- cov(X,Y) = cov(Y,X)
- cov(constant,X) = 0
- cov(a+bX+cY,Z) = b cov(X,Z) + c cov(Y,Z)
- cov(X,Y)^2 ≤ var(X) var(Y)

A few families of distribution.

- Bernouilli: RV from Ω to {0,1}. Take p = prob(X=0).  
  *Number of 1s from a 1/p dice throw (a dice with 1/p faces).*
  - E[X] = p
  - var(X) = p (1-p)
- Binomial "X ~ B(n,p)": RV such that fX(x) = (n choose x) p^x (1-p)^(n-x).  
  *Number of 1s from n throws of a 1/p dice.*
  - E[X] = n p
  - var(X) = n p (1-p)
- Geometric "X ~ Geom(p)": RV such that fX(x) = p (1-p)^(x-1)  
  *Number of throws before a 1/p dice yields a 1.*
  - E[X] = 1/p
  - var(X) = (1-p)/p^2
  - prob(X > n+m | X > m) = prob(X > n)  *(memory loss)*
- Negative binomial "X ~ NegBin(n,p)": RV such that fX(x) = (x-1 choose n-1) p^n (1-p)^(x-n).  
  *Number of throws before a 1/p dice yields n 1s.*
  - E[X] = n p / (1-p)
  - var(X) = n p / (1-p)^2
- Hypergeometric: RV such that fX(r) = (N choose r) (N-R choose n-r) / (N choose n)  
  *Number of red socks got from n blind picks without replacement from a drawer
  with N socks of which R are red.*
  - E[X] = R n/N
  - var(X) = R n/N (N-R)/N (N-n)/(N-1)
- Poisson: RV such that fX(x) = λ^x/x! exp(-λ), with x∈{0,1,…,λ}.  
  *Number of ticks per second when averaging λ ticks per second, if ticks are independent.*
  - E[X] = λ
  - var(X) = λ
- Uniform: RV such that fX(x) = constant with x∈[a,b].  
  *Result of dice throw.*
  - E[X] = (a+b)/2
  - var(X) = (b-a)^2/12, or ((b-a+1)^2-1)/12 if discrete
- Normal (Gaussian) "X ~ N(μ,σ^2)": RV such that fX(x) = exp(-(x-μ)^2/(2σ^2)) / (σ sqrt(2π))  
  *Infinite random walk starting at μ with step variance σ^2.*
  - E[X] = μ
  - var(X) = σ^2
