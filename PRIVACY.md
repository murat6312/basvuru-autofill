# Gizlilik Politikası — Başvuru Autofill

Son güncelleme: 20 Eylül 2026

## Kısaca

Bu eklenti **hiçbir veri toplamaz, hiçbir sunucuya veri göndermez**. Girdiğiniz bilgiler
yalnızca kendi tarayıcınızda, cihazınızda saklanır. Geliştirici bu verilere erişemez.

## Hangi veriler, nerede saklanıyor?

Ayarlar sayfasına kendi girdiğiniz bilgiler tarayıcınızın yerel deposunda
(`chrome.storage.local`) tutulur:

- Kişisel bilgiler: ad, soyad, doğum tarihi, TC kimlik numarası, uyruk, cinsiyet, askerlik durumu
- İletişim bilgileri: e-posta, telefon, adres, il, ilçe, posta kodu, ülke
- Meslek bilgileri: unvan, şirket, deneyim, eğitim, maaş beklentisi, bağlantılar
- Özgeçmiş dosyası (yüklerseniz)
- Cevap bankasındaki soru ve cevaplar
- "Eşleştir" ile öğrettiğiniz site kuralları (alan adı ve alan kimliği)

Bu veriler bilgisayarınızdan çıkmaz. Tarayıcı hesabınızla senkronize edilmez
(`chrome.storage.sync` kullanılmaz).

## Veriler nasıl kullanılıyor?

Yalnızca tek bir amaçla: siz kısayola ya da "Bu sayfayı doldur" düğmesine bastığınızda,
o anda açık olan sayfadaki form alanlarını doldurmak için.

- Eklenti arka planda çalışmaz; yalnızca sizin başlattığınız anda o sekmeye girer.
- Formu **göndermez**; Gönder tuşuna her zaman siz basarsınız.
- Şifre alanlarını doldurmaz ve şifre saklamaz.
- Onay kutularını işaretlemez.
- CAPTCHA'lara dokunmaz.
- `linkedin.com` üzerinde hiç çalışmaz.

## Üçüncü taraflar

Yoktur. Eklenti hiçbir analiz aracı, reklam ağı, hata raporlama servisi veya yapay zekâ
API'si kullanmaz. Hiçbir ağ isteği göndermez.

## İzinler ve gerekçeleri

- **storage**: Bilgilerinizi cihazınızda saklamak için.
- **activeTab**: Yalnızca siz eklentiyi çalıştırdığınızda, o anda açık olan sekmeye erişmek için.
- **scripting**: Form doldurma kodunu o sekmeye enjekte etmek için.
- **optional_host_permissions (`<all_urls>`)**: İsteğe bağlıdır ve varsayılan olarak kapalıdır.
  Yalnızca, başvuru formu başka bir alan adından gömülü çerçevede gösteriliyorsa (ör. Greenhouse)
  ve siz ayarlardan açarsanız istenir.

## Verilerinizi silme

- Ayarlar sayfasındaki **Tüm verileri sil** düğmesi her şeyi siler.
- Eklentiyi kaldırdığınızda Chrome yerel depoyu da siler.
- **JSON dışa aktar** ile yedek alabilir, başka bir bilgisayara taşıyabilirsiniz.

## Değişiklikler ve iletişim

Bu politika değişirse bu sayfa güncellenir ve sürüm notlarında belirtilir.
Soru ve bildirimler için: murratek63@hotmail.com

---

# Privacy Policy — Başvuru Autofill (English)

Last updated: 20 September 2026

**In short: this extension collects no data and sends nothing anywhere.** Everything you type
into its settings page is stored locally on your own device (`chrome.storage.local`) and the
developer has no access to it.

**What is stored locally:** the profile fields you enter (name, contact details, national ID
number, address, education, work details, links), an optional CV file, your saved answers to
common application questions, and the per-site field rules you teach it.

**How it is used:** only to fill form fields on the page you are looking at, and only when you
press the keyboard shortcut or the "fill" button. The extension never submits forms, never fills
password fields, never checks consent boxes, never touches CAPTCHAs, and never runs on
linkedin.com.

**Third parties:** none. No analytics, no ads, no crash reporting, no AI services, no network
requests of any kind.

**Permissions:** `storage` to keep your data on your device; `activeTab` and `scripting` to fill
the page you explicitly trigger it on; `<all_urls>` is optional, off by default, and only requested
if you enable filling inside cross-origin embedded forms.

**Deleting your data:** use "Delete all data" on the options page, or uninstall the extension.
You can export a JSON backup at any time.

Contact: murratek63@hotmail.com
