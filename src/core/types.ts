export type ProfileKey =
  | 'firstName' | 'lastName' | 'fullName'
  | 'email' | 'phone'
  | 'address' | 'city' | 'district' | 'postalCode' | 'country'
  | 'linkedin' | 'github' | 'website'
  | 'birthDate' | 'tckn' | 'gender' | 'nationality' | 'militaryStatus' | 'drivingLicence'
  | 'currentTitle' | 'currentCompany' | 'experienceYears'
  | 'salaryExpectation' | 'noticePeriod' | 'workAuthorization'
  | 'school' | 'degree' | 'fieldOfStudy' | 'graduationYear'
  | 'summary' | 'coverLetter'
  | 'iban' | 'taxNumber';

export type Profile = Record<ProfileKey, string>;

/** Alanlarin ayarlar sayfasindaki ve eslestirme menusundeki Turkce adlari */
export const FIELD_LABELS: Record<ProfileKey, string> = {
  firstName: 'Ad', lastName: 'Soyad', fullName: 'Ad Soyad',
  email: 'E-posta', phone: 'Telefon',
  address: 'Adres', city: 'İl', district: 'İlçe', postalCode: 'Posta kodu', country: 'Ülke',
  linkedin: 'LinkedIn', github: 'GitHub', website: 'Web sitesi',
  birthDate: 'Doğum tarihi', tckn: 'TC Kimlik No', gender: 'Cinsiyet', nationality: 'Uyruk',
  militaryStatus: 'Askerlik durumu', drivingLicence: 'Ehliyet',
  currentTitle: 'Unvan', currentCompany: 'Şirket', experienceYears: 'Deneyim (yıl)',
  salaryExpectation: 'Maaş beklentisi', noticePeriod: 'İşe başlama', workAuthorization: 'Çalışma izni',
  school: 'Okul', degree: 'Derece', fieldOfStudy: 'Bölüm', graduationYear: 'Mezuniyet yılı',
  summary: 'Kısa özet', coverLetter: 'Ön yazı',
  iban: 'IBAN', taxNumber: 'Vergi no',
};

export const PROFILE_KEYS = Object.keys(FIELD_LABELS) as ProfileKey[];

export type NamedProfile = { id: string; name: string; values: Profile };
export type Answer = { question: string; answer: string };

/** Kullanicinin "bu alan sudur" diye ogrettigi site kurallari */
export type Override = { host: string; signature: string; key: ProfileKey | 'skip' };

/** Ozgecmis dosyasi; yalnizca bu cihazda, base64 olarak saklanir */
export type CvFile = { name: string; type: string; base64: string };

export type Settings = {
  version: 2;
  profiles: NamedProfile[];
  activeProfileId: string;
  answers: Answer[];
  overrides: Override[];
  cv: CvFile | null;
  /** Kullanicinin veri saklamaya onay verdigi an (Chrome Web Store 'affirmative consent' sarti) */
  consentAt: number | null;
};

export const EMPTY_PROFILE: Profile = Object.fromEntries(PROFILE_KEYS.map((k) => [k, ''])) as Profile;

export function newProfile(name: string): NamedProfile {
  return { id: `p${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`, name, values: { ...EMPTY_PROFILE } };
}

export function defaultSettings(): Settings {
  const first = newProfile('Varsayılan');
  return { version: 2, profiles: [first], activeProfileId: first.id, answers: [], overrides: [], cv: null, consentAt: null };
}

type StoredV1 = { profile?: Partial<Profile>; answers?: Answer[] };

export async function loadSettings(): Promise<Settings> {
  const stored = (await chrome.storage.local.get('settings')).settings as Partial<Settings> & StoredV1 | undefined;
  if (!stored) return defaultSettings();

  // v1 -> v2 gecisi: tek profil, adlandirilmis profile donusturulur
  if (!stored.version && stored.profile) {
    const migrated = defaultSettings();
    migrated.profiles[0]!.values = { ...EMPTY_PROFILE, ...stored.profile };
    migrated.answers = stored.answers ?? [];
    await saveSettings(migrated);
    return migrated;
  }

  const base = defaultSettings();
  const profiles = stored.profiles?.length
    ? stored.profiles.map((p) => ({ id: p.id, name: p.name, values: { ...EMPTY_PROFILE, ...p.values } }))
    : base.profiles;
  return {
    version: 2,
    profiles,
    activeProfileId: profiles.some((p) => p.id === stored.activeProfileId) ? stored.activeProfileId! : profiles[0]!.id,
    answers: stored.answers ?? [],
    overrides: stored.overrides ?? [],
    cv: stored.cv ?? null,
    consentAt: stored.consentAt ?? null,
  };
}

export async function saveSettings(settings: Settings): Promise<void> {
  await chrome.storage.local.set({ settings });
}

export function activeProfile(settings: Settings): Profile {
  return (settings.profiles.find((p) => p.id === settings.activeProfileId) ?? settings.profiles[0])?.values ?? EMPTY_PROFILE;
}
