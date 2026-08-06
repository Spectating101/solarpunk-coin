# External Review Record — `<REVIEW-ID>`

## 1. Review identity

| Field | Value |
|---|---|
| Review ID | `<DOMAIN-REVIEW-001 / TECH-REVIEW-001>` |
| Review role | `<domain / technical / research / operational>` |
| Status | `<INVITED / ACCEPTED / ACTIVE / CLOSED / INCOMPLETE>` |
| Reviewer identity | `<name or permitted pseudonym>` |
| Relevant experience | `<bounded description>` |
| Organization | `<if permitted>` |
| Prior relationship | `<none / collaborator / advisor / other>` |
| Compensation or interest | `<none / honorarium / authorship / advisory / commercial>` |
| Attribution permission | `<public / private / anonymous>` |
| Quote permission | `<yes / no / case-by-case>` |

## 2. Frozen review package

| Artifact | Identity |
|---|---|
| Repository commit | `<SHA>` |
| Release / benchmark | `<version>` |
| External case | `<case ID and version>` |
| Evidence identity | `<hash or permitted reference>` |
| Policy | `<ID / version / manifest hash>` |
| Decision | `<decision ID>` |
| Settlement | `<settlement ID or N/A>` |
| Receipt | `<receipt ID>` |
| Capsule | `<capsule ID>` |
| Manuscript / brief | `<version or N/A>` |
| Permission boundary | `<private / public metadata / aggregates / raw>` |
| Review start | `<ISO date>` |
| Review deadline | `<ISO date>` |

## 3. Review scope

### Included

- `<question or artifact>`
- `<question or artifact>`

### Excluded

- `<physical certification, legal validity, market demand, etc.>`

### Review questions

1. `<question>`
2. `<question>`
3. `<question>`

## 4. Findings

| ID | Scope | Severity | Artifact | Finding | Evidence | Consequence | Recommendation | Confidence |
|---|---|---|---|---|---|---|---|---|
| `<DR-001>` | `<domain>` | `<major>` | `<path/object>` | `<statement>` | `<basis>` | `<impact>` | `<action>` | `<high>` |

## 5. Programme disposition

| Finding ID | Disposition | Correction / rationale | Commit or artifact | Owner | Status |
|---|---|---|---|---|---|
| `<DR-001>` | `<ACCEPTED — FIXED>` | `<response>` | `<SHA/path>` | `<person>` | `<closed>` |

Allowed dispositions:

- `ACCEPTED — FIXED`
- `ACCEPTED — PLANNED`
- `ACCEPTED — OUT OF CURRENT SCOPE`
- `PARTIALLY ACCEPTED`
- `REJECTED WITH RATIONALE`
- `DUPLICATE`
- `CANNOT REPRODUCE`
- `REQUIRES EXTERNAL AUTHORITY`

## 6. Claim and artifact changes

- Claims removed or reduced: `<IDs and changes>`
- Non-claims added: `<IDs and changes>`
- Tests added or changed: `<paths>`
- Documentation corrected: `<paths>`
- External authority required: `<description>`
- Remaining blockers: `<description>`

## 7. Reviewer follow-up

| Question | Reviewer response |
|---|---|
| Were material corrections inspectable? | `<yes / no / partial>` |
| Are critical findings unresolved? | `<yes / no>` |
| Are major findings unresolved? | `<yes / no>` |
| Does closure imply endorsement or certification? | `NO` |
| Additional statement | `<optional>` |

## 8. Closure

**Closure state:** `<REVIEWED WITH CORRECTIONS / MATERIAL BLOCKERS REMAIN / CLAIM REMOVED OR REDUCED / REVIEW INCOMPLETE>`

**Closure date:** `<ISO date>`

**Public summary permission:** `<scope>`

**Required boundary statement:**

> This review covered only the frozen artifacts and questions recorded above. It does not establish certification, legal validity, production readiness, institutional adoption, market demand, or source truth beyond the reviewer’s documented scope.