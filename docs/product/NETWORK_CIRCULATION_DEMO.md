# Network Circulation Demo

- generated_at: `2026-06-07T09:14:30.763Z`
- thesis: SPK is network settlement money issued against verified energy surplus. Circulation is primary; energy redemption is an optional exit.

## Identity

Issuance anchor = surplus kWh. Public face = replay-protected network payments between participants. Not a dollar peg. Not an electricity-company coupon.

## Flow

| Step | Action | SPK | Note |
|---:|---|---:|---|
| 1 | network_payment | 12 | Producer pays meter gateway for attestation service. |
| 2 | network_payment | 40 | Producer pays maintenance crew in SPK — not a utility bill. |
| 3 | network_payment | 180 | Producer allocates SPK into the local network economy. |
| 4 | network_payment | 55 | Buyer spends SPK on local goods — primary money use. |
| 5 | network_payment | 20 | Merchant settles supply invoice back to producer. |
| 6 | optional_redemption | 15 | Small optional energy exit — secondary sink, not the product identity. |

## Network Metrics

| Metric | Value |
|---|---:|
| total_settled_spk | `307` |
| total_redeemed_spk | `15` |
| circulation_share_percent | `95.34` |
| redemption_share_percent | `4.66` |
| circulation_share_before_optional_exit_percent | `100` |
| network_payment_count | `5` |
| redemption_count | `1` |

