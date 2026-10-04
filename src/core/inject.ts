/**
 * Doldurma yalnizca kullanici hareketiyle baslar (kisayol ya da acilir penceredeki dugme).
 * LinkedIn bilerek disarida: kendi sayfasinda calisan eklentileri kullanim sartlarinda yasakliyor
 * ve Easy Apply zaten onceki cevaplari kendisi dolduruyor.
 */
export const BLOCKED_HOST = /(^|\.)linkedin\.com$/i;

export type FillOutcome = 'ok' | 'blocked' | 'unsupported' | 'error';

export async function fillActiveTab(): Promise<FillOutcome> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id || !tab.url) return 'unsupported';

  let hostname: string;
  try {
    const url = new URL(tab.url);
    if (!/^https?:$/.test(url.protocol)) return 'unsupported';
    hostname = url.hostname;
  } catch {
    return 'unsupported';
  }
  if (BLOCKED_HOST.test(hostname)) return 'blocked';

  try {
    await chrome.scripting.executeScript({ target: { tabId: tab.id, allFrames: true }, files: ['content.js'] });
    return 'ok';
  } catch {
    // Capraz alan adindan gomulu cerceveler icin izin gerekebilir; en azindan ust cerceveyi dene.
    try {
      await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content.js'] });
      return 'ok';
    } catch {
      return 'error';
    }
  }
}
