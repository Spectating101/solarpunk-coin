# Field-validation freeze

**Effective from:** tag `v0.2.0-field-ready-alpha` (`c32a484`)  
**Mode:** 80% operator acquisition / pilot execution · 20% maintenance & pilot-driven fixes · **0% speculative features**

## `main` accept list

1. Defects discovered in production or CI  
2. Security or privacy fixes  
3. Changes required to ingest a real external source (Issue #3 / Gates 1B–1D)  
4. Usability changes supported by operator feedback from an actual pilot

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
- **1C** Operator-signed path toward L1  
- **1D** Live gateway path to L2  

Decisive milestone: one external source, one custody receipt, one reproducible result, one operator reaction.
