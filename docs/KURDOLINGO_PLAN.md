# Kurdolingo — Optimum Web Sitesi Planı

> Kapsam: ürün vizyonu, öğrenme deneyimi, bilgi mimarisi, teknik mimari, güvenlik, tasarım, SEO/büyüme, gelir modeli, metrikler ve fazlara bölünmüş yol haritası.
> Dayanak: Bu repodaki mevcut FerhengAI kodunun incelenmesi (Ekim 2026). Fiyatlar, hedef oranlar ve süreler **test edilecek başlangıç varsayımlarıdır**, kesin rakam değildir.

---

## 0. Özet (TL;DR)

**Kurdolingo**, Kürtçe öğrenmek ve kullanmak için tek adres olmalı. Dört ayağı olsun:

1. **Öğren (Hîn bibe):** Kısa, oyunlaştırılmış ve CEFR'e (A1 → B2) göre dizilmiş dersler.
2. **Ferheng:** Mevcut yapay zekâ sözlüğü. Doğrulanmış bir sözlük veritabanına dönüşmeli ve dersler ile tekrar sistemine bağlanmalı.
3. **Pratik:** Aralıklı tekrar (SRS), YZ ile konuşma partneri, hikâyeler.
4. **Kültür ve topluluk:** Atasözleri, şarkılar, hikâyeler; ana dili konuşanların ses ve içerik katkısı.

**En önemli 7 karar:**

| # | Karar | Neden |
|---|-------|-------|
| 1 | **Önce güvenlik açıklarını kapat** (Bölüm 1.2) | Şu an herkes kendini ücretsiz Pro yapabiliyor, Gemini anahtarı tarayıcıda açıkta duruyor ve başkasının aboneliği iptal edilebiliyor. |
| 2 | **Tek marka:** Kurdolingo çatı marka olsun, *Ferheng* onun sözlük ürünü olsun | Kodda FerhengAI ile Kurdolingo karışık kullanılıyor (`src/constants.ts:276`). |
| 3 | **İlk lehçe Kurmancî, ilk anlatım dili Türkçe ve İngilizce** | Kullanıcı hacmi en büyük grup burada. Soranî 2. fazda, Zazakî 3. fazda gelsin. |
| 4 | **Çekirdek içerik insan tarafından doğrulansın, YZ yalnızca pratikte kullanılsın** | Kürtçe az kaynaklı bir dil. LLM'ler (özellikle Zazakî'de) hata yapıyor. Dersler hatalı olursa güven kaybedilir. |
| 5 | **SPA + HashRouter'dan Next.js'e (SSR/SSG) geç** | Şu an Google hiçbir sayfayı düzgün indeksleyemiyor. Sözlük sayfaları en büyük organik büyüme kaynağı. |
| 6 | **İçerik ve ilerleme verisi PostgreSQL'e taşınsın** (Firebase Auth kalabilir) | Ders ağacı, SRS ve sözlük ilişkisel veri. Ayrıca Firestore'da arama zayıf. |
| 7 | **Dersler herkese ücretsiz olsun, para YZ, reklamsızlık ve kurum planlarından kazanılsın** | Misyonla uyumlu. Gelir bölgesel fiyatlandırma ile çoğunlukla diasporadan gelir. |

---

## 1. Mevcut Durum Tespiti

### 1.1 Mevcut olanlar (korunacak değerler)

- **Stack:** React 19, Vite 6, Tailwind 4, Firebase (Auth + Firestore), Express sunucusu, Gemini API, Polar.sh ödemeleri, Resend e-postaları.
- **Ürün:** 3 lehçe (Kurmancî / Soranî / Zazakî) ↔ 16 dil arası YZ sözlüğü. Cinsiyet (`Masc`/`Fem`) bilgisi, örnek cümle ve transliterasyon var.
- **Arayüz:** 16 dilde UI çevirisi, açık/koyu tema, fiyatlandırma sayfası, kurumsal demo paneli, admin paneli, KVKK veri silme sayfası, çerez bandı.
- **Görsel dil:** "Apple tarzı" cam kartlar ve framer-motion animasyonları. Pazarlama sayfaları için iyi bir temel.

### 1.2 Kritik güvenlik açıkları (P0: lansmandan ÖNCE kapatılmalı)

| # | Sorun | Konum | Etkisi | Çözüm |
|---|-------|-------|--------|-------|
| S1 | Gemini API anahtarı istemci paketine gömülüyor | `vite.config.ts:17-19`, `src/services/geminiService.ts:6` | Herkes anahtarı tarayıcıdan alıp masrafı sana yükleyebilir. | Tüm LLM çağrılarını sunucuya taşı. **Anahtarı hemen yenile (rotate).** |
| S2 | Kullanıcı kendi `plan` ve `dailySearchCount` alanını yazabiliyor | `firestore.rules:141-142` | Konsoldan tek satırla ücretsiz Pro alınabiliyor ve limitler sıfırlanabiliyor. | `plan`, `role`, sayaçlar ve abonelik alanları yalnızca sunucu tarafından yazılabilsin. |
| S3 | Arama limiti istemcide uygulanıyor | `src/components/Dictionary.tsx:174-192` | Limit atlanabiliyor. | Limit sunucuda, API çağrısıyla aynı yerde uygulanmalı (Redis/DB sayacı). |
| S4 | Admin uç noktası, gövdedeki `admin_email` alanına güveniyor | `server.ts:354-358` | Herkes `{"admin_email":"…"}` gönderip istediği hesabı premium yapabilir. | Firebase ID token doğrula ve custom claim ile rol kontrolü yap. Sabit e-posta kullanılmasın. |
| S5 | `/api/cancel-subscription` ve `/api/get-user-subscription` kimlik doğrulamasız | `server.ts:305`, `server.ts:393` | IDOR: başkasının aboneliği iptal edilebilir, ödeme geçmişi okunabilir. | `user_id` gövdeden değil doğrulanmış token'dan alınsın. |
| S6 | Polar webhook imzası doğrulanmıyor | `server.ts:222` (TODO) | Sahte "yenilendi" olaylarıyla bedava abonelik alınabilir. | Webhook imza doğrulaması ve idempotency anahtarı ekle. |
| S7 | `verify-checkout`, checkout ID karşılığında oturum token'ı veriyor | `server.ts:159` | Checkout ID sızarsa hesap ele geçirilebilir. Ayrıca e-postaya göre otomatik hesap açılıyor. | Önce kullanıcı giriş yapsın, ödeme mevcut hesaba bağlansın. Custom token akışı kaldırılsın. |
| S8 | Veri silme e-postasında HTML enjeksiyonu var, rate limit yok | `server.ts:472-476` | Spam ve oltalama aracı olarak kötüye kullanılabilir. | Girdiyi escape et, rate limit ve CAPTCHA (Turnstile) ekle. |
| S9 | `api_usage` koleksiyonuna kimliksiz yazılabiliyor | `firestore.rules:158` | Maliyet raporları kirletilebilir. | Kullanım kaydını yalnızca sunucu yazsın. |
| S10 | Kişisel veri loglanıyor | `server.ts:62`, `server.ts:411` | Tüm istekler ve kullanıcı belgesi loglara düşüyor (KVKK/GDPR riski). | Yapılandırılmış log kullan, kişisel veriyi maskele. |
| S11 | Admin e-postası koda sabit yazılmış | `src/components/AuthModal.tsx:101`, `firestore.rules` | Rol yönetimi kırılgan. | Rolleri custom claims ile yönet. |

### 1.3 Teknik borç ve tutarsızlıklar

- **SEO'ya kapalı:** `HashRouter` kullanılıyor (`src/App.tsx:440`). `/#/pricing` gibi URL'ler indekslenmiyor, sayfa başına meta etiketi de yok.
- **İki farklı paket çözümü aynı anda:** `index.html:10` içinde esm.sh importmap var, Vite paketi de var. Bu AI Studio'dan kalma. İkisi çakışabilir ve sürüm uyuşmazlığı riski taşır.
- **İki ödeme sağlayıcı:** `server/routes/payment.ts` (Stripe) hiçbir yere bağlı değil. Gerçekte Polar kullanılıyor. Ölü kod temizlenmeli.
- **Tutarsız vaatler:**
  - Ücretsiz limit FAQ'de 5/gün, plan kartında 30/gün (`constants.ts:113`), kodda 5/100/150.
  - Sitede "Gemini & Claude" yazıyor ama kodda yalnızca Gemini var (Anthropic SDK'sı yok).
  - "+500 doğrulanmış cinsiyet kuralı" (`constants.ts:252`) diye bir veri kodda yok.
  - "Loved by thousands" referansları (`constants.ts:259`) var.
  - Bunlar hem güven hem de yanıltıcı reklam (tüketici hukuku) riski taşıyor. Gerçek olmayan iddialar kaldırılmalı.
- **Senkronizasyon vaadi tutulmuyor:** FAQ'de "favoriler cihazlar arasında senkronize olur" yazıyor, ama geçmiş ve favoriler yalnızca `localStorage`'da tutuluyor (`src/App.tsx:263`).
- **Çeviri dosyası tek parça:** 16 dilin tüm UI metinleri ~3.800 satırlık tek dosyada (`src/constants.ts`). Hepsi her kullanıcıya indiriliyor. Dil başına tembel yükleme (lazy load) yapılmalı.
- **Önizleme modeli üretimde:** `gemini-3.1-flash-lite-preview` kullanılıyor. Token sayısı karakterden tahmin ediliyor. Önbellek ve değerlendirme (eval) seti yok.
- **Test, CI ve hata izleme yok.**

---

## 2. Vizyon ve Konumlandırma

### 2.1 Tek cümle
> **Kurdolingo: Kürtçenin her lehçesini; telefonda, günde 5 dakikada, ana dili konuşanların sesiyle öğreten ücretsiz platform.**

### 2.2 Neden şimdi, neden biz?
- Büyük dil öğrenme uygulamalarında Kürtçe ya hiç yok ya da çok sınırlı. Bu alan büyük ölçüde boş.
- Kürtçe 30 milyondan fazla kişi tarafından konuşuluyor. Avrupa'da büyük ve gelir düzeyi yüksek bir diaspora var.
- Farklılaştırıcılar:
  - Çok lehçe desteği.
  - Kürtçeye özgü dilbilgisi eğitmenleri (ezafe, cinsiyet, ergatiflik).
  - Çift alfabe (Latin ve Arap kökenli Soranî alfabesi).
  - Sözlük ile dersin birbirine bağlı olması.

### 2.3 Hedef kitle (persona) ve önceliği

| Öncelik | Persona | İhtiyacı | Anlatım dili |
|---|---|---|---|
| 1 | **Türkiye'de Kürtçeyi okulda öğrenememiş Kürt genç/yetişkin** | Ailesiyle konuşmak, okuyup yazabilmek | Türkçe |
| 2 | **Diaspora mirası öğrenicisi (heritage learner)**, Almanya, İsveç, Fransa, İngiltere | Anlıyor ama konuşamıyor. Çocuğuna öğretmek istiyor. | Almanca, İngilizce, İsveççe |
| 3 | **Kürt olmayan öğrenici:** eş, araştırmacı, gazeteci, STK çalışanı | Sıfırdan yapılandırılmış bir kurs | İngilizce |
| 4 | **Öğretmen ve kurumlar:** anadil dersleri, dernekler, Kürdoloji bölümleri | Sınıf yönetimi, ödev verme, materyal | Çeşitli |
| 5 | **Ebeveyn ve çocuk** | Çocuğa uygun, güvenli içerik | Çeşitli |

> **Önemli niş:** Avrupa'daki **anadili dersleri** (Almanya'da *Herkunftssprachlicher Unterricht*, İsveç'te *modersmålsundervisning*) Kürtçe öğretmenlerinin ciddi materyal ihtiyacı olan bir pazar. Kurum planı bu kitleyi hedeflemeli.

### 2.4 Lehçe konusundaki hassasiyet
- Yazım standartlarını açıkça seç ve belgele:
  - **Kurmancî:** Hawar Latin alfabesi (31 harf).
  - **Soranî:** Standart Arap kökenli Kürt alfabesi. Latin transliterasyonu seçenek olarak sunulsun.
  - **Zazakî:** Birden fazla yazım geleneği var. Birini seç, varyantları "bölgesel kullanım" etiketiyle göster.
- Zazakî konuşanların bir kısmı onu ayrı bir dil olarak görüyor. Bu yüzden arayüzde "Kürtçe lehçeleri **ve** Zazakî" gibi kapsayıcı bir dil kullan. Tartışmaya taraf olma.
- Bölgesel varyantları (Botan, Behdînan, Serhed vb.) "yanlış" diye işaretleme. "Alternatif kabul edilen cevap" olarak sisteme ekle.

---

## 3. Bilgi Mimarisi (Site Haritası)

İki katman olsun: **Herkese açık site** (SEO, sunucu tarafında render) ve **uygulama** (giriş yapmış kullanıcı, etkileşimli).

### 3.1 Herkese açık site (SSG/ISR, indekslenebilir)

```
/{locale}/                              → Landing (tr, en, de, ku, ckb, ar, fa …)
/{locale}/kurmanci                      → "Kurmancî öğren" lehçe sayfası
/{locale}/sorani                        → "Soranî öğren"
/{locale}/zazaki                        → "Zazakî öğren"
/{locale}/ferheng                       → Sözlük arama
/{locale}/ferheng/{lehce}/{kelime}      → Kelime sayfası (programatik SEO, en büyük trafik kaynağı)
/{locale}/ferheng/{lehce}/{fiil}/cekim  → Fiil çekim tablosu
/{locale}/ifadeler/{konu}               → "Kürtçe selamlaşma", "Kürtçe sayılar" vb.
/{locale}/gramer/{konu}                 → Ezafe, cinsiyet, ergatiflik, zamanlar…
/{locale}/alfabe/{lehce}                → Alfabe ve telaffuz (sesli)
/{locale}/kultur/…                      → Atasözleri (gotinên pêşiyan), şarkılar, hikâyeler
/{locale}/kurumlar                      → Okullar ve dernekler için
/{locale}/fiyatlar, /sss, /hakkimizda, /blog
/{locale}/gizlilik, /kosullar, /kvkk, /veri-silme
```

- Yerel ayar (locale) alt dizinlerde olsun (`/tr/`, `/en/`, `/de/`). `hreflang` ve dil başına sitemap eklensin.
- Mevcut `ferhengai.com` adresleri 301 yönlendirmesiyle yeni yapıya bağlansın.

### 3.2 Uygulama (giriş sonrası, CSR)

```
/app/learn                → Öğrenme yolu (ünite → beceri → ders)
/app/lesson/:id           → Ders oynatıcı (tam ekran)
/app/review               → Günlük SRS tekrarı ("Bugün 23 kart")
/app/practice             → Hatalarım, zayıf kelimeler, dinleme, konuşma
/app/chat                 → YZ konuşma partneri (senaryolu, Plus)
/app/stories              → Seviyeye göre hikâyeler
/app/ferheng              → Sözlük (+ "tekrar desteme ekle")
/app/leaderboard          → Haftalık lig
/app/profile, /app/settings, /app/achievements
/teach                    → Öğretmen paneli (sınıf, ödev, ilerleme)
/studio                   → İçerik stüdyosu (dilbilimci ve editör CMS'i)
/admin                    → Operasyon (kullanıcı, abonelik, rapor, YZ maliyeti)
```

---

## 4. Öğrenme Deneyimi (Ürünün Kalbi)

### 4.1 Pedagojik çerçeve
- **CEFR hizalı müfredat:** A1 → A2 → B1 → B2. Her seviye ~8–12 ünite, her ünite 4–6 beceri, her beceri 4–6 ders. Bir ders **3–6 dakika** sürsün (10–15 alıştırma).
- **Anlaşılır girdi (comprehensible input):** Her yeni yapı önce bağlam içinde gösterilsin, sonra açıkça açıklansın ("💡 İpucu" kartı), sonra üretim alıştırması gelsin.
- **Aralıklı tekrar:** Her kelime ve yapı bir SRS kartı olsun. **FSRS** algoritması önerilir (açık kaynak, SM-2'den daha isabetli). Günlük tekrar oturumu ayrı bir hedef olarak sunulsun.
- **Yerleştirme sınavı:** Diaspora ve heritage öğrenicileri için şart. Anlayan ama yazamayan biri A1'den başlamak istemez.

### 4.2 Alıştırma türleri

| Tür | Örnek | Faz |
|---|---|---|
| Çeviri seç | "Rojbaş" → ☐ Günaydın ☐ İyi geceler | 1 |
| Kelime bankasıyla cümle kur | "Ben ekmek yerim" → [Ez] [nan] [dixwim] | 1 |
| Eşleştirme | 5 kelime çifti | 1 |
| Dinle ve yaz | Ana dili konuşanın sesi → yazım | 1 |
| Boşluk doldur | "Mal__ min" → **-a** | 1 |
| **Ezafe eğitmeni** 🟢 | *bav**ê** min* (eril) / *mal**a** min* (dişil), çoğul *-ên* | 1 |
| **Cinsiyet eğitmeni** 🟢 | Kelimeyi eril/dişil kutusuna sürükle | 1 |
| **Ergatif geçmiş zaman** 🟢 | *Ez çûm* (geçişsiz) vs. *Min nan xwar* (geçişli → özne eğik halde) | 2 |
| **Alfabe modülü** 🟢 | Soranî harfleri (ڕ ڵ ێ ۆ ە ڤ), Kurmancî ê/î/û/ç/ş/x | 1 (Soranî ile) |
| **Lehçe köprüsü** 🟢 | "Kurmancî *ez* → Soranî *min*": bir lehçeyi bilenlere diğerini öğretir | 3 |
| Konuşma (telaffuz) | Kaydet ve dinle (faz 2), otomatik puanlama (faz 3+) | 2–3 |
| Hikâye ve diyalog | Etkileşimli kısa hikâye, anlama soruları | 2 |
| YZ ile rol yapma | "Pazarda alışveriş", "Nenemle tanışma" | 2 (Plus) |

🟢 = Kürtçeye özgü, rakiplerde olmayan farklılaştırıcı.

### 4.3 Yazma yardımı
- Ekran üstü özel karakter çubuğu: `ê î û ç ş` (Kurmancî) ve tam Soranî klavyesi.
- Esnek değerlendirme: Kullanıcı aksanı atlarsa (*e* yerine *ê*) cevabı "doğru ama yazıma dikkat" diye kabul et. Tamamen yanlış sayma.
- Soranî için Latin ↔ Arap alfabesi geçiş düğmesi.

### 4.4 Ses (en kritik içerik yatırımı)
- Kürtçe TTS kalitesi hâlâ zayıf. **Çekirdek cümleler ana dili konuşanlara kaydettirilmeli.** Hedef: lehçe başına A1 için ~1.500, A2 için ~3.000 cümle. Farklı bölgelerden, kadın ve erkek sesler olsun.
- **Topluluk ses programı:** Gönüllüler cümle okusun, diğerleri doğrulasın (Common Voice modeli). Mozilla Common Voice'taki Kurmancî ve Soranî veri setleri (CC0) ASR/TTS denemeleri için başlangıç kaynağı olabilir.
- Dosyalar Opus/AAC formatında, CDN'den sunulsun. Ders başlamadan önceden yüklensin (prefetch).

### 4.5 Oyunlaştırma (dengeli dozda)
- **Olsun:** XP, günlük hedef, seri (streak) ve seri dondurucu, haftalık ligler (takma adla), başarımlar, ders sonu kutlama animasyonu.
- **Kültürel başarımlar:** "Newroz" (21 Mart haftası etkinliği), "Dengbêj" (100 dinleme alıştırması), "Gotinên Pêşiyan" (50 atasözü) gibi.
- **Maskot önerisi:** **Kew** (keklik). Kürt halk şarkılarında güçlü bir kültürel simge. Yeşil baykuş gibi Duolingo'yu çağrıştıran tasarımlardan kaçının (bkz. Risk R7).
- **Olmasın:** Ücretsiz kullanıcının öğrenmesini cezalandıran "can (heart)" sistemi. Bu, gelir aracı olarak işe yarar ama öğrenmeye zarar verir. Kurdolingo'nun misyonuyla çelişir.

### 4.6 YZ'nin doğru kullanımı

| Kullanım | Değer | Koruma |
|---|---|---|
| "Hatamı açıkla" | Neden yanlış olduğunu öğrenicinin kendi diliyle açıklar | Kural tabanlı ön kontrol (cinsiyet ve ezafe sözlüğü), sonra YZ |
| Konuşma partneri | Senaryolu, seviyeye uygun kelimelerle sohbet | Seviye kelime listesiyle kısıtlanır. Rapor butonu ve "beta" etiketi bulunur. |
| Kişisel alıştırma üretimi | Zayıf kelimelerden yeni cümleler üretir | Yalnızca doğrulanmış kelime ve kalıplardan üretilir |
| Sözlük yedeği | Veritabanında olmayan kelime için öneri sunar | "YZ önerisi, doğrulanmadı" etiketi. İnceleme kuyruğuna düşer. |

- **Değerlendirme (eval) seti:** Lehçe başına ~500 altın örnek (çeviri, cinsiyet, ezafe). Her model veya prompt değişikliğinde otomatik puanlansın. "Gemini mi Claude mu?" sorusu bu veriyle yanıtlansın.
- **Model soyutlama katmanı:** Sağlayıcı değiştirmek tek satırlık iş olsun. Yapılandırılmış çıktı (JSON schema), önbellek ve kullanıcı başına kota olsun.

### 4.7 Onboarding akışı (dönüşüm için kritik)
1. "Hangi lehçeyi öğrenmek istersin?" Emin değilse "Ailen nereden?" mini sorusu lehçe önerir.
2. Anlatım dili (otomatik algılanır).
3. Neden öğreniyorsun? (aile, kültür, iş, seyahat, okul) → içerik vurgusu buna göre ayarlanır.
4. Günlük hedef (5/10/15/20 dk).
5. "Sıfırdan" veya "Seviyemi test et".
6. **İlk ders, KAYIT OLMADAN yapılır.**
7. Ders sonunda "İlerlemeni kaydet" ile kayıt istenir (Google, Apple, e-posta).
8. Bildirim izni, **ilk başarıdan sonra** istenir.

---

## 5. Ferheng (Sözlük): Mevcut Varlığın Dönüşümü

### 5.1 Hedef: "YZ çevirmeni"nden "doğrulanmış sözlüğe"
Bugün her arama canlı bir LLM çağrısı. Bu hem pahalı, hem tutarsız, hem de SEO'ya kapalı. Hedeflenen yapı:

1. **Çekirdek sözlük veritabanı:** Lisansı uygun açık kaynaklarla başla (ör. Wîkîferheng / Kürtçe Vikisözlük, lisansına uyarak). Üzerine editör kürasyonu ekle.
2. **YZ yedeği:** Veritabanında olmayan kelimelerde YZ önerisi sunulsun. Sonuç önbelleğe alınsın, inceleme kuyruğuna düşsün ve onaylanınca kalıcı girdiye dönüşsün.
3. **Topluluk düzeltmesi:** "Bu yanlış / öneri gönder" butonu, moderasyon kuyruğuna gitsin.

### 5.2 Bir sözlük girdisi
```
lemma, lehçe, sözcük türü, cinsiyet (Kurmancî/Zazakî),
ezafe biçimleri (tekil eril/dişil, çoğul), çoğul,
fiil kökleri (geniş zaman / geçmiş zaman), geçişlilik,
anlamlar[] → her anlam için hedef dil karşılıkları + örnek cümleler,
ses dosyası(ları), lehçeler arası karşılıklar, eş/zıt anlamlılar,
köken (opsiyonel), kaynak ve doğrulayan editör, durum (taslak/doğrulanmış)
```

### 5.3 Sözlük ile ders sinerjisi
- Her girdide **"Tekrar desteme ekle"** butonu olsun. Kart SRS'e girer.
- Derste geçen her kelimeye dokunulduğunda sözlük kartı açılsın.
- Kelime sayfasında "Bu kelime **Ünite 3: Aile** dersinde geçiyor → Derse başla" bağlantısı olsun. SEO trafiği bu yolla öğreniciye dönüşür.

### 5.4 Kürtçe arama normalizasyonu
- Aksan katlama: `e`/`ê`, `i`/`î`, `u`/`û`, `c`/`ç`, `s`/`ş`. Kullanıcı "kece" yazsa da *keçê* bulunsun.
- Soranî Arap alfabesi normalizasyonu: ی/ي, ک/ك, ە/ه varyantları, ZWNJ.
- Latin harfle yazılan Soranî araması (*supas* → سوپاس).
- Türkçe kullanıcı alışkanlıkları da hesaba katılsın (ör. "kürtçe ekmek ne demek").

---

## 6. Teknik Mimari

### 6.1 Önerilen stack

| Katman | Öneri | Gerekçe ve alternatif |
|---|---|---|
| Web framework | **Next.js (App Router) + TypeScript** | Herkese açık sayfalar SSG/ISR, uygulama kısmı CSR olur. Mevcut React bileşenleri büyük ölçüde taşınabilir. *Alternatif:* Mevcut Vite SPA uygulama olarak kalır, pazarlama ve sözlük için ayrı bir Astro sitesi kurulur. Bu iki ayrı codebase demek. |
| UI | Tailwind 4 (mevcut) + Radix/shadcn primitives | Erişilebilir bileşenler. Mevcut tasarım dili korunur. |
| Animasyon | `motion` (mevcut) | Ders ekranında hafif tutulmalı. `prefers-reduced-motion` desteklenmeli. |
| Veritabanı | **PostgreSQL** (Neon / Supabase / Cloud SQL) | Ders ağacı, SRS ve sözlük ilişkisel veri. FTS ve `pg_trgm` ile bulanık arama yapılabilir. |
| ORM | Drizzle veya Prisma | Tip güvenli şema ve migration. |
| Kimlik | **Firebase Auth (mevcut) kalsın** | Mevcut kullanıcılar taşınmak zorunda kalmaz. Sunucu, Firebase ID token'ı doğrular. Roller custom claims ile yönetilir. |
| Önbellek / rate limit | Redis (Upstash vb.) | YZ kotaları, limitler, lig sıralamaları. |
| Arama | Postgres FTS + trigram → gerekirse Meilisearch/Typesense | Başlangıçta ayrı bir servis gerekmez. |
| Dosya / ses | Cloudflare R2 / GCS + CDN | Ucuz çıkış trafiği, global erişim. |
| YZ | Sunucu tarafı model katmanı (Gemini / Claude) | Eval setine göre seçilir. Anahtar asla istemciye gitmez. |
| Ödeme | **Polar (mevcut, Merchant of Record)** veya Paddle | KDV ve vergi sağlayıcı tarafından yönetilir. Stripe kodu kaldırılır. Türkiye'de TL ile yerel kart için ileride iyzico eklenebilir. |
| E-posta | Resend (mevcut) | İşlemsel e-postalar ve "günün kelimesi" bülteni. |
| Analitik | PostHog (gizlilik ayarlı, EU bölgesi) | Ürün analitiği, feature flag, A/B testleri. |
| Hata izleme | Sentry | İstemci ve sunucu. |
| Barındırma | Vercel veya Cloud Run (mevcut) + Cloudflare önde | DDoS koruması, edge önbellek. |
| Mobil | **Önce PWA**, tutunma kanıtlanınca React Native (Expo) | PWA ile çevrimdışı ders ve ana ekrana ekleme sağlanır. |
| CI/CD | GitHub Actions | Lint, typecheck, test, preview deploy. |
| Test | Vitest (birim), Playwright (E2E), içerik doğrulama scriptleri | Her alıştırmanın şemaya uyduğu ve sesinin bulunduğu CI'da kontrol edilir. |

### 6.2 Veri modeli (özet)

```
users(id, firebase_uid, display_name, locale, created_at, …)
profiles(user_id, handle, avatar, is_public=false, daily_goal_min, timezone)
entitlements(user_id, plan, source, valid_until)          ← yalnızca sunucu yazar
subscriptions(user_id, provider, provider_sub_id, status, period_end)
webhook_events(provider, event_id UNIQUE, payload, processed_at)  ← idempotency

dialects(code: kmr|ckb|zza, script, orthography)
courses(id, dialect, instruction_lang, cefr_level, status)
units(id, course_id, order, title, cultural_note)
skills(id, unit_id, order, title, grammar_points[])
lessons(id, skill_id, order, kind: learn|practice|story|test)
exercises(id, lesson_id, order, type, payload JSONB, version)
sentences(id, dialect, text, script_alt, audio_id, status, verified_by)
sentence_translations(sentence_id, lang, text, accepted_alternatives[])

lexemes(id, dialect, lemma, pos, gender, forms JSONB, status, source)
senses(id, lexeme_id, gloss_lang, gloss, examples[])
lexeme_links(lexeme_id, other_lexeme_id, kind: dialect_equiv|synonym|antonym)
audio_assets(id, url, speaker_id, region, gender, duration, license)

user_lesson_progress(user_id, lesson_id, completed_at, score, mistakes JSONB)
srs_cards(user_id, item_type, item_id, stability, difficulty, due_at, reps, lapses)
xp_events(user_id, amount, reason, created_at)
streaks(user_id, current, longest, last_active_date, freezes)
leagues(id, tier, week), league_members(league_id, user_id, xp)

classrooms(id, org_id, teacher_id, course_id, join_code)
classroom_members(classroom_id, user_id, role)
assignments(id, classroom_id, lesson_ids[], due_at)
organizations(id, name, seats, plan)

content_reports(id, user_id, target_type, target_id, reason, status)
ai_requests(id, user_id, feature, model, input_tokens, output_tokens, cost, latency_ms, cache_hit)
```

### 6.3 API ilkeleri
- Her uç nokta **Firebase ID token** doğrulamasından geçsin. `user_id` hiçbir zaman gövdeden alınmasın.
- Girdi doğrulaması **Zod** şemalarıyla yapılsın. Hata mesajlarında stack trace ve iç detay dönmesin (şu an `details: error.toString()` dönüyor).
- Ders ilerlemesi **sunucu tarafından puanlansın.** XP ve lig hilesi engellenmiş olur.
- Çevrimdışı tamamlanan dersler kuyruğa alınsın, çevrimiçi olunca senkronize edilsin. Çakışmada sunucu kazanır.

### 6.4 Performans hedefleri
- **Core Web Vitals (p75, mobil):** LCP < 2.5 sn, INP < 200 ms, CLS < 0.1.
- İlk yükte JS < 170 KB (gzip). UI çevirileri dil başına tembel yüklensin. Lehçe ve ders verisi ders başına parça (chunk) halinde gelsin.
- Ders içi geçişler < 100 ms. Sonraki alıştırmanın sesi ve görseli önceden yüklensin.
- Fontlar kendi sunucundan, `font-display: swap` ve alt küme (subset) ile sunulsun. Latin için Inter. Soranî karakterlerini (ڕ ڵ ێ ۆ ە ڤ) **test edilmiş şekilde** kapsayan bir Arap alfabesi fontu (ör. Noto Sans Arabic veya Vazirmatn) seçilsin.

### 6.5 Uluslararasılaştırma ve RTL
- `next-intl` (veya i18next) kullanılsın, metinler dil başına JSON dosyalarında tutulsun.
- **Kürtçe arayüz metinleri makine çevirisiyle değil, ana dili konuşan editörle** hazırlansın. Şu an `translate.ts` ile Gemini'den üretiliyor.
- **RTL:** Soranî, Arapça ve Farsça arayüzler için CSS mantıksal özellikleri (`ms-*`, `me-*`, `ps-*`) kullanılsın. Karışık yönlü içerikte (Türkçe arayüz içinde Soranî cümle) `dir="auto"` ve `<bdi>` kullanılsın.
- Tarih, sayı ve çoğul kuralları için `Intl` API kullanılsın.

---

## 7. Güvenlik, Gizlilik ve Hassasiyet

### 7.1 Teknik güvenlik
- Bölüm 1.2'deki S1–S11 maddeleri kapatılsın. Firestore kalırsa kurallar için **emulator testleri** yazılsın.
- CSP, HSTS ve güvenli çerezler kullanılsın. Gizli anahtarlar Secret Manager'da tutulsun ve periyodik olarak yenilensin.
- Her açık uç noktada rate limit olsun, kayıt ve formlarda Cloudflare Turnstile kullanılsın.
- Bağımlılık taraması için Dependabot, gizli anahtar taraması için GitHub secret scanning açılsın.

### 7.2 Gizlilik (KVKK ve GDPR)
- **Etnik köken özel nitelikli kişisel veridir** (KVKK md. 6, GDPR md. 9). Kullanıcıya "Kürt müsün?" gibi bir soru **asla sorulmasın.** "Neden öğreniyorsun?" sorusundaki "aile" seçeneği bile opsiyonel olsun ve yalnızca kişiselleştirme için kullanılsın.
- **Varsayılan olarak gizli profil** olsun. Liglerde gerçek isim değil takma ad görünsün. Profil herkese açık arama motorlarında indekslenmesin.
- Bazı ülkelerde Kürtçe öğrenmek kullanıcı için hassas olabilir. Hassas bölgelerde **üçüncü taraf reklam izleyicisi kullanılmasın.** Analitik çerezsiz veya onaylı modda çalışsın.
- **Veri silme self-servis olsun:** "Hesabımı sil" butonu tüm veriyi otomatik silsin. Bugünkü manuel e-posta akışının yerini alsın. Bir de veri dışa aktarma (JSON) seçeneği eklensin.
- **Çocuklar:** 13 yaş altı (veya ülkeye göre 16) için ebeveyn onayı veya okul hesabı üzerinden kullanım sağlansın. Çocuk hesaplarında YZ sohbeti ve ligler kapalı olsun.

### 7.3 Erişilebilirlik ve dayanıklılık
- Bazı ülkelerde erişim engeli olasılığı göz önünde bulundurulsun: Cloudflare arkasında barındırma, yedek alan adı planı, PWA ve uygulama mağazası kanalları.
- Siyasi içerikten uzak durulsun. **Kültür, dil ve aile** odağı korunsun. Topluluk alanlarında net moderasyon kuralları olsun.

---

## 8. Tasarım ve UX

### 8.1 Tasarım dili
- **Pazarlama sayfaları:** Mevcut zarif "Apple tarzı" estetik korunabilir.
- **Ders ekranı:** Bambaşka bir mod olsun. Sade, büyük dokunma alanları, tek görev odağı. Cam efektleri ve blur yerine net kontrast kullanılsın. Performans ve odak için bu şart.
- **Renk ve motifler:** Kilim desenleri, Zagros dağları, Newroz ateşi gibi kültürel ve doğa temalı sıcak bir palet. Bayrak renklerini birebir kullanmak bazı bölgelerde siyasi okuma ve erişim riski yaratabilir. Kültürel motif daha kapsayıcı ve güvenli bir tercih.
- **Tasarım token'ları:** Renk, tipografi ve boşluklar için tek kaynak olsun. Açık ve koyu tema desteklensin.

### 8.2 Mobil öncelik
- Kullanıcıların büyük çoğunluğu telefondan gelecek. Her ekran önce 360 px genişlikte tasarlansın.
- Ana aksiyon butonu başparmak bölgesinde (alt kısımda) olsun. Ders içinde haptik ve ses geri bildirimi verilsin, kapatılabilir olsun.
- Düşük bant genişliği modu: Ses önceden indirilsin, görseller isteğe bağlı olsun. Irak ve Suriye gibi bölgelerdeki bağlantı koşulları düşünülsün.

### 8.3 Erişilebilirlik (WCAG 2.2 AA)
- Tüm alıştırmalar klavyeyle yapılabilsin. Ekran okuyucu etiketleri olsun.
- Sesli içerik için transkript, görsel içerik için alternatif metin bulunsun.
- Kontrast oranları ≥ 4.5:1 olsun. Odak halkaları görünsün. Disleksi dostu font seçeneği sunulsun.
- Ses alıştırması yapamayanlar için "Şimdi dinleyemiyorum / konuşamıyorum" seçeneği olsun (atlanır, ceza verilmez).

---

## 9. SEO ve Büyüme

### 9.1 Teknik SEO
- SSR/SSG kullanılsın, temiz URL'ler olsun (HashRouter kaldırılsın). Sayfa başına `title`/`description`/OG görseli (dinamik OG görseli kelime kartı olarak) üretilsin. Canonical, hreflang ve bölünmüş sitemap'ler eklensin.
- Yapılandırılmış veri: `DefinedTerm` (sözlük), `Course`, `FAQPage`, `BreadcrumbList`, `Organization`.
- **İnce içerik riski:** Programatik sayfalar yalnızca **doğrulanmış** girdiler için indekslensin. YZ önerisi olan girdilere `noindex` uygulansın. Aksi halde Google'ın kalitesiz içerik cezası riski doğar.

### 9.2 İçerik ve arama talebi
- Türkçede "kürtçe … ne demek", "kürtçe … nasıl denir", "kürtçe sayılar", "kürtçe selamlaşma" gibi aramalar yüksek hacimli ve uzun kuyruklu. Her biri için sözlük veya ifade sayfası hazırlansın.
- Gramer rehberleri (ezafe, cinsiyet, ergatiflik) kalıcı (evergreen) içerik olarak yazılsın.
- Kültür içerikleri yazılsın: atasözleri, dengbêj geleneği, Newroz, yemek isimleri.

### 9.3 Büyüme kanalları
- **Kısa video:** Günün kelimesi, lehçe karşılaştırmaları ve telaffuz videoları TikTok, Reels ve Shorts'ta paylaşılsın. Bu alan için en güçlü kanal büyük ihtimalle bu.
- **Diaspora dernekleri ve anadili öğretmenleri:** Ücretsiz sınıf hesabı sunulsun. Bu, kurumsal satışa giden yol olur.
- **Paylaşım kartları:** "30 günlük serim 🔥" veya "Kurmancî A1 tamamlandı" gibi görseller tek tıkla paylaşılabilsin.
- **Davet et, ödül kazan:** Arkadaşını getirene 1 hafta Plus verilsin.
- **E-posta ve push:** Günün kelimesi, kırılmak üzere olan seri hatırlatması (kişinin saat dilimine göre, günde en fazla 1 bildirim).
- **Topluluk elçileri programı:** Ana dili konuşan katkıcılar ses kaydı yapsın ve cümle doğrulasın. Karşılığında Plus üyelik ve rozet alsınlar.
- **Kurumsal ortaklıklar:** Kürdoloji bölümleri, kültür enstitüleri ve dernekler. Ortaklık resmileşmeden "ortağımız" ifadesi kullanılmasın.

---

## 10. Gelir Modeli

### 10.1 İlke
> **Öğrenmenin kendisi her zaman ücretsiz.** Para; konfor, YZ ve kurumsal araçlardan kazanılır.

### 10.2 Planlar (fiyatlar test edilecek varsayımlar)

| Plan | İçerik | Başlangıç fiyat varsayımı |
|---|---|---|
| **Ücretsiz** | Tüm dersler, SRS, sözlük (doğrulanmış girdiler sınırsız, YZ önerisi günde ~10), seri ve ligler | 0 |
| **Kurdolingo Plus** | Sınırsız YZ (hata açıklama, konuşma partneri, YZ sözlük), çevrimdışı ders, "Hatalarım" pratiği, birden fazla lehçe ilerlemesi, reklamsızlık (zaten reklam olmaması önerilir), PDF çalışma kâğıtları | AB: ~€6,99/ay, ~€49,99/yıl. **Bölgesel fiyat (PPP):** Türkiye ve Irak için belirgin şekilde daha düşük |
| **Aile** | 6 hesaba kadar Plus | Yıllık ~1,5× Plus |
| **Kurum / Okul** | Sınıflar, ödevler, ilerleme raporları, toplu lisans, SSO (ileride), fatura ile ödeme | Koltuk başı yıllık. Dernekler için indirim |
| **Ömür boyu (erken destekçi)** | Plus'ın sınırlı sayıda ömür boyu versiyonu | Lansmanda nakit akışı ve topluluk oluşturmak için |

### 10.3 Diğer gelir ve finansman kaynakları
- **Sözlük ve çeviri API'si:** Geliştiriciler ve kurumlar için (mevcut Enterprise planındaki "API Access" vaadinin gerçek karşılığı).
- **Hibeler ve vakıflar:** Dil koruma, kültürel miras ve dijital kapsayıcılık fonları. Özellikle Zazakî içeriği için güçlü bir başvuru gerekçesi.
- **Bağış ve "destekçi" rozeti.**
- **Reklam önerilmez:** Bu ölçekte geliri düşük olur, güveni ve deneyimi bozar, hassas bölgelerde izleme riski taşır, çocuk kullanıcılar için de uygun değil. Mevcut AdSense/SidebarAd altyapısı kaldırılsın.

---

## 11. Metrikler

### 11.1 Kuzey Yıldızı metriği
**Haftalık aktif öğrenici (WAL):** Son 7 günde en az 3 ders veya tekrar oturumu tamamlayan kullanıcı sayısı.

### 11.2 Huni ve hedefler (başlangıç varsayımları)

| Metrik | Hedef |
|---|---|
| Landing → ilk ders başlatma | > %35 |
| İlk ders tamamlama | > %80 |
| İlk ders → kayıt | > %40 |
| D1 / D7 / D30 tutunma | > %40 / > %20 / > %10 |
| 7+ günlük seri sahibi kullanıcı oranı | > %15 |
| Ücretsiz → Plus dönüşümü | %3–5 |
| İçerik hata raporu / 1.000 alıştırma | < 2 |
| YZ eval doğruluğu (lehçe başına) | Kurmancî > %90, Soranî > %85, Zazakî ölçülüp izlenir |
| Organik trafik payı | 12. ayda > %50 |

### 11.3 Olay (event) takip planı
`onboarding_step`, `lesson_start`, `lesson_complete{score, duration, mistakes}`, `exercise_answer{type, correct}`, `review_session_complete`, `streak_extended/lost`, `ferheng_search{hit|ai_fallback|miss}`, `add_to_srs`, `paywall_view`, `checkout_start/success`, `content_report`, `ai_request{feature, latency, cost}`.

---

## 12. Yol Haritası

### Faz 0: Acil durum (Hafta 0–2)
- [ ] **Gemini anahtarını yenile.** LLM çağrılarını sunucuya taşı (S1).
- [ ] Firestore kurallarını düzelt: `plan`, `role` ve sayaçlar istemciden yazılamasın (S2, S3, S9).
- [ ] Admin, abonelik ve iptal uç noktalarına token doğrulaması ekle (S4, S5, S11).
- [ ] Polar webhook imza doğrulaması ve idempotency ekle (S6). `verify-checkout` custom token akışını kaldır (S7).
- [ ] Veri silme formuna escape ve rate limit ekle (S8). Log'lardan kişisel veriyi temizle (S10).
- [ ] Doğru olmayan iddiaları kaldır ("Claude", "+500 kural", "thousands", tutarsız limitler).
- [ ] Marka kararını ver: Kurdolingo çatı marka, Ferheng sözlük ürünü. Alan adı ve marka araştırması yap (R7).

### Faz 1: Temel ve kapalı beta (Ay 1–3)
- [ ] Next.js'e geçiş, Postgres şeması, Drizzle/Prisma, CI (lint, typecheck, test), Sentry, PostHog.
- [ ] İçerik stüdyosu (CMS) v1: Ünite, beceri, ders ve alıştırma editörü. Ses yükleme. "Taslak → İnceleme → Yayında" akışı.
- [ ] Ders oynatıcı (6 temel alıştırma türü + ezafe ve cinsiyet eğitmenleri).
- [ ] FSRS tabanlı tekrar, XP, seri, günlük hedef.
- [ ] **Kurmancî A1, ilk 3 ünite** (Türkçe ve İngilizce anlatımlı, ~45 ders, ~400 cümle, tamamı seslendirilmiş).
- [ ] Ferheng v2: Veritabanı ve YZ yedeği, herkese açık kelime sayfaları (yalnızca doğrulanmışlar indekslenir).
- [ ] Onboarding (kayıtsız ilk ders) ve PWA (çevrimdışı ders).
- [ ] 200–500 kişilik kapalı beta: diaspora dernekleri ve sosyal medya bekleme listesinden.

### Faz 2: Herkese açık lansman (Ay 4–6)
- [ ] Kurmancî A1'in tamamı. Soranî A1'e başlangıç (alfabe modülüyle birlikte).
- [ ] Plus aboneliği, bölgesel fiyatlandırma, aile planı.
- [ ] YZ "hatamı açıkla" ve konuşma partneri (beta, Plus).
- [ ] Haftalık ligler, başarımlar, paylaşım kartları, davet sistemi.
- [ ] Öğretmen paneli v1 (sınıf, katılım kodu, ödev, ilerleme).
- [ ] Topluluk ses kaydı ve doğrulama programı.
- [ ] Almanca anlatım dili.

### Faz 3: Ölçeklenme (Ay 7–12)
- [ ] Soranî A1'in tamamı, **Zazakî A1**, Kurmancî A2.
- [ ] Konuşma alıştırmaları (kaydet ve karşılaştır, sonra otomatik telaffuz puanlama denemesi).
- [ ] Etkileşimli hikâyeler.
- [ ] Native uygulama (Expo) ve mağaza lansmanı.
- [ ] Arapça, Farsça ve İsveççe anlatım dilleri.
- [ ] Kurumsal satış: anadili dersleri ve okullar. Faturalama ve toplu lisans.

### Faz 4: Derinleşme (12. aydan sonra)
- [ ] B1 ve B2 seviyeleri, podcast ve dinleme kütüphanesi.
- [ ] "Lehçe köprüsü" kursları (Kurmancî bilenler için Soranî ve tersi).
- [ ] Canlı öğretmen pazaryeri (birebir ders).
- [ ] Herkese açık sözlük ve çeviri API'si.
- [ ] Çocuk modu (ayrı ve güvenli deneyim).

---

## 13. Ekip ve Kaynaklar (Minimum Uygulanabilir Ekip)

| Rol | Yoğunluk | Not |
|---|---|---|
| Full-stack geliştirici | 1–2 tam zamanlı | Next.js, Postgres, altyapı |
| Ürün ve UX tasarımcısı | Yarı zamanlı | Ders oynatıcı ve onboarding kritik |
| İçerik lideri / dilbilimci (lehçe başına) | Yarı zamanlı, Kurmancî ile başla | Müfredat, doğrulama, eval seti |
| Ses sanatçıları | Proje bazlı | Bölge ve cinsiyet çeşitliliği |
| Topluluk ve sosyal medya yöneticisi | Yarı zamanlı | Kısa video, dernek ilişkileri |
| Hukuk (proje bazlı) | Danışmanlık | Marka tescili, KVKK/GDPR, çocuk verisi |

**Altyapı maliyeti (kaba tahmin):** Lansman öncesi ve ilk aylarda düşük düzeyde, aylık birkaç yüz dolar mertebesinde. YZ maliyeti önbellek, kota ve doğrulanmış veritabanı sayesinde kontrol altında tutulur. En büyük kalem altyapı değil, **içerik üretimi** (dilbilimci ve ses kaydı) olacak.

---

## 14. Riskler ve Önlemler

| # | Risk | Olasılık / Etki | Önlem |
|---|---|---|---|
| R1 | İçerik kalitesi ve lehçe tartışmaları | Yüksek / Yüksek | Yazım standardı belgesi, editör onayı, alternatif cevap desteği, "bölgesel kullanım" etiketi |
| R2 | YZ halüsinasyonları (az kaynaklı dil) | Yüksek / Orta | YZ yalnızca pratikte kullanılsın. Eval seti, etiketler, rapor butonu, doğrulanmış sözlük önceliği. |
| R3 | Düşük tutunma | Orta / Yüksek | Kayıtsız ilk ders, kısa dersler, seri ve bildirimler, tutunma metriklerinin haftalık takibi |
| R4 | Düşük ödeme gücü olan bölgeler | Yüksek / Orta | PPP fiyatlandırma, gelirin çoğunun diaspora ve kurumlardan gelmesi, hibeler |
| R5 | Siyasi hassasiyet ve erişim engeli | Orta / Yüksek | Kültür odağı, moderasyon, CDN, yedek alan adı, PWA ve uygulama mağazası |
| R6 | Kullanıcı verisi hassasiyeti (etnik köken çıkarımı) | Orta / Yüksek | Veri minimizasyonu, varsayılan gizli profil, izleyicisiz analitik, self-servis silme |
| R7 | **Marka riski:** "-lingo" eki ve olası maskot benzerliği Duolingo ile karışıklık veya itiraz doğurabilir | Orta / Orta | Marka avukatıyla ön araştırma yap. Özgün maskot (Kew) ve görsel kimlik kullan. Gerekirse alternatif ad belirle. |
| R8 | Tek kişiye bağımlılık (bus factor) | Orta / Yüksek | Dokümantasyon, CI, altyapının kod olarak tutulması (IaC), rollerin custom claims ile yönetilmesi |
| R9 | Mevcut açıklar nedeniyle maliyet patlaması veya veri sızıntısı | **Şu an yüksek** / Yüksek | Faz 0 (bkz. 1.2) |

---

## 15. İlk 10 Somut Adım

1. Gemini API anahtarını **bugün** yenile ve LLM çağrısını `/api/ferheng/search` sunucu uç noktasına taşı.
2. `firestore.rules` içinde kullanıcı belgesinde yalnızca `name`/`locale` gibi güvenli alanların istemciden yazılmasına izin ver.
3. `server.ts` içine Firebase ID token doğrulayan bir middleware ekle ve tüm `/api/*` uç noktalarına uygula.
4. Polar webhook imza doğrulamasını ekle. `verify-checkout` custom token akışını kaldır.
5. Sitedeki doğru olmayan iddiaları ve tutarsız limitleri düzelt.
6. Marka kararını ver (Kurdolingo + Ferheng) ve marka ön araştırmasını yaptır.
7. Kurmancî A1 müfredat taslağını (ünite ve beceri listesi) bir dilbilimciyle çıkar.
8. Postgres şemasını (Bölüm 6.2) kur ve mevcut kullanıcıları taşıma planını hazırla.
9. Ders oynatıcı prototipini 3 alıştırma türüyle yap ve 10 gerçek kullanıcıyla test et.
10. Bekleme listesi sayfasını yayına al. İlk 2 diaspora derneği veya anadili öğretmeniyle görüş.

---

## Ek A: Örnek Ders Akışı (Kurmancî A1, Ünite 2 "Malbat / Aile", Ders 1)

1. **Tanıtım kartı (sesli):** *bav* (baba, eril), *dê* (anne, dişil), *bira* (erkek kardeş, eril), *xwişk* (kız kardeş, dişil).
2. **Resim seç:** 🔊 "dê" → 4 görselden anneyi seç.
3. **İpucu kartı:** "Kurmancîde isimlerin cinsiyeti vardır. 'Benim' derken eril isimlere **-ê**, dişil isimlere **-a** eklenir: *bav**ê** min*, *xwişk**a** min*. Ünlüyle biten isimlerde araya **y** girer: *bira**yê** min*, *dê**ya** min*."
4. **Ezafe eğitmeni:** *xwişk__ min* → **-a**
5. **Kelime bankası:** "Benim babam" → [bavê] [min]
6. **Dinle ve yaz:** 🔊 "Ev birayê min e." (Bu benim erkek kardeşim.)
7. **Eşleştirme:** 4 kelime ile 4 anlam.
8. **Kültür notu:** "Türkçede olduğu gibi Kurmancîde de akrabalık kelimeleri anne ve baba tarafına göre ayrılır: amca *mam*, dayı *xal*, hala *met*, teyze *xaltî*."
9. **Sonuç ekranı:** +15 XP, seri 🔥 4, "4 yeni kelime tekrar destene eklendi."

## Ek B: Mevcut Koddan Taşınacak ve Bırakılacaklar

| Taşınacak / yeniden kullanılacak | Bırakılacak / yeniden yazılacak |
|---|---|
| Tasarım dili, Navbar/Footer/Hero bileşenleri | HashRouter, esm.sh importmap |
| 3 lehçeli sözlük prompt'u ve JSON şeması (sunucu tarafına) | İstemci tarafı Gemini çağrısı |
| UI çevirileri (dil başına JSON'a bölünerek, Kürtçe olanlar editörden geçerek) | `constants.ts` içindeki tek dev sözlük nesnesi |
| Kurumsal demo paneli (gerçek öğretmen paneline evrilir) | Stripe route (kullanılmıyor), AdSense ve reklam altyapısı |
| Polar entegrasyonu (güvenli hale getirilerek) | `verify-checkout` custom token akışı, sabit admin e-postası |
| KVKK, gizlilik ve koşullar sayfaları (güncellenerek) | Manuel e-posta ile veri silme (self-servise dönüşür) |
