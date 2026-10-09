# Policy Lab — Standards and Adjacent-System Differentiation

**Status:** judge-facing comparison note  
**Last verified:** 2026-09-10  
**Purpose:** prevent false novelty claims and make the actual contribution easier to evaluate.

Policy Lab should **not** claim that policy-as-code, authorization, cryptographic credentials, proof-of-reserve, or machine-readable financial contracts are novel. Mature systems already cover those functions.

The narrower contribution being tested is the composition:

```text
evidence identity / assurance
        ↓
explicit policy admission
        ↓
comparable quantity ceilings + binding attribution
        ↓
settlement consequence
        ↓
reproducible decision / receipt / assessment
```

with a non-promotion rule: success at one layer must not silently create authority at the next.

## Comparison matrix

| System / standard | What it primarily provides | Important overlap with Policy Lab | What Policy Lab must **not** claim | Policy Lab-specific layer under test |
|---|---|---|---|---|
| Open Policy Agent (OPA) | General-purpose policy engine; evaluates declarative policy against structured input | Explicit, inspectable policy evaluation | Policy-as-code or domain-agnostic rules are novel | Evidence/assurance typing, quantity authority, settlement separation, and cross-object reproduction are composed around the policy result |
| Cedar | Authorization language and engine producing Allow/Deny decisions from principal/action/resource/context and policies | Explicit authorization policy and determining-policy diagnostics | Authorization policy evaluation itself is novel | Policy Lab asks what evidence is allowed to authorize, how much quantity follows, and what later settlement does; these are finance/evidence semantics rather than user/resource permission semantics |
| W3C Verifiable Credentials Data Model 2.0 | Cryptographically secured, machine-verifiable credentials/presentations | Evidence identity, issuer/verifier boundaries, cryptographic verification | A valid signature proves the underlying physical/economic claim or automatically supplies authorization | Policy Lab consumes evidence/assurance as inputs to separate business-policy, quantity, and settlement decisions; cryptographic verifiability must not promote claim truth |
| Chainlink Proof of Reserve | Reserve-data feeds and automated reserve/mint safeguards for tokenized assets and DeFi | External financial evidence, reserve thresholds, automated stopping rules | Oracle delivery, reserve feeds, or mint circuit breakers are novel | Policy Lab focuses on explicit evidence-quality/assurance boundaries, policy-dependent admission and attributable quantity ceilings before later settlement consequences |
| ACTUS | Standardized, machine-readable representation and algorithmic behavior of financial contracts | Deterministic financial semantics and reproducible contractual behavior | Machine-readable financial-contract logic is novel | Policy Lab is upstream of contract execution: it evaluates whether external evidence can justify a claim and what bounded quantity is authorized under a declared policy |

## Why these distinctions matter

### OPA

OPA describes itself as an open-source, general-purpose policy engine. It accepts structured data as input and evaluates domain-agnostic policies to return policy decisions. Policy Lab therefore cannot use “rules as code” as its novelty claim.

Policy Lab's narrower question is: **given evidence with a declared assurance state, what policy admits it, what comparable quantity ceiling binds, and what remains possible at settlement?** A general-purpose policy engine could potentially be used to implement parts of that logic, but it would not by itself define Policy Lab's evidence/quantity/settlement semantics.

### Cedar

Cedar is specifically an authorization policy language. Its canonical request is whether a principal may perform an action on a resource in a context, and its authorizer returns Allow or Deny with diagnostics. Cedar's security guidance also makes the application responsible for supplying relevant data and writing the intended authorization model correctly.

Policy Lab must therefore avoid pretending that “explicit policy determines an outcome” is new. Its additional research object is the typed chain from source evidence through assurance, claim admission, bounded quantity, and settlement.

### W3C Verifiable Credentials

W3C VC 2.0 defines cryptographically secure, machine-verifiable credentials and presentations. The W3C's decentralized-credentials threat model states explicitly that **verifiability does not make the underlying claims true**. Earlier and related VC material also separates verification from the verifier's own authorization/reliance decisions.

That is closely aligned with Policy Lab's non-promotion principle: a valid signature or credential is evidence about provenance/integrity, not automatic proof of physical truth, legal authority, permitted quantity, or successful settlement.

### Chainlink Proof of Reserve

Chainlink Proof of Reserve provides automated reserve monitoring and can connect reserve information to minting safeguards, circuit breakers, redemption limits, and related protocol logic. This is an important adjacent financial system, not something Policy Lab should minimize.

However, Chainlink's individual Proof of Reserve feed pages also warn that a reported reserve value may not equal the current value of actually available reserves and place responsibility on integrators to review the quality of the data they consume. Policy Lab's claimed contribution should therefore be framed around **making those evidence-quality and policy-consequence boundaries explicit, attributable, and reproducible**, rather than claiming to replace reserve feeds or oracle networks.

### ACTUS

ACTUS provides standardized, machine-readable representations of financial-contract logic across instruments such as loans and derivatives. Policy Lab should not claim deterministic financial-contract execution as novel.

The Policy Lab research layer is conceptually upstream: it tests whether external evidence is sufficient for a specific financial claim, the maximum defensible quantity under declared rules, and the settlement consequence before execution is confused with legitimacy.

## Source ledger

Official sources used for this comparison:

- Open Policy Agent documentation: https://www.openpolicyagent.org/docs
- Cedar Policy Language reference: https://docs.cedarpolicy.com/
- Cedar authorization semantics: https://docs.cedarpolicy.com/auth/authorization.html
- Cedar security / shared-responsibility guidance: https://docs.cedarpolicy.com/other/security.html
- W3C Verifiable Credentials Data Model 2.0: https://www.w3.org/TR/vc-data-model-2.0/
- W3C Threat Model for Decentralized Credentials: https://www.w3.org/TR/threat-model-decentralized-credentials/
- Chainlink Proof of Reserve: https://chain.link/proof-of-reserve
- Example Chainlink Proof of Reserve feed disclaimer: https://data.chain.link/feeds/ethereum/mainnet/21btc-por
- ACTUS: https://www.actusfrf.org/

## Safe novelty statement

Prefer:

> **Policy Lab tests a non-promotion semantics across evidence assurance, policy admission, quantity authorization, and settlement, while preserving the exact identities and assumptions required to reproduce the result.**

Do not say:

- “Policy Lab invented policy-as-code.”
- “Existing authorization systems cannot express these rules.”
- “Verifiable credentials prove claim truth.”
- “Proof-of-reserve systems do not gate minting or expose reserve thresholds.”
- “ACTUS does not provide deterministic financial-contract semantics.”
- “Policy Lab is a neutral standard.”

The comparison is meant to narrow the contribution, not inflate it.
