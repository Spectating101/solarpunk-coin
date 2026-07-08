# Meter / utility export files

## SPK-native CSV (direct import)

Template: [`spk_meter_import_template.csv`](./spk_meter_import_template.csv)

```bash
npm run meter:onboard -- --meter-id=YOUR-METER --site-id=your-site --device-address=0x...
METER_PRIVATE_KEY=0x... npm run hardware:validate -- --csv=data/meter/your_export.csv --operator
```

## Green Button / utility interval CSV

Sample: [`green_button_sample.csv`](./green_button_sample.csv)

```bash
npm run meter:green-button -- --in=data/meter/your_green_button.csv --out=data/meter/normalized.csv
METER_PRIVATE_KEY=0x... npm run hardware:validate -- --csv=data/meter/normalized.csv --operator
```

Supported column aliases include `Interval Start`, `start`, `usage`, `Flow Direction`, etc.

## Do not commit

Real operator exports with customer-identifying data. Add local paths to `.gitignore`.

Guide: [`docs/product/HARDWARE_OPERATOR_QUICKSTART.md`](../../docs/product/HARDWARE_OPERATOR_QUICKSTART.md)
