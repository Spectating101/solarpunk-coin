# SolarPunk Thesis Handoff

Date: 2026-04-07

## Current Status

The thesis package is now materially cleaner than the earlier state:

- real NASA POWER ingestion works in `thesis_package/monetary_scorecard.py`
- the reproducible Taiwan calibration is explicit
- the stale `<1.4%` convergence claim has been replaced in the thesis draft
- the collar result is framed as structural net credit, not a fake threshold
- oracle quality is framed as location-specific tolerance, not a trivial fixed-error variance-reduction claim
- margin is framed as the adoption constraint that implies a clearing-house requirement
- the monetary-standard framing from the stronger dirty docx has been merged back into the markdown draft
- `create_thesis_word.py` has been rebuilt as a clean markdown-to-DOCX exporter

## Verified Real-Data Outputs

Primary command:

```bash
python thesis_package/monetary_scorecard.py --data-source real --diagnostics
```

Verified outputs:

- `thesis_package/empirical_results/calibration_diagnostics_real.csv`
- `thesis_package/empirical_results/cross_location_pricing.csv`
- `thesis_package/empirical_results/oracle_tolerance.csv`
- `thesis_package/empirical_results/quarterly_simulation_real_thesis_reconstructed.csv`

Key numbers:

- Taiwan filtered real-data calibration: `σ = 189.5%`
- Jarque-Bera on filtered calibration series: `p = 0.349`
- Taiwan binomial-vs-Monte Carlo divergence: `2.08%` at `20,000` paths
- Oracle tolerance for `VR >= 95%`:
  - Taiwan: `21.7%`
  - Saudi Arabia: `19.7%`
  - Arizona: `18.9%`
  - Brazil: `22.7%`
  - Germany: `5.2%`
- Real quarterly 99% margin ratio range: `9.9x` to `15.4x` spot

## Thesis Framing To Preserve

Use this claim consistently:

> Energy-backed derivatives constitute a credible synthetic commodity monetary architecture: energy floors are empirically meaningful when enforcement is credible, the instrument can be priced from public physical data, and under explicit institutional conditions it performs better than gold and fiat on the core requirements of a monetary standard.

Do not backslide into these weaker framings:

- “CEIR is the thesis”
- “the collar becomes zero-premium only above a volatility threshold”
- “99% hedge effectiveness at 6% oracle error” as the main oracle result
- “the collar removes the primary adoption barrier”

## Important Methodological Note

The `189%` Taiwan number is not reproduced by naive raw daily NASA returns. Raw daily returns are much noisier. The thesis-grade value comes from the explicit `thesis_reconstructed` method:

- 4-day rolling mean
- 1% absolute log-return trim
- annualised on the resulting filtered series

That should be described as a filtered operational volatility estimate for quarterly hedging.

## Clean DOCX Outputs

Built from the current canonical markdown with the rebuilt exporter:

- `thesis_package/THESIS_COMPLETE_FINAL.docx`
- `thesis_package/COMPLETE_THESIS_SUBMISSION_READY.docx`

These no longer leak raw markdown fences, `---` separators, or pipe tables.

## Files Updated In This Pass

- `thesis_package/README.md`
- `thesis_package/thesis-draft.md`
- `thesis-draft.md`
- `generate_thesis.py`
- `create_thesis_word.py`

## Remaining Risks / Tomorrow's Likely Tasks

1. Decide whether the final thesis draft should keep both:
- the static Chapter 4 threshold table, and
- the full 20-quarter empirical table from `quarterly_simulation_real_thesis_reconstructed.csv`

2. Polish the abstract and conclusion one more time for examiner-safe wording.
The backend is much better aligned now, but the final prose can still be tightened.

3. If needed, regenerate the Word document from the current draft:

```bash
python create_thesis_word.py
```

## Recommended Next Conversation With Claude

Ask Claude to do one of these, not all at once:

1. “Polish the abstract, introduction, and conclusion in examiner-safe wording using the current numbers.”
2. “Turn the thesis into three paper outlines: CEIR, pricing, and synthetic commodity money.”
3. “Review the rebuilt DOCX output for style-only issues rather than factual/backend issues.”
