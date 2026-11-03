import { forms } from './forms-config.js';
export function bindFeedback(form, config, send = fetch) {
  const button = form.querySelector('button[type="submit"]');
  const status = form.querySelector('.status');
  const ready = /^[\w-]+$/.test(config?.formId || '') && /^entry\.\d+$/.test(config?.commentEntry || '') && (form.dataset.feedback !== 'uninstall' || /^entry\.\d+$/.test(config?.reasonEntry || ''));
  button.disabled = !ready;
  if (ready) form.querySelector('.form-note').textContent = 'Optional. Your feedback is sent through Google Forms. Do not include private links or sensitive information.';
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    if (!ready) { status.textContent = 'Feedback is not available yet. Nothing was sent.'; return; }
    const body = new URLSearchParams();
    body.set(config.commentEntry, form.elements.comment.value.trim());
    if (config.reasonEntry) body.set(config.reasonEntry, form.elements.reason.value || '');
    button.disabled = true; status.textContent = 'Sending…';
    try {
      await send(`https://docs.google.com/forms/d/e/${config.formId}/formResponse`, {method:'POST', mode:'no-cors', credentials:'omit', body, signal:AbortSignal.timeout(15000)});
      // An opaque no-cors response cannot confirm Google stored a response.
      status.textContent = 'Your feedback was sent. This page cannot confirm that Google Forms saved it.';
    } catch { status.textContent = 'Your feedback could not be sent. Try again, or contact us on GitHub.'; }
    finally { button.disabled = false; }
  });
}
for (const form of document.querySelectorAll('form[data-feedback]')) bindFeedback(form, forms[form.dataset.feedback]);
