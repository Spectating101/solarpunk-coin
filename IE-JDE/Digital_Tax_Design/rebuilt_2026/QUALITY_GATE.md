# Fiscal Choke Points — Final Quality Gate

This is the release checklist for moving the Digital Tax rebuild from `HOSTILE-REVIEW READY` to `SUBMISSION CANDIDATE`.

The standard is not “sounds strong.” The standard is that a skeptical reviewer can reconstruct the paper’s central contribution, country evidence, and inference boundaries from the package.

## Gate A — Research question

- [x] Central question is institutional and answerable by the available evidence.
- [x] Old rate-regression question is explicitly superseded.
- [x] Abstract and introduction state the same research object.

**Pass condition:** a reader can state the question without mentioning the old rate coefficient.

---

## Gate B — Originality and literature

- [x] Platform VAT/GST liability is acknowledged as prior art.
- [x] Firms-as-fiscal-intermediaries literature is engaged.
- [x] VAT information-trail literature is engaged.
- [x] Digital-tax administration guidance is engaged.
- [x] Prior ASEAN digital-tax comparative mapping is acknowledged as prior art.
- [x] Contribution is narrowed to transaction-node architecture, node locus, and event coupling rather than generic regional comparison.
- [ ] External literature reviewer confirms the contribution is additive beyond both OECD platform-liability guidance and existing ASEAN comparative work.

**Pass condition:** novelty survives after conceding both the underlying intermediation mechanism and prior regional comparisons.

---

## Gate C — Country evidence

### Malaysia
- [x] location indicators frozen;
- [x] registration threshold frozen;
- [x] platform/FSP guidance frozen;
- [x] current MySToDS index confirms that the FSP guide remains officially linked;
- [x] quarterly taxable period frozen;
- [ ] comparable reconciliation/audit evidence frozen.

### Indonesia
- [x] appointment/collection role frozen;
- [x] commercial proof of collection frozen;
- [x] active-collector and cumulative collection figures frozen;
- [x] current DGT page controls monthly remittance and periodic-return cadence;
- [ ] comparable reconciliation/audit evidence frozen.

### Vietnam
- [x] Decree 117 issue date and 2025-07-01 effective date frozen;
- [x] payment-capable platform scope frozen;
- [x] transaction-level withholding trigger frozen;
- [x] September 2026 currentness check completed through Decree 68/2026 and Decree 141/2026;
- [x] Decree 68/2026 expressly carries forward the per-transaction platform responsibility under Decree 117;
- [ ] comparable reconciliation/audit evidence frozen.

### Thailand
- [x] VES threshold and rail frozen;
- [x] continuous offer/payment/delivery platform guidance frozen;
- [x] governing-law basis frozen from Revenue Code section 82/13;
- [ ] comparable reconciliation/audit evidence frozen.

### Philippines
- [x] digital-services VAT scope frozen;
- [x] location evidence frozen;
- [x] B2C provider rail frozen;
- [x] B2B withholding path frozen;
- [x] separate transaction paths preserved;
- [ ] comparable reconciliation/audit evidence frozen.

**Pass condition:** no central country paragraph depends on a source marked unresolved. Comparable reconciliation evidence is required only for performance claims that depend on it; the present manuscript preserves it as an explicit evidence gap instead.

---

## Gate D — Comparative logic

- [x] five components defined;
- [x] node locus defined;
- [x] event coupling defined;
- [x] coding rules frozen in `CODING_RULES.md`;
- [x] country matrix contains both dimensions;
- [x] cross-case findings derive from country rows;
- [x] typology explicitly labeled non-ranking;
- [ ] event-coupling assignments independently reread for consistency.

**Pass condition:** another researcher can assign the same qualitative category using the documented source facts and definitions.

---

## Gate E — Inference discipline

- [x] no GMV/GTV-to-tax shortcut;
- [x] no hidden-GDP inference;
- [x] no rate-irrelevance claim;
- [x] no 30:1 base-breadth claim;
- [x] no inherited Malaysia causal estimate;
- [x] no claim that destination basis eliminates tax competition;
- [x] administrative collections are labeled non-causal;
- [x] privacy/legal-authority boundary is explicit;
- [x] performance ranking is prohibited without comparable evidence.

**Pass condition:** every strong claim is supported by its evidence class rather than by rhetoric.

---

## Gate F — Manuscript architecture

- [x] abstract identifies question, method, findings, contribution, and noncausal boundary;
- [x] introduction states bounded cross-case findings;
- [x] literature section precedes novelty claim;
- [x] manuscript explicitly concedes both mechanism prior art and prior ASEAN comparison;
- [x] method/source hierarchy is explicit;
- [x] framework is defined before country cases;
- [x] country cases use consistent comparative variables;
- [x] separate cross-case findings section exists;
- [x] implications do not overclaim sovereignty or welfare;
- [x] limitations are substantive rather than ceremonial;
- [x] conclusion matches the claim register.

**Pass condition:** remove any country subsection and the paper still has a visible analytical architecture rather than collapsing into a sequence of anecdotes.

---

## Gate G — Reproducibility package

- [x] source catalog exists;
- [x] claim register exists;
- [x] country architecture exists;
- [x] claim boundaries exist;
- [x] literature-positioning map exists;
- [x] coding rules exist;
- [x] package manifest exists;
- [x] figures/tables spec exists;
- [x] reviewer-risk register exists;
- [x] submission materials exist;
- [x] structural validator exists (`validate_package.py`);
- [x] structural validator executed successfully on the branch package — GitHub Actions run `34819639467`, validated head `39d6e087ed68df2cc8edd883ab423a9a55580d1f`;
- [x] validation output recorded in `VALIDATION_REPORT_2026-09-14.md`;
- [ ] final release hash / tag after independent review.

**Pass condition:** a reviewer can audit the paper without searching historical Digital Tax files. Structural validation is now an executed gate rather than a prospective one.

---

## Gate H — Relationship to Invisible Ledger

- [x] IL is treated as a measurement companion rather than tax-liability evidence;
- [x] platform revenue and transaction value remain distinct;
- [x] DT begins only after a legal taxable object is defined;
- [x] conclusion states the measurement/institutional division of labor.

**Pass condition:** the two papers can be submitted separately without one depending on the other’s unsupported inference.

---

## Gate I — Packaging

- [x] canonical title available;
- [x] alternative titles available;
- [x] short abstract available;
- [x] standard abstract available;
- [x] keywords available;
- [x] highlights available;
- [x] methods statement available;
- [x] data/reproducibility statement available;
- [x] ethics/data statement available;
- [x] cover-letter core available;
- [x] plain-language summary available;
- [ ] venue-specific formatting and cover letter after route selection.

---

# Current release assessment

**Current status:** `STRONG RESEARCH PACKAGE / HOSTILE-REVIEW READY, NOT YET SUBMISSION-FROZEN`

### Strongest dimensions

- research-question clarity;
- claim discipline;
- comparative architecture;
- primary-source grounding;
- novelty boundary against both mechanism prior art and regional-comparison prior art;
- currentness through the material 2026 Vietnam legal layer;
- distinction from Invisible Ledger;
- narrative and policy legibility;
- package-level auditability;
- executed CI validation.

### Remaining quality gap versus CL-ECI-level package discipline

1. independent re-code of node locus/event coupling;
2. independent novelty/hostile review;
3. preserve reconciliation/audit/compliance-cost limitations unless comparable evidence is actually collected;
4. final just-before-submission source-currentness check;
5. route to a venue that values comparative institutional/tax-administration work rather than forcing weak causal econometrics back into the paper.

## Promotion rule

Change status to `SUBMISSION CANDIDATE` only when Gate B’s external novelty check and Gate D’s independent coding reread are closed, the hostile reviewer risk register contains no unresolved critical risk, and the final source-currentness check is performed for the selected submission date. Reconciliation evidence need not be manufactured merely to close the package; where it is unavailable, it remains an explicit limitation rather than a hidden inference.