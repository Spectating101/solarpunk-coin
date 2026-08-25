# Global AI Finance 2026 — RC4 Claim / Evidence Ledger

This ledger is internal. It exists so the outward abstract can read like a normal research submission without losing claim discipline.

Canonical machine checkpoint: `frontend/src/data/publicEvidenceCheckpoint.js`  
Canonical external-case builder: `scripts/external_case_001p_ausgrid.mjs`  
Canonical case policies: `packages/constraint-core/src/casePolicies.js`

## Frozen case

- case: `PUB-AUSGRID-001P`
- dataset label: Ausgrid, *Solar Home Electricity Data*
- selected window: 2012-07-01 through 2012-07-07
- selected intervals: 336 half-hour intervals
- archive SHA-256: `6949ffee7ef8e2260f229f8a7e3b992390187facaaf023bb933b811a11cd1a11`
- evidence hash: `ac0bc483f3da8d90c4b9281b46abdbc81177a9338525039bd0e346be12a1d93b`
- assurance: L0
- derived eligible surplus: 33.066 kWh

## RC4-01 — the research problem is the handoff between existing mechanisms

**Safe outward claim**

Oracle, credential, policy-engine, financial-contract, and proof-of-reserve systems already address important parts of data-dependent finance. The research question is what happens at the handoff from external evidence to admissibility, supported quantity, and settlement.

**Prior-art basis**

- Eskandari et al. (2021): oracle trust models and manipulation risks;
- W3C VC 2.0: technical verifiability does not itself make claims true; verifier policy governs reliance;
- Open Policy Agent: general policy-as-code evaluation;
- ACTUS: algorithmic financial-contract terms/events with separate risk factors;
- Chainlink Proof of Reserve: reserve feeds can gate minting/circuit-breaker behavior.

**Do not claim**

- Policy Lab invented oracles, credentials, policy-as-code, proof of reserve, deterministic rules, or machine-readable contracts;
- no prior system has ever separated these concepts;
- the literature proves Policy Lab is novel.

## RC4-02 — Policy Lab is the method, not the research question

**Safe outward claim**

Policy Lab is used as an executable method for representing source assurance, policy admission, supported quantity, and settlement as separate states under pinned inputs.

**Evidence**

- case-policy engine and deterministic tests;
- public checkpoint with separate open/pilot decisions and settlement object;
- stable evidence and decision identities;
- closed-world reproduction and package checks.

**Do not claim**

- deterministic execution proves economic correctness;
- stable hashes prove physical source truth;
- the implementation itself is sufficient validation.

## RC4-03 — 33.066 kWh is a derived physical quantity, not a price

**Exact derivation**

For each half-hour interval in the selected case:

`derived_surplus_kwh = max(GG - (GC + CL), 0)`

where:
- `GG` = observed gross solar generation channel;
- `GC` = observed general-consumption channel;
- `CL` = observed controlled-load channel when present.

The external-case builder performs this calculation per interval and sums the accepted interval surplus. The selected seven-day case totals **33.066 kWh**.

**Safe outward wording**

> The worked case derives a conservative 33.066 kWh surplus from gross PV generation minus general and controlled load, floored at zero per half-hour interval.

**Important interpretation**

- it is a **physical evidence-supported quantity**;
- under the open research policy, one experimental `ENERGY_CLAIM_UNIT` maps one-for-one to one kWh of that underlying quantity;
- it is **not** a monetary price, market value, discount-adjusted valuation, legal entitlement, or direct metered export channel.

**Do not claim**

- `33.066 kWh` is observed exported energy;
- `33.066` is an asset price or fair value;
- the one-for-one research mapping is an economically justified exchange rate.

## RC4-04 — public availability does not upgrade source assurance

**Safe outward claim**

The case remains at the workbench's lowest assurance tier, L0, because the research copy lacks source-holder-confirmed custody, a cryptographic operator signature, and external corroboration.

**Evidence**

- `evidence.assurance = L0`;
- external-case builder explicitly sets `signed=false`, `operator_signed=false`, `cryptographically_verified=false`, `external_corroboration=false`;
- builder warning: frozen mirror bytes do not prove source-holder custody.

**Do not claim**

- Ausgrid authenticated this Policy Lab case;
- hashing or public availability upgrades the source to operator-verified evidence;
- the half-hour readings were independently certified for this research use.

## RC4-05 — the policy comparison is a sensitivity experiment, not normative validation

**Open research policy** — `LAB-CASE-OPEN-004`
- admission: positive surplus + zero blockers;
- quantity ceilings: evidence-backed capacity, resource-context capacity, absolute cap;
- result on fixed public evidence: admitted up to 33.066;
- evidence-backed capacity binds.

**Pilot research policy** — `ENERGY-CASE-PILOT-005`
- adds signed-evidence requirement;
- adds minimum provenance L2;
- result on the same L0 evidence: blocked;
- blocking rules: signed evidence + minimum provenance.

**Safe outward wording**

> The policies are researcher-declared comparison policies used to test how evidence requirements change the result while the evidence object is held fixed.

**Do not claim**

- either policy is empirically calibrated, institutionally endorsed, legally correct, economically optimal, or production-ready;
- the stricter policy is necessarily better;
- the open policy is a recommendation for live issuance.

## RC4-06 — the policy result changes while evidence identity is fixed

**Evidence**

- open decision ID: `913bde9848571e905873510ae2e11bd7b8ed4489d828e2605dca038dc3002a1a`
- pilot decision ID: `96bc8edae69b3f27e6261ffcfb6f5a347b3b0a1a750abc81ec414e66b5a6e7d2`
- evidence hash is unchanged across both evaluations.

**Safe inference**

The financial consequence in the executable model can change because the explicit admissibility rule changes, without claiming that the evidence itself has become stronger or weaker.

## RC4-07 — settlement is a separate stress stage

**Frozen stress**
- admitted quantity: 33.066
- declared settlement capacity fraction: 0.4
- covered: 13.2264
- shortfall: 19.8396
- result: partial

**Safe outward wording**

> Holding the admitted claim fixed and declaring settlement capacity at 40% produces 13.2264 covered and 19.8396 short.

**Do not claim**

- 40% is an estimated default probability;
- this is observed redemption or physical delivery;
- settlement stress proves legal enforceability.

## RC4-08 — methodological contribution and current limit

**Safe contribution statement**

The current contribution is a reproducible methodological demonstration that source assurance, admissibility, supported physical quantity, and settlement can be represented and tested as different states under a fixed external evidence object.

**Current limits**

- one public outside-data case;
- L0 assurance;
- derived surplus, not directly metered export;
- comparison policies are researcher-declared rather than externally calibrated;
- settlement is hypothetical stress;
- no legal issuance/redemption result;
- no monetary valuation/adoption result;
- no proof of general field validity.

## Reference boundary

The outward submission may cite the following as context, not as endorsement:

1. Eskandari et al. (2021), oracle SoK;
2. W3C Verifiable Credentials Data Model v2.0;
3. Open Policy Agent documentation;
4. ACTUS fundamentals;
5. Chainlink Proof of Reserve documentation;
6. Ratnam et al. (2017), Ausgrid residential load/PV dataset paper.

## Language guard

| Avoid | Use instead |
|---|---|
| “Ausgrid validated Policy Lab” | “the experiment uses a pinned public copy of Ausgrid data” |
| “verified energy production” | “public research evidence retained at L0” |
| “metered export of 33.066 kWh” | “derived surplus of 33.066 kWh” |
| “33.066 is the financial value” | “33.066 is the evidence-supported physical quantity before valuation” |
| “validated pilot policy” | “researcher-declared comparison policy” |
| “settlement proves redemption” | “40% declared settlement stress” |
| “real-world pilot” | “outside-data research case” |
| “independent validation” | “reproducible public case,” unless a genuinely independent evaluator exists |
