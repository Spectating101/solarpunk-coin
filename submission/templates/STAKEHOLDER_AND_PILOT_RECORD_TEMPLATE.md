# Stakeholder and Pilot Evidence Record — `<RECORD-ID>`

Use one record per participant or pilot. Do not create public records containing private contact information or confidential organizational details.

## A. Stakeholder interview

### Identity and permission

| Field | Value |
|---|---|
| Interview ID | `<INT-001>` |
| Date | `<ISO date>` |
| Interviewer | `<name>` |
| Participant identity | `<private reference or permitted name>` |
| Organization type | `<university / ESCO / operator / consultant / platform / other>` |
| Roles | `<source partner / operator / user / influencer / buyer / budget owner / gatekeeper / channel / reviewer>` |
| Hypothesis tested | `<H1 / H2 / H3 / H4>` |
| Notes confidentiality | `<private / anonymized / attributable>` |
| Quote permission | `<none / anonymized / attributable>` |
| Follow-up permission | `<yes / no>` |

### Current workflow

- Decision or claim made: `<description>`
- Frequency: `<one-time / periodic / continuous / event-driven>`
- Source systems and files: `<description>`
- People and authorities involved: `<description>`
- Current tools, consultants, or procedures: `<description>`
- Final decision artifact: `<description>`

### Problem evidence

- Common missing or inconsistent evidence: `<description>`
- Point of discovery: `<early / late / audit / submission / other>`
- Consequence: `<time / delay / rework / financial / legal / reputational / none>`
- Quantified impact where available: `<value and basis>`
- Existing alternative: `<description>`
- Why the alternative is or is not sufficient: `<description>`

### Authority and budget

- Problem owner: `<role>`
- Data-access authority: `<role>`
- Pilot approver: `<role>`
- Buyer: `<role or unknown>`
- Budget owner: `<role or unknown>`
- Budget line or range: `<if disclosed>`
- Procurement/privacy/security/legal gates: `<description>`

### Commitments

| Commitment | State | Evidence / next action |
|---|---|---|
| Bounded source sample | `<yes / no / conditional>` | `<detail>` |
| Factual review | `<yes / no / conditional>` | `<detail>` |
| Operator introduction | `<yes / no>` | `<detail>` |
| Buyer introduction | `<yes / no>` | `<detail>` |
| Written interest | `<yes / no / conditional>` | `<detail>` |
| Pilot review | `<yes / no / conditional>` | `<detail>` |
| Budget discussion | `<yes / no / conditional>` | `<detail>` |
| Payment or funded resource | `<yes / no / conditional>` | `<detail>` |

### Evidence classification

Select the strongest justified class:

- [ ] `INTEREST`
- [ ] `PROBLEM CONFIRMATION`
- [ ] `RESOURCE COMMITMENT`
- [ ] `FORMAL INTEREST`
- [ ] `BUDGET CONFIRMATION`
- [ ] `PAID PILOT`
- [ ] `REPEAT USE`
- [ ] `RECURRING CONTRACT`

Justification: `<why this class and not a stronger class>`

### Outcome

- Confirmed problem: `<yes / no / uncertain>`
- Reusable workflow signal: `<yes / no / uncertain>`
- Hypothesis strengthened, weakened, or unchanged: `<state and reason>`
- Next action and owner: `<action>`
- Follow-up date: `<ISO date or none>`

---

## B. Pilot record

### Pilot identity

| Field | Value |
|---|---|
| Pilot ID | `<PILOT-001>` |
| Version | `<version>` |
| Organization | `<private or permitted identity>` |
| Buyer role | `<role>` |
| Budget owner | `<role>` |
| Hypothesis | `<H1 / H2 / H3 / H4>` |
| Status | `<PROPOSED / NEGOTIATING / ACCEPTED / ACTIVE / COMPLETE / REJECTED / CANCELLED>` |
| Start / end | `<dates>` |

### Problem and scope

- Problem statement: `<bounded statement>`
- Source and permission contract: `<reference>`
- Inputs: `<files, systems, windows, policies>`
- Deliverables: `<exact list>`
- Explicit exclusions: `<certification, legal conclusion, production SLA, etc.>`
- Valid blocked/failure outcome: `<definition>`

### Success criteria

- [ ] Authorized source set processed.
- [ ] Semantics and unresolved fields recorded.
- [ ] Declared policy produces a reproducible result.
- [ ] Operator can explain the blocker or binding limit.
- [ ] Result changes or clarifies a decision.
- [ ] Authorized package can be verified or reproduced.
- [ ] Additional criterion: `<description>`

### Commercial and resource terms

| Term | Value |
|---|---|
| Standard price | `<amount or N/A>` |
| Pilot price | `<amount or N/A>` |
| Discount | `<amount and reason>` |
| Non-cash contribution | `<data / staff / hosting / review / introduction>` |
| Publication rights | `<scope>` |
| Testimonial/name rights | `<scope>` |
| Payment evidence | `<invoice / contract / receipt / none>` |
| IP treatment | `<reference>` |
| Data retention/deletion | `<reference>` |
| Support/liability boundary | `<reference>` |

### Delivery evidence

- Founder hours: `<value>`
- Customer hours: `<value>`
- Adapter hours: `<value>`
- Policy/configuration hours: `<value>`
- Clarification cycles: `<count>`
- Defects discovered: `<IDs>`
- Manual interventions: `<description>`
- Clean reproduction time: `<value>`
- Result identity: `<decision/receipt/capsule IDs>`

### Customer outcome

- Decision or action changed: `<description or none>`
- Value stated by customer: `<quote or summary with permission>`
- Repeat-use request: `<yes / no / conditional>`
- Renewal or next project: `<description>`
- Referral/introduction: `<description>`
- Rejection or dissatisfaction: `<description>`

### Pilot verdict

- Problem validated for this organization: `<yes / no / partial>`
- Willingness to pay demonstrated: `<yes / no / partial>`
- Workflow reusable: `<yes / no / partial>`
- Recurring-software signal: `<yes / no / partial>`
- Required product corrections: `<IDs>`
- Continue / change / stop hypothesis: `<decision and rationale>`

**Boundary:** One pilot supports only its documented organization, role, scope, and result. It does not establish product-market fit, scalable demand, market size, certification, or neutral-standard status.