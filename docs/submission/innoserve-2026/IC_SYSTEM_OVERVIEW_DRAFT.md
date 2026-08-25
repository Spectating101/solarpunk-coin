# InnoServe 2026 International Exchange — English (IC) System Overview Draft

> **For final submission, place this content into the official Attachment 1-2 Word template.**  
> This Markdown file is the content master, not the upload format.

**Title of Information System (Mandarin):** Policy Lab：實證支持型金融主張的可稽核決策與約束系統  
**Title of Information System (English):** Policy Lab: Auditable Decisions for Evidence-Backed Financial Claims

## I. Preface

Financial and digital-asset systems increasingly depend on facts measured outside the financial system itself: energy production, environmental certificates, asset valuations, collateral states, insurance events, reserve claims, and other externally observed conditions. Yet there is often a hidden step between “we have data” and “this data is sufficient to authorize financial value.”

Policy Lab addresses that gap. It is an auditable verification and constraint workbench that separates five questions that are often collapsed into one decision: Does evidence exist? Is that evidence sufficient under the selected policy? If admitted, how much can it justify? Can the resulting claim settle? What still remains unproven?

Instead of returning only an approval score, Policy Lab preserves the evidence identity, assurance state, policy version, evaluated rules, binding quantity ceiling, settlement result, deterministic decision identity, and explicit unresolved boundaries. This allows a decision to be inspected and challenged rather than merely displayed.

The current public implementation uses energy-linked cases as its primary research domain. Policy Lab is not a cryptocurrency launch and does not claim that its current energy evidence establishes legal money, a stablecoin, verified physical delivery, or market adoption. An important function of the system is to show precisely when evidence is not strong enough to support a stronger claim.

## II. Innovation Description

Policy Lab's central innovation is to make the conversion from external evidence to financial authority explicit and executable.

First, **data is not automatically trusted evidence**. Public availability, hashing, a receipt, or a polished interface does not promote the underlying source into stronger assurance.

Second, **evidence is not automatically authority**. Versioned policies define admission requirements. The same evidence can be acceptable for a bounded research policy and unacceptable for a stricter policy.

Third, **admission is not unlimited quantity**. After admission, Policy Lab calculates comparable quantity ceilings and returns the lowest applicable maximum together with the exact constraint that binds.

Fourth, **valid quantity is not guaranteed settlement**. Settlement capacity is evaluated separately, allowing a valid bounded claim to end in a partial or complete shortfall.

Fifth, **a financial claim is not automatically money**. Legal, institutional, governance, circulation, and monetary-performance claims remain separate until they are independently established.

The public checkpoint `PUB-AUSGRID-001P` demonstrates these distinctions with a pinned outside Ausgrid dataset. The system retains its actual assurance at L0 and evaluates the same evidence under two policies. The open research policy returns `ADMIT_WITH_LIMIT` at 33.066 kWh, with evidence-backed capacity as the binding ceiling. The stricter pilot policy returns `BLOCKED` because signed evidence and stronger provenance are required. When the admitted quantity is stressed at 40% declared settlement capacity, the result becomes `PARTIAL`: 13.2264 kWh is covered and 19.8396 kWh remains short.

The result can therefore be summarized in one judge-visible sentence:

> **Same evidence. Different policy. Different financial consequence. Every step is inspectable.**

## III. System Functions

### Evidence and assurance handling

Policy Lab represents source identity, measurement window, summary statistics, diagnostics, evidence hash, and assurance state as explicit objects. Observed evidence is kept separate from modeled analytical context.

### Versioned policy admission

Each policy has a declared identity and version. Admission rules are evaluated individually. If a required rule fails, the claim is blocked and quantity evaluation does not continue as though the admission failure had not occurred.

### Quantity ceilings and binding attribution

For admitted cases, the system evaluates comparable maximum quantities such as evidence-backed capacity, provenance/policy capacity, and resource-context capacity. It selects the lowest applicable ceiling and records which constraint actually determined the result.

### Settlement stress

Users can change declared settlement capacity while keeping the evidence and original decision state visible. Policy Lab reports settled, partial, or shortfall outcomes and shows covered versus uncovered quantity.

### Receipts, lineage, and portable assessment

Each decision retains the identities required to reconstruct its reasoning chain. The system can produce a Decision Receipt, Research Capsule, and machine-readable Claim Assessment Package. Automated workflows verify schema consistency, decision reproduction, and deterministic rebuilding.

### Interactive comparison

The public workbench lets users inspect controlled cases, compare policies, alter assurance scenarios, stress settlement, view the outside-data checkpoint, trace lineage, and verify public research artifacts.

## IV. System Features

### Auditable rather than merely executable

A conventional rules engine can return a decision. Policy Lab also exposes why the decision occurred, which evidence and policy were used, which rule blocked or bound it, and what the decision does not prove.

### Failure is a valid result

Blocked admission, weak provenance, quantity limitation, and settlement shortfall are first-class outcomes. The system is designed to prevent overclaiming rather than maximize the number of approved cases.

### Deterministic reproduction

Equivalent declared case, evidence, context, policy, calculator versions, and rule results produce the same decision identity. The outside-data workflow rebuilds and verifies its decision artifacts and portable assessment package in CI.

### Extensible object model

Policy Lab uses typed manifests and public schemas rather than hard-coding one dashboard workflow. New domains can define their evidence, policy requirements, and comparable quantity constraints while preserving the same audit structure.

### Evidence-boundary preservation

The Ausgrid checkpoint remains L0. A public dataset, cryptographic hash, receipt, or historical blockchain implementation does not automatically become verified physical truth. This non-promotion rule is part of the system design.

## V. System Development Tools and Techniques

- **Frontend:** React, Vite, JavaScript.
- **Decision engine:** deterministic Node.js/JavaScript constraint core.
- **Data and schemas:** JSON and JSON Schema for cases, evidence, policies, decisions, receipts, settlement results, and assessments.
- **Testing:** Node test suites, frontend tests, Playwright browser tests, external-data CI, deterministic rebuild checks.
- **CI/CD:** GitHub Actions for surface-integrity checks, conformance, tests, secrets scanning, security checks, deployment, and live production smoke tests.
- **Deployment:** public GitHub Pages research workbench; core use does not require an account, wallet, or server-side financial service.
- **Historical reference implementation:** earlier SolarPunk/SPK/Sepolia components remain available for research lineage but are not required by the current Policy Lab decision core.

## VI. System Users

Policy Lab is currently positioned as a research, verification, and decision-design tool for users who need to understand how external evidence becomes financial authority. Potential users include:

1. researchers studying evidence-backed financial systems;
2. technical or product teams designing tokenized real-world assets, collateral/reserve claims, or energy/environmental certificates;
3. risk, governance, or audit functions that need to know which evidence, policy version, and constraint produced a decision;
4. institutional or policy researchers comparing the consequences of different explicit rules.

These are target workflows and extensibility directions, not claims of current commercial customers. The next material validation gate is an attributable owner/operator evidence source with stronger source/custody information.

## VII. System Environment

The public workbench runs in modern desktop and mobile browsers and is deployed through GitHub Pages. No account registration is required for the current research interface. Users can move between an interpreted Overview and Full Analysis, investigate controlled cases, compare policies, stress settlement, inspect receipts and lineage, and review the outside-data checkpoint.

Development and reproduction use Node.js 22, npm, React/Vite, and GitHub Actions on standard Linux CI environments. Historical Solidity/Sepolia components are reference surfaces rather than dependencies for the current Policy Lab workflow.

## VIII. Conclusion

Policy Lab is built around a simple challenge:

> **If a financial decision claims that real-world evidence supports it, how much does that evidence actually justify, and where must the claim stop?**

The current implementation demonstrates that the same outside evidence can produce a bounded admission under one policy and a block under another; an admitted quantity can still face settlement shortfall; and each result can retain a deterministic, inspectable reasoning chain.

The broader value is not the number 33.066 itself. It is the ability to show why the amount is no larger, why a stricter policy refuses the same evidence, what happens when settlement fails, and which claims remain unproven.

Policy Lab therefore turns a hidden institutional assumption — the conversion from evidence to financial authority — into an explicit system object that can be tested, compared, reproduced, and challenged. The next development step is not to add unrelated features, but to apply the frozen architecture to stronger attributable external evidence and learn where real operational conditions require the policy model to change.
