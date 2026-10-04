/**
 * Turkce ve Ingilizce etiketleri karsilastirilabilir hale getirir:
 * kucuk harfe cevirir, Turkce karakterleri sadelestirir, noktalamayi bosluga cevirir.
 * "Doğum Tarihi*" -> "dogum tarihi"
 */
export function normalize(input: string | null | undefined): string {
  if (!input) return '';
  return input
    .replace(/İ/g, 'i')
    .replace(/I/g, 'i')
    .toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/** Kisa anahtar kelimeler (<=4 harf) sadece tam kelime olarak eslesir: "ad" != "adres" */
export function containsKeyword(haystack: string, keyword: string): boolean {
  if (!haystack || !keyword) return false;
  if (keyword.length <= 4 || keyword.includes(' ')) {
    return new RegExp(`(^| )${escapeRegExp(keyword)}( |$)`).test(haystack);
  }
  return haystack.includes(keyword);
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Iki soru metni arasinda kaba benzerlik (ortak kelime orani). 0..1 */
export function similarity(a: string, b: string): number {
  const ta = new Set(normalize(a).split(' ').filter((w) => w.length > 2));
  const tb = new Set(normalize(b).split(' ').filter((w) => w.length > 2));
  if (!ta.size || !tb.size) return 0;
  let shared = 0;
  for (const w of ta) if (tb.has(w)) shared++;
  return shared / Math.min(ta.size, tb.size);
}
