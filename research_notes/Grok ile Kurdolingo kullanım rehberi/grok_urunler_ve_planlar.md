# Grok tüketici ürünleri, modeller ve planlar (durum: 13 Kasım 2026)

Research date: 2026-11-13. Every fact carries the date of the source. Items marked **[STALE?]** could only be confirmed from 2025 or early-2026 material. Items marked **[3P]** come only from third-party blogs/trackers, not from xAI/X primary pages.

Access notes for the writer: x.ai/news/x-subscription and docs.x.ai/release-notes were fetched directly (primary). x.ai/blog/grok-4-6, x.ai/legal/privacy-policy, help.x.com/using-x/about-grok, docs.x.ai/x-subscription/pricing.md and thenewstack.io returned 403/404 to the fetcher, so those topics rest on search snippets and secondary sources.

Terminology warning: in 2026 there are two different things with similar names.
- **@grok on X** = the reply account you tag under a post ("Ask Grok").
- **Grok Bot** = a separate agent product launched Aug 2026 ("durable AI teammates on a persistent cloud computer"). It is not the @grok reply account.
Also: the company is referred to as **SpaceXAI** in most press from mid-2026; one vendor source says SpaceX acquired xAI on 2 Feb 2026 (single unverified source). The domains are still x.ai / grok.com.

---

## 1. Which Grok models are current? What changed during 2026?

### Takeaway
The newest model is **Grok 4.7 (released 21 Sep 2026; 500k context; $2/$6 per 1M tokens)**, preceded by Grok 4.6 (12 Aug 2026), Grok 4.5 (8 Jul 2026) and Grok 4.20 (Mar 2026). In the consumer app, a November 2026 review still lists Grok 4.6 as the paid default, with 4.7 confirmed only for API/Cursor/Grok Build; Grok 5 is not released.

### Cited Findings
- **Grok 4.7** (`grok-4.7`), Sept 2026 release note: 500k context window; text + image input, text output; pricing per 1M tokens input/cached/output $2 / $0.50 / $6 below 200k prompt tokens, $4 / $1 / $12 above; reasoning effort low/medium/high (default)/xhigh. — [xAI release notes](https://docs.x.ai/release-notes) (fetched 2026-11-13)
- Grok 4.7 release date 21 Sep 2026; positioned for coding and knowledge work; same price as 4.6; available via API, Cursor, Grok Build, OpenRouter, Vercel, Cloudflare; CursorBench 4.0 46.3% vs 40.4% for 4.6; Terminal-Bench 4.0 38.0% vs 20.3% (vendor's own testing); "entirely new safeguard stack". — [Pulse 2.0](https://pulse2.com/spacexai-launches-grok-4-7-with-improved-coding-knowledge-work-and-ai-safety-capabilities/), [Unite.AI](https://unite.ai/spacexai-releases-grok-4-7-for-coding-and-knowledge-work), [x.ai blog](https://x.ai/blog/grok-4-7) (search-result summaries, Sept 2026)
- **Grok 4.7 Fast**: same model at 2x token rates (1.5x long-context); only in Cursor and Grok Build, not the public API (Sept 2026). — [xAI release notes](https://docs.x.ai/release-notes)
- **Grok 4.6**: released 12 Aug 2026; 500k context; text+image in, text out; same pricing as 4.7; built for long-running agents and interactive/visual work. — [xAI release notes](https://docs.x.ai/release-notes); [SiliconANGLE, 12 Aug 2026](https://siliconangle.com/2026/08/12/spacexai-releases-flagship-grok-4-6-model-advanced-reasoning-capabilities/)
- **Grok 4.5**: released 8 Jul 2026; $2 in / $6 out per 1M; made available in the API console for EU users in July 2026. — [Axios, 8 Jul 2026](https://axios.com/2026/07/08/spacexai-grok-new-model); [xAI release notes](https://docs.x.ai/release-notes)
- **Grok 4.20 and Grok 4.20 Multi-agent** went live March 2026. — [xAI release notes](https://docs.x.ai/release-notes)
- **Grok Build 0.1** coding model + Grok Build beta (TUI/headless coding agent), May 2026. — [xAI release notes](https://docs.x.ai/release-notes)
- Consumer app lineup per a review page marked "Updated November 2026": Grok 4.6 = default for paid users; Grok 4.3 (Apr 2026) kept for 1M context and native video input; Grok 4 Heavy (multi-agent) for SuperGrok Heavy only; Grok 4.7 on API/Cursor/Build with no stated app date; Grok 5 "in training, not released". **[3P]** — [The AI Rankings](https://theairankings.com/xai/grok/)
- Voice models: Grok Voice 1.0 (Apr 2026), 2.0 (Jul 2026), **Grok Voice 3.0** (Oct 2026, `grok-voice-latest` points to it; 2.0 deprecated). Speech-to-Text GA April 2026 with "transcription in 25 languages"; Grok Voice Transcribe 2.0 default from Sept/Oct 2026. Text-to-Speech GA March 2026; Custom Voices (voice cloning) May 2026. — [xAI release notes](https://docs.x.ai/release-notes)
- Imagine models: video generation + revamped image generation Jan 2026; `grok-imagine-video-1.5` (native 1080p, text/image/reference-to-video) Jul 2026; `grok-imagine-image-2.0` with quality levels (Aug 2026); `grok-imagine-image-quality`/`-pro` retired Nov 2026. — [xAI release notes](https://docs.x.ai/release-notes)
- OpenRouter's `grok-latest` alias was reported pointing at Grok 4.6 in one search snapshot (undated; possibly stale given 4.7). — [OpenRouter mirror listing](https://api3.shopot.ai/~x-ai/grok-latest)

### Inferences
- 2026 cadence was roughly one flagship point-release every 4-8 weeks from July (4.5 -> 4.6 -> 4.7), all at the same $2/$6 price; planning around a specific version name is fragile, use `-latest` style aliases where offered.
- The app's model picker likely lags the API; whether a consumer plan "has 4.7" in the app as of Nov 2026 is unconfirmed.

### Gaps
- Could not fetch x.ai/blog/grok-4-6 or grok-4-7 (403), so there are no primary benchmark or app-availability statements.
- No source gives Kurdish (Kurmancî/Soranî) quality benchmarks for any Grok model. The list of the 25 STT languages was not retrieved; whether Kurdish is among them is unknown (the search found no mention of Kurdish anywhere).
- Context window for Grok 4.5 not stated; Grok 4.3 details (Apr 2026, 1M context) rest on a single third-party page.

---

## 2. Consumer plans, prices, inclusions, regional pricing

### Takeaway
On **12 Oct 2026** xAI replaced the SuperGrok / X Premium ladder for new buyers with **"The X Subscription"**: Free, Plus $8, Premium $30, Super $100, Ultra $200 per month, with one shared weekly usage pool across Grok, the Grok tab on X and Cursor. Legacy SuperGrok (Lite $10 / $30 / Plus $100 / Heavy $300) and X Premium / Premium+ continue only for existing subscribers. No Turkey- or Europe-specific price list was found.

### Cited Findings
**The X Subscription (official announcement, 12 Oct 2026)**
- Free $0: limited daily Grok access, starter Cursor coding allowance, standard X. Plus $8/mo: base usage, checkmark, creator tools, fewer X ads. Premium $30/mo: 4x Plus usage; "covers SuperGrok, Cursor Pro and X Premium+" (stated as $90/mo combined before). Super $100/mo: 15x. Ultra $200/mo: 50x. — [x.ai/news/x-subscription](https://x.ai/news/x-subscription)
- Paid plans share one pool of Grok model usage across the Grok apps, the Grok tab on X and Cursor; overage is billed at API list prices via top-ups; third-party models in Cursor on Premium and above. — [x.ai/news/x-subscription](https://x.ai/news/x-subscription)
- Existing SuperGrok, Cursor and X Premium subscribers may keep plan, price and features or switch (prorated refund). Rollout "globally over the next few days"; no regional prices listed. — [x.ai/news/x-subscription](https://x.ai/news/x-subscription)
- **Teams**: Premium, Super, Ultra at the same per-seat prices ($30/$100/$200), with SSO, admin controls, consolidated billing, usage analytics, SOC 2; Enterprise via sales with a single shared usage pool. — [x.ai/news/x-subscription](https://x.ai/news/x-subscription)
- Annual prices $80 / $300 / $1,000 / $2,000; pool refreshes weekly, absolute size unpublished; when the pool runs out paid features pause until reset while free chat and voice continue; Plus has chat, voice, Imagine images, Build, API access but **no video and no Grok Bot**; Premium adds video, Grok Bot, latest models; Super adds priority at peak; Ultra earliest access. SuperGrok closed to new customers. Prices checked 23 Oct 2026. **[3P]** — [Robo Rhythms](https://www.roborhythms.com/?p=35730)
- Same tier table confirmed with prices "checked November 11, 2026"; that page also lists a "Business $30/seat" row and an unpriced "Lite" sampler tier. **[3P]** — [Krater](https://krater.ai/blog/grok-pricing)
- Usage is shown as a percentage of a weekly quota, not a message count; Grok, Cursor first-party models and Grok Bot draw from the same quota, no rollover, reset time unpublished (20-28 Oct 2026). **[3P]** — [SmartScope](https://smartscope.blog/en/blog/x-subscription-premium-grok-bot-cursor-grok-cli-2026/)
- A mid-October 2026 user thread reported roughly half the previous Imagine video allowance after the switch; xAI published no per-video figure. **[3P, anecdotal]** — [Robo Rhythms](https://www.roborhythms.com/?p=35730)

**Legacy plans (existing subscribers only, as of Oct 2026)**
- SuperGrok Lite $10, SuperGrok $30, SuperGrok Plus $100, SuperGrok Heavy $300 per month per the App Store listing. **[3P]** — [Robo Rhythms](https://www.roborhythms.com/?p=35730)
- X Premium $8/mo and X Premium+ $40/mo (Premium+ bundling SuperGrok-level access) were the pre-October prices. **[3P]** — search summary of [ai-toolbox](https://www.ai-toolbox.co/grok-models/grok-pricing-plans-api-2026), [Krater](https://krater.ai/blog/grok-pricing)
- Since June 2026 paid plans no longer had separate daily limits for chat, Imagine, voice and Build (moved to pooled usage). **[3P, single search snippet]** — [buildfastwithai](https://www.buildfastwithai.com/blogs/supergrok-explained-pricing-limits-is-it-worth-it-2026)

**Free tier limits (conflicting)**
- ~10 prompts per 2 hours on Grok 4-class chat, DeepSearch 10/day, limited Think, basic voice, **no image generation** (removed from Free 19 Mar 2026). **[3P]** — [The AI Rankings](https://theairankings.com/xai/grok/); another source cites 50 messages / 2 hours on grok.com — [search summary, techjacksolutions](https://techjacksolutions.com/ai-tools/grok/grok-pricing/). Robo Rhythms (Oct 2026) says Free still has "limited chat, images, and Grok Build" and that free Imagine access "has switched on and off by account through 2026" — [Robo Rhythms](https://www.roborhythms.com/?p=35730).

**API (separate billing)**
- grok-4.7 $2 / $6 per 1M tokens; batch 20% off; voice speech-to-speech $0.08/min; Imagine from $0.02/image and $0.02/s video (cheapest) to $0.04/image and $0.08/s (recommended). **[3P for voice/Imagine figures]** — [Robo Rhythms](https://www.roborhythms.com/?p=35730); token prices confirmed by [xAI release notes](https://docs.x.ai/release-notes)

### Inferences
- For a small team the relevant purchase today is X Subscription **Premium ($30/seat)**: lowest tier with Grok Bot, video and "latest models", and it carries the X Premium+ benefits. Plus ($8) is enough if the only need is the checkmark plus higher Grok chat limits (and, per section 4, the right to tag @grok).
- Because limits are an opaque weekly percentage, cost predictability for heavy use (video, routines) is poor; the API is the predictable-cost route.

### Gaps
- **No Turkey (TRY) or EU (EUR, VAT) price list found.** The official page shows USD only. Historically X Premium had localized and app-store-specific prices, but nothing dated 2026 was found for the new tiers. Must be checked in-app from a Turkish/EU account.
- The official docs page docs.x.ai/x-subscription/pricing returned 404 to the fetcher; the per-tier feature matrix above is from third parties.
- Whether "Plus" under the new scheme includes @grok tagging rights is not explicitly stated anywhere found (it carries the X Premium checkmark, so probably yes).
- Absolute message/DeepSearch/voice-minute caps for the new tiers are unpublished.

---

## 3. Features and how they work

### Takeaway
The Grok app/web bundles chat with reasoning modes, DeepSearch/DeeperSearch over web + X, voice mode with personalities and camera, Imagine image/video, Projects, memory, file upload with a code interpreter, Companions, and (since Aug 2026) the Grok Bot agent product with scheduled "routines". Most per-feature details for late 2026 come from third-party reviews, and tier gating was reshuffled by the October 2026 plan change.

### Cited Findings
- **DeepSearch / DeeperSearch**: multi-step research agent that searches web, X and news and synthesizes; available on all tiers with limits (Free 10/day; legacy Premium+/SuperGrok 20 per 2 h); DeeperSearch preset uses 40+ sources. **[3P, Nov 2026 page; quotas refer to legacy plans]** — [The AI Rankings](https://theairankings.com/xai/grok/)
- **Reasoning modes**: Think (limited on Free), Big Brain (SuperGrok), Heavy = Grok 4 Heavy multi-agent (SuperGrok Heavy). API-side reasoning effort low/medium/high/xhigh on 4.6/4.7. — [The AI Rankings](https://theairankings.com/xai/grok/); [xAI release notes](https://docs.x.ai/release-notes)
- **Real-time X search**: Grok has live access to posts, trends, sentiment; API Web Search gained image search in May 2026. — [The AI Rankings](https://theairankings.com/xai/grok/); [xAI release notes](https://docs.x.ai/release-notes)
- **Voice mode**: real-time voice with personalities (Helpful, Unhinged, Genius, Zen Master, ...), basic voice on Free, Grok Vision (camera sharing). **[3P]** — [The AI Rankings](https://theairankings.com/xai/grok/)
- **Voice languages**: April 2025 the app voice mode added Turkish, French, Hindi, Japanese, Spanish alongside English **[STALE? 2025]** — [MacRumors, 23 Apr 2025](https://www.macrumors.com/2025/04/23/grok-ai-vision-voice-features-ios-app/). 2026 API-side: STT "25 languages" (Apr 2026) — [xAI release notes](https://docs.x.ai/release-notes); TTS reported as 20+ languages, 21 new voices in July 2026 with "25+ languages" in one report vs 20 in official docs (conflict noted by the search summary) — [TestingCatalog](https://www.testingcatalog.com/spacexai-launches-21-new-grok-voices-on-xai-console.md), [xAI voice guide](https://docs.x.ai/docs/guides/voice). **No source mentions Kurdish.**
- **Grok Imagine**: images (Aurora / image-2.0) and short videos with audio (video-1.5, native 1080p on API). Restricted to paid users 9 Jan 2026 after the deepfake scandal; removed from Free 19 Mar 2026; tighter moderation for real people. Under X Subscription, video starts at Premium; 720p falls back to 480p after the tier cap. — [The AI Rankings](https://theairankings.com/xai/grok/); [PiunikaWeb, 19 Mar 2026](https://piunikaweb.com/2026/03/19/grok-imagine-locked-behind-premium-subscription/); [Robo Rhythms](https://www.roborhythms.com/?p=35730)
- **Projects**: persistent context across chats, file grouping, project-specific custom instructions (legacy: SuperGrok; another source says a reduced version on Free). **[3P, conflicting]** — [The AI Rankings](https://theairankings.com/xai/grok/); [search summary, techjacksolutions](https://techjacksolutions.com/ai-tools/grok/how-to-use-grok/)
- **Memory**: cross-session memory launched April 2025, stored server-side; described as inconsistent in testing; availability on Free disputed. **[3P; STALE? on launch details]** — [search summary, Suprmind](https://suprmind.ai/hub/grok/)
- **File uploads**: PDF, DOCX, XLSX, CSV, TXT, PNG, JPEG, GIF, code; 25 MB per file; OCR; stateful Python code interpreter. **[3P]** — [The AI Rankings](https://theairankings.com/xai/grok/)
- **Companions**: Ani, Valentine; expanded April 2026; used in voice mode; SuperGrok-level and up. **[3P]** — [The AI Rankings](https://theairankings.com/xai/grok/)
- **Grok Bot** (primary: "durable AI teammates on a persistent cloud computer, with messaging, approvals, connectors, and routines", Aug 2026) — [xAI release notes](https://docs.x.ai/release-notes). Beta from 11 Aug 2026, initially SuperGrok Heavy / Cursor Ultra / Cursor Teams Premium; runs Grok 4.6; no independent reliability testing — [The AI Rankings](https://theairankings.com/xai/grok/). Now in X Subscription Premium/Super/Ultra, not Plus — [SmartScope](https://smartscope.blog/en/blog/x-subscription-premium-grok-bot-cursor-grok-cli-2026/).
- **Routines (scheduled prompts, the 2026 form of "Tasks")**: Premium+; minimum interval 5 minutes; each run consumes the shared weekly quota (short intervals can exhaust a week's quota in a day); may pause after long user absence; model is auto-selected. **[3P, Oct 2026]** — [SmartScope](https://smartscope.blog/en/blog/x-subscription-premium-grok-bot-cursor-grok-cli-2026/)
- **Grok Bot and X**: official X connector shipped 29 Aug 2026 and is **read-only** (cannot post to your account) — [OpenTweet](https://opentweet.io/blog/does-grok-post-to-x) **[3P]**. Searching public posts needs no login; DMs/bookmarks/timeline need the X plugin. Tagging your Bot account in an X post forwards the request to your Bot; X shows only an acknowledgment and the output stays in the Bot app. **Tag forwarding is not offered in the EU, UK, Australia, Iceland, Liechtenstein, Norway.** Posting/replying on your behalf is unconfirmed in official docs. — [SmartScope](https://smartscope.blog/en/blog/x-subscription-premium-grok-bot-cursor-grok-cli-2026/)
- **Grok-based X feed ranking**: the EU Commission's 26 Jan 2026 action extended its recommender-system probe to cover X's "switch to Grok-based recommendations", which confirms that X's feed ranking uses Grok. — [SCL](https://www.scl.org/european-commission-investigates-grok-and-x-recommender-systems/); [AA](https://aa.com.tr/en/europe/eu-opens-formal-probe-into-grok-xs-recommender-systems-over-sexualized-imagery/3811067)
- API-only but relevant to a startup: custom moderation `guidelines` (Oct 2026), Context Compaction API (May 2026), Batch API (Jan 2026), Files API public URLs (Jun 2026). — [xAI release notes](https://docs.x.ai/release-notes)

### Inferences
- "Tasks" as a standalone consumer feature was not found in late-2026 sources; scheduled work now appears to live in Grok Bot routines (Premium and up).
- For a Kurdish learning product, voice mode is the riskiest surface: Turkish support is documented (2025), Kurdish is documented nowhere. Text chat in Kurdish will work to whatever extent the model does, but no quality evidence was found.

### Gaps
- No primary feature matrix for Nov 2026 (grok.com/plans not fetched). Tier gating for Projects, memory, Companions and DeepSearch quotas under the new X Subscription is unknown; the cited quotas are legacy-plan figures.
- Nothing found on Grok in X DMs or X Communities, or on consumer-level custom instructions/personas outside Projects and voice personalities.
- Consumer voice-mode language list for 2026 not found; Kurdish support unverified (assume absent until tested).
- Whether a standalone "Tasks" feature still exists in the app is unconfirmed.

---

## 4. How the @grok mention bot on X behaves

### Takeaway
Since about **11-17 March 2026, tagging @grok in a thread works only for paying X subscribers**; free users must use the Grok tab or grok.com. Replies come from the ordinary @grok account, subject to reply restrictions, blocks, protected accounts, thread length and load, with no published rate limits or SLA, so a brand cannot rely on it as a support channel.

### Cited Findings
- "Ask Grok" (summoning @grok in replies) became exclusive to Premium / Premium+ subscribers; users saw a notice from ~11 Mar 2026, effective date reported as 17 Mar 2026; Grok itself confirmed in a reply; no official X/xAI changelog found. Free users can still use the Grok tab on X or grok.com with limited capabilities. — [PiunikaWeb, 11 Mar 2026](https://piunikaweb.com/2026/03/11/x-ask-grok-premium-only/); [Game Revolution/AOL](https://www.aol.com/x-restricts-access-ask-grok-123154053.html); [Let's Data Science](https://letsdatascience.com/news/musk-restricts-grok-chatbot-to-paid-subscribers-34e3bb0f)
- Before that, the feature was open to all users with stricter undisclosed limits for unpaid users (academic paper). — [arXiv 2602.11286](https://arxiv.org/pdf/2602.11286)
- Mechanics (article dated 11 Jan 2026, **pre-paywall**): mention @grok in a public post -> text reply from Grok's own account; image generation/editing by mention requires Premium; replies usually arrive within minutes, sometimes up to ~an hour. — [Roboin](https://roboin.io/article/en/2026/01/12/why-grok-doesnt-reply-to-mentions-and-how-to-fix-it/)
- Failure modes listed there: (1) protected/private accounts get no reply; (2) reply-restricted posts ("Accounts you follow", etc.) block Grok unless it qualifies; (3) user has blocked Grok (muted = reply but no notification); (4) thread grown too long, start a new post; (5) server load; (6) delay. No numeric limits published. — [Roboin](https://roboin.io/article/en/2026/01/12/why-grok-doesnt-reply-to-mentions-and-how-to-fix-it/)
- Content/legal failure modes: July 2025 Grok produced insulting replies about Erdoğan/Atatürk leading to a Turkish criminal probe and blocked posts — [Daily Sabah](https://www.dailysabah.com/business/tech/turkiye-launches-probe-into-grok-chatbot-after-insults-swearing) **[2025]**; Turkish courts blocked at least 12 @grok replies in four cases Feb 2025 - Aug 2026 (replies about alleged official misconduct) — [Stockholm Center for Freedom, 21 Aug 2026](https://stockholmcf.org/?p=74600); Jan 2026 sexualised-deepfake scandal via Grok image generation on X (CCDH estimate ~3M sexualised images in 11 days) — [The AI Rankings](https://theairankings.com/xai/grok/), [The Register, 26 Jan 2026](https://www.theregister.com/2026/01/26/ec_open_new_investigation_into/).
- Building your own reply bot instead: since 23 Feb 2026 the X API only allows a reply when the original author mentioned or quoted your account first ("summoned"); AI-powered automated reply bots need prior written X approval. **[3P vendor blogs]** — [Roboin, 24 Feb 2026](https://roboin.io/article/en/2026/02/24/x-limits-api-based-automated-replies-to-combat-engagement-farming/); [OpenTweet](https://opentweet.io/how-to/x-api-rules-for-ai-agents-2026)

### Inferences
- A brand cannot configure, prompt, or constrain @grok; whoever tags it (a paying user) gets Grok's own answer under the brand's post. With free users locked out, most of a Kurdish-learner audience could not invoke it at all.
- The dependable own-brand pattern on X is "user mentions the brand account -> brand's approved bot replies" (allowed under the Feb 2026 "summoned" rule), powered by the xAI API or any other model.
- Kurdish-language answers given publicly from Turkey-related threads carry a non-trivial risk of politically sensitive output, and Turkish courts have repeatedly blocked individual @grok replies.

### Gaps
- No source found on **how @grok selects context** (parent post, thread, quoted post, media, web/X search) or **what language it replies in** (commonly observed to mirror the asker's language, but no citable source; Kurdish behaviour untested).
- No published rate limits per user/tier for mentions.
- Nothing dated 2026 on the Grok button on posts ("Explain this post") or Grok in X search; help.x.com/using-x/about-grok returned 403. Whether these remain free is unknown.
- Whether the new "Plus" $8 tier counts as "Premium" for tagging rights is not explicitly confirmed.

---

## 5. Availability in Turkey and the EU

### Takeaway
No evidence was found of a country-wide Grok ban in Turkey as of late 2026: Turkish action has consisted of blocking specific @grok posts (at least 12, Feb 2025 - Aug 2026) plus a **September 2025 court order to block the whole @grok X account that had not been enforced as of August 2026**. In the EU Grok is available but under an open DSA investigation (opened 26 Jan 2026) with interim measures threatened; some features (Grok Bot tag forwarding) are withheld in the EU/UK.

### Cited Findings
**Turkey**
- 9 Jul 2025: Ankara Chief Prosecutor opened an investigation; an Ankara criminal judgeship of peace ordered restrictions on ~50 Grok posts over insults to Erdoğan, Atatürk and religious values; widely headlined as "first AI tool banned in Turkey", but it was content-level. **[2025]** — [Daily Sabah](https://www.dailysabah.com/business/tech/turkiye-launches-probe-into-grok-chatbot-after-insults-swearing); [Bianet/BirGün](https://www.birgun.net/haber/investigation-launched-access-ban-imposed-on-artificial-intelligence-grok-637098); [SCF](https://stockholmcf.org/?p=68065)
- 11 Sep 2025: access-block order against the entire @grok X account under Law 5651 Art. 8/A (national security, public order), reported by Prof. Yaman Akdeniz / EngelliWeb; issuing court not disclosed; at publication the account was still reachable from Turkey. **[2025]** — [Diken, 11 Sep 2025](https://www.diken.com.tr/?p=1632192)
- 21 Aug 2026: Expression Interrupted analysis: at least 12 Grok posts blocked in four cases (Feb 2025, Dec 2025, Mar 2026, Aug 2026), all about alleged misconduct by officials; the Sept 2025 whole-account order "has not been enforced". — [Stockholm Center for Freedom](https://stockholmcf.org/?p=74600)
- One report said the Grok app and x.com/i/grok remained reachable after the account order. **[undated in search summary, likely Sept 2025]** — [Webtekno](https://www.webtekno.com/grok-erisim-engeli-h202862.html)
- A Turkish-language search for October 2026 status returned only July 2025 material; no report of a new or enforced nationwide block was found.

**EU**
- 26 Jan 2026: European Commission opened formal DSA proceedings against X over Grok (risk assessment/mitigation before deploying Grok functions in the EU, sexualised deepfakes) and extended its Dec 2023 recommender-systems probe to cover Grok-based recommendations; warned of possible interim measures. No final decision found. — [The Register](https://www.theregister.com/2026/01/26/ec_open_new_investigation_into/); [SCL](https://www.scl.org/european-commission-investigates-grok-and-x-recommender-systems/); [RTÉ](https://www.rte.ie/news/business/2026/0126/1555098-eu-commission-to-open-proceedings-against-grok-report)
- Ireland's DPC opened a GDPR investigation into Grok training in April 2025; reported as ongoing in 2026. — [The AI Rankings](https://theairankings.com/xai/grok/); [search summary, sonomos.ai](https://sonomos.ai/blog/is-grok-gdpr-compliant-2026/)
- Grok 4.5 was made available to EU users in the API console in July 2026 (i.e. EU model rollouts can lag). — [xAI release notes](https://docs.x.ai/release-notes)
- Grok Bot tag forwarding not offered in EU, UK, Australia, Iceland, Liechtenstein, Norway (Oct 2026). **[3P]** — [SmartScope](https://smartscope.blog/en/blog/x-subscription-premium-grok-bot-cursor-grok-cli-2026/)
- Elsewhere: Indonesia and Malaysia blocked Grok during the Jan 2026 deepfake scandal. — [The AI Rankings](https://theairankings.com/xai/grok/)

### Inferences
- Practical status for Turkey, most likely: grok.com, the app and @grok all work, but individual replies get geo-blocked by court order and a dormant whole-account order exists that could be enforced at any time. This is a standing platform risk for a product whose audience is largely in Turkey and whose subject (Kurdish) is politically sensitive there.
- EU users may get features later or not at all; test from an EU account before promising a feature.

### Gaps
- **No source dated Sept-Nov 2026 confirms current accessibility of Grok in Turkey.** Latest datapoint is 21 Aug 2026. Needs an on-the-ground check.
- No EU decision or interim measures found after Feb 2026; coverage found is all Jan-Feb 2026, so the outcome may simply have been missed.

---

## 6. Privacy and data use

### Takeaway
By default, outside the EU, both public X posts (and Grok interactions on X) and Grok app conversations can be used for model training; each has its own opt-out, and opt-outs are forward-looking only. EU users' public posts have been excluded from Grok training since August 2024. Business/API data terms could not be verified from a primary source.

### Cited Findings
- Grok app / grok.com: setting **"Improve the Model"** under Settings -> Data Controls; when on, conversations may be used to improve xAI models; turning it off applies going forward only; feedback you submit is not covered. **[3P guides, 2026]** — [DeleteMe guide](https://joindeleteme.com/ai-privacy-settings/grok-privacy-settings-guide/); [ai-chat-importer](https://ai-chat-importer.com/blog/does-grok-use-your-conversations-for-training)
- X side: Settings -> Privacy & Safety -> Data sharing and personalization -> **"Grok & Third-party Collaborators"**; on by default for non-EU users; covers public posts and Grok interactions. — [Roboin, 1 Jan 2026](https://roboin.io/article/en/2026/01/01/how-to-opt-out-of-grok-training-on-your-posts/); [Anonyome](https://anonyome.com/knowledge-center/ai-privacy/grok-privacy/)
- Opting out does not undo past training. — [Anonyome](https://anonyome.com/knowledge-center/ai-privacy/grok-privacy/)
- Private Chat content is reportedly not used for training (citing xAI FAQ; unverified against the FAQ). **[3P]** — [baa-atlas](https://baa-atlas.vercel.app/ai/grok)
- EU: X suspended Grok training on EU users' data on 8 Aug 2024 after Irish DPC action; noyb filed complaints in several EU countries. **[2024; reported as still in force in 2026 by vendor blogs]** — [Engadget](https://www.engadget.com/big-tech/x-wont-train-grok-on-eu-users-public-posts-155438606.html); [TechCrunch, 11 Aug 2024](https://techcrunch.com/2024/08/11/elon-musks-x-targeted-with-eight-privacy-complaints-after-grabbing-eu-users-data-for-training-grok)
- Policy versions: an xAI privacy policy version "Effective April 4, 2026" is now marked previous; one source cites a version effective 24 Aug 2026 that asks users not to put personal information in prompts; consumer ToS had a 10 Apr 2026 version now superseded. — [x.ai/legal/privacy-policy](https://x.ai/legal/privacy-policy) (search snippet; page 403 on fetch); [x.ai consumer ToS previous version](https://x.ai/legal/terms-of-service/previous-2026-04-10); [Robo Rhythms](https://www.roborhythms.com/is-grok-safe/)
- Team plans advertise SSO, admin controls and SOC 2 compliance. — [x.ai/news/x-subscription](https://x.ai/news/x-subscription)

### Inferences
- Anything a user writes to @grok publicly is a public X post and falls under X's data-sharing default; learners' posts tagging Grok are training data unless each user opts out.
- For a startup handling learner data, the consumer app with "Improve the Model" off, or the API/Team plan under business terms, are the only defensible options; but the business no-training commitment must be read directly from x.ai/legal before reliance.

### Gaps
- **Business/enterprise/API data terms (no-training by default, retention period, DPA, EU data residency) not confirmed**; x.ai/legal pages were not fetchable. The existence of a "US regional endpoint" for grok-4.7 is noted in release notes, but no EU endpoint was confirmed.
- Current (post-Aug 2026) privacy policy text and retention periods not read first-hand.
- Whether the X Subscription merger changed data sharing between X, Grok and Cursor accounts is unknown.
- Turkey-specific (KVKK) handling: nothing found.
