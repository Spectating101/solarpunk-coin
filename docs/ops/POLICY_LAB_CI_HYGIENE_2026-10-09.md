# Policy Lab CI hygiene assessment

Baseline: main 6a9e240, 2026-10-09. Frontend redesign is deferred. Current workbench CI already runs visual quality, accessibility, the ci visual-state profile and load performance under Node 22. Its SDK pack guard checks the SDK package identity and content. Keep those gates unchanged.

## Bounded additions and separate ownership

The engineering extraction candidate adds the production-only frontend dependency audit missing from current workbench CI. The Gauntlet candidate adds read-only validation without a trusted attestation/deployment path. The MCP candidate tests native verification, discovery and negative-result parity using a pinned separate runner. Historical-reference backend changes remain a separate candidate and use the existing Python test workflows.

## Optional cross-browser job

Defer adding a Firefox/WebKit job until the Chromium baseline can run locally and the existing visual guards are green. The ci profile already accepts --browser and the dated visual record describes past Firefox/WebKit runs. A future optional workflow_dispatch matrix can use pinned Playwright/browser builds and upload reports; it should not relax existing gates, change CSS or introduce deployment permissions. Historical passing runs are not current validation of such a new job.

## Other observations

Root postinstall applies hash-checked backports and must not be bypassed. Keep npm ci and the Node 22 engine range. Existing path filters should be widened only for actual new executable dependencies, not copied wholesale from deferred Browser branches. Existing deployment and live-smoke workflows are not invoked by this work. Archived scheduled writers and old package publishers stay archived.

The Tests & Coverage workflow contains an existing Codecov upload action. This consolidation does not add, invoke or expand that integration, change credentials or alter unrelated project checks. Updating action majors or coverage policy needs its own compatibility review.

## Local blocker record

The sandbox denies preview listen on 127.0.0.1:4173 and Chromium socket setup with EPERM. Node spawnSync also reports EPERM and async captured output is lost. These are observed infrastructure failures, not grounds to reduce the guards or claim they passed. No new candidate may be pushed until the complete user-required local guard set is green in a compatible local execution environment.
