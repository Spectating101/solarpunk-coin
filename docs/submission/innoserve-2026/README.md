# Policy Lab — InnoServe 2026 Submission Plan

**Official rules verified:** 2026-08-25  
**Registration:** 2026-08-03 09:00 → 2026-10-05 16:00 (Taiwan time)  
**Preliminary review:** 2026-10-13 → 2026-10-23  
**IC Taiwan semifinal:** 2026-10-23  
**Final:** 2026-11-07, National Taiwan University Sports Center

Official rules: https://innoserve.tca.org.tw/Rules/Detail?category=College  
Official downloads: https://innoserve.tca.org.tw/Download

## Packaging authority

For the current submission state, read these first:

1. [`PACKAGING_FREEZE.md`](./PACKAGING_FREEZE.md) — frozen route, candidate revision, Word/video packaging state, remaining human actions, and change control.
2. [`SUBMISSION_MANIFEST.json`](./SUBMISSION_MANIFEST.json) — machine-readable package state and candidate hashes.
3. [`ADVISOR_BRIEF.md`](./ADVISOR_BRIEF.md) — bounded one-page faculty-advisor handoff.
4. [`IP_SYSTEM_OVERVIEW_DRAFT.md`](./IP_SYSTEM_OVERVIEW_DRAFT.md) — Chinese content master.
5. [`IC_SYSTEM_OVERVIEW_DRAFT.md`](./IC_SYSTEM_OVERVIEW_DRAFT.md) — English content master.
6. [`VIDEO_SCRIPT_EN.md`](./VIDEO_SCRIPT_EN.md) — three-minute English narration master.

The Word candidates are generated artifacts rather than repository semantic authority. Rebuild them from the content masters if technical facts change.

## Route decision

### 1. Information Application (IP) — PRIMARY / FIRE

This is the strongest truthful fit for current Policy Lab.

Official scope includes ICT innovation, blockchain, finance, energy, public services, cloud and information-security applications. It does **not** require a native AI component.

Preliminary rubric:

| Criterion | Weight |
|---|---:|
| Innovation | 50% |
| Extensibility | 50% |

Final rubric:

| Criterion | Weight |
|---|---:|
| Innovation | 30% |
| Practicality | 15% |
| Stability | 15% |
| Extensibility | 15% |
| System-document completeness | 15% |
| Explanation / demonstration | 10% |

### 2. International Exchange — English (IC) — SECONDARY / FIRE

A team may enter up to two competition categories, so IP + IC is permitted under the current rules.

IC has broad ICT scope and no AI requirement. Application materials and live presentation are in English.

| Criterion | Weight |
|---|---:|
| Practicality | 45% |
| Innovation | 30% |
| English explanation / presentation | 15% |
| System/document completeness | 10% |

The current weakness is the 45% practicality criterion: Policy Lab has an outside-data checkpoint and complete workflow, but no owner/operator pilot or independent adoption evidence. The submission must answer practicality through clear workflows, feasible deployment and extensibility — not fabricated users.

### 3. Industry AI Innovation (ADIAI) — DO NOT PURSUE CURRENT

The official 2026 ADIAI description asks teams to build AI application solutions and describe their AI techniques. Policy Lab's current contribution is deterministic constraint/verification machinery, not a native AI application.

Do not bolt on an LLM merely to enter this track.

## Project titles

**Chinese:**

> Policy Lab：實證支持型金融主張的可稽核決策與約束系統

**English:**

> Policy Lab: Auditable Decisions for Evidence-Backed Financial Claims

Keep these identical across the registration form, system-overview documents, video, and presentation.

## Official submission assets

Current rules require:

- system overview in Word format;
- maximum five A4 pages;
- maximum file size 4 MB;
- student ID copy or official enrollment proof if the student ID does not visibly establish enrollment;
- competition consent / personal-data / portrait-release form;
- three-minute project-introduction video uploaded to YouTube with the URL entered into registration;
- horizontal 16:9 team photo, at least 1280 × 720;
- one or two faculty advisors;
- up to eight student team members.

For IP, the overview follows the Chinese Attachment 1-1 structure.  
For IC, the overview follows English Attachment 1-2 and the project video must use **spoken English by a team member**, not AI/software-generated narration.

Both overview candidates have now been formatted and rendered at **4 A4 pages**, leaving one page of safety margin under the official cap.

## Required overview sections

Both official templates use the same eight-section structure:

1. Preface / 前言
2. Innovation Description / 創意描述
3. System Functions / 系統功能簡介
4. System Features / 系統特色
5. System Development Tools and Techniques / 系統開發工具與技術
6. System Users / 系統使用對象
7. System Environment / 系統使用環境
8. Conclusion / 結語

## Submission asset state

| Asset | State |
|---|---|
| machine-bound facts | PASS |
| IP route fit | VERIFIED |
| IC route fit | VERIFIED |
| ADIAI refusal | VERIFIED |
| Chinese IP content master | READY |
| English IC content master | READY |
| official-format IP Word candidate | READY / 4 PAGES |
| official-format IC Word candidate | READY / 4 PAGES |
| 3-minute English narration | READY |
| recording storyboard | READY |
| advisor handoff brief | READY |
| judge screenshots | CI-GENERATED |
| live demo | PASS |
| faculty advisor | HUMAN ACTION REQUIRED |
| final team identity | HUMAN ACTION REQUIRED |
| consent form | HUMAN ACTION REQUIRED |
| student ID / enrollment proof | HUMAN ACTION REQUIRED |
| team photo | HUMAN ACTION REQUIRED |
| final video recording/upload | HUMAN ACTION REQUIRED |
| online registration | HUMAN ACTION REQUIRED |

## Remaining execution order

1. Send the advisor brief and lock one or two faculty advisors.
2. Lock the final student team list.
3. Decide whether to use the already-prepared IC second entry; current recommendation is **yes** unless the extra administration becomes material.
4. Record the three-minute English video from the frozen storyboard and live demo.
5. Prepare consent, enrollment proof and 16:9 team photo.
6. Make only requested administrative/title wording edits to the Word candidates; do not change machine-bound technical facts casually.
7. Upload the video as Unlisted and test it from a logged-out browser.
8. Complete both registration entries by the internal 2026-09-30 target rather than using the official deadline as the working date.

## Submission boundary

InnoServe entry does not upgrade Policy Lab evidence.

Do not describe:

- the Ausgrid checkpoint as an operator pilot;
- L0 public evidence as authenticated source truth;
- the receipt as physical delivery proof;
- the system as a stablecoin or legal money;
- current architecture directions as existing customers;
- generated screenshots, competition entry, or advisor support as external validation.
