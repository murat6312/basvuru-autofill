import { fillActiveTab } from './core/inject';

chrome.commands.onCommand.addListener((command) => {
  if (command !== 'fill-form') return;
  void fillActiveTab().then((outcome) => {
    if (outcome === 'ok') return;
    badge(outcome === 'blocked' ? 'LI' : '—');
  });
});

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') void chrome.runtime.openOptionsPage();
});

function badge(text: string): void {
  void chrome.action.setBadgeBackgroundColor({ color: '#b45309' });
  void chrome.action.setBadgeText({ text });
  setTimeout(() => void chrome.action.setBadgeText({ text: '' }), 2500);
}
