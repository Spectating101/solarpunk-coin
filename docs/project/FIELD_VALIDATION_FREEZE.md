# Field-validation freeze

**Release baseline:** tag `v0.2.0-field-ready-alpha` (`c32a484`)  
**Enforcement:** begins when this freeze document lands on `main`  
**Mode:** 80% operator acquisition / pilot execution · 20% maintenance & pilot-driven fixes · **0% speculative features**

## `main` accept list

1. Defects discovered in production or CI  
2. Security or privacy fixes  
3. Changes required to ingest or verify a real external source (Issue #3 / Gates 1B–1D)  
4. Usability changes supported by operator feedback from an actual pilot  
5. Minimal documentation or release metadata required to execute and audit the field-validation program

## `main` reject list (until a pilot forces them)

- IndexedDB / local research-project workspace (Gate 2) before Gate 1B  
- Additional calculators or domain generalizations  
- New token / payment / chain functionality  
- AI copilots, accounts, cloud sync  
- MapLibre / GIS stacks  
- DuckDB-Wasm before meaningful local datasets  
- Visual redesign of approved workbench surfaces  

## North star

Issue #3 remains open. Track sub-gates separately:

- **1B** Real-source software validation (BLOCKED OK)  
- **1C** Authenticated operator evidence toward L1  
- **1D** Live gateway path to L2  

Decisive milestone: one external source, one custody receipt, one reproducible result, one operator reaction.

## Exit condition

The freeze may be revised only after Gate 1B produces operator feedback. The next substantial product branch must cite that evidence and identify the specific pilot friction or demand it addresses.
