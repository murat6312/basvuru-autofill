import { CV_KEYWORDS } from './core/dictionary';
import { fillRadioGroup, fillSelect, fillTextLike, labelTextFor, setNativeValue } from './core/fill';
import { CONFIDENT_SCORE, matchField } from './core/matcher';
import { containsKeyword, normalize, similarity } from './core/normalize';
import {
  activeProfile, FIELD_LABELS, loadSettings, PROFILE_KEYS, saveSettings,
  type CvFile, type Profile, type ProfileKey, type Settings,
} from './core/types';

type FillRecord = { el: HTMLElement; label: string; source: string; value: string; confident: boolean; undo: () => void };

const HOST = location.hostname;

void run();

async function run(): Promise<void> {
  const settings = await loadSettings();
  const profile = activeProfile(settings);
  if (!Object.values(profile).some((v) => v.trim())) {
    toast({ message: 'Önce eklenti ayarlarından bilgilerinizi girin.', kind: 'warn' });
    return;
  }

  const overrides = new Map(
    settings.overrides.filter((o) => o.host === HOST).map((o) => [o.signature, o.key] as const),
  );
  const done: FillRecord[] = [];
  const flagged: FillRecord[] = [];
  const radioGroups = new Set<string>();

  for (const el of Array.from(document.querySelectorAll<HTMLElement>('input, select, textarea'))) {
    if (el instanceof HTMLInputElement && el.type === 'file') {
      const record = fillCv(el, settings.cv);
      if (record) {
        done.push(record);
        highlight(el, true);
      }
      continue;
    }
    if (!isFillable(el)) continue;

    const label = labelTextFor(el);
    const signals = {
      label,
      aria: el.getAttribute('aria-label') ?? '',
      placeholder: el.getAttribute('placeholder') ?? '',
      name: `${el.getAttribute('name') ?? ''} ${el.getAttribute('id') ?? ''}`,
      autocomplete: el.getAttribute('autocomplete') ?? '',
    };
    const questionText = `${label} ${signals.placeholder} ${signals.aria}`;

    // 1) Kullanicinin bu site icin ogrettigi kural her seyin onunde gelir
    const override = overrides.get(signatureOf(el, label));
    if (override === 'skip') continue;
    if (override) {
      const value = resolveValue(profile, override);
      const record = value ? apply(el, override, value, radioGroups, 'kural') : null;
      if (record) {
        done.push(record);
        highlight(el, true);
        continue;
      }
    }

    // 2) Soru kutulari cevap bankasindan
    if (looksLikeQuestion(el, questionText)) {
      const answer = matchAnswer(settings, questionText);
      if (answer) {
        const undo = snapshot(el);
        if (fillTextLike(el as HTMLInputElement | HTMLTextAreaElement, answer.answer)) {
          const record = { el, label: label || signals.name, source: 'cevap bankası', value: answer.answer, confident: answer.score >= 0.75, undo };
          (record.confident ? done : flagged).push(record);
          highlight(el, record.confident);
          continue;
        }
      }
    }

    // 3) Sozluk eslesmesi
    const match = matchField(signals);
    if (!match) continue;
    const value = resolveValue(profile, match.key);
    if (!value) continue;
    const record = apply(el, match.key, value, radioGroups, FIELD_LABELS[match.key]);
    if (record) {
      record.confident = match.score >= CONFIDENT_SCORE;
      (record.confident ? done : flagged).push(record);
      highlight(el, record.confident);
    }
  }

  report(done, flagged);
}

function apply(el: HTMLElement, key: ProfileKey, value: string, radioGroups: Set<string>, source: string): FillRecord | null {
  const label = labelTextFor(el) || el.getAttribute('name') || '';
  const undo = snapshot(el);
  let ok = false;

  if (el instanceof HTMLSelectElement) {
    ok = fillSelect(el, value, key);
  } else if (el instanceof HTMLInputElement && el.type === 'radio') {
    if (!el.name || radioGroups.has(el.name)) return null;
    radioGroups.add(el.name);
    const group = Array.from(document.querySelectorAll<HTMLInputElement>(`input[type="radio"][name="${CSS.escape(el.name)}"]`));
    ok = fillRadioGroup(group, value, key);
  } else if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    ok = fillTextLike(el, el.type === 'date' ? toIsoDate(value) : value);
  }

  return ok ? { el, label, source, value, confident: true, undo } : null;
}

function fillCv(input: HTMLInputElement, cv: CvFile | null): FillRecord | null {
  if (!cv || input.files?.length) return null;
  const context = normalize(`${labelTextFor(input)} ${input.name} ${input.id} ${input.accept}`);
  const looksLikeCv = CV_KEYWORDS.some((kw) => containsKeyword(context, kw));
  const onlyFileInput = document.querySelectorAll('input[type="file"]').length === 1;
  if (!looksLikeCv && !onlyFileInput) return null;

  try {
    const bytes = Uint8Array.from(atob(cv.base64), (c) => c.charCodeAt(0));
    const transfer = new DataTransfer();
    transfer.items.add(new File([bytes], cv.name, { type: cv.type }));
    input.files = transfer.files;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    return {
      el: input, label: labelTextFor(input) || 'CV', source: 'CV', value: cv.name, confident: true,
      undo: () => {
        input.value = '';
        input.dispatchEvent(new Event('change', { bubbles: true }));
      },
    };
  } catch {
    return null;
  }
}

/** Alanin site icindeki kimligi: ogretilen kurallar bununla eslenir. */
function signatureOf(el: HTMLElement, label: string): string {
  const name = el.getAttribute('name') || el.getAttribute('id');
  if (name) return name;
  return `L:${normalize(label).slice(0, 48)}`;
}

function snapshot(el: HTMLElement): () => void {
  if (el instanceof HTMLSelectElement) {
    const previous = el.value;
    return () => {
      el.value = previous;
      el.dispatchEvent(new Event('change', { bubbles: true }));
    };
  }
  if (el instanceof HTMLInputElement && el.type === 'radio') {
    const group = Array.from(document.querySelectorAll<HTMLInputElement>(`input[type="radio"][name="${CSS.escape(el.name)}"]`));
    const checked = group.find((r) => r.checked);
    return () => {
      group.forEach((r) => (r.checked = false));
      if (checked) checked.checked = true;
      el.dispatchEvent(new Event('change', { bubbles: true }));
    };
  }
  const input = el as HTMLInputElement | HTMLTextAreaElement;
  const previous = input.value;
  return () => setNativeValue(input, previous);
}

function resolveValue(profile: Profile, key: ProfileKey): string {
  const direct = profile[key]?.trim();
  if (direct) return direct;
  if (key === 'fullName') return [profile.firstName, profile.lastName].filter(Boolean).join(' ').trim();
  if (key === 'firstName' && profile.fullName) return profile.fullName.trim().split(/\s+/)[0] ?? '';
  if (key === 'lastName' && profile.fullName) {
    const parts = profile.fullName.trim().split(/\s+/);
    return parts.length > 1 ? parts[parts.length - 1]! : '';
  }
  return '';
}

function toIsoDate(value: string): string {
  const m = value.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/);
  return m ? `${m[3]}-${m[2]!.padStart(2, '0')}-${m[1]!.padStart(2, '0')}` : value;
}

function looksLikeQuestion(el: HTMLElement, text: string): boolean {
  return el instanceof HTMLTextAreaElement || text.includes('?') || text.trim().length > 40;
}

function matchAnswer(settings: Settings, questionText: string): { answer: string; score: number } | null {
  let best: { answer: string; score: number } | null = null;
  for (const item of settings.answers) {
    if (!item.question?.trim() || !item.answer?.trim()) continue;
    const score = similarity(questionText, item.question);
    if (score >= 0.5 && (!best || score > best.score)) best = { answer: item.answer, score };
  }
  return best;
}

function isFillable(el: HTMLElement): boolean {
  if (el instanceof HTMLInputElement) {
    if (['password', 'hidden', 'submit', 'button', 'reset', 'image', 'file', 'checkbox'].includes(el.type)) return false;
    if (el.type !== 'radio' && el.value.trim() !== '') return false;
  } else if (el instanceof HTMLTextAreaElement) {
    if (el.value.trim() !== '') return false;
  } else if (el instanceof HTMLSelectElement) {
    if (el.selectedIndex > 0) return false;
  } else return false;

  const field = el as HTMLInputElement;
  if (field.disabled || field.readOnly) return false;
  if (el.getClientRects().length === 0) return false;
  const style = getComputedStyle(el);
  return style.visibility !== 'hidden' && style.display !== 'none' && Number(style.opacity) !== 0;
}

function highlight(el: Element, confident: boolean): void {
  const node = el as HTMLElement;
  const previous = node.style.outline;
  node.style.outline = `2px solid ${confident ? '#16a34a' : '#f59e0b'}`;
  node.style.outlineOffset = '1px';
  setTimeout(() => (node.style.outline = previous), 10000);
}

function report(done: FillRecord[], flagged: FillRecord[]): void {
  const all = [...done, ...flagged];
  const message = all.length
    ? `${done.length} alan dolduruldu${flagged.length ? `, ${flagged.length} alan kontrol bekliyor` : ''}.`
    : 'Eşleşen alan bulunamadı.';

  toast({
    message: all.length ? `${message} Göndermeden önce kontrol edin.` : `${message} "Eşleştir" ile alanları öğretebilirsiniz.`,
    kind: all.length ? 'ok' : 'warn',
    onUndo: all.length ? () => all.forEach((r) => r.undo()) : undefined,
    onTeach: () => void startTeaching(),
  });

  void chrome.runtime.sendMessage({ type: 'fill-result', filled: done.length, flagged: flagged.length }).catch(() => {});

  if (all.length) {
    console.groupCollapsed(`[Başvuru Autofill] ${all.length} alan`);
    console.table(all.map((r) => ({ etiket: r.label.slice(0, 50), kaynak: r.source, deger: r.value.slice(0, 40), emin: r.confident })));
    console.groupEnd();
  }
}

/* ---------------------------------------------------------------- Öğretme modu */

async function startTeaching(): Promise<void> {
  const banner = panel();
  banner.textContent = 'Öğretmek istediğiniz alana tıklayın. Çıkmak için ESC.';
  document.addEventListener('keydown', onKey, true);
  document.addEventListener('click', onClick, true);

  function onKey(e: KeyboardEvent): void {
    if (e.key === 'Escape') stop();
  }

  function onClick(e: MouseEvent): void {
    const target = (e.target as HTMLElement | null)?.closest('input, select, textarea') as HTMLElement | null;
    if (!target) return;
    e.preventDefault();
    e.stopPropagation();
    void choose(target);
  }

  async function choose(el: HTMLElement): Promise<void> {
    const label = labelTextFor(el) || el.getAttribute('name') || 'seçili alan';
    const picked = await askField(label);
    if (!picked) return;

    const settings = await loadSettings();
    const signature = signatureOf(el, label);
    settings.overrides = settings.overrides.filter((o) => !(o.host === HOST && o.signature === signature));
    settings.overrides.push({ host: HOST, signature, key: picked });
    await saveSettings(settings);

    if (picked !== 'skip') {
      const value = resolveValue(activeProfile(settings), picked);
      if (value) {
        apply(el, picked, value, new Set(), 'kural');
        highlight(el, true);
      }
    }
    banner.textContent = `Kaydedildi: ${picked === 'skip' ? 'bu alan atlanacak' : FIELD_LABELS[picked]}. Başka bir alana tıklayın, ESC ile çıkın.`;
  }

  function stop(): void {
    document.removeEventListener('keydown', onKey, true);
    document.removeEventListener('click', onClick, true);
    banner.parentElement?.remove();
  }
}

/** Alan secimi icin kucuk bir liste acar; secilen ProfileKey'i dondurur. */
function askField(label: string): Promise<ProfileKey | 'skip' | null> {
  return new Promise((resolve) => {
    const box = panel();
    box.innerHTML = '';
    const title = document.createElement('div');
    title.textContent = `"${label.trim().slice(0, 40)}" alanı şu bilgiyle dolsun:`;
    title.style.cssText = 'margin-bottom:8px;font-weight:600';

    const select = document.createElement('select');
    select.style.cssText = 'width:100%;padding:6px;border-radius:6px;font:inherit';
    for (const key of PROFILE_KEYS) select.appendChild(new Option(FIELD_LABELS[key], key));
    select.appendChild(new Option('— Bu alanı hiç doldurma —', 'skip'));

    const actions = document.createElement('div');
    actions.style.cssText = 'display:flex;gap:8px;margin-top:8px';
    const ok = button('Kaydet', () => finish(select.value as ProfileKey | 'skip'));
    const cancel = button('Vazgeç', () => finish(null));
    actions.append(ok, cancel);

    box.append(title, select, actions);
    select.focus();

    function finish(value: ProfileKey | 'skip' | null): void {
      box.parentElement?.remove();
      resolve(value);
    }
  });
}

/* ---------------------------------------------------------------- Arayüz parçaları */

function host(): ShadowRoot {
  const el = document.createElement('div');
  el.style.cssText = 'position:fixed;z-index:2147483647;right:16px;bottom:16px';
  el.dataset.basvuruAutofill = 'ui';
  document.body.appendChild(el);
  // Acik shadow root: sayfanin CSS'inden yalitilir ama test edilebilir kalir.
  return el.attachShadow({ mode: 'open' });
}

function panel(): HTMLElement {
  const shadow = host();
  const box = document.createElement('div');
  box.style.cssText = `font:14px/1.45 system-ui,-apple-system,"Segoe UI",sans-serif;max-width:320px;
    padding:12px 14px;border-radius:10px;background:#111827;color:#fff;box-shadow:0 8px 24px rgba(0,0,0,.3)`;
  shadow.appendChild(box);
  return box;
}

function button(text: string, onClick: () => void): HTMLButtonElement {
  const b = document.createElement('button');
  b.textContent = text;
  b.style.cssText = `font:inherit;padding:5px 10px;border-radius:6px;border:1px solid rgba(255,255,255,.35);
    background:transparent;color:inherit;cursor:pointer`;
  b.addEventListener('click', onClick);
  return b;
}

function toast(opts: { message: string; kind: 'ok' | 'warn'; onUndo?: () => void; onTeach?: () => void }): void {
  const shadow = host();
  const box = document.createElement('div');
  box.style.cssText = `font:14px/1.45 system-ui,-apple-system,"Segoe UI",sans-serif;max-width:340px;
    padding:12px 14px;border-radius:10px;color:#fff;background:${opts.kind === 'ok' ? '#16a34a' : '#b45309'};
    box-shadow:0 8px 24px rgba(0,0,0,.28)`;

  const text = document.createElement('div');
  text.textContent = opts.message;
  box.appendChild(text);

  const actions = document.createElement('div');
  actions.style.cssText = 'display:flex;gap:8px;margin-top:10px';
  if (opts.onUndo) actions.appendChild(button('Geri al', () => {
    opts.onUndo!();
    shadow.host.remove();
  }));
  if (opts.onTeach) actions.appendChild(button('Eşleştir', () => {
    shadow.host.remove();
    opts.onTeach!();
  }));
  if (actions.childElementCount) box.appendChild(actions);

  shadow.appendChild(box);
  setTimeout(() => shadow.host.remove(), 12000);
}
