# config.json alanları

Şablon (`assets/template.html`) tüm metni ve listeyi bu dosyadan okur. Örnek: `assets/example_config.json`.

| Alan | Tür | Açıklama |
|---|---|---|
| `items` | dizi | **Zorunlu.** Her öğe: `rank` (1 = en iyi), `name`, isteğe bağlı `sub` (alt isim), `rating` + `count` **veya** `stat` (puan yoksa serbest metin, ör. "1.200 m", "1568"), `lat`, `lon` (yalnızca harita içindir, ekrana yazılmaz), `addr` (2 satırlık dizi), `area` (ilçe/semt). |
| `items[].photo` | metin | İsteğe bağlı. WORK içindeki gerçek fotoğraf dosyası (ör. `photos/1.jpg`). Varsa sahnede sağda eğik bir foto kartı çıkar, harita pini sola kayar. Yalnızca lisansı uygun gerçek fotoğraf kullan (ör. Wikimedia Commons CC BY/CC BY-SA); üretilmiş görseli "gerçek fotoğraf" diye kullanma. |
| `items[].photo_credit` | metin | Foto kartının altındaki künye: "Foto: Yazar · CC BY-SA 4.0 · Wikimedia Commons". CC lisansları için zorunlu say. |
| `items[].photo_focus` | [x, y] | Kırpma odağı (0–1). Uzun binalar için `[0.5, 0.2]` gibi üst kısma odaklan. |
| `countdown` | bool | `true` (varsayılan): en büyük sıradan 1'e. `false`: 1'den aşağı. |
| `target_seconds` | sayı | Toplam süre hedefi (varsayılan 60). Sahne süresi = (hedef − giriş − final) / öğe sayısı, en az 3,5 sn. |
| `scene_seconds`, `intro_seconds`, `final_seconds` | sayı | Elle süre vermek için (varsayılan: hesaplanır / 4 / 12). |
| `kicker` | dizi | Girişte üstteki küçük, harf aralıklı satırlar ("GOOGLE HARİTALAR", "PUANLARINA GÖRE"). |
| `title1`, `title2` | metin, dizi | Büyük başlık (krem) ve vurgulu başlık satırları (turuncu). |
| `subtitle` | dizi | Giriş alt yazısı. `{N}` öğe sayısıyla değişir. |
| `map_title`, `map_subtitle` | dizi, metin | Final haritasının başlığı. |
| `count_label` | metin | Sayının yanındaki etiket ("Google değerlendirmesi", "oy", "ziyaretçi"). |
| `rating_max` | sayı | Puan ölçeği (varsayılan 5; ör. 10 üzerinden puanlar için 10). |
| `decimal_comma` | bool | `false` → 4.9; varsayılan Türkçe 4,9. |
| `address_label` | metin | Adres kartı başlığı ("ADRES", "KONUM", "ADDRESS"). |
| `city` | metin | Adres kartında ilçe adının yanına eklenir ("SUR / DİYARBAKIR"). |
| `district_labels` | dizi | `[ad, lat, lon]` — uzak planda gösterilen semt adları. |
| `water_labels` | dizi | `[ad, lat, lon]` — nehir/göl adı (italik, mavi). |
| `closeup` | nesne | İsteğe bağlı. Finalde yoğun bir kümeye yakınlaşma: `lat`, `lon`, `scale` (px/m, 1.5–2.5), `title`, `labels` = `{ "sıra": [dx, dy] }` piksel ofsetleri (negatif dx → etiket sola). |
| `zoom_scale` | sayı | Sahne yakınlaşması (px/m, varsayılan 1.6 ≈ ekran genişliği 675 m). Kırsal/dağınık konular için 0.6–1.0. |
| `palette` | nesne | Renkleri değiştirmek için (aşağıya bakın). |
| `sparks` | bool | Girişteki köz kıvılcımları (varsayılan açık). Yemek dışı konularda `false` olabilir. |
| `street_labels` | bool | Pin çevresindeki sokak adı etiketleri (varsayılan açık). |
| `music` | nesne | İsteğe bağlı müzik ayarı (`scripts/music.py --config` okur): `style` (anadolu, urban, lofi, sinematik, tropikal, akustik, caz; yoksa konu kelimelerinden otomatik), `mode` (hicaz, ussak, rast, huseyni, nihavend, major, minor, dorian, mixolydian, harmonic), `bpm`, `tonic` (Hz), `seed` (farklı varyasyon için). |
| `credit` | metin | Alt künye: veri kaynakları. |
| `outro` | metin | Final kapanış sözü ("Afiyet olsun!", "İyi yolculuklar!"). |

## Palet anahtarları

`ember` (vurgu/rozet), `gold` (1. sıra, yıldızlar), `cream` (ana metin), `red` (pin), `muted` (ikincil metin), `ink` (kart metni),
`land`, `land2` (zemin gradyanı), `bld`, `bldS` (bina dolgu/kenar), `water`, `waterS`, `roadMajor`, `roadMid`, `roadMinor`, `casing` (yol kenarı),
`shade` ("r,g,b" — üst/alt karartma), `cardText` (kart başlıkları).

Hazır palet önerileri:

- **Bazalt & köz (varsayılan)** — yemek, gece hayatı, tarih.
- **Gece mavisi**: `{"land":"#0f1724","land2":"#16233a","bld":"#1f2f48","bldS":"#2b4062","roadMajor":"#5fd3ff","roadMid":"#b9d8ff","roadMinor":"#6a84a8","casing":"#070b12","ember":"#3fb6ff","shade":"8,12,20","cardText":"#1f5f99","water":"#123a5c","waterS":"#5fb0e0"}` — teknoloji, ulaşım, kafe.
- **Yeşil vadi**: `{"land":"#16201a","land2":"#1d2a22","bld":"#2a3a2f","bldS":"#38503f","roadMajor":"#ffd35a","roadMid":"#e7e0b8","roadMinor":"#8fa38f","casing":"#0b120d","ember":"#6fcf5a","shade":"10,16,12","cardText":"#2f7a32"}` — parklar, doğa, spor.
