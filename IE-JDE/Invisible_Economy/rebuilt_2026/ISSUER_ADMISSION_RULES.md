# Invisible Ledger V2 — Issuer Admission Rules

These rules govern the issuer/segment evidence used for RQ1 and the mechanism chapter. They are designed to prevent the old project from rebuilding a large-looking residual by combining non-equivalent disclosures.

## 1. Required fields for every candidate period

A candidate issuer/segment period is not `CORE` until the following are documented:

1. **Issuer / segment identity** — legal issuer and exact reporting segment or business line.
2. **Period** — fiscal year/quarter and whether the period length changed.
3. **Geography** — Indonesia-only, regional, global, or mixed.
4. **Business perimeter** — marketplace, travel, logistics, financial services, other businesses included/excluded.
5. **Transaction metric** — exact source label and definition; GTV/GMV/TPV/order value are not assumed equivalent.
6. **Revenue metric** — exact source label and gross/net/comparable basis.
7. **Accounting presentation** — principal/agent treatment where relevant; incentives/contra-revenue treatment if disclosed.
8. **Currency and conversion** — source currency and any FX transformation.
9. **Source locator** — filing/report/table/page/URL sufficient for independent reconstruction.
10. **Comparability note** — mergers, disposals, segment redefinitions, acquisitions, restatements, changes in incentives, or metric-definition changes.

## 2. Admission classes

### `A_DIRECT_CORE`

Use in the main longitudinal issuer analysis when:

- transaction and revenue measures are directly disclosed by the issuer or directly derivable from audited/source-native components;
- the geography and business perimeter are acceptable for the research question;
- two consecutive periods are definitionally comparable or a documented comparable basis exists;
- no undisclosed allocation assumption is required.

### `B_DIRECT_CONDITIONAL`

Direct data exist, but one material boundary requires an explicit judgment. Examples currently include:

- Blibli third-party activity if travel-inclusive scope remains in the segment;
- Bukalapak Group if the broader-than-Indonesia geography remains material.

These cases may become core only after the advisor/sample gate is resolved. Until then, show them separately and do not let them determine a pooled summary.

### `C_RECONSTRUCTED_SENSITIVITY`

Country or segment values depend on allocation assumptions, market shares, inferred take rates, or other reconstruction.

Use only for sensitivity, historical continuity, or mechanism diagnostics. Never mix these rows with `A_DIRECT_CORE` rows in a headline sample count or pooled coefficient.

### `D_CORROBORATION`

External issuer histories that establish recurrence or heterogeneity outside the core sample. Keep their units and geographies source-native.

### `E_REJECTED`

Exclude from the empirical core if any of the following holds:

- no defensible common perimeter across consecutive periods;
- transaction metric definition changes in a way that cannot be bridged;
- revenue basis changes in a way that cannot be bridged;
- geography cannot be separated and materially conflicts with the claimed setting;
- period length mismatch is unresolved;
- major merger/disposal/reclassification makes growth comparison uninterpretable;
- source cannot be independently located;
- key value is carried forward from an old manuscript without source re-verification.

## 3. Transition-level rule

Admission is evaluated **per transition**, not per company.

A company may have:

- some `A_DIRECT_CORE` transitions;
- some `B_DIRECT_CONDITIONAL` transitions;
- some rejected transitions.

Do not label an entire issuer `clean` merely because one period is clean.

## 4. Growth-divergence coding

For each admitted transition calculate, from source-native values:

- transaction growth rate;
- revenue growth rate;
- signed divergence = revenue growth minus transaction growth;
- direction relation: `SAME_POSITIVE`, `SAME_NEGATIVE`, `OPPOSITE_TX_DOWN_REV_UP`, `OPPOSITE_TX_UP_REV_DOWN`, `FLAT_MIXED`;
- magnitude note;
- known mechanism flags: `INCENTIVES`, `MONETIZATION`, `GROSS_NET`, `BUSINESS_MIX`, `PERIMETER_CHANGE`, `OTHER`, `UNRESOLVED`.

The signed divergence is descriptive. It is not an economic wedge, tax gap, or missing-value measure.

## 5. Common revenue-basis rule

The final issuer chapter should use the most comparable revenue concept that can be supported across admitted transitions. If a single common basis cannot be defended:

- do not force one;
- stratify results by revenue basis;
- state the loss of cross-case comparability;
- preserve the strongest within-case mechanism evidence.

A smaller clean sample is preferable to a larger mixed-basis sample.

## 6. Advisor gate currently open

The V2 research pack intentionally leaves three decisions unresolved until the advisor-facing proposal stabilizes:

1. whether Blibli's travel-inclusive third-party segment is acceptable in the primary longitudinal sample;
2. whether Bukalapak's group geography is acceptable for an Indonesia-centered thesis;
3. which common revenue basis should govern the final issuer-transition table.

No automated process should silently decide these on behalf of the thesis author/advisor.

## 7. Reporting rule

The manuscript should report:

- the candidate inventory;
- the admitted inventory after gates;
- excluded transitions and reasons;
- direct vs reconstructed status;
- mechanism evidence separately from simple divergence counts.

This makes sample construction auditable and prevents result-driven inclusion.