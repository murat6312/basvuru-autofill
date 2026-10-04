# Chrome Web Store yayın dosyası

Bu dosya, Developer Dashboard'daki alanlara kopyalanacak metinleri ve yayın adımlarını içerir.
Politika bilgileri 20 Eylül 2026'da resmî Chrome dokümanlarından doğrulandı.

---

## 1. Yayın öncesi kontrol listesi

- [ ] Geliştirici hesabı açıldı ve **tek seferlik kayıt ücreti** ödendi (resmî sayfa tutar yazmıyor; yaygın olarak 5 USD, tutarı ödeme ekranında gör; yıllık yenileme yok)
- [ ] Hesap için **uzun vadeli kullanacağın e-posta** seçildi — hesap açıldıktan sonra adres değiştirilemiyor
- [ ] Hesapta **2 Adımlı Doğrulama açık** (zorunlu, olmadan yayın yapılamıyor)
- [ ] **Trader / non-trader beyanı** yapıldı (ücretsiz ve kişisel yayın için non-trader savunulabilir; para almaya başlayınca trader olunur ve yasal ad mağazada görünür)
- [ ] Publisher adı ve doğrulanmış iletişim e-postası girildi
- [ ] `npm run package` ile `basvuru-autofill.zip` üretildi (manifest ZIP kökünde)
- [ ] Gizlilik politikası herkese açık bir adreste yayında (aşağıda)
- [ ] Ekran görüntüleri hazır (en az 1 adet, 1280x800)
- [ ] Küçük tanıtım görseli hazır (440x280)
- [ ] Privacy practices sekmesindeki tüm alanlar dolduruldu (aşağıdaki hazır metinler)
- [ ] İlk gönderim **Unlisted** olarak yapıldı, kendi hesabında test edildi, sonra Public'e çevrildi

Önemli: kod **minify edilmiyor** (esbuild yapılandırmasında `minify` kapalı). Bu bilinçli bir
tercihtir; "obfuscated code" reddini (Red Titanium) önler ve incelemeyi hızlandırır.

---

## 2. Store listing metinleri

### Ad (en fazla 75 karakter)

```
Başvuru Autofill — Türkçe form doldurucu
```

### Özet / summary (en fazla 132 karakter)

```
Başvuru ve kayıt formlarını kayıtlı bilgilerinizle tek tuşta doldurur. Türkçe alanları tanır, veriler cihazınızda kalır.
```

### Ayrıntılı açıklama — Türkçe

```
İş başvurusu ve kayıt formlarını, bir kez kaydettiğiniz bilgilerle tek tuşta doldurur.

Formu ASLA göndermez, şifre alanı doldurmaz, şifre saklamaz. Gönder tuşuna her zaman siz basarsınız.

Verileriniz yalnızca kendi tarayıcınızda saklanır. Sunucu yok, hesap yok, bulut senkronu yok,
analiz aracı yok, yapay zekâ servisi yok. Girdiğiniz hiçbir bilgi cihazınızdan çıkmaz.

NE YAPAR
• Türkçe ve İngilizce alan etiketlerini tanır: Ad, Soyad, E-posta, Cep Telefonu, TC Kimlik No,
  Adres, İl, İlçe, Doğum Tarihi, Askerlik Durumu, Mezuniyet, Maaş Beklentisi ve daha fazlası.
• Kayıtlı özgeçmişinizi formdaki dosya alanına ekler.
• Tekrar eden açık uçlu sorulara ("Neden bu pozisyona başvuruyorsunuz?") hazır cevaplarınızı yazar.
• Birden fazla profil tutar; doldurmadan önce hangisini kullanacağınızı seçersiniz.
• Emin olduğu alanı yeşil, tahmin ettiğini sarı çerçeveler; yanlışsa tek tuşla geri alırsınız.
• Tanımadığı bir alanı "Eşleştir" ile ona siz öğretirsiniz; kural o site için kaydedilir.

NASIL ÇALIŞIR
Formun olduğu sayfada Alt+Shift+F tuşlarına basın (ya da araç çubuğundaki simgeye tıklayın).
Eklenti arka planda çalışmaz; yalnızca siz başlattığınızda, yalnızca o sekmede çalışır.

NE YAPMAZ
• Formu göndermez. • Şifre alanlarına dokunmaz. • Onay kutularını işaretlemez.
• CAPTCHA çözmez. • linkedin.com üzerinde hiç çalışmaz (LinkedIn'in kullanım şartlarına saygıyla).

Mevcut özellikler her zaman ücretsiz kalacaktır.
```

### Ayrıntılı açıklama — İngilizce

```
Fills job application and sign-up forms from a profile you save once.

It NEVER submits the form, never fills password fields and never stores passwords.
You always press Submit yourself.

Your data is stored only in your own browser. No server, no account, no cloud sync,
no analytics, no AI service. Nothing you type ever leaves your device.

WHAT IT DOES
• Understands Turkish and English field labels: first/last name, e-mail, phone, national ID,
  address, city, district, date of birth, military status, graduation, salary expectation and more.
• Attaches your saved CV to the file field of the form.
• Answers repeated open questions ("Why are you applying?") from your saved answer bank.
• Keeps multiple profiles; you pick one before filling.
• Marks confident fields green and guesses amber; one click undoes everything.
• Teach it any field it does not recognise; the rule is saved for that site.

HOW IT WORKS
Press Alt+Shift+F on the page with the form, or click the toolbar icon.
The extension never runs in the background — only when you trigger it, only in that tab.

WHAT IT DOES NOT DO
• Never submits forms. • Never touches password fields. • Never ticks consent boxes.
• Never solves CAPTCHAs. • Never runs on linkedin.com.

The current features will stay free forever.
```

Kaçınılacaklar (Yellow Argon — keyword spam): site/marka listesi yazmayın, aynı anahtar kelimeyi
beşten fazla tekrarlamayın, "en iyi/1 numara" gibi iddialar kullanmayın.

### Kategori ve dil

- Kategori: **Workflow & Planning** (alternatif: Productivity)
- Dil: Türkçe (ana), İngilizce listeleme ikinci dil olarak eklenebilir
- Tek eklenti, çok dilli listeleme kullanın. Ayrı "TR" ve "EN" eklentisi açmak yasak (Yellow Nickel: duplicate).

---

## 3. Privacy practices sekmesi (hazır metinler)

### Tek amaç (single purpose)

```
Kullanıcının kendi cihazında kaydettiği kişisel profil bilgileriyle, kullanıcının açıkça
tetiklediği anda, açık olan sekmedeki web formu alanlarını doldurmak.
```

### İzin gerekçeleri

| İzin | Gerekçe metni |
|---|---|
| `storage` | Kullanıcının girdiği profil bilgileri, cevapları ve özgeçmiş dosyası yalnızca cihazda (chrome.storage.local) saklanır. Sunucuya hiçbir veri gönderilmez. |
| `activeTab` | Eklenti yalnızca kullanıcı kısayola bastığında ya da açılır penceredeki düğmeye tıkladığında, o anda açık olan sekmeye erişir. Kalıcı content script veya geniş host izni kullanılmaz. |
| `scripting` | Form doldurma kodunun, yalnızca kullanıcının tetiklediği sekmeye o an enjekte edilmesi için gereklidir. |
| `optional_host_permissions: <all_urls>` | İsteğe bağlıdır ve varsayılan olarak kapalıdır. Yalnızca başvuru formu başka bir alan adından gömülü çerçevede gösteriliyorsa ve kullanıcı ayarlardan açıkça izin verirse istenir. |

### Uzak kod (remote code)

**Hayır.** Eklenti hiçbir uzaktan barındırılan kod indirmez veya çalıştırmaz; tüm kod paketin içindedir.

### Toplanan veri türleri (işaretlenecek kutular)

- Kişisel olarak tanımlanabilir bilgiler (ad, adres, telefon, e-posta, kimlik numarası) — **evet**
- Web sitesi içeriği (form alanı yapısı) — **evet**
- Kimlik doğrulama bilgileri (şifre vb.) — **hayır**
- Konum, sağlık, finansal, kişisel iletişim, web geçmişi, kullanıcı etkinliği — **hayır**

Not: Chrome, veriyi **yalnızca cihazda işleseniz bile** beyan etmenizi zorunlu tutuyor
("even when data is processed or stored locally"). Bu yüzden yukarıdaki iki kutu işaretlenir.

### Sertifikasyon kutuları

Üçü de işaretlenir: veriyi onaylanan amaç dışında kullanmıyorum, üçüncü taraflara satmıyorum,
kredi verme amacıyla kullanmıyorum.

### Gizlilik politikası URL'i

Depo GitHub'a yüklendikten sonra:
`https://github.com/<kullanıcı-adı>/basvuru-autofill/blob/main/PRIVACY.md`

Daha resmî görünmesi için GitHub Pages: Settings > Pages > Source: main > /(root).
Sonra adres `https://<kullanıcı-adı>.github.io/basvuru-autofill/PRIVACY.html` olur.
**Link çalışmıyorsa veya politika eksikse doğrudan ret sebebidir (Purple Lithium).**

---

## 4. Görseller

| Varlık | Boyut | Durum |
|---|---|---|
| Mağaza ikonu | 128x128 PNG, içerik 96x96 + 16 px şeffaf boşluk | ✅ `public/icons/icon128.png` |
| Küçük tanıtım görseli (**zorunlu**) | 440x280 PNG | ✅ `store-assets/promo-440x280.png` |
| Ekran görüntüsü | 1280x800 PNG, en az 1 en fazla 5, kenar boşluksuz | ⬜ **sen çekeceksin** |
| Marquee | 1400x560 | opsiyonel, atla |

Ekran görüntüleri bilerek otomatik üretilmedi: mağaza, eklentinin **gerçek** çalışmasını gösteren
kareler istiyor. Demo verisiyle üretilmiş kare yanıltıcı sayılabilir (Yellow Zinc).

**Ekran görüntüsü nasıl çekilir (1280x800):**

1. Eklentiyi yükleyin ve bilgilerinizi girin.
2. Chrome'da F12 > cihaz araç çubuğu (Ctrl+Shift+M) > boyutu **1280x800** yapın.
3. Şu üç kareyi çekin:
   - `test/form.html` sayfası doldurulmuş hali (yeşil çerçeveler ve sağ alttaki özet görünsün)
   - Ayarlar sayfası (kendi bilgileriniz yerine örnek bilgiler yazın, gerçek TC kimlik numarası koymayın)
   - Açılır pencere (profil seçimi ve "Bu sayfayı doldur" düğmesi)
4. DevTools'ta üç nokta > "Capture screenshot" ile tam sayfa değil, görünür alanı çekin.

Ekran görüntüsünde gerçek kişisel veriniz olmasın; örnek veri kullanın.

---

## 4b. İnceleyene not (Test instructions alanı)

```
Eklentiyi kurduktan sonra Ayarlar sayfası açılır ve verilerin yalnızca cihazda saklandığını
belirten onay ekranı gösterilir. Onaylayıp örnek bilgileri girin (ad, e-posta, telefon yeterli).

Test için: depodaki test/form.html sayfasını açın (ya da herhangi bir iş başvurusu formu),
Alt+Shift+F tuşlarına basın. Alanlar dolar, sağ altta özet çıkar.

Eklenti formu GÖNDERMEZ, şifre alanlarını doldurmaz, onay kutusu işaretlemez ve
linkedin.com üzerinde hiç çalışmaz. Hiçbir ağ isteği yapmaz; tüm veriler chrome.storage.local'dadır.
```

---

## 5. Yayın adımları

1. `npm run package` → `basvuru-autofill.zip`
2. Developer Dashboard > **Add new item** > zip'i yükle
3. **Store listing** sekmesi: yukarıdaki metinler, ikon, ekran görüntüleri, kategori, dil
4. **Privacy practices** sekmesi: tek amaç, izin gerekçeleri, uzak kod = hayır, veri beyanları, politika URL'i
5. **Distribution** sekmesi: önce **Unlisted** seç
6. Otomatik yayın kutusunu **işaretleme**: onay gelince kendin yayınla (onaydan sonra yayınlamak için **30 gün** süren var, geçerse taslağa döner)
7. **Submit for review**
8. Onay sonrası kendi hesabınla kur, her şeyi test et, sonra **Public**'e çevir
9. Hesap güvenliği için **Verified uploads** (imzalı yükleme) seçeneğini aç: kişisel veri tutan bir eklentide hesabın ele geçirilip kötü niyetli güncelleme yayımlanması en yıkıcı senaryodur

**İnceleme süresi (resmî):** çoğu eklenti birkaç gün; birkaç haftaya kadar uzayabilir.
Yeni geliştirici + yeni eklenti + hassas veri kombinasyonunda üst banda yakın bekleyin.
Play Store'daki gibi "12 test kullanıcısı × 14 gün" zorunluluğu **yoktur**.

**Yeni yayıncı sınırı:** ilk aşamada en fazla **2 yayımlanmış eklenti** hakkınız var; sonradan
panodan artırım talep edilebiliyor (kriter: mevcut eklentilerin kalitesi ve kullanımı, hesap kıdemi).

**Trader beyanı:** ücretsiz ve kişisel yayında non-trader savunulabilir. Para almaya başladığınız an
trader olursunuz; o zaman **yasal adınız, telefonunuz ve fiziki adresiniz mağaza sayfasında herkese
açık görünür**. Bu, App Store'daki bireysel geliştirici durumunun aynısı; ücretlendirmeye geçmeden
önce hesaba katın.

**Ret gelirse:** panodaki "Appeal" düğmesi. İtirazda duygusal argüman değil, reddedilen maddenin
kodda nerede karşılandığını madde madde gösterin.

---

## 6. En olası ret sebepleri ve bu projedeki karşılığı

| Kod | Sebep | Bu projede durum |
|---|---|---|
| Purple Potassium | İstenip kullanılmayan izin | Üç izin de kodda gerçekten kullanılıyor; `contextMenus` gibi kullanılmayan izin yok |
| Broad host permissions | Geniş host izni | `<all_urls>` zorunlu değil, **opsiyonel**; kalıcı `content_scripts` yok |
| Purple Lithium / Nickel | Gizlilik politikası yok veya veri beyanı eksik | PRIVACY.md + panoda beyan + ürün içi rıza ekranı |
| Red Titanium | Obfuscated kod | Minify kapalı, kaynak okunabilir |
| Yellow Magnesium | Bozuk işlevsellik | `test/form.html` ile doğrulandı; inceleyene aynı sayfa gösterilebilir |
| Yellow Argon | Anahtar kelime spam'i | Açıklamada site/marka listesi ve tekrar yok |
| Red Magnesium | Tek amaç ihlali | Kapsam tek: form doldurma. İleride CV yazarı, başvuru takibi gibi ek modüller **ayrı amaç** sayılır, eklenmemeli |

---

## 7. İleride ücretlendirme (şimdi değil)

- Chrome Web Store'un **kendi ödeme sistemi kapalı** (Şubat 2021'den beri). Mağaza içi satın alma yok.
- Geliştirici Sözleşmesi §3.3: *"ücretsiz indirilen kopyalar için sonradan ücret alamazsınız."*
  Bu yüzden **bugünkü özellikler kalıcı olarak ücretsiz kalmalı**; ücretli katman ancak **yeni**
  değerden kurulur (ör. cihazlar arası şifreli senkron, başvuru geçmişi, çoklu CV).
- Türkiye'den ödeme: Stripe yok, dolayısıyla ExtensionPay kullanılamaz. Uygun seçenekler
  Merchant of Record platformları (Polar, Paddle). Komisyon tipik olarak %5 + sabit ücret bandında.
- Ne zaman: haftalık aktif kullanıcı **3.000-5.000** eşiğinin altında ödeme altyapısı kurmak,
  getirdiği gelirden pahalıya gelir.
- Ölçüm için analiz SDK'sı **eklemeyin**: haftalık aktif kullanıcı sayısını panonun kendisi veriyor.
  Kaldırma anketi için `chrome.runtime.setUninstallURL` izin gerektirmez.
- Profil verisi hiçbir koşulda sunucuya gitmemeli; ücretli katmanda bile sunucuya yalnızca
  opak lisans anahtarı gider.
