import { FIELD_DEFS } from './dictionary';
import { normalize } from './normalize';
import type { ProfileKey } from './types';

/**
 * React/Angular/Vue kontrollu inputlarda element.value = x sessizce yutulur.
 * Native prototip setter'i ile yazip input/change olaylarini elle tetiklemek gerekir.
 */
export function setNativeValue(el: HTMLInputElement | HTMLTextAreaElement, value: string): void {
  const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
  if (setter) setter.call(el, value);
  else el.value = value;
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.dispatchEvent(new Event('change', { bubbles: true }));
}

export function fillTextLike(el: HTMLInputElement | HTMLTextAreaElement, value: string): boolean {
  el.focus({ preventScroll: true });
  setNativeValue(el, value);
  el.dispatchEvent(new Event('blur', { bubbles: true }));
  return el.value === value;
}

/** <select> icin: profil degerini secenek metinleriyle esler (es anlamlilar dahil). */
export function fillSelect(el: HTMLSelectElement, value: string, key: ProfileKey): boolean {
  const target = normalize(value);
  if (!target) return false;

  const hints = FIELD_DEFS[key].optionHints ?? {};
  const hintList = hints[target] ?? hints[target.replace(/ /g, '')] ?? [];
  const candidates = [target, ...hintList.map(normalize)];

  const options = Array.from(el.options);
  let found =
    options.find((o) => candidates.some((c) => c && normalize(o.textContent ?? '') === c)) ??
    options.find((o) => candidates.some((c) => c && normalize(o.textContent ?? '').includes(c))) ??
    options.find((o) => candidates.some((c) => c && normalize(o.value) === c));

  if (!found) return false;
  el.value = found.value;
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.dispatchEvent(new Event('change', { bubbles: true }));
  return true;
}

/** Radio gruplarinda etiketi profil degerine uyan secenegi isaretler. */
export function fillRadioGroup(radios: HTMLInputElement[], value: string, key: ProfileKey): boolean {
  const target = normalize(value);
  if (!target) return false;
  const hints = FIELD_DEFS[key].optionHints ?? {};
  const candidates = [target, ...(hints[target] ?? []).map(normalize)];

  for (const radio of radios) {
    const text = normalize(labelTextFor(radio));
    if (!text) continue;
    if (candidates.some((c) => c && (text === c || text.includes(c)))) {
      radio.click();
      return radio.checked;
    }
  }
  return false;
}

export function labelTextFor(el: Element): string {
  const input = el as HTMLInputElement;
  const byLabels = (input.labels && input.labels[0]?.textContent) || '';
  if (byLabels.trim()) return byLabels;

  const id = el.getAttribute('id');
  if (id) {
    const esc = (window as unknown as { CSS?: { escape?: (s: string) => string } }).CSS?.escape?.(id) ?? id;
    const forLabel = document.querySelector(`label[for="${esc}"]`);
    if (forLabel?.textContent?.trim()) return forLabel.textContent;
  }

  const wrapping = el.closest('label');
  if (wrapping?.textContent?.trim()) return wrapping.textContent;

  const ariaLabelledBy = el.getAttribute('aria-labelledby');
  if (ariaLabelledBy) {
    const text = ariaLabelledBy
      .split(/\s+/)
      .map((refId) => document.getElementById(refId)?.textContent ?? '')
      .join(' ');
    if (text.trim()) return text;
  }

  // Son care: bir ust kapsayicinin kisa metni (Greenhouse/Lever bu yapiyi kullanir)
  const parent = el.parentElement;
  if (parent) {
    const clone = parent.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('input, select, textarea, button, svg, option').forEach((n) => n.remove());
    const text = (clone.textContent ?? '').trim();
    if (text && text.length < 160) return text;
  }
  return '';
}
