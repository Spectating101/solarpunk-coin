# NOR-FLEX Reference Case Specification

**Case family:** Norway-inspired flexibility-resource registration and prequalification simulation  
**Status:** specification only; not implemented  
**Proposed case ID:** `NOR-FLEX-001`  
**Authority:** public official process translated into a bounded non-live research simulation

## 1. Research purpose

Test whether Policy Lab can represent why a physically flexible resource does not automatically become a market-participating or settlement-eligible resource.

This case focuses on registration and prequalification. It does not initially reproduce actual mFRR bidding, activation pricing, imbalance settlement, or payment.

## 2. Core institutional chain

```text
physical resource
→ resource identity
→ control / provider relationship
→ registration
→ flexibility-group formation
→ provider eligibility
→ prequalification application
→ Statnett assessment
→ local-grid assessment
→ admitted / limited / rejected for participation
→ only later bidding, activation, delivery and settlement
```

## 3. Proposed objects

### Flexible resource

```text
resource_id
metering_point_id
resource_type
location / grid_area
maximum_upward_capacity_mw
maximum_downward_capacity_mw
response_time
availability_window
owner_id
controller_id
measurement_method
```

### Balance service provider

```text
provider_id
provider_status
licence_status
market_registration_status
control_authorizations[]
```

### Flexibility group

```text
group_id
provider_id
resources[]
aggregate_capacity_mw
local_grid_areas[]
technical_profile
application_version
```

### Assessment context

```text
system_operator_role
local_grid_operator_roles[]
prequalification_policy_id
policy_version
assessment_timestamp
source_rule_versions[]
```

## 4. Admission gates

| Gate | Pass condition | Failure or limitation |
|---|---|---|
| `PROVIDER_ELIGIBLE` | provider has required declared eligibility | `BLOCKED_PROVIDER_INELIGIBLE` |
| `RESOURCE_IDENTIFIED` | resource and metering identity are complete | `BLOCKED_RESOURCE_IDENTITY` |
| `CONTROL_AUTHORIZED` | provider has valid authority to control/resource-group the asset | `BLOCKED_CONTROL_RIGHTS` |
| `MEASUREMENT_CAPABLE` | response can be measured at required resolution | `BLOCKED_MEASUREMENT` |
| `GROUP_VALID` | resources form a valid declared group | `BLOCKED_GROUP_CONFIGURATION` |
| `LOCAL_GRID_REVIEW` | local grid operator permits or conditions participation | `BLOCKED_GRID_CONSTRAINT` or `ADMIT_WITH_LOCAL_LIMIT` |
| `SYSTEM_REVIEW` | system operator accepts technical suitability | `BLOCKED_SYSTEM_REQUIREMENT` or `ADMIT_WITH_LIMIT` |
| `CAPACITY_POSITIVE` | admitted aggregate capacity is positive | `BLOCKED_ZERO_CAPACITY` |

## 5. Quantity logic

The reference quantity is not energy-backed issuance. It is admitted market-participation capacity.

```text
technical_aggregate_capacity
= sum(resource declared capacities)

control_rights_capacity
= capacity with valid provider authorization

measurement_capacity
= capacity whose response can be evaluated

local_grid_capacity
= capacity allowed under local-network assessment

system_approved_capacity
= capacity accepted under system prequalification

admitted_capacity
= minimum(
    technical_aggregate_capacity,
    control_rights_capacity,
    measurement_capacity,
    local_grid_capacity,
    system_approved_capacity
  )
```

The decision must identify the binding limit.

## 6. Example result

```text
GROUP PREQUALIFIED WITH LIMIT
technical capacity: 2.40 MW
control-authorized capacity: 2.40 MW
measurable capacity: 2.10 MW
local-grid permitted capacity: 1.60 MW  ← BINDING
system-approved capacity: 2.00 MW

admitted capacity: 1.60 MW
market delivery: NOT YET TESTED
financial settlement: NOT YET TESTED
```

## 7. Required counterfactuals

- same resources, different provider authority;
- same group, one resource loses control authorization;
- same physical capacity, different measurement capability;
- same group, local-grid limit tightened;
- same group, system requirement tightened;
- group split across local grid areas;
- one resource removed or unavailable;
- resource data corrected after prequalification;
- policy version changed while resource evidence remains fixed.

## 8. Required failure states

- incomplete resource identity;
- duplicate resource in multiple active groups;
- invalid provider status;
- missing control consent;
- insufficient measurement method;
- inconsistent location or grid-area mapping;
- aggregate capacity overstated;
- local-grid rejection;
- system-operator rejection;
- zero admitted capacity;
- expired prequalification;
- material resource change requiring reassessment.

## 9. State boundaries

The simulation must visibly preserve:

```text
REGISTERED
≠ PREQUALIFIED

PREQUALIFIED
≠ BID ACCEPTED

BID ACCEPTED
≠ ACTIVATED

ACTIVATED
≠ DELIVERED

DELIVERED
≠ FULLY SETTLED
```

Only the first two states are in the initial reference-case scope.

## 10. Assessment output

```text
provider eligibility
resource identity status
control-right status
measurement status
flexibility-group identity
technical aggregate capacity
local-grid assessment
system-operator assessment
binding capacity limit
admitted prequalification capacity
prequalification validity window
market-delivery status: NOT TESTED
settlement status: NOT TESTED
source rule versions
explicit non-claims
reference decision receipt
```

## 11. Acceptance gates before implementation

- [ ] flexibility-register process and post-17-August-2026 status rechecked;
- [ ] provider eligibility terminology verified;
- [ ] prequalification rules and technical requirements audited from linked official documents;
- [ ] local grid operator role precisely represented;
- [ ] duplicate-resource and control-right rules verified rather than invented;
- [ ] no actual mFRR pricing or settlement logic claimed;
- [ ] all project-designed capacity ceilings labelled as counterfactuals;
- [ ] case clearly marked as a reference simulation;
- [ ] evidence and policy changes produce new decision identities;
- [ ] no claim of market access, activation, delivery, or payment.

## 12. Research value

`NOR-FLEX-001` broadens Policy Lab beyond certificate issuance while preserving the same institutional method:

```text
resource evidence
→ actor authority
→ admission
→ comparable capacity ceilings
→ binding constraint
→ later performance and settlement
```

It is a strong second reference case, but lower priority than `NOR-GO-001` because the operational rule set is newer and more complex.
