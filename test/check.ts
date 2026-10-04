/**
 * Alan tanima kalite testi. Calistirmak icin:  npm run check
 * Gercek basvuru formlarindan (Lever, Greenhouse, Workday, Turkce kariyer sayfalari)
 * alinan etiketlerle sozlugu sinar.
 */
import { matchField, pickOption } from '../src/core/matcher';

type Case = { label?: string; name?: string; placeholder?: string; autocomplete?: string; expect: string | null };

const cases: Case[] = [
  // --- Ingilizce ATS etiketleri
  { label: 'First Name *', expect: 'firstName' },
  { label: 'Last Name *', expect: 'lastName' },
  { label: 'Full name', expect: 'fullName' },
  { label: 'Email', expect: 'email' },
  { label: 'Phone', expect: 'phone' },
  { label: 'Mobile phone number', expect: 'phone' },
  { label: 'LinkedIn Profile', expect: 'linkedin' },
  { label: 'LinkedIn URL', expect: 'linkedin' },
  { label: 'GitHub URL', expect: 'github' },
  { label: 'Website', expect: 'website' },
  { label: 'Portfolio', expect: 'website' },
  { label: 'Current Company', expect: 'currentCompany' },
  { label: 'Current Title', expect: 'currentTitle' },
  { label: 'City', expect: 'city' },
  { label: 'Country', expect: 'country' },
  { label: 'Postal Code', expect: 'postalCode' },
  { label: 'Years of experience', expect: 'experienceYears' },
  { label: 'Expected salary', expect: 'salaryExpectation' },
  { label: 'Notice period', expect: 'noticePeriod' },
  { label: 'Are you legally authorized to work?', expect: 'workAuthorization' },
  { label: 'School', expect: 'school' },
  { label: 'Degree', expect: 'degree' },
  { label: 'Field of study', expect: 'fieldOfStudy' },
  { label: 'Cover letter', expect: 'coverLetter' },
  { label: 'Date of birth', expect: 'birthDate' },
  { label: 'Gender', expect: 'gender' },

  // --- Turkce kariyer sayfasi etiketleri
  { label: 'Ad', expect: 'firstName' },
  { label: 'Adınız *', expect: 'firstName' },
  { label: 'Soyad', expect: 'lastName' },
  { label: 'Soyadınız', expect: 'lastName' },
  { label: 'Ad Soyad', expect: 'fullName' },
  { label: 'E-posta Adresiniz', expect: 'email' },
  { label: 'Cep Telefonu', expect: 'phone' },
  { label: 'Telefon Numarası', expect: 'phone' },
  { label: 'T.C. Kimlik No', expect: 'tckn' },
  { label: 'TC Kimlik Numarası', expect: 'tckn' },
  { label: 'Doğum Tarihi', expect: 'birthDate' },
  { label: 'Askerlik Durumu', expect: 'militaryStatus' },
  { label: 'Cinsiyet', expect: 'gender' },
  { label: 'Uyruk', expect: 'nationality' },
  { label: 'Adres', expect: 'address' },
  { label: 'İl', expect: 'city' },
  { label: 'İlçe', expect: 'district' },
  { label: 'Posta Kodu', expect: 'postalCode' },
  { label: 'Mezun Olduğunuz Üniversite', expect: 'school' },
  { label: 'Bölüm', expect: 'fieldOfStudy' },
  { label: 'Mezuniyet Yılı', expect: 'graduationYear' },
  { label: 'Öğrenim Durumu', expect: 'degree' },
  { label: 'Maaş Beklentisi', expect: 'salaryExpectation' },
  { label: 'İşe Başlayabileceğiniz Tarih', expect: 'noticePeriod' },
  { label: 'Çalıştığınız Kurum', expect: 'currentCompany' },
  { label: 'Unvanınız', expect: 'currentTitle' },
  { label: 'Toplam Deneyim (Yıl)', expect: 'experienceYears' },
  { label: 'Ehliyet', expect: 'drivingLicence' },
  { label: 'IBAN', expect: 'iban' },
  { label: 'Vergi Numarası', expect: 'taxNumber' },
  { label: 'Kendinizi kısaca tanıtın', expect: 'summary' },
  { label: 'Ön Yazı', expect: 'coverLetter' },

  // --- attribute sinyalleri (etiket yoksa)
  { name: 'first_name', expect: 'firstName' },
  { name: 'last_name', expect: 'lastName' },
  { name: 'urls[LinkedIn]', expect: 'linkedin' },
  { name: 'candidate_email', expect: 'email' },
  { autocomplete: 'given-name', expect: 'firstName' },
  { autocomplete: 'family-name', expect: 'lastName' },
  { autocomplete: 'postal-code', expect: 'postalCode' },
  { placeholder: 'ornek@mail.com', expect: 'email' },

  // --- yanlis pozitif olmamasi gerekenler
  { label: 'Kullanıcı Adı', expect: null },
  { label: 'Şirket Adı', expect: 'currentCompany' },
  { label: 'Okul Adı', expect: 'school' },
  { label: 'Referans Kişi Adı', expect: null },
  { label: 'Bu ilanı nereden duydunuz?', expect: null },
  { label: 'Ülke Kodu', expect: null },
];

let pass = 0;
const failures: string[] = [];

for (const c of cases) {
  const result = matchField({
    label: c.label ?? '',
    aria: '',
    placeholder: c.placeholder ?? '',
    name: c.name ?? '',
    autocomplete: c.autocomplete ?? '',
  });
  const got = result?.key ?? null;
  const signal = c.label ?? c.name ?? c.placeholder ?? c.autocomplete ?? '';
  if (got === c.expect) {
    pass++;
  } else {
    failures.push(`  "${signal}" -> beklenen: ${c.expect ?? 'eslesme yok'}, gelen: ${got ?? 'eslesme yok'}${result ? ` (${result.via}, skor ${result.score.toFixed(1)})` : ''}`);
  }
}

// --- Secenek esleme (select / radio): kisa es anlamlilar baska secenegin icinde yakalanmamali
type OptionCase = { options: string[]; value: string; key: Parameters<typeof pickOption>[2]; expect: number };
const optionCases: OptionCase[] = [
  { options: ['Erkek', 'Kadın'], value: 'Kadın', key: 'gender', expect: 1 },
  { options: ['Erkek', 'Kadın'], value: 'Erkek', key: 'gender', expect: 0 },
  { options: ['Female', 'Male'], value: 'Erkek', key: 'gender', expect: 1 },
  { options: ['Female', 'Male'], value: 'Kadın', key: 'gender', expect: 0 },
  { options: ['Erkek / Male', 'Kadın / Female'], value: 'Kadın', key: 'gender', expect: 1 },
  { options: ['Bay', 'Bayan'], value: 'Kadın', key: 'gender', expect: 1 },
  { options: ['E', 'K'], value: 'Kadın', key: 'gender', expect: 1 },
  { options: ['Seçiniz', 'Yapıldı', 'Muaf', 'Tecilli'], value: 'Muaf', key: 'militaryStatus', expect: 2 },
  { options: ['Seçiniz', 'Completed', 'Exempt'], value: 'Yapıldı', key: 'militaryStatus', expect: 1 },
  { options: ['Lise', 'Ön Lisans', 'Lisans', 'Yüksek Lisans'], value: 'Lisans', key: 'degree', expect: 2 },
  { options: ['Lise', 'Ön Lisans', 'Lisans', 'Yüksek Lisans'], value: 'Yüksek Lisans', key: 'degree', expect: 3 },
  { options: ['High school', "Bachelor's degree", "Master's degree"], value: 'Lisans', key: 'degree', expect: 1 },
];
let optionPass = 0;
for (const c of optionCases) {
  const got = pickOption(c.options, c.value, c.key);
  if (got === c.expect) {
    optionPass++;
  } else {
    failures.push(`  [${c.options.join(' | ')}] "${c.value}" -> beklenen: ${c.options[c.expect]}, gelen: ${c.options[got] ?? 'eslesme yok'}`);
  }
}

console.log(`\nAlan tanima: ${pass}/${cases.length} dogru`);
console.log(`Secenek esleme: ${optionPass}/${optionCases.length} dogru\n`);
if (failures.length) {
  console.log('Basarisiz:');
  console.log(failures.join('\n'));
  process.exitCode = 1;
}
