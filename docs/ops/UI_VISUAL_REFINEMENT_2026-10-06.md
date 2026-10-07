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

## Third pass: exhaustive state coverage

`scripts/check_visual_states.mjs` walks the reachable state space with the same measurements as `check_visual_quality.mjs` (shared in `scripts/lib/visual_measure.mjs`):

| Group | Coverage (profile `full`) |
|---|---|
| Routes | 19 routes x overview/full-analysis mode x 320, 390, 820, 1440 and 1920px |
| Cases | 5 cases x 3 policies x 4 assurance scenarios x 4 lenses, at phone, tablet and desktop |
| Compare, tools, receipts | every scenario x ordered policy pair, every Analysis Lab and Verification Hub tool, a receipt opened from every case state |
| Controls | every in-page button clicked in turn (822 clicks), every disclosure open, the mobile menu, the settlement slider at 0/10/40/100 |
| Settings | 320px reflow, 200% and 400% zoom widths, WCAG text-spacing overrides, forced-colors, reduced motion, A4 print with a real PDF |
| Engines | `ci` profile in Chromium, Firefox and WebKit (`--browser`) |

Run: `npm run policy-lab:visual-states` (profile `ci`, about 3 minutes) or `npm run policy-lab:visual-states:full` (about 15 minutes, with axe on every state). The `ci` profile is in the CI workflow; the cross-browser runs and the `full` profile are local.

Final results: `full` + axe in Chromium, 2,279 states and 2,254 axe runs, all within budget; `ci` in Firefox (447 states) and WebKit (462 states), all within budget.

What the crawl and the screenshot review found and fixed:

| Finding | Fix |
|---|---|
| Research page (Full mode): the "How the programme composes" diagram was crushed into 30px columns, text spilling past its borders | Vertical chain with rotated connectors |
| Reference page: three-step pipelines laid out in a five-column grid inside half-width cards (steps about 57px wide) | Auto-fit grid |
| Reproduction list: the MATCH/MISMATCH status auto-placed into a 30px column on phones and tablets | Explicit grid placement |
| `.event-type` used an undefined `--danger` variable that fell back to #a33 (2.86:1) | Defined `--danger` from the red token |
| Admitted quantity and binding rule truncated with an ellipsis on phones | Wraps |
| WebKit: selects sized to their longest option, overflowing their label | `min-width: 0`; one cross-engine select appearance |
| Full-analysis state pickers overflowed on phones | Shrinkable selects |
| Keyboard: scroll regions had no focus ring (introduced earlier this day, caught by the keyboard check) | Focus ring on any `tabindex="0"` element |
| **Print**: receipts and cases printed in the dark theme; without background graphics (the browser default) that is pale text on white | `styles/print.css`: light, high-contrast, no navigation chrome, cards kept whole, disclosures open; a receipt prints as three pages starting with the receipt |
| Live Sepolia reads could issue a second wave of requests after the page was left | Cancel check, provider `destroy()`, a 400 ms start delay so passing through the page contacts no one; three unit tests |
| 8 scrollable containers unreachable by keyboard, heading order, an invalid ARIA list | `ScrollRegion` component, heading levels, `role="group"` |

The detectors were also corrected where they were wrong: the measurement ignored 1px visually-hidden elements, requests are attributed to the route the page is on, a squeezed-text check was added (verified with a control), and WebKit's select-popup scroll-width quirk is not reported.

## Fourth pass: load performance

Measured cold on an emulated mid-range phone (390px, 4x CPU slowdown, "Slow 4G" at 1.6 Mbps and 150 ms RTT), median of three runs. Before: first and largest paint about 1.45 s, 257 KB over 13 requests, blocking time 12-63 ms, but layout shift of 0.13 on Compare and Receipts and up to 0.27 on Study (poor).

| Cause | Fix |
|---|---|
| Web fonts were discovered late (after the stylesheet), arrived at about 1.8 s, and the swap moved the whole page by about 3px | `<link rel="preload">` for DM Sans and Instrument Serif; JetBrains Mono is not preloaded because a third file cost about 150 ms of paint time for little extra stability |
| The new footer rendered while a page's data was still loading, then was pushed away when the content arrived (intermittent, 0.16 on Study) | The footer is shown only once the page's `<main>` exists |

After: layout shift 0.000-0.002 on every route in most runs (an occasional 0.05 from a small font swap), largest paint about 1.7-1.9 s, 257-264 KB. `scripts/check_load_performance.mjs` (`npm run policy-lab:load-performance`) keeps this from regressing; its budgets are layout shift 0.1, paint 4.5 s, blocking time 300 ms, 400 KB and 30 requests. Paint and blocking budgets are loose because runner speed varies. The guard caught the intermittent footer shift the first time it ran.

## Hosted CI

Pull request 74 (draft, into `main`) was the first time any of this ran on GitHub's runners: all 19 checks passed on the first run (core, frontend, Solidity, Slither, Python 3.11-3.13, conformance on Ubuntu and macOS, gitleaks, the public-case execution, and the workbench job including the visual quality, accessibility and visual-state checks).

## Known test behaviour

`ReceiptsWorkspace.test.jsx` ("revisiting a shared decision identity…") builds capsules and takes about 3.7 of its 5 s timeout. On a heavily loaded machine (load average about 11 on 6 cores) the full suite timed out on it three times in a row; with `--maxWorkers=2` all 96 pass. It now has a 30 s timeout (see above).

## Not done, and decisions left open

- Dark theme kept. A light theme was weighed and deferred: about 500 hard-coded colour literals across the CSS make it a larger, riskier change. Colour goes through custom properties, so it is feasible later.
- 12px is a floor, not a target. Much label text is 12–13px. Raising the floor to 13px is a possible follow-up and was not tested.
- Navigation still has three layers (primary nav, Overview/Full-analysis switch, full-analysis tools bar). Only the bar's label changed.
- Hosted Pages, real screen readers (VoiceOver, NVDA, TalkBack), real devices and the Windows high-contrast themes were not tested. Automated accessibility checks find only part of the problems. Firefox and WebKit were exercised through Playwright builds, not Firefox ESR, Safari on macOS or iOS.
- The cross-browser crawl and the `full` profile are not in CI.
- The historical Reference route reads a public Sepolia RPC as soon as it opens. A "load live reads" button instead of an automatic read would remove that third-party request; that changes behaviour and was not done.
- The `og:image` URL will 404 until the site is published.
- On a machine whose Playwright build does not match the installed browser, set `PLAYWRIGHT_BROWSERS_PATH` to a directory that links the installed headless shell under the expected name, or set `CHROMIUM_EXECUTABLE_PATH` for `check_visual_quality.mjs`.
