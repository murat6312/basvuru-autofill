import { fillActiveTab } from './core/inject';
import { loadSettings, saveSettings } from './core/types';

const profileSelect = document.querySelector<HTMLSelectElement>('#profile')!;
const fillButton = document.querySelector<HTMLButtonElement>('#fill')!;
const result = document.querySelector<HTMLParagraphElement>('#result')!;
const cvLine = document.querySelector<HTMLParagraphElement>('#cv')!;

chrome.runtime.onMessage.addListener((message: { type?: string; filled?: number; flagged?: number }) => {
  if (message?.type !== 'fill-result') return;
  const flagged = message.flagged ?? 0;
  result.textContent = message.filled
    ? `${message.filled} alan dolduruldu${flagged ? `, ${flagged} alan kontrol bekliyor` : ''}. Göndermeden önce kontrol edin.`
    : 'Eşleşen alan bulunamadı. Sayfadaki "Eşleştir" ile öğretebilirsiniz.';
});

void init();

async function init(): Promise<void> {
  const settings = await loadSettings();

  profileSelect.innerHTML = '';
  for (const p of settings.profiles) profileSelect.appendChild(new Option(p.name, p.id));
  profileSelect.value = settings.activeProfileId;
  profileSelect.hidden = settings.profiles.length < 2;

  cvLine.textContent = settings.cv ? `CV: ${settings.cv.name}` : 'CV yüklenmedi.';

  profileSelect.addEventListener('change', async () => {
    const current = await loadSettings();
    current.activeProfileId = profileSelect.value;
    await saveSettings(current);
  });

  fillButton.addEventListener('click', async () => {
    fillButton.disabled = true;
    result.textContent = 'Dolduruluyor…';
    const outcome = await fillActiveTab();
    fillButton.disabled = false;
    if (outcome === 'blocked') result.textContent = 'LinkedIn sayfalarında bilinçli olarak çalışmaz. Yönlendirildiğiniz şirket sayfasında kullanın.';
    else if (outcome === 'unsupported') result.textContent = 'Bu sayfada çalışamaz (yalnızca http/https).';
    else if (outcome === 'error') result.textContent = 'Sayfaya erişilemedi. Sekmeyi yenileyip tekrar deneyin.';
    else setTimeout(() => window.close(), 900);
  });

  document.querySelector('#options')!.addEventListener('click', (e) => {
    e.preventDefault();
    void chrome.runtime.openOptionsPage();
  });
}
