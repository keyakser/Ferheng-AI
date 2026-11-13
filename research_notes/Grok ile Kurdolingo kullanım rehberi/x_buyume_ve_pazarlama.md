# Grok + X for growth, marketing, content and community: Kurdolingo / FerhengAI (state as of 2026-11-13)

Reading notes for the report writer:
- Research date 2026-11-13. Every fact carries the date the source gives; where the source gives none, that is said.
- Source quality is uneven. Primary sources reached: the `xai-org/x-algorithm` README, the docs.x.com pricing page, DataReportal Digital 2026 Turkey. `help.x.com` (automation rules, Premium page) returned HTTP 403 and could NOT be read directly; statements about those pages come from search snippets or third-party summaries and are marked as such.
- Most "X algorithm" articles are SEO/marketing blogs from tool vendors. They are labelled "secondary/vendor" and should be treated as folklore unless they match the primary repo.
- All example prompts and workflows under "Inferences" are my proposals, not tested results. Nothing was tested on a live X or Grok account in this research.

## 1. How does X's recommendation algorithm work in 2026, and what does it imply for a niche-language account?

### Takeaway
The For You feed is ranked by a transformer ("Phoenix") that predicts roughly two dozen user actions per post and sums them with weights; the open-sourced code shows no hand-written link penalty or Premium boost, but it does show an out-of-network discount, an author-diversity decay and a new/low-impression author boost. For a Kurdish-language account the practical levers are replies, dwell time, video watch time, follows and avoiding negative feedback, not hashtag tricks.

### Cited Findings
- Primary (README of the repo, read 2026-11-13; latest dated note in it is an update of 2026-10-26): candidate sources are Thunder (in-memory recent posts from followed accounts), Phoenix retrieval (embedding nearest-neighbour, out-of-network), SimClusters and a shared popular-posts list — [xai-org/x-algorithm](https://github.com/xai-org/x-algorithm)
- Primary: ranking is done by a transformer model; candidates attend only to the viewer context, not to each other. The README itself does not call the ranker "Grok"; a `grox/` directory is described as a content-classification component — [xai-org/x-algorithm](https://github.com/xai-org/x-algorithm)
- Primary: predicted actions include favorite, reply, repost, quote, share, share via DM, share via copy link; clicks on post, profile, link, photo expand, video open, quoted post; attention signals video quality view, dwell, dwell time, click dwell time, video continuation seconds, profile visit seconds; follow author; negatives not interested, mute author, block author, report, not dwelled. Final score is a weighted sum of predicted probabilities, not raw counts — [xai-org/x-algorithm](https://github.com/xai-org/x-algorithm)
- Primary: post-scoring adjustments are an author-diversity decay (each further post from the same author in a feed is multiplied down to a floor), an out-of-network discount (also applied to replies and reposts from followed accounts), and a new-author boost that lifts posts from authors with low impressions toward a target position — [xai-org/x-algorithm](https://github.com/xai-org/x-algorithm)
- Primary: pre-scoring filters drop posts older than 48 hours, duplicates, muted keywords, blocked/muted authors and already-seen posts. The README does not mention a link penalty, a Premium/verified boost or language-based ranking; language is only a hydrated post field — [xai-org/x-algorithm](https://github.com/xai-org/x-algorithm)
- Release history (secondary, dates conflict): one source says the feed algorithm was published on GitHub on 2026-01-20; another says the full For You source was pushed on 2026-05-15 — [PiunikaWeb, 2026-01-20](https://piunikaweb.com/2026/01/20/x-algorithm-open-source-tips-grow-reach-2026/); [OpenTweet blog](https://opentweet.io/blog/x-algorithm-open-source-github-2026); press coverage of the Grok-powered release at [Decrypt](https://decrypt.co/355108/elon-musks-x-open-sources-grok-powered-algorithm-driving-for-you-feed) and [VentureBeat](https://venturebeat.com/data/x-open-sources-its-algorithm-5-ways-businesses-can-benefit)
- Links (conflict): vendor blogs disagree on whether external links are penalised; two headlines report that Musk said X dropped its link penalty (I read headlines only, article dates not confirmed) — [PPC Land](https://ppc.land/x-drops-year-old-link-penalty-musk-tells-zuckerberg-on-platform/); [Digg](https://digg.com/ai/oqroqy6r); contrary vendor claim at [SocialPilot](https://socialpilot.co/blog/twitter-algorithm)
- Reply quality (secondary reading of code, unverified by me): a vendor blog says Grok scores reply quality 0–3 in `reply_ranking.py` and that "this"/emoji-only replies score near zero — [Postory](https://postory.io/blog/x-algorithm-2026)
- Engagement bait: in March 2026 X's head of product Nikita Bier said X was close to having Grok detect posts that directly solicit engagement and rank them down — [PiunikaWeb, 2026-03-20](https://piunikaweb.com/2026/03/20/x-grok-downrank-engagement-bait-nikita-bier/)
- Enforcement: a sweep on 2026-07-16 reportedly removed nearly 4,000 accounts from creator revenue sharing, mostly for engagement baiting; the same guide warns that precise "reach penalty percentages" quoted by blogs were never published by X — [Kompozy guide](https://kompozy.io/guides/x-engagement-bait-detection-update)
- Over-posting: Bier is reported as saying accounts burn their daily reach with excessive low-value posts/replies (e.g. repeated "gm") — [Cointelegraph](https://cointelegraph.com/news/cryptoquant-founder-slams-x-over-bot-spam-and-crypto-suppression)
- Stability: a vendor roundup reports no confirmed ranking changes in August 2026 — [SocialPilot (DE edition, Aug 2026)](https://www.socialpilot.co/de/blog/twitter-algorithm)

### Inferences
- Because ranking is learned from predicted actions, there is no Kurdish-specific switch. A Kurdish post is shown to users whose history resembles people who engage with Kurdish content. Mixing Kurdish, Turkish and English in one account probably blurs that signal; one main language per post, and consistent topic, is the safer design. This is reasoning from the architecture, not a measured result.
- The new-author boost plus out-of-network discount implies a small account gets some trial exposure but must convert it into follows; "follow author" is itself a predicted action.
- Author-diversity decay means 2–4 strong posts a day beat 15 weak ones; this matches the reported Bier remark about burned daily reach.
- Video continuation seconds and dwell time are explicit targets, so a 15–30 second pronunciation clip or a card that takes several seconds to read is structurally favoured over a one-line text.
- Link handling is unsettled. Safest practice: put the value in the post itself, and test link-in-post against link-in-reply on the brand's own analytics for two weeks.
- Asking "Like if you speak Kurmanji, repost if Sorani" is exactly the solicited-engagement pattern X says it down-ranks. A genuine question ("How do you say 'tomato' in your town?") is different in kind and suits a dialect dictionary.

### Gaps
- Exact weights for each predicted action are not in the README and I did not inspect the code files.
- I found no primary X statement, dated 2026, on the size of any Premium ranking boost or on a link penalty.
- No evidence was found on how well the ranker's embeddings handle Kurmanji or Sorani text specifically.

## 2. Tactics with the @grok mention bot, and building an own bot with the X API + xAI API

### Takeaway
I found no evidence that tagging @grok under your own posts increases reach, and X has actively removed accounts that automate replies, including ones using Grok-generated text. A brand-owned, labelled, opt-in bot (for example "mention the bot with a word, get the dialect entry") is permitted in principle and is cheap under pay-per-use, but unsolicited automated replies or mentions are the highest-risk behaviour.

### Cited Findings
- No source found by a targeted search addresses a reach benefit or penalty for tagging @grok in replies (search of 2026-11-13). See Gaps.
- X removed 42,000 accounts using chatbots to automate replies during an anti-spam response on 2026-07-24/25; Bier said some operators used Grok-generated replies and that X blocked that method — [Let's Data Science](https://letsdatascience.com/news/x-says-it-removed-42000-chatbot-reply-accounts-0e994445); related coverage at [Search Engine Journal](https://searchenginejournal.com/x-live-tweets-its-fight-against-chatbot-spam-in-real-time/583572)
- X's Developer Agreement/guidelines require automated accounts using the X API to enable the "Automated" profile label (per search snippet of the official pages; page itself not opened) — [docs.x.com developer guidelines](https://docs.x.com/developer-guidelines); [help.x.com automated account labels](https://help.x.com/en/using-x/automated-account-labels)
- X's automation rules page is reported as updated April 2026 and states that the account holder is responsible for actions taken by associated applications (search snippet; direct fetch returned 403) — [help.x.com automation rules](https://help.x.com/en/rules-and-policies/x-automation)
- Third-party summary (updated August 2026, vendor wording, not X's): unsolicited auto-mentions or DMs to users who never opted in are suspendable; auto-replies are allowed only to users who requested them; auto-follow/unfollow churn, mass liking and auto-reposting to inflate metrics are suspendable; X has no rule against AI-written content; a human review step for reactive replies is the vendor's advice, not an X rule — [OpenTweet automation rules summary](https://opentweet.io/x-automation-rules)
- X API pay-per-use prices (official page, undated, "subject to change"): post create $0.015 per request; post create with URL $0.200; post create (summoned) $0.010; DM interaction create $0.015; post read $0.005; user read $0.010; trends $0.010; owned reads (own posts, mentions, followers) $0.001 per resource — [docs.x.com pricing](https://docs.x.com/x-api/getting-started/pricing)
- Official page: pay-per-use is capped at 3 million post reads per billing cycle; resources are deduplicated in a 24-hour UTC window; spend earns xAI API credits (0% under $200, 10% for $200–499, 15% for $500–999, 20% from $1,000) if an xAI team is linked — [docs.x.com pricing](https://docs.x.com/x-api/getting-started/pricing)
- Secondary, with conflicts: pay-per-use became default for new developers in February 2026; the $200/month Basic tier closed to new signups then and remaining subscribers were migrated from 2026-06-01; legacy Pro ($5,000/month) was announced deprecated on 2026-08-14. One source gives a 2 million read cap, which conflicts with the official 3 million — [Open Terms Archive memo](https://opentermsarchive.org/en/memos/x-replaces-its-dollar200-entry-level-api-plan-with-a-pay-per-use-model/); [Gigazine, 2026-02-09](https://gigazine.net/gsc_news/en/20260209-x-api-pay-per-use); [bundle.social, 2026-08-17](https://bundle.social/blog/x-api-pricing-2026-costs-limits)
- xAI API: web search and X search are opt-in server-side tools priced at $5 per 1,000 calls per the official pricing page (via search snippet) — [docs.x.ai pricing](https://docs.x.ai/developers/pricing)

### Inferences
- Tagging @grok occasionally under an own post ("@grok explain the etymology of 'azadî'") is ordinary use, not a policy breach. Doing it on every post is likely to read as low-value repetition, and Grok's answer on Kurdish etymology or dialect may be wrong in public under the brand's post. For a dictionary brand, a wrong public answer costs more than the reply is worth. Opinion, not evidence.
- A better version of the same idea: use Grok privately to draft, verify against FerhengAI data, and post the corrected explanation as the brand. If Grok's public answer is wrong, a polite correction with a source is good content, used sparingly.
- "Grok, is this true?" under other people's posts, done at volume, is the reply-farming pattern X purged in July 2026. Do not automate it.
- Cost sketch for an own bot from the official prices: 3 scheduled posts a day without links is about 90 × $0.015 = $1.35 a month; 1,000 summoned replies a month is about $10; reading 1,000 mentions as owned reads is about $1. A single post with a URL costs $0.20, so links should go in the profile or be posted manually. Calculated by me from the listed prices.
- Compliant bot design: (1) "Automated" label on, linked to the main account; (2) reply only when a user mentions the bot or opts in; (3) answers come from FerhengAI's own dictionary data, with the xAI API or another model only for phrasing; (4) no auto-likes, auto-follows or keyword-triggered replies to strangers; (5) rate caps and a kill switch; (6) log every reply for review.
- Example summoned flow: user writes "@FerhengBot sêv" and the bot replies with Kurmanji, Sorani (Arabic script), Zazaki or other variants if present, Turkish/English gloss, one example sentence. No link in the reply; the profile carries the link.

### Gaps
- Could not open help.x.com to quote the automation rules verbatim (403). The exact 2026 wording on AI-generated replies and on "summoned" replies must be checked before launch.
- No data found on whether @grok replies under a post change that post's distribution.
- xAI API token prices in sources conflict ($1.25–$2.50 per million tokens as of August 2026 in one, different model names in another); check the live page — [docs.x.ai pricing](https://docs.x.ai/developers/pricing)

## 3. Grok DeepSearch / real-time X search for social listening and competitor monitoring

### Takeaway
Grok's access to live X posts is its one clear advantage over other assistants for this brand, and it can be used manually in the app or programmatically through the xAI API's X search tool. The competitor field is crowded with small Kurdish apps while Duolingo still shows no Kurdish course in anything I found.

### Cited Findings
- xAI API exposes web search and X search as server-side tools at $5 per 1,000 calls (official page via snippet); a third-party page says consumer DeepSearch corresponds to enabling those two tools and has a limit of 10 search steps per prompt (unverified) — [docs.x.ai pricing](https://docs.x.ai/developers/pricing); [Suprmind feature overview](https://suprmind.ai/hub/grok/grok-features/)
- X API trends endpoint is billed at $0.010 per request and recent post counts at $0.005 — [docs.x.com pricing](https://docs.x.com/x-api/getting-started/pricing)
- Duolingo: no announcement of a Kurdish course was found. A change.org petition created 2025-02-25 asks for Sorani and Kurmanji courses; an earlier activist campaign (2020) said Duolingo had acknowledged the request — [change.org petition](https://www.change.org/p/add-kurdish-to-duolingo); [Kurdistan24](https://www.kurdistan24.net/en/story/383025)
- Duolingo added close to 150 AI-built courses in 2025; coverage found does not mention Kurdish — [Neowin](https://www.neowin.net/news/duolingo-drops-nearly-150-new-language-courses-says-ai-helped-build-them/)
- Competing or adjacent apps seen in store listings (developer claims, unverified): uTalk Kurdish (Sorani), paid — [uTalk](https://utalk.com/store/kurdish-sorani); ZimanGo (Kurmanji, taught via English, German, Turkish, French) — [App Store](https://apps.apple.com/app/zimango-learn-kurdish/id6743156298); KurdishClass (Sorani and Kurmanji, 12 levels) — [App Store](https://apps.apple.com/us/app/id6762526805); KurdLingua (Sorani from 12 languages) — [App Store](https://apps.apple.com/us/app/id6739162065); Jûjî (Kurmanji lessons and dictionary, iPhone) — [App Store](https://apps.apple.com/app/id6793479407); Kurdish Dictionary Glosses (offline, Kurmanji, Sorani, Southern Kurdish, Hawrami) — [listing](https://mwm.ai/apps/kurdish-dictionary-glosses/6782327109)

### Inferences
- The petition and its signers are a ready-made audience statement: "Duolingo has no Kurdish, here is what exists" is a legitimate, checkable content angle. Re-verify Duolingo's course list on the day of posting.
- Example prompts for Grok (app, DeepSearch on). Proposals, untested:
  - "Search X posts from the last 7 days written in Kurmanji Kurdish (Latin script, letters ê î û ç ş). List the 15 most-discussed topics and the hashtags used, with 2 example post links each. Exclude party-political and armed-conflict topics. Say how many posts you actually read."
  - "Find X accounts that post mainly about Kurdish language, literature, linguistics or teaching (not news or politics). For each: handle, language/dialect used, follower count, typical post format, last active date. Only include accounts you can link to. Mark anything you are unsure of."
  - "Search X in Turkish, German and English for people saying they want to learn Kurdish or are struggling to (e.g. 'Kürtçe öğrenmek', 'Kurdisch lernen', 'learn Kurdish', 'Kurmancî hîn dibim'). Group complaints into themes with counts and quote 3 posts per theme with links."
  - "What are people on X saying about ZimanGo, uTalk Kurdish, KurdishClass and KurdLingua in the last 90 days? Separate praise, complaints and feature requests. If there are fewer than 10 posts for an app, say so instead of generalising."
  - "Sorani: search posts in Arabic-script Central Kurdish from the last 7 days about language, schooling and vocabulary. Return topics in English with the original Sorani phrases."
- Always ask Grok for links and counts, then open a sample. Language models misidentify Kurmanji as Turkish or Zazaki and Sorani as Persian or Arabic, and they invent handles. Treat output as leads to check, not as measurement.
- Listening on Kurdish topics will surface political content. Keep the brand's listening scope explicitly on language and culture, and do not store personal data about individual users.

### Gaps
- No independent evaluation of Grok's accuracy on Kurdish-language X search was found.
- Glossika, Memrise community courses, "Kurdî Learn" and "Azadi" did not appear in results; their current status was not verified.
- Whether Duolingo's live course list includes Kurdish on 2026-11-13 was not checked on duolingo.com itself.

## 4. Content production: Grok Imagine, Tasks, voice

### Takeaway
Grok Imagine is usable for backgrounds, illustrations and short clips, but I found no evidence it renders Kurdish diacritics or Arabic-script Sorani reliably, and its watermark and commercial-use terms are reported inconsistently. The safe workflow is AI for the picture, human-set text on top.

### Cited Findings
- Commercial use (secondary, no primary terms page reached): guides say xAI's terms give users ownership of outputs and allow commercial use on paid tiers, that xAI may use prompts and outputs for training, and that there is no IP indemnification — [MindStudio overview](https://www.mindstudio.ai/blog/what-is-grok-imagine-xai); [Jack Righteous 2026 guide](https://jackrighteous.com/es-us/blogs/ai-art-visuals-creatives/grok-ai-image-video-generation-2026)
- Watermark (sources conflict): one says a visible watermark appears on lower tiers and is removed on higher ones, with no definitive xAI policy page; another says the watermark cannot be removed and that removing provenance signals breaches the acceptable use policy; a third says watermark-free output is behind a paid plan — [aitoolsatlas free vs paid](https://aitoolsatlas.ai/tools/grok-imagine/free-vs-paid); [St-Hakky risk note](https://book.st-hakky.com/en/security/grok-image-generation-free-version-risks); [ZSky](https://zsky.ai/blog/is-grok-imagine-free)
- Free access: one source reports the free tier for Grok Imagine ended on 2026-03-19 — [ZSky](https://zsky.ai/blog/is-grok-imagine-free)
- Text rendering: only marketing-style claims were found that it handles text and logos better than many models; nothing on non-English scripts — [MindStudio overview](https://www.mindstudio.ai/blog/what-is-grok-imagine-xai)
- Regulatory context for Imagine: Ofcom, the European Commission (formal investigation opened 2026-01-26), the California Attorney General (2026-01-14) and Australia's eSafety acted over sexualised deepfakes generated with Grok; Indonesia and Malaysia blocked Grok — [Malwarebytes, January 2026](https://www.malwarebytes.com/blog/news/2026/01/regulators-around-the-world-are-scrutinizing-grok-over-sexual-deepfakes); [Fortune, 2026-01-12](https://dc.fortune.com/2026/01/12/uk-investigation-x-xai-grok-deepfakes-us-europe-free-speech-battle)

### Inferences
- Word-of-the-day card workflow (proposal): (1) pull the entry from FerhengAI; (2) generate a text-free illustration with Imagine; (3) set the Kurdish text in a design tool with a font that covers ê î û ç ş and Sorani letters such as ڕ ڵ ۆ ێ ە; (4) a Kurdish speaker checks spelling and dialect label; (5) post natively with alt text.
- Image prompt example: "Flat illustration of a red apple on a wooden table, warm morning light, lots of empty space in the upper third for a caption, no text, no letters, no logos, 1:1."
- Video prompt example: "6-second loop, an apple falls slowly into a hand, soft colours, no text, no speech." Add voice-over recorded by a native speaker; do not rely on synthetic Kurdish speech without checking it.
- Do not generate real people, politicians, flags or maps with Imagine. For a Kurdish brand, map and flag imagery is politically loaded and AI gets it wrong.
- Never remove a watermark or provenance mark; if the mark is unwanted, use the image only as a reference and build the final asset in-house.
- Daily brief via Grok Tasks (proposal, feature not verified in this research): "Every day at 08:00 Europe/Berlin: summarise the last 24 hours of X posts about Kurdish language, Kurdish-language education and Kurdish culture in Kurmanji, Sorani, Turkish, German and English. Give 5 topics with links, 3 posts worth replying to, and one vocabulary word that fits today's topics. Skip party politics. Flag anything uncertain."
- Drafting prompt: "Here is a dictionary entry [paste]. Write 3 X posts under 240 characters: one in Kurmanji, one in Turkish, one in English. Use only the forms in the entry. Do not add etymology or dialect claims that are not in the entry."

### Gaps
- No test or review of Kurdish (Latin or Arabic script) text rendering in Grok Imagine was found. Needs a hands-on test of 20 words per script before any reliance.
- xAI's current Terms of Service and acceptable use policy were not read directly; commercial rights and watermark rules must be confirmed there.
- Nothing was found on Grok Tasks (limits, tiers, scheduling) or on Grok voice mode's support for Kurdish. Both are unverified.

## 5. Customer support, community and X-native AI/ads tools

### Takeaway
Grok features inside X Ads exist but are limited to selected advertisers and are aimed at ad setup and analysis. I found nothing confirming a Grok-run customer-support agent for small brands in DMs, so community work on X still means people answering replies, plus Communities and Spaces.

### Cited Findings
- "Prefill with Grok" and "Analyze Campaign with Grok" launched for selected advertisers in X Ads Manager in February 2025 — [Search Engine Land](https://searchengineland.com/x-grok-prefill-analyze-campaign-452495); [Storyboard18, 2025-02-25](https://www.storyboard18.com/brand-marketing/x-rolls-out-grok-ai-powered-tools-for-ad-creation-and-campaign-analysis-57665.htm)
- July 2026: X began a beta letting selected advertisers ask Grok for guidance inside Ads Manager, with tooltips and help for in-stream ad creative (date given as 17 or 21 July depending on source) — [Relevant Audience](https://www.relevantaudience.com/social-media-marketing/x-grok-ads-manager-beta-test/)
- 2026-08-24: an X Ads MCP server exposing 23 advertising tools to MCP-capable clients was reported — [PPC Land](https://ppc.land/x-ads-mcp-gives-grok-and-claude-code-23-tools-to-run-ad-campaigns/)
- Digiday reports Grok gives ads an "aesthetic score" tied to X's creative guidelines (date not captured) — [Digiday](https://digiday.com/marketing/elon-musk-outlines-ai-led-grok-future-for-advertising-on-x/)
- X API: DM interaction create costs $0.015 per request and DM events read $0.010, so an opt-in DM helper is technically and financially feasible — [docs.x.com pricing](https://docs.x.com/x-api/getting-started/pricing)
- Third-party summary: auto-DMs are allowed only to users who opted in; mass unsolicited DMs are prohibited — [OpenTweet automation rules summary](https://opentweet.io/x-automation-rules)

### Inferences
- For a small budget, ads on X aimed at "Kurdish learners" are hard to target by language; Kurdish is unlikely to be a well-populated targeting option. Test with very small spend and follower-lookalike targeting on Kurdish culture accounts before committing. Opinion.
- Spaces fit this brand: a weekly 30-minute "Kurmanji–Sorani word clinic" with a guest teacher produces live community and clips. Communities can host learner questions, but reach inside Communities was not researched.
- Support: answer publicly within a day, keep a pinned FAQ, and move account issues to email. Use Grok or another model to draft replies in Kurdish, Turkish, German and English, with a person sending them.

### Gaps
- No source found on "Grok for Business" features for customer support, on Grok acting inside brand DMs, or on X Communities/Spaces performance in 2026.
- No official X announcement was found for a general release of Grok ad-creative generation; availability to a small advertiser in Turkey, Iraq or the EU is unknown.

## 6. Benchmarks, case studies and realistic expectations versus Instagram, TikTok and YouTube

### Takeaway
X is a minority platform for this audience: in Turkey its ad reach is under a third of Instagram's and falling, and in Iraq it is tiny next to TikTok. X is worth running as the conversation, credibility and diaspora-intellectual channel, with Instagram, TikTok and YouTube carrying volume.

### Cited Findings
- Turkey, DataReportal Digital 2026 (ad reach, late 2025, not active users): Instagram 62.3 million (+10.3% year on year); YouTube 57.9 million; TikTok 44.9 million adults 18+ (+14.8%); Facebook 34.7 million; X 18.5 million, 21.1% of population, down 973 thousand (−5.0%); DataReportal advises caution on X trends — [DataReportal Digital 2026: Turkey](https://datareportal.com/reports/digital-2026-turkey)
- Turkey, survey-style shares among social media users (reported from October 2025 data): Instagram 89.5%, WhatsApp 88.9%, YouTube 78%, Facebook 68.6%, X 58.7%. This is self-reported use and is much higher than X's ad reach — [Hürriyet Daily News](https://www.hurriyetdailynews.com/turkiyes-online-media-usage-surpasses-global-average-220421)
- Turkey: 61.0 million social media user identities in October 2026 (69.3% of population) per the newer report — [DataReportal Digital 2027: Turkey](https://datareportal.com/reports/digital-2027-turkey)
- Iraq: about 39.6 million internet users in October 2025; TikTok ad reach 40.1 million adults (+17.0%) per DataReportal 2026 via a secondary write-up — [DataReportal Digital 2026: Iraq](https://datareportal.com/reports/digital-2026-iraq); [Creative4All summary](https://iraq.creative4all.com/en/blog/digital-marketing-trends-iraq/)
- Iraq, national Digital Media Center figures (different method): TikTok 34.3 million users, X 2.065 million — [PUKmedia](https://pukmedia.com/EN/Details/77715)
- Iraq: 22.9 million Instagram users in September 2026 (47.7% of population) — [NapoleonCat](https://napoleoncat.com/stats/instagram-users-in-iraq/)
- Germany: 64.7 million social media user identities in October 2025 (77.1% of population) — [DataReportal Digital 2026: Germany](https://datareportal.com/reports/digital-2026-germany)
- Turkey access risk: courts ordered at least 1,270 X accounts blocked in September 2026, about 90% of which X made invisible in Turkey; X says refusing risks throttling of the whole platform — [Human Rights Watch, 2026-10-12](https://www.hrw.org/news/2026/10/12/turkiye-end-internet-censorship); [Cipher Brief/FDD, 2026-10-23](https://www.thecipherbrief.com/turkey-has-outsourced-its-censorship-to-american-companies)
- Kurdish-focused Mezopotamya Agency's X accounts were blocked in Turkey repeatedly in 2026, including October — [Stockholm Center for Freedom](https://stockholmcf.org/?p=74593)
- Platform-wide throttling of X, YouTube and others in Turkey was reported in September 2025; no comparable 2026 report was found — [Al-Monitor, September 2025](https://www.al-monitor.com/originals/2025/09/access-x-youtube-other-online-platforms-restricted-turkey-internet-monitor-says)
- Duolingo on X (vendor analysis, updated 2026-01-14, not Duolingo data): about 3.4K average reposts, 4.18% engagement, posts a few times a week, mostly memes and reposts of user mentions; 68% of its social mentions came from X; it runs separate accounts per language market — [Brand24](https://brand24.com/blog/duolingo-social-media-strategy/)

### Inferences
- Rough channel roles: TikTok and Instagram Reels for reach in Turkey, the Kurdistan Region and among diaspora youth; YouTube for lessons and search; X for teachers, writers, journalists, linguists, developers and diaspora activists who amplify. X followers will be fewer but more likely to quote, correct and link.
- Only neutral, language-and-culture content is a safe position on X in Turkey. Account-level withholding is the concrete risk; keep an email list and other channels so the audience is not held on one platform.
- Duolingo's transferable lesson is behaviour, not budget: reply to and repost learners, keep a consistent voice, and run per-language presence. Its meme tone may not transfer to a minority-language brand whose audience treats the language as heritage.
- Suggested measures for the first 90 days on X: follows per 1,000 impressions, replies per post, share of replies from non-followers, profile visits, dictionary sign-ups from the profile link. No external benchmark for minority-language accounts was found, so the brand's own baseline is the benchmark.

### Gaps
- No data exists in what I found on platform use by Kurds specifically, in any country. All figures are national.
- Iran and Syria were not researched; X is officially blocked in Iran, which I did not source here.
- No case study of a minority-language account's growth on X, and no evidence on word-of-the-day format performance, was found.
- Germany, Sweden, UK, Netherlands and France X-specific figures were not retrieved.

## 7. Rules, pitfalls, brand safety and cost of Premium / Verified Organizations

### Takeaway
The main rule risks are automated or solicited engagement and unsolicited mentions; the main brand risk is Grok itself, which carried regulator investigations in 2026 and a court-ordered restriction in Turkey in 2025. Premium prices are reported inconsistently, so check X's own page before budgeting.

### Cited Findings
- Premium prices (secondary, mostly spring 2026 or earlier): Basic $3/month, Premium $8/month, Premium+ $40/month or $395/year; reply prioritisation rises by tier, largest for Premium+ — [Tweet Archivist](https://www.tweetarchivist.com/twitter-subscription-features-guide); [Postory](https://postory.io/blog/x-premium-worth-it)
- Conflicting newer report (October 2026, single source, unconfirmed): tiers restructured, Basic renamed "Plus" at $8 and Premium+ cut to $30 — [OpenTweet](https://opentweet.io/blog/x-subscription-plans-explained-2026)
- Verified Organizations: one source says from about $200/month for a base tier; another lists $1,000/month plus $50/month per affiliate, which may be outdated; prices vary by country — [Lilach Bullock](https://www.lilachbullock.com/?p=108823); [Hypefury](https://hypefury.com/twitter/x-account-types-and-prices); [Getsby](https://getsby.com/en/creator-platform/how-to-subscribe-to-x-premium)
- The open-sourced README does not mention a Premium or verified boost in ranking — [xai-org/x-algorithm](https://github.com/xai-org/x-algorithm)
- Grok in Turkey: a court ordered an access ban on Grok in July 2025 after responses deemed insulting to Erdoğan and Atatürk; later reports said the order was not fully enforced and @grok stayed reachable — [Bianet](https://bianet.org/haber/turkish-court-orders-access-ban-on-grok-over-national-security-concerns-311424); [Stockholm Center for Freedom](https://stockholmcf.org/turkey-bans-content-of-xs-ai-chatbot-grok-amid-criminal-probe-over-insults/)
- Grok deepfake scandal, January 2026: investigations by Ofcom, the European Commission, California and Australia; blocks in Indonesia and Malaysia. No outcome (fine or ruling) was found in my search — [Malwarebytes](https://www.malwarebytes.com/blog/news/2026/01/regulators-around-the-world-are-scrutinizing-grok-over-sexual-deepfakes); [eMarketer](https://www.emarketer.com/content/ai-governance-pressure-mounts-following-grok-deepfake-fallout)
- Spam enforcement: 42,000 chatbot-reply accounts removed 2026-07-24/25 — [Let's Data Science](https://letsdatascience.com/news/x-says-it-removed-42000-chatbot-reply-accounts-0e994445)
- Automation: "Automated" label required for API-driven automated accounts; operator is responsible for app actions — [docs.x.com developer guidelines](https://docs.x.com/developer-guidelines); [help.x.com automation rules](https://help.x.com/en/rules-and-policies/x-automation)

### Inferences
- Do: post natively, reply personally, label any bot, keep automation opt-in, credit sources for dictionary entries, have a Kurdish speaker approve every public Kurdish text.
- Do not: automate replies to strangers, run several accounts that repost each other, buy followers or engagement, ask for likes/reposts, flood trending hashtags, auto-like or auto-follow, strip watermarks, or post Grok's unverified linguistic claims as fact.
- Publicly summoning @grok on Kurdish topics from inside Turkey carries an extra risk: Grok can produce a political or offensive answer under the brand's post, and the 2025 Turkish case shows such outputs lead to legal action. Use Grok as a back-office tool and keep it out of the brand's public threads on sensitive topics.
- Position the brand as "built with our own dictionary data and human review", not "powered by Grok". Diaspora users in the EU and UK may associate Grok with the 2026 investigations.
- Premium is probably worth a one- or two-month trial for reply prioritisation and longer posts, measured against the account's own baseline. Verified Organizations is hard to justify for a small brand at either reported price. Opinion.

### Gaps
- X's official 2026 Premium and Verified Organizations prices and the exact ranking benefit could not be read (help.x.com returned 403).
- No X policy text on mandatory labelling of AI-generated images or text in organic posts was retrieved; EU AI Act transparency duties for synthetic media were not researched.
- Outcomes of the 2026 Grok investigations and any advertiser withdrawals were not found.
