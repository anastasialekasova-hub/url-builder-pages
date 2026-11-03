# URL Builder pages

Published version of the approved November 3, 2026 design. Public repository: https://github.com/anastasialekasova-hub/url-builder-pages. GitHub Pages serves the main branch from /. Issues are enabled for contact links. The extension's URLs are unchanged. Google Forms are configured with real IDs; live page/API verification is recorded below.

## Pages

- https://anastasialekasova-hub.github.io/url-builder-pages/welcome/
- https://anastasialekasova-hub.github.io/url-builder-pages/uninstall/
- https://anastasialekasova-hub.github.io/url-builder-pages/feedback/
- Policy: https://pinwisp.com/url-builder/privacy/ (separate pinwisp files in the product's privacy folder).

The three directories contain deployable static HTML. Shared CSS, the product icon and the actual release screenshot live in assets. The icon and screenshot are byte-identical to the approved design. Structure follows the designated pages template; approved URL Builder styling and copy take precedence. English copy was reviewed in the context of the activation and feedback flows; approved wording was retained.

## Local checks

Run `npm ci`, then `npm run validate`. A Chrome for Testing executable is required for `CHROME_PATH=/path/to/chrome npm run e2e`. Run browser tests only on the authorized test server, using the canonical remote-test helper and a separate staging directory named url-builder-pages-build. Logs, screenshots and receipts go into tools/e2e/out (ignored by git). The server script serves real directory URLs, checks desktop/mobile layout and images, records a real online Umami probe separately, and uses an explicit offline analytics fixture for isolated UI checks. Local forms tests inject a mock transport; they never send feedback to Google.

There is no compilation step. GitHub Pages publishes this public main branch, including .nojekyll. Product pages use the welcome, uninstall, feedback and assets directories. No privacy page belongs in this repository.

## Feedback forms

Real Google Forms configuration is in assets/forms-config.js. Both forms are public and collect no email. HTML submit buttons stay disabled until JavaScript validates the configuration; no-JS visits retain the explicit unavailable message. The feedback textarea is required. A failed transport retains the user's text and permits retry. An opaque no-cors response only means a request was sent; the page explicitly says it cannot confirm Google stored it.

- Uninstall edit: https://docs.google.com/forms/d/1nr2aJUPsXmezgyD0MlsRym4Ivqmpe3iDxT2Q0ackyVM/edit — reason entry.475296943, comment entry.670259370.
- Feedback edit: https://docs.google.com/forms/d/1NfvzFSepC4yYXdSINcZvlw63-JbAalIYxmaFzBmbcCI/edit — comment entry.1860305172, one question “What should be better?”.

The canonical forms_create.py tool created these forms after a successful dry run. Anonymous viewform HTTP 200 and public entry IDs matched the API. Each setup submission was read back through the Forms API. Published-page submissions were verified separately: each form increased from 1 to 2 API responses, and each exact test marker was read back. The uninstall response also retained the exact selected reason. The recorded settings are emailCollectionType=DO_NOT_COLLECT for both forms.

## Publication handoff

Ana authorized publication on November 3, 2026. The initial published HEAD was cdc66e485e617c328a8c7bb1bd730693303c7d30 (approved source 404fbd003ef3ce99a0af453560008b8cc524e5ea). Live checks returned HTTP 200 for all three HTML pages, shared CSS/JS, both images and Issues; all eight deployed files matched local bytes. Each HTML contains the exact common Umami ID once. Privacy publication completed through pinwisp MR !81: https://gitlab.purrweb.net/serpalnik/pinwisp/-/merge_requests/81. Merge commit: 8aab7e50fcbd67b75396d83179693d2e4fca9cf1; the official script exited 0 and reported the policy live. Final verification checks HTTP 200 and version.txt against that merge commit. The subsequent form stage supplies real configuration and verifies submissions.

The extension itself has no analytics or outbound processing requests. Umami on these three web pages is separate web analytics, using the common website ID 328e350f-b770-4529-9500-92b514123a6c. Voluntary feedback is sent to Google Forms after an explicit user submission. The approved policy explains these boundaries. The policy has no analytics script.

## Build verification, November 3, 2026

Local validate and JavaScript syntax checks passed. Approved text/asset transfer passed. The two separate privacy files passed the actual privacyGaps function from pinwisp HEAD 4d96b8d77a06b22742afe1490fbb51bf0cfe2a00 with permissions activeTab/storage, no host permissions and no extension data disclosures; approved policy body is exact.

Server run: Windows / Node 22.14 / Chrome for Testing 156.0.8078.47, six desktop/mobile screens and both form branches passed, console errors 0, failed requests 0, EXIT 0 and chromes_left 0. Real online Umami script request completed; dashboard/event persistence is not verified. Forms checks used a local mock transport and included required-field validation, success wording, failure/retry and unavailable production config. No Google feedback request was made.

Raw download and visual review are complete. The recovered receipt and eight PNGs are in tools/e2e/out/server-render. All eight recorded source hashes match the local source commit 404fbd003ef3ce99a0af453560008b8cc524e5ea. All six desktop/mobile screens and both mock failure screens were visually reviewed: no clipping, overlap, missing images or unreadable status messages. Failed submissions retain the entered text and allow retry. No source changes or repeated render were required. The temporary SSH download problem is closed; no transport changes were made by this pages build.

The durable QA summary and raw-file hashes are in tools/build-receipt.json. Online Umami script and two API responses were HTTP 200; dashboard persistence remains outside this build check. At BUILD time production form configuration was empty. BUILD was accepted by the orchestrator before the authorized publication. The publication checks above extend that unchanged source verification. The form stage below supersedes that initial empty configuration.


## Live Forms verification, November 3, 2026

Windows / Chrome for Testing 156.0.8078.47 loaded and reloaded both public URLs with cache disabled, verified the actual config SHA256 c003bce93a5f0682a4c8f10ac198fd164d5979c76acb7c17b3d3927eb353407f, filled the fields and clicked Send feedback once per page. Each observed request was POST with the correct entry keys and exact setup marker. API counts rose 1 → 2 for both forms, with one exact matching response per marker. These API readbacks prove storage; the UI's opaque fetch result alone does not. Chrome reported net::ERR_ABORTED on both formResponse requests despite successful API persistence; page/console errors and failed static resources were zero. This network limitation is preserved in the raw receipt rather than hidden.

Both final screenshots were visually reviewed with no clipping, overlaps or missing controls. Chrome/profile cleanup completed and the runner reported EXIT 0, chromes_left=0. Full raw JSON/PNG, before/after canonical --check logs, question/settings/answer API receipt and deployment byte comparisons live in the product research/pages-forms folder. tools/e2e/form-live.mjs preserves the explicit live submission check; do not rerun it casually because it submits real setup feedback.

The post-configuration mock-only regression passed on the same Windows browser: six desktop/mobile renders, both empty-config guards, required-field validation, success wording and failed transport/retry, errors 0 and failed requests 0. EXIT 0, chromes_left=0. No additional real Forms submission was made.
