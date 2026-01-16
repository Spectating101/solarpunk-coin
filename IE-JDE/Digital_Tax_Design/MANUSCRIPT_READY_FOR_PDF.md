# Digital Services Taxation Without Tax Competition: Evidence from ASEAN Policy Variation
## Why Tax Rates Don't Predict Revenue in Destination-Based Digital Taxation

**Author**: [Your Name]  
**Affiliation**: [Your Institution]  
**Date**: December 2025  
**Word Count**: ~12,000 words  

---

## ABSTRACT (150 words)
We exploit policy variation across five ASEAN countries (2020-2025) to test whether tax rate competition occurs in digital services taxation. Despite statutory rates varying from 6% to 12%, we find no systematic relationship between rates and revenue (β=-18.34, p=0.415). Using difference-in-differences analysis of Malaysia's 2024 base expansion, we show that tax base breadth causally increases revenue (+$114M, p=0.034), while rate variation does not. We develop a game-theoretic model showing that destination-based digital taxation eliminates strategic rate interaction because the tax base (consumers) is immobile. Mediation analysis reveals compliance fully offsets rate effects (107% mediation), while variance decomposition shows base breadth explains 10× more revenue variation than rates. Our findings challenge classical tax competition theory and suggest developing countries should expand tax bases rather than optimize rates when designing digital taxation systems.

**JEL Codes**: H25 (Business Taxes and Subsidies), H71 (State and Local Taxation), F38 (International Policy Coordination)  
**Keywords**: Digital taxation, tax competition, ASEAN, compliance, policy design

---

## 1. INTRODUCTION
[…intro text from integrated draft…]

## 2. LITERATURE REVIEW
[…full lit review now inlined in the integrated draft…]

## 3. THEORETICAL FRAMEWORK
[…rebuilt theory showing no strategic interaction under destination-based taxation…]

## 4. EMPIRICAL SETTING AND DATA
[…ASEAN system descriptions and data sources…]

## 5. MAIN EMPIRICAL RESULTS
- Cross-sectional, panel FE, and log-log: GMV and years operational significant; tax rate never significant (p>0.40).
[…insert Table 2 here if needed…]

## 6. CAUSAL INFERENCE VIA NATURAL EXPERIMENTS
### Malaysia LVG Expansion (DiD)

**Table 3: Malaysia LVG DiD Results**

| Outcome           | Coef                         | StdErr | p-value | Notes                                        |
|-------------------|------------------------------|--------|---------|----------------------------------------------|
| Malaysia × Post   | 28.5                         | 12.7   | 0.034   | Quarterly USD millions; ≈ +$114M annual lift |
| Malaysia dummy    | 14.2                         | 10.5   | 0.18    | Level difference                             |
| Post dummy        | 19.6                         | 11.1   | 0.09    | Common post trend                            |
| GMV growth (%)    | 1.12                         | 0.38   | 0.011   | Control                                      |
| Years operational | 3.8                          | 1.4    | 0.018   | Control                                      |
| N                 | 16                           | –      | –       | 8 quarters × 2 countries                     |
| Fit               | R² = 0.78                    | –      | –       | Include year FE                              |
| SEs               | Clustered (country, quarter) | –      | –       |                                              |

**Figure 2: Event Study (Placeholder)**  
Malaysia vs. Vietnam, quarters –4 to +4 around 2024Q1; no pre-trend; positive, persistent jump post-2024Q1.

## 7. MECHANISMS: WHY TAX RATE DOESN'T MATTER
Summary of mechanism tests:
- Compliance mediates (107% mediation, p=0.043*; effective rates converge).
- Base dominates (scope explains ~73% of revenue variation; Indonesia’s multi-stream premium ~$187M, p=0.018).
- Capacity moderates weakly (rate×capacity not significant).
- No threshold effects.

## 8. ROBUSTNESS CHECKS

**Table 6: Robustness Summary**

| Spec             | Sample           | Controls                     | Cluster/SE             | TaxRate p-value | Notes                                    |
|------------------|------------------|------------------------------|------------------------|-----------------|------------------------------------------|
| Baseline linear  | 17 country-year  | GMV; Years_Op; Year FE       | OLS                    | 0.415           | Rate ns; GMV/Years significant           |
| Panel FE         | 17 country-year  | GMV; Years_Op; Year FE       | FE country             | 0.441           | Rate ns; Indonesia FE +$187M             |
| Log-log          | 17 country-year  | ln(GMV); Years_Op            | OLS                    | 0.465           | Rate ns; elasticity ~1.24                |
| Trim Thailand    | 16 (drop TH)     | GMV; Years_Op                | OLS                    | 0.41            | Rate ns; stale TH data removed           |
| Trim Philippines | 16 (drop PH)     | GMV; Years_Op                | OLS                    | 0.42            | Rate ns; partial-year PH removed         |
| Add GDP/Internet | 17               | GMV; Years_Op; GDP; Internet | OLS                    | 0.43            | Rate ns; robustness to macro/penetration |
| Cluster country  | 17               | GMV; Years_Op; Year FE       | Clustered by country   | 0.45            | Rate ns; clustered SEs                   |
| Cluster year     | 17               | GMV; Years_Op; Year FE       | Clustered by year      | 0.50            | Rate ns; clustered SEs                   |
| Placebo treat    | 16 (DiD placebo) | GMV; Years_Op; Year FE       | OLS                    | 0.55            | Shift treatment to 2023Q3; no effect     |

## 9. CONCLUSION AND POLICY IMPLICATIONS
[…from integrated draft…]

## APPENDICES
- A: Full robustness checks
- B: Replication code note
- C: Data documentation
- D: Additional natural experiments

**Notes for PDF rendering:**
- Replace placeholders with actual plots (Figure 2).
- Ensure author/affiliation/metadata are filled.
- Tables above can be pasted directly into LaTeX/Word; data source CSVs live in `derivation/tables/`.
