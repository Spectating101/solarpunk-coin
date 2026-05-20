# SolarPunk Data Request Outreach

## Goal

Get one real solar dataset that can pass through `scripts/operator_data_intake.js`.

The ask should stay small: one anonymized CSV export from a solar lab, university, campus, homeowner, or operator. We are not asking for production credentials, private customer data, or participation in a token launch.

## Minimum Data Request

Preferred columns:

```csv
window_start,window_end,generation_kwh,site_load_kwh,export_kwh,curtailed_kwh,quality_score,source
2026-05-01T00:00:00Z,2026-05-01T23:59:59Z,31.2,18.4,12.8,0,0.98,operator_csv_v1
```

Acceptable fallback:

- `timestamp` or `window_start/window_end`
- `generation_kwh`
- `gross_consumption_kwh` or `site_load_kwh`
- `export_kwh` if available
- `capacity_kw`
- source description such as inverter model, lab meter, dashboard export, or utility export

One day is enough for a proof. One week is better. Thirty days is strong.

## First Target List

Verified against public official pages/search results on 2026-05-19.

| Target | Why | Contact / link |
|---|---|---|
| NTU Energy Research Center | Energy research center with solar and energy-system relevance | `ntunstcoena@ntu.edu.tw`; https://homepage.ntu.edu.tw/~ntunstcoena/EnergyResearchCenter/Home.html |
| NTU E3 Center | Solar PV, forecasting, smart energy, energy management, green finance | https://e3center.caece.net/ |
| NKUST Solar & Photovoltaic Engineering Research Center | Direct solar/PV engineering research center | `clshen@nkust.edu.tw`; https://cset.nkust.edu.tw/p/412-1125-5792.php |
| ITRI Green Energy and Environment Research Laboratories | Green energy, smart-grid, solar, energy technology lab | `vivianHsieh@itri.org.tw`; https://www.itri.org.tw/english/ListStyle.aspx?DisplayStyle=05&MmmID=617763640701005334&SiteID=1 |
| ITRI Open Lab | Possible industry/open-lab route for a structured pilot | `sysjane@itri.org.tw`, `emma.liao@itri.org.tw`; https://www.itri.org.tw/english/ListStyle.aspx?DisplayStyle=20&MGID=617762350654473171&MmmID=617755772433266023&SiteID=1 |
| INER / NARI Solar Energy | Government research group with solar technology background | `iner@iner.gov.tw`; https://en.iner.gov.tw/index.php/26-research-development/new-energy/111-solar-energy |
| Taipei Tech energy/electrical labs | University route; ask for referral if not the right office | https://ece.ntut.edu.tw/p/405-1071-22745%2Cc2687.php?Lang=en |

## Email

Subject: Request for anonymized solar PV export data for open-source SPK research

Hello,

I am building SolarPunk, an open-source public-lab prototype for testing whether verified surplus renewable energy can mint a testnet cryptocurrency called SPK.

I am not requesting production system access, private customer data, passwords, or involvement in a token sale. I am only asking whether your lab/center could share one anonymized historical solar PV export file, such as:

- timestamp or window_start/window_end
- generation_kWh
- site_load_kWh or gross_consumption_kWh
- export_kWh if available
- capacity_kW
- source description, such as inverter export, meter export, dashboard export, or utility export

One day or one week is enough. Site names can be anonymized.

The output would be a public research artifact showing how real PV data flows through the SPK testnet mint model, with clear disclaimers that it is not live hardware certification, not a token sale, and not paid launch readiness.

Thank you,

[Name]

## Follow-Up

Subject: Follow-up: anonymized PV data request

Hello,

I wanted to follow up once on the solar PV data request below.

The smallest useful file is just one anonymized day with generation and export/load values. If your center is not the right contact, I would appreciate any referral to a lab, facilities team, or researcher who manages PV monitoring data.

Thank you,

[Name]

## If They Reply Yes

Send them:

- `data/operator/README.md`
- `data/operator/sample_operator_export.csv`
- `data/operator/sample_operator_profile.json`
- `docs/product/OPERATOR_DATA_INTAKE.md`

Then run:

```bash
METER_PRIVATE_KEY=0x... node scripts/operator_data_intake.js \
  --csv=data/operator/operator_export.csv \
  --profile=data/operator/operator_profile.json \
  --now=2026-05-19T00:00:00Z
```

## Interpretation

A real CSV does not make SPK ready for public money use by itself. It does unlock the next product step: a named external case study where real solar data produces a validated SPK cryptocurrency mint preview.
