# Fiscal Choke Points — Coding Rules

This file freezes the qualitative coding used in `COUNTRY_ARCHITECTURE.csv`. The categories are analytical descriptors, not scores.

## 1. Unit being coded

Code the **specific legal/administrative instrument examined in the paper**, not the entire national tax system and not the country’s general level of digitalization.

A country may legitimately contain more than one node or coupling type. Where the paper examines a split architecture, preserve the split rather than forcing one category.

## 2. Node locus

`node_locus` describes where the principal fiscal duty examined in the paper sits in the commercial chain.

### `provider-centered`

Use when the nonresident or other supplier remains the principal registrant/remitter for the examined transaction class.

Evidence should show provider registration, filing, remittance, or equivalent direct liability.

### `provider-centered with conditional platform responsibility`

Use when the provider is the default node but official rules or guidance can shift responsibility to a platform when specified control functions are satisfied.

### `appointed collector`

Use when the authority designates or appoints an intermediary to collect and remit for the covered transaction class.

### `payment-capable platform`

Use when the platform’s payment function is central to the legally assigned withholding/remittance duty.

### `split provider/buyer/marketplace nodes`

Use when the examined regime intentionally assigns different fiscal nodes to different transaction classes, such as B2C provider remittance and B2B buyer withholding.

### Coding rule

Do not infer node locus from the commercial prominence of a platform. Code only the actor assigned a fiscal duty by the frozen source.

## 3. Event coupling

`event_coupling` describes how closely the required fiscal action is legally tied to the underlying commercial event.

It does **not** measure quality, effectiveness, compliance, digital maturity, or revenue performance.

### `transaction-coupled`

Use when the source explicitly ties withholding, collection, or another fiscal action to transaction confirmation, accepted payment, settlement, or an equivalent per-transaction trigger.

**Current example:** Vietnam under Decree 117/2025 for the covered seller/platform scope.

### `collection-coupled`

Use when an appointed or liable intermediary charges the tax as part of the covered commercial transaction and issues transaction-level commercial proof, while reporting/remittance may occur periodically.

**Current example:** Indonesia PMSE VAT collector architecture.

### `conditional platform/provider rail`

Use when the platform becomes liable only when specified control functions are satisfied, while the broader compliance process remains registration/filing based rather than a universal per-transaction withholding rule.

**Current example:** Thailand VES platform condition.

### `periodic/provider-centered`

Use when the principal examined architecture relies on provider registration and periodic return/remittance, even if tax becomes due by reference to payment or invoice timing.

**Current example:** Malaysia SToDS foreign-provider rail.

### `split by transaction type`

Use when different transaction classes within the examined regime have materially different coupling and liable nodes.

**Current example:** Philippines B2C provider remittance versus B2B final withholding paths.

## 4. Borderline cases

When a source supports more than one category:

1. preserve the narrower instrument scope;
2. record the split if transaction classes genuinely differ;
3. do not average categories;
4. document the ambiguity in `open_issue`;
5. prefer `mixed` or split wording over false precision.

## 5. Evidence standard

A coding assignment requires at least one frozen country claim establishing the mechanism.

Examples:

- `transaction-coupled` requires source language tying fiscal action to a transaction event;
- `collection-coupled` requires transaction-level tax collection or proof;
- `provider-centered` requires direct provider liability/registration/remittance;
- `split` requires separate official rules for the different nodes.

Administrative collection totals cannot establish coupling category.

## 6. Current coding

| Country | Node locus | Event coupling | Main supporting claims |
|---|---|---|---|
| Malaysia | provider-centered with conditional platform responsibility | periodic/provider-centered | DT-MY-001..004 |
| Indonesia | appointed collector | collection-coupled | DT-ID-001..003 |
| Vietnam | payment-capable platform | transaction-coupled | DT-VN-002..003 |
| Thailand | provider-centered with conditional platform shift | conditional platform/provider rail | DT-TH-001..002 |
| Philippines | split provider/buyer/marketplace nodes | split by transaction type | DT-PH-001..004 |

## 7. Re-coding trigger

Revisit a country code when:

- governing law materially changes;
- a newer official source changes the liable node;
- the manuscript changes the transaction class being studied;
- a source previously treated as controlling is superseded;
- the current category cannot be reproduced from the frozen claims.

Never change a code merely to make the cross-country figure look more symmetric or theoretically attractive.