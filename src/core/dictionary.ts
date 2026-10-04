import type { ProfileKey } from './types';

export type FieldDef = {
  /** Etiket/placeholder/name icinde aranan Turkce + Ingilizce anahtar kelimeler */
  kw: string[];
  /** Bu kelimeler varsa eslesme iptal edilir (yanlis pozitifleri onler) */
  not?: string[];
  /** Coktan secmeli alanlarda kullanilacak es anlamlilar: profil degeri -> secenek metni */
  optionHints?: Record<string, string[]>;
};

/**
 * Sozluk sirasi onemsizdir; en spesifik (en uzun) eslesen anahtar kelime kazanir.
 * Anahtar kelimeler normalize edilmis halde yazilmalidir (Turkce karakter yok).
 */
export const FIELD_DEFS: Record<ProfileKey, FieldDef> = {
  firstName: {
    kw: ['ad', 'adi', 'adiniz', 'isim', 'isminiz', 'on ad', 'first name', 'firstname', 'given name', 'forename'],
    not: ['soyad', 'soyisim', 'last', 'surname', 'family', 'kullanici', 'user', 'company', 'sirket', 'firma', 'okul', 'universite', 'ulke', 'adres', 'dosya', 'file', 'unvan', 'sehir', 'il', 'ilce', 'banka', 'referans', 'reference', 'anne', 'baba', 'acil durum', 'emergency'],
  },
  lastName: {
    kw: ['soyad', 'soyadi', 'soyadiniz', 'soyisim', 'last name', 'lastname', 'surname', 'family name'],
  },
  fullName: {
    kw: ['ad soyad', 'adi soyadi', 'isim soyisim', 'full name', 'fullname', 'tam ad', 'name', 'ad ve soyad', 'adiniz soyadiniz'],
    not: ['first', 'last', 'user', 'kullanici', 'company', 'sirket', 'firma', 'file', 'dosya', 'okul', 'universite', 'school', 'university', 'bank', 'referans', 'reference', 'domain'],
  },
  email: {
    kw: ['e posta', 'eposta', 'e mail', 'email', 'mail', 'elektronik posta'],
    not: ['sifre', 'password', 'dogrula', 'confirm', 'tekrar'],
  },
  phone: {
    kw: ['telefon', 'cep telefonu', 'cep', 'gsm', 'phone', 'mobile', 'cell', 'tel', 'iletisim numarasi', 'telefon numarasi'],
  },
  address: {
    kw: ['adres', 'address', 'acik adres', 'street', 'sokak', 'cadde', 'mahalle', 'address line'],
    not: ['e posta', 'eposta', 'email', 'mail', 'ip'],
  },
  city: {
    kw: ['il', 'sehir', 'city', 'ilimiz', 'yasadiginiz sehir', 'bulundugunuz sehir', 'location', 'konum'],
    not: ['ilce', 'district', 'posta', 'ulke', 'country'],
  },
  district: { kw: ['ilce', 'district', 'county', 'semt', 'ilcesi'] },
  postalCode: { kw: ['posta kodu', 'postakodu', 'zip', 'zip code', 'postal code', 'postcode'] },
  country: { kw: ['ulke', 'country', 'ulkeniz'], not: ['uyruk', 'nationality', 'citizenship', 'kod', 'kodu', 'code'] },
  linkedin: { kw: ['linkedin', 'linked in'] },
  github: { kw: ['github', 'git hub', 'gitlab'] },
  website: {
    kw: ['web sitesi', 'website', 'web site', 'portfolio', 'portfoy', 'kisisel site', 'blog', 'url', 'site adresi'],
    not: ['linkedin', 'github', 'twitter', 'instagram', 'sirket', 'company'],
  },
  birthDate: {
    kw: ['dogum tarihi', 'dogum gunu', 'birth date', 'birthdate', 'date of birth', 'dob', 'birthday', 'dogum'],
    not: ['yeri', 'place', 'sehir', 'city'],
  },
  tckn: {
    kw: ['tc kimlik', 'tc kimlik no', 'tc kimlik numarasi', 'tckn', 'tc no', 'kimlik numarasi', 'kimlik no', 'national id', 'identity number', 'identification number', 'tc'],
    not: ['vergi', 'tax', 'seri', 'anne', 'baba'],
  },
  gender: {
    kw: ['cinsiyet', 'gender', 'sex'],
    optionHints: {
      erkek: ['erkek', 'male', 'bay', 'e'],
      kadin: ['kadin', 'female', 'bayan', 'k'],
    },
  },
  nationality: { kw: ['uyruk', 'nationality', 'citizenship', 'vatandaslik', 'tabiiyet'] },
  militaryStatus: {
    kw: ['askerlik', 'askerlik durumu', 'military', 'military status', 'military service'],
    optionHints: {
      yapildi: ['yapildi', 'tamamlandi', 'yapti', 'completed', 'done', 'tamamlanmis'],
      muaf: ['muaf', 'exempt'],
      tecilli: ['tecil', 'tecilli', 'ertelendi', 'deferred', 'postponed'],
      yapilmadi: ['yapilmadi', 'not completed', 'yapmadi'],
    },
  },
  drivingLicence: { kw: ['ehliyet', 'surucu belgesi', 'driving licence', 'driving license', 'drivers license', 'driver license'] },
  currentTitle: {
    kw: ['unvan', 'pozisyon', 'gorev', 'job title', 'current title', 'position', 'title', 'meslek', 'occupation'],
    not: ['sirket', 'company', 'firma', 'okul', 'school', 'basvurulan', 'applied', 'ilan'],
  },
  currentCompany: {
    kw: ['sirket', 'firma', 'kurum', 'isyeri', 'company', 'employer', 'current company', 'organization', 'calistiginiz kurum'],
    not: ['okul', 'universite', 'school', 'university', 'unvan', 'title', 'sektor', 'industry', 'adres', 'address'],
  },
  experienceYears: {
    kw: ['deneyim', 'tecrube', 'deneyim yili', 'years of experience', 'experience', 'kac yil', 'toplam deneyim'],
    not: ['aciklama', 'description', 'detay', 'ozet'],
  },
  salaryExpectation: {
    kw: ['maas', 'ucret', 'maas beklentisi', 'ucret beklentisi', 'salary', 'salary expectation', 'expected salary', 'compensation', 'beklenen maas'],
  },
  noticePeriod: {
    kw: ['ise baslama', 'ise baslayabileceginiz', 'baslangic tarihi', 'notice period', 'start date', 'availability', 'ne zaman baslayabilirsiniz', 'musaitlik'],
  },
  workAuthorization: {
    kw: ['calisma izni', 'work authorization', 'work permit', 'visa', 'vize', 'sponsorship', 'authorized to work', 'calisma hakki'],
    optionHints: {
      evet: ['evet', 'yes', 'var', 'authorized'],
      hayir: ['hayir', 'no', 'yok'],
    },
  },
  school: {
    kw: ['universite', 'okul', 'school', 'university', 'egitim kurumu', 'mezun oldugunuz okul', 'college', 'institution'],
    not: ['bolum', 'department', 'major', 'derece', 'degree', 'yil', 'year'],
  },
  degree: {
    kw: ['derece', 'degree', 'egitim seviyesi', 'education level', 'ogrenim durumu', 'mezuniyet derecesi', 'egitim durumu'],
    optionHints: {
      lisans: ['lisans', 'bachelor', 'universite', 'undergraduate', 'bs', 'ba'],
      yukseklisans: ['yuksek lisans', 'master', 'ms', 'ma', 'graduate'],
      doktora: ['doktora', 'phd', 'doctorate'],
    },
  },
  fieldOfStudy: {
    kw: ['bolum', 'field of study', 'major', 'program', 'brans', 'okudugunuz bolum'],
    not: ['okul', 'universite', 'school', 'university'],
  },
  graduationYear: {
    kw: ['mezuniyet', 'mezuniyet yili', 'graduation', 'graduation year', 'mezun', 'year of graduation'],
  },
  summary: {
    kw: ['ozet', 'hakkinda', 'hakkinizda', 'kendinizi', 'kendinizden', 'tanitin', 'about you', 'about yourself', 'summary', 'profil ozeti', 'kisa bilgi'],
  },
  coverLetter: {
    kw: ['on yazi', 'onyazi', 'cover letter', 'motivasyon', 'motivation letter', 'niyet mektubu', 'basvuru mektubu', 'neden basvuruyorsunuz'],
  },
  iban: { kw: ['iban', 'hesap numarasi', 'account number'], not: ['musteri', 'customer'] },
  taxNumber: { kw: ['vergi no', 'vergi numarasi', 'vergi kimlik', 'vkn', 'tax number', 'tax id'] },
};

/** HTML autocomplete standardi -> profil alani (en guvenilir sinyal) */
export const AUTOCOMPLETE_MAP: Record<string, ProfileKey> = {
  'given-name': 'firstName',
  'additional-name': 'firstName',
  'family-name': 'lastName',
  name: 'fullName',
  email: 'email',
  tel: 'phone',
  'tel-national': 'phone',
  'street-address': 'address',
  'address-line1': 'address',
  'address-level2': 'city',
  'address-level1': 'district',
  'postal-code': 'postalCode',
  'country-name': 'country',
  country: 'country',
  bday: 'birthDate',
  organization: 'currentCompany',
  'organization-title': 'currentTitle',
  url: 'website',
  sex: 'gender',
};

/** Dosya alanlarinda ozgecmis yuklemek icin aranan kelimeler */
export const CV_KEYWORDS = ['cv', 'ozgecmis', 'resume', 'curriculum', 'dosya', 'file', 'upload', 'yukle', 'belge', 'attachment', 'ek dosya'];
