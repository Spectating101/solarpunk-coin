# Visual frontend refinement — 2026-10-06

Dated change record, not runtime authority. Start from [CURRENT_SURFACE.json](../../CURRENT_SURFACE.json) and [AGENTS.md](../../AGENTS.md).

Branch `ui/visual-assessment-2026-10-06`, created from `fix/repository-audit-2026-10-05` @ `998b9f3`. Changes are uncommitted in the repair checkout. Nothing was pushed, merged or deployed. Product behaviour, evidence classes and research boundaries are unchanged.

## Why

A headless review of every route at 1440×900 and 390×844 found layout defects, text below readable size and contrast, undersized targets, and template-like framing. The review compared the interface with Our World in Data, GOV.UK, Cochrane Summary of Findings, the OPA playground, Sigstore Rekor and OpenFisca.

## What changed

| Area | Change |
|---|---|
| Shell width | `.app-minimal.paired-platform-app` is 1640px. The workbench pages were designed for 1480–1600px but sat inside the legacy 920px SPK shell, which squeezed the case, compare, receipt and overview pages. |
| Type | Every font size below 12px is raised to 12px. All-caps tracked labels are sentence case, and labels moved from mono to sans. Status pills keep capitals. `<small>` no longer shrinks below the floor. |
| Colour tokens | `--muted`, `--dim` and `--red` raised so every text tier is at least 5.3:1 on every surface (previously `--dim` was about 2.5–2.9:1). `--border` and `--border-strong` raised. `color-scheme: dark` so native controls are dark. |
| Background | Radial glow and noise overlay removed. |
| Compare | The policy-diff body had no base styling. Added `styles/policyDiff.css`, with ruled rows, a ruled summary row, dark selects, and a stacked mobile layout. |
| Overview | Stat tiles replaced by a ruled inventory row. The orphaned grid cell is gone. |
| Case and receipts, mobile | Hidden horizontal scrollers for identity, actions and lenses became wrapping rows and a 2×2 lens grid. Truncated labels wrap. Genuine scroll regions (decision matrix, receipt index, reading maps) get edge scroll cues. |
| Wording | Dot-joined page kickers rewritten as plain phrases. "Shared workspaces" is now "Full analysis tools". "URL-BOUND STATE" is now "State is in the URL". |
| Source and limits | New `SourceAndLimits` note under the Ausgrid checkpoint (driven by `non_claims` and the R4 boundary), the compare page, and the receipt page. |
| Delivery | `CopyLinkButton` on case and receipt pages. `SiteFooter` linking public-interest, governance, privacy, security, code of conduct and licence, and stating what Policy Lab is not. |
| Historical routes | `reference`, `legacy-protocol` and `currency` show a "Historical reference" note. The Evidence Lab does not, because the README treats it as current. |
| Content fix | The Programme page said "Four-case pack"; it now reads the count from the case pack (five). `AGENTS.md` still says "four-case" and was not changed. |
| Page intros | The boxed "Complete interpreted result / inspection depth" teaser that repeated on every page is now a ruled aside. Remaining tracked letter-spacing on small labels removed. |
| Targets | Interactive targets at least 24px on reference-page links, footer links and range inputs. |
| Regression guard | `scripts/check_visual_quality.mjs`, run with `npm run policy-lab:visual-quality`, fails on overflow, clipped text, text under 12px, more than 1% of characters below AA contrast, targets under 24px, light native selects and console errors. |
| README image | `docs/media/policy-lab-overview.jpg` regenerated from this build. |

## Verification (final build, Node 22.21.1)

| Check | Result |
|---|---|
| Frontend unit tests | 96 pass (91 existing, 5 new) |
| `policy-lab:surface`, `policy-lab:preflight` | pass, 29 of 29 checks |
| `check_frontend_bundle.mjs` | pass |
| `node --test test-node/*.test.js` | 100 pass |
| `check_visual_quality.mjs` | 28 route and viewport checks within budget |
| `check_receipt_context.mjs` | pass: L0 → L2 → original L0, matching receipt and capsule downloads |
| `capture_case_workbench_v2.mjs` | 30 screenshots captured |

The visual-quality check was exercised with a negative control (type floor raised to 14px): it failed 28 of 28 and exited 1.

Before and after, character-weighted, desktop: text under 12px fell from 53–87% to 0% on the Policy Lab routes, text below AA contrast from 8–26% to 0%, and every overflow, clipped-text and light-select finding on the audited routes was removed. Contrast is measured against flat background colours and ignores gradients.

## Second pass: accessibility, privacy and sharing

| Area | Change |
|---|---|
| axe-core | Scanned all 18 routes at desktop (1440), tablet (820) and phone (390). Findings fixed: one `<main>` landmark on every route (Reference, Evidence, Currency, Sepolia and Protocol had none; the study, reproduction and brief pages nested or lacked one), links in text and tables underlined instead of colour-only, keyboard access to scrollable regions, menu and horizon buttons whose accessible name omitted their visible text, heading order on the reproduction page. Result: 0 violations on 54 route and viewport combinations. |
| Keyboard | Skip-to-content link (script-driven, because the app uses hash routing), per-page document titles, a polite route-change announcement, and a keyboard walk that checks every tab stop shows a focus ring at least 3:1. |
| Tablet | Hash strings on the reproduction page wrap instead of truncating, proof-stage hints wrap, the Sepolia header and grid no longer overflow at 820px and 390px, small links meet 24px. |
| Privacy | The page no longer requests fonts from Google. DM Sans, Instrument Serif and JetBrains Mono (SIL OFL 1.1, Latin and Latin Extended) are served from the site; licence texts ship at `third-party-notices.txt`, linked from the footer. `PRIVACY.md` now states this. Measured: every current route requests only its own origin. The historical Reference and Sepolia routes read a public Sepolia RPC and are the documented exception. |
| Sharing | `og:image` and `twitter:image` (1200×630 crop of the real overview), `summary_large_image`, canonical URL, `theme-color`, `color-scheme`. The image URL is the Pages path and resolves once published. |
| Guards | `scripts/check_accessibility.mjs` (`npm run policy-lab:a11y`) and a third-party-origin budget in `check_visual_quality.mjs`; the visual check now also covers tablet width and 18 routes. Both are wired into `.github/workflows/case_workbench_v2.yml`, which has not run on this unpublished branch. `axe-core` is a dev-only dependency (MPL-2.0, not bundled); the lockfile change is 11 lines and the four dependency backports still verify. Each guard was proved with a negative control. |
| Tests changed | Case lens buttons are now named by their visible text, so three tests and `capture_case_workbench_v2.mjs` match by prefix. The horizon toggle drops its redundant per-button label; one test and `capture_constraint_protocol_alpha.mjs` target the labelled group. The heavy receipts test has a 30 s timeout. One test title said "four-case". |

## Known test behaviour

`ReceiptsWorkspace.test.jsx` ("revisiting a shared decision identity…") builds capsules and takes about 3.7 of its 5 s timeout. On a heavily loaded machine (load average about 11 on 6 cores) the full suite timed out on it three times in a row; with `--maxWorkers=2` all 96 pass. It now has a 30 s timeout (see above).

## Not done, and decisions left open

- Dark theme kept. A light theme was weighed and deferred: about 500 hard-coded colour literals across the CSS make it a larger, riskier change. Colour goes through custom properties, so it is feasible later.
- 12px is a floor, not a target. Much label text is 12–13px. Raising the floor to 13px is a possible follow-up and was not tested.
- Navigation still has three layers (primary nav, Overview/Full-analysis switch, full-analysis tools bar). Only the bar's label changed.
- Hosted Pages, real screen readers (VoiceOver, NVDA, TalkBack) and light-mode preferences were not tested. Automated accessibility checks find only part of the problems.
- The historical Reference route reads a public Sepolia RPC as soon as it opens. A "load live reads" button instead of an automatic read would remove that third-party request; that changes behaviour and was not done.
- The `og:image` URL will 404 until the site is published.
- On a machine whose Playwright build does not match the installed browser, set `PLAYWRIGHT_BROWSERS_PATH` to a directory that links the installed headless shell under the expected name, or set `CHROMIUM_EXECUTABLE_PATH` for `check_visual_quality.mjs`.
