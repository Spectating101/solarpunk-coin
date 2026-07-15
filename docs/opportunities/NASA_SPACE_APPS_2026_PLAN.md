# NASA Space Apps 2026 Execution Plan

**Opportunity:** NASA International Space Apps Challenge 2026  
**Official status checked:** 2026-07-15  
**Hackathon dates:** November 14–15, 2026  
**Cost:** free  
**Participation:** open across ages, skill levels, and professional backgrounds  
**Format:** Local Events, virtual Local Events, or Universal Event  
**Decision:** monitor and prepare a team; activate only after the official 2026 challenge set reveals a strong fit

## 1. Critical event rule

NASA Space Apps states that each team must select an official challenge. Challenge summaries and full challenge statements are released closer to the event, and teams are not allowed to begin work on the challenge before the hackathon.

Therefore:

> **Do not build a NASA-specific project before the event.**

This document defines team readiness, challenge-selection criteria, and a 48-hour execution process. It does not define a prebuilt challenge solution.

## 2. Why the project background fits conditionally

NASA Space Apps centers NASA and Space Agency Partner open data and challenge topics can include software development, Earth/space science, agriculture, and other real-world problems.

Christopher's relevant capabilities:

```text
NASA POWER resource-data experience
NREL/PVWatts modeled solar context
spatiotemporal data handling
source / model / evidence separation
case comparison
stress/scenario replay
React analytical interfaces
Python / ETL
research narrative
```

The fit becomes strong only if an official 2026 challenge needs:

```text
Earth observation / environmental data
energy/resource uncertainty
agriculture/resource decision support
spatiotemporal data quality
multi-source evidence comparison
scenario transparency
open-data accessibility
```

The fit is weak if the challenge is primarily:

```text
spacecraft mechanical design
astrophysical numerical simulation beyond current expertise
robotics hardware requiring unavailable equipment
mission operations requiring specialist domain depth
```

## 3. Award targeting

NASA's published award categories include:

```text
Best Use of Science
Best Use of Data
Best Use of Technology
Galactic Impact
Best Mission Concept
Most Inspirational
Best Use of Storytelling
Global Connection
Art & Technology
Local Impact
```

For Christopher's current skill set, prioritize:

1. **Best Use of Data** — make NASA/partner data accessible or use it in a distinctive application.
2. **Best Use of Science** — use the scientific method and clear evidence boundaries.
3. **Local Impact** — connect a global/open dataset to a concrete Taiwan/local problem if the challenge permits.
4. **Best Use of Technology** — only if the technical mechanism is genuinely innovative.

Do not target all awards in the narrative.

## 4. Team plan

NASA permits solo participation but recommends teams and caps teams at six members.

Recommended team: 3–4.

### Christopher — system/research lead

```text
data pipeline
case / decision method
scientific boundary
full-stack integration
submission narrative
```

### Earth/space data teammate

```text
NASA dataset familiarity
geospatial / remote-sensing semantics
scientific validation
```

### Visualization/story teammate

```text
React / map / data visualization
public comprehension
video and narrative
```

### Optional domain teammate

Depends entirely on the selected challenge:

```text
agriculture
climate
solar / energy
urban resilience
space science
```

Do not recruit the final domain role until challenge summaries are released.

## 5. Safe pre-event preparation

Allowed/general preparation:

```text
register when 2026 registration opens
choose Local or Universal Event
form preliminary team
review participant guides and Virtual Bootcamp
practice NASA data discovery
practice STAC / GeoJSON / raster / time-series handling generically
prepare a clean Python + React project template with no challenge-specific logic
practice 2-minute data story demos on unrelated sample data
prepare Git workflow
prepare video capture
```

Do not:

```text
build against a 2026 challenge before the hackathon
create challenge-specific model logic
write final challenge narrative
publish a solution repo early
```

## 6. Challenge selection scorecard

When challenge summaries appear, score every plausible challenge 0–5 on:

```text
data-access confidence
scientific-domain confidence
fit with evidence/decision method
48-hour implementation feasibility
visual demo quality
team skill coverage
local-impact angle
novelty without overclaim
```

Weight:

```text
data-access confidence           20%
48-hour feasibility              20%
scientific-domain confidence     15%
evidence/decision-method fit     15%
visual demo quality              10%
team coverage                    10%
local impact                      5%
novelty / differentiation         5%
```

Select one challenge only.

## 7. Challenge-specific method template

After official hacking begins, ask:

```text
What is the exact scientific or public question?
What NASA/partner data answers part of it?
What is observed versus modeled?
What preprocessing assumptions exist?
What decision, comparison, or interpretation does the user need?
What uncertainty or failure mode must stay visible?
```

Possible method pattern, only where challenge semantics fit:

```text
NASA / PARTNER OPEN DATA
        ↓
SOURCE + TIME + SPACE SEMANTICS
        ↓
QUALITY / COVERAGE DIAGNOSTICS
        ↓
MODELED OR OBSERVED CONTEXT
        ↓
DECLARED ANALYSIS RULE
        ↓
COMPARISON / LIMIT / ALERT / SCENARIO
        ↓
EXPLANATION RECEIPT
```

Do not force financial claim language into NASA challenges.

## 8. 48-hour execution plan

### Hour 0–2 — challenge lock

```text
read full challenge statement
read all required resources
write one-sentence problem
select target user
select 1 primary award category
```

### Hour 2–5 — data proof

Before UI:

```text
download/fetch required data
parse a real sample
verify spatial/time semantics
produce one correct derived output
```

Kill the project if the critical dataset cannot be accessed or interpreted.

### Hour 5–10 — scientific minimum

```text
normalization
quality checks
method implementation
one baseline
one known limitation
```

Write assumptions as code/data metadata, not only in final slides.

### Hour 10–18 — end-to-end prototype

```text
user selects case/location/time
        ↓
data loads
        ↓
method runs
        ↓
result shown
        ↓
source/assumption explanation visible
```

### Hour 18–24 — comparison or scenario

Add exactly one meaningful analytical action:

```text
compare locations
compare dates
change threshold
replay scenario
inspect source coverage
```

### Hour 24 — kill/simplify gate

Ask:

```text
Does the project answer the challenge?
Does it actually use NASA/partner data?
Can the scientific method be defended?
Can a judge understand the result in 2 minutes?
```

### Hour 24–32 — visual/story pass

Build for the selected award category.

For Best Use of Data:

```text
data identity
why this dataset
what was difficult
what new accessibility/combination is provided
```

For Best Use of Science:

```text
question
method
assumptions
result
limitations
```

### Hour 32–38 — validation

```text
reproduce fresh run
check missing data
check unit/timezone/coordinate semantics
check mobile/demo machine
```

### Hour 38–43 — submission package

```text
project page
README
source/data register
architecture
2-minute video
demo screenshots
team roles
```

### Hour 43–48 — freeze and submit

No new features.

## 9. Data/source register

For every challenge source:

```text
source_id
provider
NASA / partner agency
dataset name
endpoint / asset identity
time coverage
spatial coverage
observed / modeled / derived
units
missingness
license / event-use notes
transformation
```

This is one area where the current workbench habits provide real advantage without reusing a challenge solution.

## 10. Five-minute judge narrative

Generic structure:

### 0:00–0:30

Challenge and target user.

### 0:30–1:15

Why the selected NASA/partner data matters.

### 1:15–2:30

Live analytical path.

### 2:30–3:30

Comparison/scenario and result.

### 3:30–4:15

Scientific assumption or limitation kept visible.

### 4:15–5:00

Impact and next validation.

Do not begin with Christopher's thesis history.

## 11. Go/no-go gate

Activate the NASA sprint only if:

```text
[ ] registered for 2026 event
[ ] official challenge statements released
[ ] one challenge scores >= 3.7 / 5 on the scorecard
[ ] critical data is accessible during the event
[ ] team has scientific/data coverage
[ ] event dates do not conflict with graduation-critical obligations
```

If no challenge clears the score threshold, skip the event rather than forcing SolarPunk into NASA branding.

## 12. Official sources checked

- NASA Space Apps official 2026 homepage.
- NASA Space Apps Participant FAQ, updated December 22, 2025.
- NASA Space Apps Awards page.

Source pages:

- https://www.spaceappschallenge.org/
- https://www.spaceappschallenge.org/resources/-faq/
- https://www.spaceappschallenge.org/2025/awards/

The 2026 challenge set and participant guides must be rechecked when released.
