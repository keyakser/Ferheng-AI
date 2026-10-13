---
name: harita-geri-sayim-videosu
description: Bir şehirdeki en iyi/en yüksek puanlı yerleri (restoran, kafe, müze, park, plaj, okul, eczane, tarihi yapı vb.) araştırıp doğrulayan ve bunları özgün çizim stilinde gerçek sokak haritası üzerinde gösteren, konuya uygun özgün müzikli (her videoda yeniden bestelenen), dikey (1080x1920, Instagram Reels / TikTok / Shorts) "10'dan 1'e" geri sayım animasyon videosu üreten iş akışı. Kullanıcı "en iyi 10 ...", "top 10", "sıralama videosu", "geri sayım videosu", "reels / shorts / tiktok için video", "haritada göster", "Google Maps puanlarına göre", "şehrin en iyi ... animasyon" gibi bir şey istediğinde — puan kaynağını, şehri veya konuyu açıkça söylemese bile — bu skill'i kullan. Ayrıca bir yer listesini haritalı, konum pinli video/animasyon haline getirme isteklerinde de kullan.
---

# Harita Geri Sayım Videosu

Bir konu + şehir için sıralama listesini **araştırır, doğrular** ve **özgün vektör haritada** konumları gösteren, **müzikli dikey video** üretir.
Akış dört aşamalıdır: Araştırma → Konum doğrulama → Harita & müzik verisi → Render & kontrol.

Bu skill gerçek bir oturumdan çıkarıldı; oradaki düzeltmeler aşağıda "neden" olarak yer alıyor. Kullanıcıya her aşamada kısa durum bilgisi ver.

## 0. Hazırlık

- Çalışma klasörünü scratchpad'de aç (`WORK=<scratchpad>/<konu-sehir>`). Skill dosyaları: `SKILL_DIR=.claude/skills/harita-geri-sayim-videosu`.
- Gereken araçlar: `python3` + `pip install pyarrow shapely numpy`, `node` + Playwright (Chromium), `ffmpeg`. Eksikse kur; Playwright tarayıcısını indirmeye çalışmadan önce `/opt/pw-browsers` gibi hazır kurulum var mı bak.
- Kullanıcının istekleri netleşmemişse makul varsayılanları kullan ve sonda söyle: 10 öğe, 60 sn, dikey, geri sayım (10→1), puanı eşit olanlarda değerlendirme sayısı fazla olan önde.

## 1. Araştırma (puan ve sayı)

Google Haritalar'a doğrudan erişim çoğu ortamda ağ politikasıyla engellidir ve sayfa kazıma güvenilmezdir. Bu yüzden:

1. Google verisini yansıtan siteleri **WebSearch** ile tara (WebFetch de engelli olabilir; arama özetleri yeterli bilgi verir). Türkiye için: menuburada.com (Google puan + "reyting" sayısı yansıtır), restoranim.net, restaurantguru.com, wanderlog.com, tripadvisor, yandex haritalar, foursquare. Başka ülkelerde benzer dizinleri bul.
2. Geniş tarama işini bir **arka plan alt ajanına** ver (çok sayıda arama gerekir; bağlamı korur). Ondan isim | puan | sayı | adres | kaynak tablosu iste ve "uydurma, bulamazsan 'bulunamadı' yaz" de.
3. **Tek bir kaynağı esas al** ve tüm listede onu kullan; kaynaklar arasında sayılar çok farklıdır (aynı yer için bir sitede 190, diğerinde 8.300 değerlendirme görülebilir). Karışık kaynak, sıralamayı anlamsızlaştırır.
4. Kullanıcının eşiklerini uygula (ör. "en az 200 değerlendirme"). Eşiği geçen öğe sayısı istenen sayıdan azsa **eksik sayıyla devam et** (ör. 8'den 1'e) ve kullanıcıya eşiğin hemen altında kalanları öner. Eşiği esnetip listeyi kendiliğinden doldurma.
5. Sıralama: puan (yüksek → düşük), eşitlikte değerlendirme sayısı.

**Yorum/alıntı:** Ziyaretçi yorumlarını ekranda göstereceksen yalnızca gerçekten gördüğün metinden al; arama özetlerinden gelen ifadeleri "özet/çeviri" olarak etiketle. Asla yorum uydurma. Kullanıcı istemedikçe yorum ekleme.

## 2. Konum doğrulama

Pinler haritada metre hassasiyetinde görüneceği için her adres ve koordinat doğrulanmalı.

1. Şehrin sınır kutusunu belirle (tüm adayları kapsasın, ~15×12 km yeter) ve Overture verisini indir:
   ```bash
   python $SKILL_DIR/scripts/fetch_overture.py --bbox LON_MIN LAT_MIN LON_MAX LAT_MAX --out $WORK
   ```
   (Büyük metropollerde kutuyu küçült veya `--skip-buildings` kullan.)
2. Her aday için Overture yer kayıtlarında ara:
   ```bash
   python $SKILL_DIR/scripts/find_places.py $WORK/places.json "isim|regex"
   python $SKILL_DIR/scripts/find_places.py $WORK/places.json --phone "0536 070 86"
   ```
   **Telefon eşleşmesi** (dizin sitesindeki telefon = Overture kaydındaki telefon) en güçlü kanıttır. İsim benzer ama şube farklı olabilir; adres ve ilçeyi karşılaştır.
3. Overture'da yoksa WebSearch ile adres + koordinat ara (dizin siteleri koordinat yayınlar) ve sokak verisiyle tutarlılığını kontrol et.
4. Doğrulanamayan, kaynakları çelişen veya "geçici/kalıcı kapalı" görünen yeri listeden çıkar ya da açıkça işaretle; bunu kullanıcıya söyle.
5. Kapı numarası gibi küçük çelişkileri sonuç notunda belirt.

## 3. Harita, müzik ve config

```bash
python $SKILL_DIR/scripts/build_mapdata.py $WORK $WORK/mapdata.json
cp $SKILL_DIR/assets/template.html $WORK/
# config.json'u yaz (aşağıya bak), sonra konuya uygun müziği üret:
python $SKILL_DIR/scripts/music.py --config $WORK/config.json --out $WORK/music.wav
```

- **config.json**: `assets/example_config.json`'u örnek al; tüm alanlar `references/config.md`'de. Süre: `target_seconds` (varsayılan 60) → müzik süresi de bu olmalı (`intro + sahne×N + final`; şablon `TOTAL`'ı buna göre hesaplar).
- **Harita stili**: Şablon, uydu görüntüsü değil kendi çizdiği vektör stilini kullanır (zemin, binalar, yol hiyerarşisi, su). Konuya uygun paleti `palette` ile seç (`references/config.md` içinde hazır paletler var). Kullanıcı açıkça uydu görüntüsü istemedikçe uydu kullanma.
- **Koordinatlar ekrana yazılmaz**; sadece pin konumu içindir. Adres kartı mahalle/cadde/sokak/no ve ilçe gösterir.
- `district_labels` ile 3–6 semt adı, `water_labels` ile nehir/göl adı ekle (uzak planda görünür).
- Birkaç öğe birbirine 300 m'den yakınsa `closeup` ekle (final yakın planı) ve etiket ofsetlerini çakışmayacak şekilde ver.
### Müzik: her videoda bağlama uygun ve özgün

Müzik videonun duygusunu taşır; ciğerci videosunda saz + darbuka, gökdelen videosunda elektronik ritim gibi. Aynı parçayı her videoda kullanmak izleyicide "şablon" hissi bırakır. Bu yüzden müzik **her video için config'ten yeniden üretilir**:

- **Stil seçimi** — `music.py` başlık, alt başlık ve öğe adlarındaki kelimelerden stili otomatik seçer ve çıktıda nedenini yazar. Seçimi konuya göre **sen değerlendir**: kelime eşleşmesi yanlışsa (ör. "tarihi kahvehaneler" lofi değil anadolu olmalı) `config.json` içine `"music": {"style": "..."}` yaz. Stiller (`--list-styles`):

  | Stil | Ses dünyası | Uygun konular |
  |---|---|---|
  | `anadolu` | saz/bağlama, dem, darbuka/def; Hicaz, Uşşak, Rast, Hüseyni | yöresel yemek, çarşılar, Doğu/Güneydoğu şehirleri, geleneksel mekânlar |
  | `urban` | kick/hat, synth bas, arpej | gökdelenler, teknoloji, AVM, gece hayatı, modern şehir |
  | `lofi` | elektrik piyano, boom-bap, plak cızırtısı | kafeler, kitapçılar, kütüphaneler, pastaneler |
  | `sinematik` | yaylılar, timpani, bakır | müzeler, kaleler, antik kentler, anıtlar, tarihi yapılar |
  | `tropikal` | marimba, shaker, offbeat | plajlar, koylar, yaz/tatil mekânları |
  | `akustik` | gitar arpeji, hafif perküsyon | parklar, doğa, yürüyüş, göller |
  | `caz` | walking bas, ride, piyano | şık restoranlar, barlar, oteller |

- **Özgünlük** — tohum (seed) başlık + öğe adlarından türetilir; melodi motifleri, ton, dizi/makam ve tempo her videoda değişir. Aynı konu için ikinci bir sürüm istenirse `"music": {"seed": 42}` ile farklı bir tohum ver.
- **Görüntüyle senkron** — tempo, her sahne çift sayıda vuruş sürecek şekilde ince ayarlanır; her sahne geçişinde vurgu (darbuka geçişi / darbe / zil), girişte yükselen ses, finalde ek katman ve 2,5 sn kapanış vardır. Bu yüzden müziği **config son haline geldikten sonra** üret (öğe sayısı veya süre değişirse yeniden üret).
- İnce ayar: `"music": {"style": "anadolu", "mode": "ussak", "bpm": 96}`. Kullanıcı belirli bir duygu/tempo isterse ("daha sakin", "daha hareketli") stil veya bpm ile karşıla.
- Çıktı satırındaki stil/makam/bpm bilgisini sonuç mesajında kısaca kullanıcıya söyle.

## 4. Render ve kontrol

1. **Önce önizleme kareleri** (tam render ~2–3 dk sürer, önce hataları yakala):
   ```bash
   node $SKILL_DIR/scripts/render.mjs $WORK stills 3,8,20,35,50,58
   ```
   Kareleri birleştirip (ffmpeg `hstack`) Read ile incele. Kontrol listesi:
   - Metin taşması/çakışması yok (uzun isimler küçülür; adres kartı, rozet, taç, ilerleme çubuğu).
   - Instagram güvenli alanı: önemli içerik üst ~170 px ve alt ~320 px dışında.
   - Pin doğru sokakta; sokak etiketleri okunur ve üst üste binmiyor.
   - Final haritasında tüm pinler kadrajda, lejant ve kapanış yazısı çakışmıyor.
2. Tam video:
   ```bash
   node $SKILL_DIR/scripts/render.mjs $WORK video $WORK/raw.mp4
   ```
3. **Sesi doğrula** (bir kullanıcı "müzik yok" diye şikâyet etmişti; çoğu zaman oynatıcı sessiz başlatıyordu ama emin olmak gerekir):
   ```bash
   ffprobe -v error -show_entries stream=codec_type,codec_name,duration -of compact raw.mp4
   for s in 1 20 40; do ffmpeg -ss $s -t 2 -i raw.mp4 -vn -af volumedetect -f null - 2>&1 | grep mean_volume; done
   ```
   Ortalama ≈ -12 dB olmalı; -30 dB'den düşükse müzik sorunlu.
4. **Boyut**: Dosya gönderme sınırı genelde 30 MB'tır. Gerekirse iki geçişli sıkıştır:
   ```bash
   ffmpeg -y -i raw.mp4 -c:v libx264 -preset slow -b:v 3200k -pass 1 -an -f null /dev/null && \
   ffmpeg -y -i raw.mp4 -c:v libx264 -preset slow -b:v 3200k -maxrate 5000k -bufsize 8000k -pass 2 -pix_fmt yuv420p -c:a copy -movflags +faststart final.mp4
   ```
5. Videoyu kullanıcıya gönder (indirilebilir ek olarak; uygulama içi önizleme sesi kapalı başlatabilir — bunu da söyle).

## Sonuç mesajı

Kısa tut ve şunları içer:
- Sıralama tablosu: sıra | isim | puan | sayı | adres.
- Neler dışarıda kaldı ve neden (eşik altı, doğrulanamadı, kapalı).
- Veri kaynakları ve sınırlamalar (ör. dizin sitesinin eski veri yansıtabileceği, aramayla erişilemeyen sayfalar).
- Belirsiz konumlar (tek kaynak, çelişen kapı numarası).
- Kaynak bağlantıları.

## Uyarlama ipuçları

- **Puansız listeler** (en yüksek binalar, en eski camiler): `rating` yerine `stat` kullan ("1568", "245 m").
- **Dağınık konular** (bir ilin ilçeleri, plajlar): bbox'u büyüt, `--skip-buildings`, `zoom_scale` 0.4–0.8.
- **Yatay video** istenirse: `VW=1920 VH=1080` ile render edilebilir ama şablon dikey yerleşime göre tasarlandı; yatay için yerleşim koordinatlarını (üst bilgi, adres kartı, lejant) yeniden düzenle.
