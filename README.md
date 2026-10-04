# Başvuru Autofill

Başvuru ve kayıt formlarını, bir kez kaydettiğin bilgilerle tek tuşta dolduran Chrome eklentisi.
**Türkçe ve İngilizce alan etiketlerini tanır. Gönder tuşuna her zaman sen basarsın.**

- Veriler yalnızca bu bilgisayarda (`chrome.storage.local`) durur. Sunucu, hesap, telemetri, yapay zekâ çağrısı yok.
- Yalnızca kısayola (**Alt+Shift+F**) ya da araç çubuğundaki düğmeye bastığında çalışır.
- Şifre saklamaz, şifre alanı doldurmaz, onay kutusu işaretlemez, CAPTCHA'ya dokunmaz, formu göndermez.
- `linkedin.com` bilinçli olarak kapsam dışı: LinkedIn kendi sayfasında çalışan eklentileri yasaklıyor, Easy Apply zaten önceki cevaplarını kendi saklıyor.

## Özellikler

| Özellik | Açıklama |
|---|---|
| Türkçe + İngilizce alan tanıma | Etiket, placeholder, `name`/`id` ve `autocomplete` sinyallerini puanlar; Türkçe karakterleri sadeleştirir |
| Çoklu profil | Birden fazla kişi/senaryo için ayrı profil, açılır pencereden seçilir |
| Cevap bankası | "Neden bu pozisyona başvuruyorsunuz?" gibi tekrar eden açık uçlu sorulara hazır cevap; benzer sorularda da eşleşir |
| CV yükleme | Formdaki dosya alanına kayıtlı özgeçmişi ekler |
| Öğretme modu | Doldurma sonrası **Eşleştir** ile "bu alan şudur" dersin; kural o siteye kaydedilir |
| Geri al | Yanlış doldurduysa tek tuşla eski haline döner |
| Renkli işaret | Emin olduğu alan yeşil, tahmin ettiği sarı çerçevelenir |
| Yedekleme | JSON dışa/içe aktarma, tüm verileri silme |

## Kurulum (geliştirici modu)

```bash
npm install
npm run build
```

Chrome'da `chrome://extensions` > **Geliştirici modu** > **Paketlenmemiş öğe yükle** > `dist` klasörü.
İlk kurulumda ayarlar sayfası açılır; bilgilerini girip kaydet.

Kısayolu değiştirmek için: `chrome://extensions/shortcuts`

## Kullanım

1. Başvuru formunun olduğu sayfada **Alt+Shift+F** (ya da araç çubuğundaki simge > "Bu sayfayı doldur").
2. Sağ altta kaç alanın dolduğu yazar; **Geri al** ve **Eşleştir** düğmeleri oradadır.
3. Dolmayan alan olursa **Eşleştir** > alana tıkla > listeden bilgiyi seç. Kural o site için kaydedilir.
4. Formu kontrol et ve **sen** gönder.

## Geliştirme

```bash
npm run dev        # esbuild izleme modu
npm run check      # alan tanıma testleri (72 gerçek form etiketi)
npm run typecheck  # tsc
npm run icons      # ikonları yeniden üret
npm run package    # mağazaya yüklenecek zip'i oluşturur
```

`public/` değişirse `npm run build` çalıştır, sonra `chrome://extensions` sayfasından eklentiyi yenile.
Eklentiyi kurmadan mantığı denemek için `test/form.html` sayfasını yerel sunucuyla açıp
"Demo veriyle doldur" düğmesine bas.

## Yapı

```
src/
  background.ts      kısayol → içerik betiğini aktif sekmeye enjekte eder
  popup.ts           profil seçimi, doldur düğmesi, sonuç
  options.ts         profiller, cevap bankası, CV, öğretilen kurallar, yedekleme
  content.ts         alanları tarar, doldurur, renklendirir, geri alma ve öğretme modu
  core/
    dictionary.ts    Türkçe + İngilizce alan sözlüğü (asıl bakım noktası)
    matcher.ts       sinyalleri puanlar, en spesifik eşleşmeyi seçer
    fill.ts          React/Angular uyumlu yazma, select/radio eşleştirme, etiket bulma
    normalize.ts     Türkçe karakter sadeleştirme, kelime sınırı, soru benzerliği
    inject.ts        sekmeye enjekte etme, linkedin.com koruması
    types.ts         profil şeması, ayar yükleme/kaydetme, v1→v2 göçü
tools/make-icons.mjs bağımlılıksız PNG ikon üretici
```

## Bilinen sınırlar

- Workday tarzı özel açılır listeler (gerçek `<select>` olmayan) doldurulmaz; bu alanları **Eşleştir** ile de öğretemezsin.
- Başka alan adından gömülü çerçeveler için ayarlardan "Tüm sitelerde çerçeve desteği" iznini açman gerekir.
- Çok sayfalı formlarda her sayfada kısayola yeniden basılır.
- Veriler şifrelenmeden saklanır (Chrome profilinin kendi korumasıyla). Ortak kullanılan bilgisayarda dikkat.

## Yayınlama

Chrome Web Store'a yükleme adımları, mağaza metinleri, izin gerekçeleri ve politika notları:
[STORE.md](STORE.md). Paket için `npm run package` (çıktı: `basvuru-autofill.zip`).

Hazır mağaza varlıkları: `public/icons/icon128.png` (96x96 içerik + 16 px şeffaf kenar) ve
`store-assets/promo-440x280.png`. Ekran görüntülerini gerçek eklentiyle sen çekeceksin.

## Gizlilik

Bkz. [PRIVACY.md](PRIVACY.md). Özet: hiçbir veri cihazından çıkmaz. Eklenti ilk açılışta
verilerin nerede saklandığını anlatan bir onay ekranı gösterir (Chrome Web Store'un hassas veri
için zorunlu tuttuğu "açık rıza" şartı).
