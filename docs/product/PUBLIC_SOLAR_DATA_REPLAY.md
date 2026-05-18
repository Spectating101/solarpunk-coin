# SolarPunk Public Solar Data Replay

This replays public historical rooftop-solar data through the SPK mint math. It proves the coin logic can ingest real-world solar profiles, but it is not a live meter proof.

## Source

- dataset: `Ausgrid Solar home electricity data`
- official_page: https://www.ausgrid.com.au/Industry/Our-Research/Data-to-share/Solar-home-electricity-data
- data_gov_au: https://data.gov.au/data/dataset/nsw-solar-home-electricty-data
- original_window: `2012-07-01` -> `2012-07-03`
- customer_id: `1`

## Replay Result

| Metric | Value |
|---|---:|
| Accepted days | `3` |
| Generator capacity | `3.78 kW` |
| Solar generation | `29.775 kWh` |
| Export surplus | `18.715 kWh` |
| Self-consumed solar | `11.06 kWh` |
| Average export ratio | `0.633574` |
| Accepted verifier records | `3` |
| Verified lab signatures | `3` |
| Net SPK preview | `0.8991 SPK` |
| Can mint SPK in lab replay | `true` |

## Daily Replay

| Date | Generation kWh | Export surplus kWh | Self-consumed kWh | Export ratio |
|---|---:|---:|---:|---:|
| 2012-07-01 | 8.726 | 6.335 | 2.391 | 0.725991 |
| 2012-07-02 | 9.833 | 5.658 | 4.175 | 0.575409 |
| 2012-07-03 | 11.216 | 6.722 | 4.494 | 0.599322 |

## Boundary

- This is public historical data, not a live operator meter feed.
- The lab signs normalized rows only so the existing SPK verifier can replay the math.
- This cannot upgrade hardware provenance beyond public-lab evidence.
- SPK real-value minting still needs a named operator, live meter or inverter source, custody, and legal/commercial terms.
