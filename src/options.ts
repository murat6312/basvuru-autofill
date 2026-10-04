import {
  defaultSettings, FIELD_LABELS, loadSettings, newProfile, saveSettings,
  type Answer, type Profile, type ProfileKey, type Settings,
} from './core/types';

const $ = <T extends HTMLElement>(sel: string): T => document.querySelector<T>(sel)!;
const MAX_CV_BYTES = 5 * 1024 * 1024;

let settings: Settings;

void init();

async function init(): Promise<void> {
  settings = await loadSettings();
  showConsentIfNeeded();
  renderProfiles();
  renderAnswers();
  renderRules();
  renderCv();

  $('#save').addEventListener('click', () => void persist('Kaydedildi.'));
  $('#addAnswer').addEventListener('click', () => addAnswerRow({ question: '', answer: '' }));
  $('#export').addEventListener('click', () => exportJson());
  $('#import').addEventListener('click', () => importJson());
  $('#wipe').addEventListener('click', () => void wipe());
  $('#grant').addEventListener('click', () => void requestAllUrls());
  $('#addProfile').addEventListener('click', () => void addProfile());
  $('#renameProfile').addEventListener('click', () => void renameProfile());
  $('#deleteProfile').addEventListener('click', () => void deleteProfile());
  $<HTMLSelectElement>('#profileSelect').addEventListener('change', () => void switchProfile());
  $<HTMLInputElement>('#cvInput').addEventListener('change', (e) => void onCvSelected(e));
  $('#cvRemove').addEventListener('click', () => void removeCv());

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      void persist('Kaydedildi.');
    }
  });
  void refreshPermissionState();
}

/* --------------------------------------------------------------------- rıza */

/**
 * Chrome Web Store, hassas veri isleyen eklentilerde gizlilik politikasinin yani sira
 * URUN ICINDE belirgin aciklama + acik riza istiyor. Bu ekran onay verilene kadar acik kalir.
 */
function showConsentIfNeeded(): void {
  if (settings.consentAt) return;
  const box = $('#consent');
  box.classList.add('show');
  $('#consentAccept').addEventListener('click', async () => {
    settings.consentAt = Date.now();
    await saveSettings(settings);
    box.classList.remove('show');
  }, { once: true });
}

/* ------------------------------------------------------------------ profiller */

function renderProfiles(): void {
  const select = $<HTMLSelectElement>('#profileSelect');
  select.innerHTML = '';
  for (const p of settings.profiles) select.appendChild(new Option(p.name, p.id));
  select.value = settings.activeProfileId;
  ($('#deleteProfile') as HTMLButtonElement).disabled = settings.profiles.length < 2;
  fillForm(currentProfile());
}

function currentProfile(): Profile {
  return (settings.profiles.find((p) => p.id === settings.activeProfileId) ?? settings.profiles[0]!).values;
}

async function switchProfile(): Promise<void> {
  collectForm(); // acik profildeki degisiklikleri kaybetme
  settings.activeProfileId = $<HTMLSelectElement>('#profileSelect').value;
  await saveSettings(settings);
  fillForm(currentProfile());
  flash('Profil değiştirildi.');
}

async function addProfile(): Promise<void> {
  const name = prompt('Yeni profilin adı:', `Profil ${settings.profiles.length + 1}`);
  if (!name?.trim()) return;
  collectForm();
  const profile = newProfile(name.trim());
  settings.profiles.push(profile);
  settings.activeProfileId = profile.id;
  await saveSettings(settings);
  renderProfiles();
  flash('Profil eklendi.');
}

async function renameProfile(): Promise<void> {
  const active = settings.profiles.find((p) => p.id === settings.activeProfileId)!;
  const name = prompt('Profil adı:', active.name);
  if (!name?.trim()) return;
  active.name = name.trim();
  await saveSettings(settings);
  renderProfiles();
}

async function deleteProfile(): Promise<void> {
  if (settings.profiles.length < 2) return;
  const active = settings.profiles.find((p) => p.id === settings.activeProfileId)!;
  if (!confirm(`"${active.name}" profili silinsin mi?`)) return;
  settings.profiles = settings.profiles.filter((p) => p.id !== active.id);
  settings.activeProfileId = settings.profiles[0]!.id;
  await saveSettings(settings);
  renderProfiles();
  flash('Profil silindi.');
}

/* --------------------------------------------------------------------- form */

function fillForm(profile: Profile): void {
  for (const el of document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[data-key]')) {
    el.value = profile[el.dataset.key as ProfileKey] ?? '';
  }
}

function collectForm(): void {
  const profile = currentProfile();
  for (const el of document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[data-key]')) {
    profile[el.dataset.key as ProfileKey] = el.value.trim();
  }
  settings.answers = readAnswers();
}

async function persist(message: string): Promise<void> {
  collectForm();
  await saveSettings(settings);
  flash(message);
}

/* ------------------------------------------------------------- cevap bankası */

function renderAnswers(): void {
  $('#answers').innerHTML = '';
  if (!settings.answers.length) {
    addAnswerRow({ question: 'Neden bu pozisyona başvuruyorsunuz?', answer: '' });
    return;
  }
  settings.answers.forEach(addAnswerRow);
}

function addAnswerRow(item: Answer): void {
  const row = document.createElement('div');
  row.className = 'qa';

  const question = document.createElement('input');
  question.placeholder = 'Soru';
  question.value = item.question;
  question.dataset.role = 'question';

  const answer = document.createElement('textarea');
  answer.placeholder = 'Cevap';
  answer.value = item.answer;
  answer.dataset.role = 'answer';
  answer.style.minHeight = '58px';

  const remove = document.createElement('button');
  remove.type = 'button';
  remove.textContent = '✕';
  remove.title = 'Sil';
  remove.addEventListener('click', () => row.remove());

  row.append(question, answer, remove);
  $('#answers').appendChild(row);
}

function readAnswers(): Answer[] {
  return Array.from(document.querySelectorAll('#answers .qa'))
    .map((row) => ({
      question: row.querySelector<HTMLInputElement>('[data-role="question"]')!.value.trim(),
      answer: row.querySelector<HTMLTextAreaElement>('[data-role="answer"]')!.value.trim(),
    }))
    .filter((a) => a.question && a.answer);
}

/* ---------------------------------------------------------- öğretilen alanlar */

function renderRules(): void {
  const box = $('#rules');
  box.innerHTML = '';
  if (!settings.overrides.length) {
    box.innerHTML = '<p class="hint">Henüz kural yok.</p>';
    return;
  }
  for (const rule of settings.overrides) {
    const row = document.createElement('div');
    row.className = 'rule';

    const site = document.createElement('div');
    site.textContent = rule.host;

    const target = document.createElement('div');
    target.innerHTML = `<code>${escapeHtml(rule.signature)}</code> → ${rule.key === 'skip' ? 'doldurma' : FIELD_LABELS[rule.key]}`;

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.textContent = '✕';
    remove.addEventListener('click', async () => {
      settings.overrides = settings.overrides.filter((o) => o !== rule);
      await saveSettings(settings);
      renderRules();
    });

    row.append(site, target, remove);
    box.appendChild(row);
  }
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
}

/* ------------------------------------------------------------------------ CV */

function renderCv(): void {
  const state = $('#cvState');
  state.textContent = settings.cv
    ? `Yüklü: ${settings.cv.name} (${Math.round((settings.cv.base64.length * 0.75) / 1024)} KB)`
    : 'Dosya yüklenmedi.';
  ($('#cvRemove') as HTMLButtonElement).disabled = !settings.cv;
}

async function onCvSelected(event: Event): Promise<void> {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  if (file.size > MAX_CV_BYTES) {
    flash('Dosya 5 MB sınırını aşıyor.');
    return;
  }
  const buffer = new Uint8Array(await file.arrayBuffer());
  let binary = '';
  for (const byte of buffer) binary += String.fromCharCode(byte);
  settings.cv = { name: file.name, type: file.type || 'application/octet-stream', base64: btoa(binary) };
  await saveSettings(settings);
  renderCv();
  flash('CV kaydedildi.');
}

async function removeCv(): Promise<void> {
  settings.cv = null;
  await saveSettings(settings);
  renderCv();
  flash('CV kaldırıldı.');
}

/* -------------------------------------------------------- yedekleme / izinler */

function exportJson(): void {
  collectForm();
  const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'basvuru-autofill-yedek.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importJson(): void {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json';
  input.addEventListener('change', async () => {
    const file = input.files?.[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text()) as Partial<Settings>;
      const base = defaultSettings();
      settings = {
        version: 2,
        profiles: parsed.profiles?.length ? parsed.profiles : base.profiles,
        activeProfileId: parsed.activeProfileId ?? base.activeProfileId,
        answers: parsed.answers ?? [],
        overrides: parsed.overrides ?? [],
        cv: parsed.cv ?? null,
        consentAt: parsed.consentAt ?? settings.consentAt,
      };
      if (!settings.profiles.some((p) => p.id === settings.activeProfileId)) {
        settings.activeProfileId = settings.profiles[0]!.id;
      }
      await saveSettings(settings);
      renderProfiles();
      renderAnswers();
      renderRules();
      renderCv();
      flash('İçe aktarıldı.');
    } catch {
      flash('Dosya okunamadı.');
    }
  });
  input.click();
}

async function wipe(): Promise<void> {
  if (!confirm('Tüm profiller, cevaplar, kurallar ve CV silinecek. Emin misiniz?')) return;
  await chrome.storage.local.clear();
  settings = defaultSettings();
  await saveSettings(settings);
  renderProfiles();
  renderAnswers();
  renderRules();
  renderCv();
  flash('Tüm veriler silindi.');
}

async function requestAllUrls(): Promise<void> {
  const granted = await chrome.permissions.request({ origins: ['<all_urls>'] });
  flash(granted ? 'İzin verildi.' : 'İzin verilmedi.');
  void refreshPermissionState();
}

async function refreshPermissionState(): Promise<void> {
  const granted = await chrome.permissions.contains({ origins: ['<all_urls>'] });
  $('#permState').textContent = granted ? ' Açık.' : ' Kapalı (yalnızca ana çerçeve doldurulur).';
  ($('#grant') as HTMLButtonElement).disabled = granted;
}

function flash(message: string): void {
  const status = $('#status');
  status.textContent = message;
  setTimeout(() => (status.textContent = ''), 2500);
}
