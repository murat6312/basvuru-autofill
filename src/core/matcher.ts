import { AUTOCOMPLETE_MAP, FIELD_DEFS } from './dictionary';
import { containsKeyword, normalize } from './normalize';
import type { ProfileKey } from './types';

export type Signals = {
  label: string;
  aria: string;
  placeholder: string;
  name: string;
  autocomplete: string;
};

export type Match = { key: ProfileKey; score: number; via: string };

/** Sinyalin agirligi: etiket metni, name/id attribute'undan daha guvenilirdir. */
const WEIGHTS: Array<{ field: keyof Signals; weight: number }> = [
  { field: 'label', weight: 3 },
  { field: 'aria', weight: 2.5 },
  { field: 'placeholder', weight: 2 },
  { field: 'name', weight: 1.5 },
];

/** Bu esigin altindaki eslesmeler doldurulmaz, sadece isaretlenir. */
export const CONFIDENT_SCORE = 12;
export const MIN_SCORE = 5;

export function matchField(signals: Signals): Match | null {
  const ac = normalize(signals.autocomplete).replace(/ /g, '-');
  if (ac && AUTOCOMPLETE_MAP[ac]) {
    return { key: AUTOCOMPLETE_MAP[ac], score: 100, via: `autocomplete="${ac}"` };
  }

  const normalized: Record<keyof Signals, string> = {
    label: normalize(signals.label),
    aria: normalize(signals.aria),
    placeholder: normalize(signals.placeholder),
    name: normalize(signals.name),
    autocomplete: ac,
  };

  let best: Match | null = null;

  for (const [key, def] of Object.entries(FIELD_DEFS) as Array<[ProfileKey, (typeof FIELD_DEFS)[ProfileKey]]>) {
    const blocked = (def.not ?? []).some((bad) =>
      WEIGHTS.some(({ field }) => containsKeyword(normalized[field], bad)),
    );
    if (blocked) continue;

    for (const { field, weight } of WEIGHTS) {
      const haystack = normalized[field];
      if (!haystack) continue;
      for (const kw of def.kw) {
        if (!containsKeyword(haystack, kw)) continue;
        // Etiketin tamami anahtar kelimeye esitse ("İl", "Ad") bu cok guclu bir sinyaldir.
        const exactBonus = haystack === kw ? 10 : 0;
        const score = kw.length * weight + exactBonus;
        if (!best || score > best.score) {
          best = { key, score, via: `${field}: "${kw}"` };
        }
      }
    }
  }

  return best && best.score >= MIN_SCORE ? best : null;
}
