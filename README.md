# URL Builder pages

Local BUILD of the approved November 3, 2026 design. No remote repository, publication or Google Forms have been created. The extension's URLs are unchanged.

## Pages

- https://anastasialekasova-hub.github.io/url-builder-pages/welcome/
- https://anastasialekasova-hub.github.io/url-builder-pages/uninstall/
- https://anastasialekasova-hub.github.io/url-builder-pages/feedback/
- Policy: https://pinwisp.com/url-builder/privacy/ (separate pinwisp files in the product's privacy folder).

The three directories contain deployable static HTML. Shared CSS, the product icon and the actual release screenshot live in assets. The icon and screenshot are byte-identical to the approved design. Structure follows the designated pages template; approved URL Builder styling and copy take precedence. English copy was reviewed in the context of the activation and feedback flows; approved wording was retained.

## Local checks

Run `npm ci`, then `npm run validate`. A Chrome for Testing executable is required for `CHROME_PATH=/path/to/chrome npm run e2e`. Run browser tests only on the authorized test server, using the canonical remote-test helper and a separate staging directory named url-builder-pages-build. Logs, screenshots and receipts go into tools/e2e/out (ignored by git). The server script serves real directory URLs, checks desktop/mobile layout and images, records a real online Umami probe separately, and uses an explicit offline analytics fixture for isolated UI checks. Local forms tests inject a mock transport; they never send feedback to Google.

There is no compilation step. To publish, deploy the welcome, uninstall, feedback and assets directories with .nojekyll after separate authorization. Do not deploy tools or package files as product pages when using a deployment artifact. No privacy page belongs in this repository.

## Feedback setup pending

Both entries in assets/forms-config.js are deliberately empty. Until setup, both submit buttons are disabled and show an explicit availability message. No feedback is sent or silently saved. No-js visits also display this message; buttons are disabled in the HTML and only enabled after valid configuration loads. The feedback textarea remains required.

In the separately authorized form stage, use the canonical forms_create.py tool and the exact uninstall reasons in uninstall/index.html. Put its actual public form ID and entry keys in assets/forms-config.js, validate, test anonymous access and verify a response count increase through the Forms API before claiming working submissions. The no-cors transport reports that a request was sent; it cannot verify that Google stored it. A transport failure keeps the user's text and enables retry.

## Publication handoff

Requires Ana's separate permission. Create a public url-builder-pages repository, enable GitHub Pages and **enable/verify Issues** for the contact links. Publish the two policy files only using pinwisp's privacy-mr.sh; do not create a GitHub privacy directory. Verify final addresses, headers, each image, Umami script on all three pages, and pinwisp deployment version. Then perform form mode and verify real submissions from the live pages. No publication command is run by this build.

The extension itself has no analytics or outbound processing requests. Umami on these three web pages is separate web analytics, using the common website ID 328e350f-b770-4529-9500-92b514123a6c. Voluntary feedback is sent to Google Forms only after setup. The approved policy explains these boundaries. The policy has no analytics script.

## Build verification, November 3, 2026

Local validate and JavaScript syntax checks passed. Approved text/asset transfer passed. The two separate privacy files passed the actual privacyGaps function from pinwisp HEAD 4d96b8d77a06b22742afe1490fbb51bf0cfe2a00 with permissions activeTab/storage, no host permissions and no extension data disclosures; approved policy body is exact.

Server run: Windows / Node 22.14 / Chrome for Testing 156.0.8078.47, six desktop/mobile screens and both form branches passed, console errors 0, failed requests 0, EXIT 0 and chromes_left 0. Real online Umami script request completed; dashboard/event persistence is not verified. Forms checks used a local mock transport and included required-field validation, success wording, failure/retry and unavailable production config. No Google feedback request was made.

**Remaining verification:** raw screenshot/receipt download and human visual inspection are pending. SSH to Windows began closing after key exchange before user authentication after the successful run. Initial pull and one bounded retry failed; the gateway authenticated successfully. No SSH settings were changed. Do not claim visual QA complete or publish based on this build yet. Existing raw output remains at C:/nastya-tools/cws/code/url-builder-pages-build/tools/e2e/out; use canonical remote-test pull when access recovers, without sync or rerunning unchanged tests. Local command logs and validation receipts are in tools/e2e/out.
