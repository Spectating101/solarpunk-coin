# Visual Review Workflow (Cursor + ChatGPT)

GitHub and code review can verify **structure and copy**. They cannot judge **spacing, hierarchy, or first-impression polish**. Use this workflow when you want a real visual critique without blocking shipping.

---

## Quick capture (recommended)

From repo root:

```bash
# One-time: install Playwright browser
npx playwright install chromium

# Screenshots of live GitHub Pages demo (default)
npm run demo:screenshots

# Or local preview after build
cd frontend && npm run build && npm run preview -- --port 4173
# other terminal:
DEMO_URL=http://localhost:4173/ npm run demo:screenshots
```

**Output:**

| Path | Purpose |
|------|---------|
| `screenshots/public-lab/YYYY-MM-DD/` | PNG set + manifest |
| `screenshots/public-lab-screenshots.zip` | Upload this to ChatGPT |

Each run captures **desktop / tablet / mobile** — viewport + full-page PNGs.

---

## What to upload to ChatGPT

1. `screenshots/public-lab-screenshots.zip`
2. Optional: link https://spectating101.github.io/solarpunk-coin/demo/
3. Paste the prompt below

---

## ChatGPT visual critique prompt (copy-paste)

```text
Review these SolarPunk Public Lab v1.0 landing screenshots as a product/design critique.

Context: research demo landing page (not a crypto dApp). Goal: cold visitor understands in 90 seconds:
- Why this matters (fourth foundation: verified renewable surplus)
- What was built (Sepolia testnet lab)
- What proof exists
- What is blocked (launch gates)
- What external validation is needed (one meter export)

Judge:
1. Above-the-fold hook strength
2. Visual hierarchy and scanability
3. CTA clarity (evidence, meter data, console)
4. Pipeline + proof strip readability
5. Mobile layout
6. Does it feel like a serious research demo vs student repo?

Do NOT suggest: token sale, mainnet, wallet-first hero, hiding blocked gates.

Give: top 5 fixes ranked by impact, and a 1–10 score for advisor-ready presentation.
```

---

## Division of labor

| Tool | Best for |
|------|----------|
| **Cursor** | Code, copy structure, deploy, evidence, protocol |
| **ChatGPT + screenshots** | Visual polish, spacing, CTA dominance, mobile feel |
| **You** | Advisor email, meter data outreach, thesis submit |

Do not stall shipping waiting for pixel perfection. Screenshot review is for **presentation polish**, not project validity.

---

## After visual feedback

Bring concrete CSS/copy tweaks back to Cursor:

> "Apply ChatGPT visual fixes: [paste numbered list]. Only `PublicLabLanding.jsx` + `index.css`. No protocol changes."

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `playwright install` needed | `npx playwright install chromium` |
| Stale deployed page | Hard refresh demo or capture local `npm run preview` |
| zip missing | Install `zip` package or upload the dated folder manually |
| `screenshots/` in git | Ignored — regenerate anytime |
