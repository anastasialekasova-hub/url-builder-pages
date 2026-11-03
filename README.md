# URL Builder pages

Published version of the approved November 3, 2026 design. Public repository: https://github.com/anastasialekasova-hub/url-builder-pages. GitHub Pages serves the main branch from /. Issues are enabled for contact links. The extension's URLs are unchanged. Google Forms setup follows in the separate form block.

## Pages

- https://anastasialekasova-hub.github.io/url-builder-pages/welcome/
- https://anastasialekasova-hub.github.io/url-builder-pages/uninstall/
- https://anastasialekasova-hub.github.io/url-builder-pages/feedback/
- Policy: https://pinwisp.com/url-builder/privacy/ (separate pinwisp files in the product's privacy folder).

The three directories contain deployable static HTML. Shared CSS, the product icon and the actual release screenshot live in assets. The icon and screenshot are byte-identical to the approved design. Structure follows the designated pages template; approved URL Builder styling and copy take precedence. English copy was reviewed in the context of the activation and feedback flows; approved wording was retained.

## Local checks

Run `npm ci`, then `npm run validate`. A Chrome for Testing executable is required for `CHROME_PATH=/path/to/chrome npm run e2e`. Run browser tests only on the authorized test server, using the canonical remote-test helper and a separate staging directory named url-builder-pages-build. Logs, screenshots and receipts go into tools/e2e/out (ignored by git). The server script serves real directory URLs, checks desktop/mobile layout and images, records a real online Umami probe separately, and uses an explicit offline analytics fixture for isolated UI checks. Local forms tests inject a mock transport; they never send feedback to Google.

There is no compilation step. GitHub Pages publishes this public main branch, including .nojekyll. Product pages use the welcome, uninstall, feedback and assets directories. No privacy page belongs in this repository.

## Feedback setup pending

Both entries in assets/forms-config.js are deliberately empty. Until setup, both submit buttons are disabled and show an explicit availability message. No feedback is sent or silently saved. No-js visits also display this message; buttons are disabled in the HTML and only enabled after valid configuration loads. The feedback textarea remains required.

In the separately authorized form stage, use the canonical forms_create.py tool and the exact uninstall reasons in uninstall/index.html. Put its actual public form ID and entry keys in assets/forms-config.js, validate, test anonymous access and verify a response count increase through the Forms API before claiming working submissions. The no-cors transport reports that a request was sent; it cannot verify that Google stored it. A transport failure keeps the user's text and enables retry.

## Publication handoff

Ana authorized publication on November 3, 2026. The initial published HEAD was cdc66e485e617c328a8c7bb1bd730693303c7d30 (approved source 404fbd003ef3ce99a0af453560008b8cc524e5ea). Live checks returned HTTP 200 for all three HTML pages, shared CSS/JS, both images and Issues; all eight deployed files matched local bytes. Each HTML contains the exact common Umami ID once. Privacy publication completed through pinwisp MR !81: https://gitlab.purrweb.net/serpalnik/pinwisp/-/merge_requests/81. Merge commit: 8aab7e50fcbd67b75396d83179693d2e4fca9cf1; the official script exited 0 and reported the policy live. Final verification checks HTTP 200 and version.txt against that merge commit. Forms are pending and both submit buttons remain explicitly unavailable until real form configuration and API verification.

The extension itself has no analytics or outbound processing requests. Umami on these three web pages is separate web analytics, using the common website ID 328e350f-b770-4529-9500-92b514123a6c. Voluntary feedback is sent to Google Forms only after setup. The approved policy explains these boundaries. The policy has no analytics script.

## Build verification, November 3, 2026

Local validate and JavaScript syntax checks passed. Approved text/asset transfer passed. The two separate privacy files passed the actual privacyGaps function from pinwisp HEAD 4d96b8d77a06b22742afe1490fbb51bf0cfe2a00 with permissions activeTab/storage, no host permissions and no extension data disclosures; approved policy body is exact.

Server run: Windows / Node 22.14 / Chrome for Testing 156.0.8078.47, six desktop/mobile screens and both form branches passed, console errors 0, failed requests 0, EXIT 0 and chromes_left 0. Real online Umami script request completed; dashboard/event persistence is not verified. Forms checks used a local mock transport and included required-field validation, success wording, failure/retry and unavailable production config. No Google feedback request was made.

Raw download and visual review are complete. The recovered receipt and eight PNGs are in tools/e2e/out/server-render. All eight recorded source hashes match the local source commit 404fbd003ef3ce99a0af453560008b8cc524e5ea. All six desktop/mobile screens and both mock failure screens were visually reviewed: no clipping, overlap, missing images or unreadable status messages. Failed submissions retain the entered text and allow retry. No source changes or repeated render were required. The temporary SSH download problem is closed; no transport changes were made by this pages build.

The durable QA summary and raw-file hashes are in tools/build-receipt.json. Online Umami script and two API responses were HTTP 200; dashboard persistence remains outside this build check. Production form configuration remains deliberately empty. BUILD was accepted by the orchestrator before the authorized publication. The publication checks above extend that unchanged source verification. Real Forms are pending the next block.
