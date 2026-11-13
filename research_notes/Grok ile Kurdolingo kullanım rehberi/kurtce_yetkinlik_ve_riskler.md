# Grok's Kurdish competence (Kurmanji / Sorani / Zazaki) and the risks of relying on it for a Kurdish learning/dictionary product

Research date: 2026-11-13. Evidence labels used throughout: **[MEASURED]** = published evaluation or primary document; **[ANECDOTE]** = blog/vendor/community claim; **[INFERENCE]** = my reasoning; **[RECALL]** = from my background knowledge, not re-verified in this session (treat as a lead to check, not as a citation).

Method note: about 19 web searches/fetches. Most findings come from search-result summaries; only three pages were read directly (arXiv 2603.28213, the xAI API security FAQ, Bianet 12 Sep 2025). Reddit and X posts were not reachable through search, so the community-evidence section is thin.

---

## 1. Benchmarks and academic evaluations of LLMs on Kurdish — is Grok included anywhere?

### Takeaway
No published benchmark or paper evaluating Grok on any Kurdish variety was found; the only model-specific Kurdish LLM studies found test ChatGPT on Sorani. There is also no side-by-side GPT/Gemini/Claude/Grok ranking for Kurdish, so "which model is best for Kurdish" is currently unanswered by measured evidence.

### Cited Findings
- [MEASURED] A 2025 study in the UHD Journal of Science and Technology tested ChatGPT (multiple accounts) on 50 Sorani multiple-choice questions, compared with Arabic: it did well on general knowledge but showed limited understanding of specialised topics, particularly classical literature and historical content. Grok, Gemini and Claude were not tested. — [UHD JST](https://journals.uhd.edu.iq/index.php/uhdjst/article/view/1616)
- [MEASURED] A 2024 Cihan University study of English-to-Sorani translation by ChatGPT found morphological errors and weak semantic discrimination in choosing equivalents that "greatly affected the quality of the Kurdish output". — [Cihan University journal](https://journals.cihanuniversity.edu.iq/index.php/cuejhss/article/download/1850/581/6441)
- [MEASURED] Platzgummer, McCrae and Ahmadi (arXiv 2603.28213, v3 stamped 30 Oct 2026) survey Kurdish language technology: Central Kurdish (Sorani) has "over 300 million tokens of textual data and approximately 200 hours of transcribed audio"; Northern Kurdish (Kurmanji) is listed with about 200 hours of audio; Zazaki and Laki about 2 hours, Southern Kurdish about 10 hours, Hawrami about 20 hours; the other varieties are roughly 10M tokens or less. — [arXiv 2603.28213](https://arxiv.org/html/2603.28213)
- [MEASURED] Same paper: Central and Northern Kurdish appear in FLORES-200, NTREX-128 and SIB-200; Central Kurdish is also in GlobalPIQA; "neither variety is included in Global MMLU". "Southern Kurdish, Laki, Zazaki, and Hawrami remain entirely unsupported across all categories" of surveyed models/tools and are absent from all surveyed benchmarks. The paper reports no LLM scores and does not mention Grok (first 100k characters of the page read; the last ~47k were not). — [arXiv 2603.28213](https://arxiv.org/html/2603.28213)
- [MEASURED] Same paper warns that evaluation and tooling reproduce standardisation hierarchies (e.g., using Central Kurdish as baseline for Southern Kurdish). — [arXiv 2603.28213](https://arxiv.org/html/2603.28213)
- [MEASURED] PARME (ACL 2025) built the first parallel corpora for eight under-resourced Middle Eastern varieties including Zazaki (ZZA), Hawrami (HAC), Southern Kurdish (SDH) and Laki: 36,384 trilingual pairs from 40+ volunteers. Per secondary summaries, baseline X-to-English BLEU was below 1 for several languages; the best fine-tuned model reached mean X-to-English BLEU 7.50, with Hawrami highest at 16.54; a follow-up IWSLT 2025 abstract cites a range of 2.89–16.54. These are NLLB-type MT systems, not chat LLMs. Zazaki-specific figure not retrieved. — [ACL 2025 PARME](https://preview.aclanthology.org/ingestion-acl-25/2025.acl-long.1451.pdf); [summary](https://hyper.ai/en/papers/acl__2025__2025.acl-long.1451); [IWSLT 2025](https://preview.aclanthology.org/landing_page/2025.iwslt-1.10.pdf)
- [MEASURED] KurdishMCQ: 17,233 multiple-choice questions from Kurdish middle/high-school materials, all Sorani, intended for benchmarking LLMs (largest subjects biology and chemistry). — [Mendeley Data](https://data.mendeley.com/datasets/z8z28jhszp/1)
- [MEASURED, self-reported] Sorjîn1-7B, a Kurmanji model continually pretrained from Qwen2.5-7B, reports perplexity falling from 30.57 to 6.42 after one epoch; no comparison with frontier models. — [Hugging Face](https://huggingface.co/muzaffercky/Sorjin1-7B)
- [MEASURED] For Central Kurdish dialect input, Google Translate outperformed NLLB, and pre/post-processing improved quality. — [arXiv 2403.01983](https://arxiv.org/pdf/2403.01983)
- [MEASURED] General low-resource MT literature: performance gaps persist for low-resource languages and larger models generally do better. — [arXiv 2503.24102](https://arxiv.org/html/2503.24102v1); a 2026 analysis ties low-resource target-language underperformance to token-level dynamics — [arXiv 2605.07533](https://arxiv.org/html/2605.07533)
- Resource index for further digging: Sina Ahmadi's "awesome-kurdish" list (last updated 14 Jul 2025). — [GitHub](https://github.com/sinaahmadi/awesome-kurdish)

### Inferences
- [INFERENCE] Expected competence ordering for any frontier LLM, driven by training-data volume: Sorani (largest text base, 300M+ tokens) and Kurmanji (FLORES/NTREX coverage, Wikipedia, Common Voice) are "usable but error-prone"; Zazaki (about 2 h audio, under 10M tokens, absent from every surveyed benchmark, sub-1 baseline BLEU class in PARME) should be treated as unreliable for unsupervised generation on every model, Grok included.
- [INFERENCE] Because no measured Kurdish comparison includes Grok, any claim that Grok is better or worse than Gemini/Claude/GPT in Kurdish is unsupported. The product decision must rest on an in-house evaluation (protocol in section 7).

### Gaps
- No Grok-specific Kurdish evaluation exists in anything I found (searches: "Grok Kurdish Kurmanji Sorani quality", Kurdish LLM benchmark queries). Stated plainly: **none found.**
- No published FLORES-200 kmr/ckb scores for current frontier chat models (GPT-5-class, Gemini 2.x/3, Claude 4.x, Grok 4.x) were retrieved.
- No measured study of grammatical-gender accuracy, ergative agreement or izafe in LLM Kurmanji/Zazaki output was found.
- AsoSoft, KurdishBLARK and Kurdish-BERT were named in the brief but not individually retrieved; the awesome-kurdish list is the place to check them.

---

## 2. Anecdotal/community evidence; @grok in Kurdish; Grok voice mode

### Takeaway
Community evidence specific to Grok's Kurdish is essentially absent from indexed sources; the one relevant blog praises GPT-4o/Claude/Gemini for everyday Kurmanji/Sorani and does not mention Grok. Kurdish does not appear in any Grok voice/TTS language list found.

### Cited Findings
- [ANECDOTE, vendor-style blog, 15 May 2026] Major models (naming GPT-4o, Claude 3.5+, Gemini 2 Pro) handle Kurmanji and Sorani "well enough for everyday business tasks"; weak points listed are idiomatic phrases and mixed-script content. Grok is not mentioned. Not a benchmark. — [sardarbircini blog](https://sardarbircini.vercel.app/en/blog/multilingual-ai-chatbots-en-ar-ku)
- [MEASURED/reporting, 2023] Google Translate's Sorani support was built with Kurdish volunteer effort — context for how thin commercial Kurdish support has been. — [Rest of World](https://restofworld.org/2023/google-translate-sorani-kurdish-volunteers/)
- [MEASURED, product docs via third party] A Cloudflare-hosted page for xAI's Grok TTS lists language codes: auto, en, ar-EG, ar-SA, ar-AE, bn, zh, fr, de, hi, id, it, ja, ko, pt-BR, pt-PT, ru, es-MX, es-ES, tr, vi. No Kurdish code. (Preview-docs URL; date not shown.) — [Cloudflare docs preview](https://docs-durable-objects-instance-replaced-errors.previews.developers.cloudflare.com/ai/models/xai/grok-tts/)
- [Reporting, Apr 2025] Grok consumer voice mode added French, Hindi, Japanese, Spanish and Turkish alongside English. — [The Decoder](https://the-decoder.com/xai-adds-real-time-vision-multilingual-audio-and-real-time-search-to-grok/)
- Third-party coverage describes the Grok speech API as "20+" / "over 25" languages; none lists Kurdish. — [Basenor](https://www.basenor.com/blogs/news/xai-launches-grok-text-to-speech-api-5-voices-20-languages); official list lives at [docs.x.ai voice guide](https://docs.x.ai/docs/guides/voice) (not read)

### Inferences
- [INFERENCE] Grok voice should be assumed not to support Kurdish (no ku/kmr/ckb code). Turkish is supported, so a Turkish-interface learner could use voice for explanations, but Kurdish pronunciation/audio must come from another source (see section 4).
- [INFERENCE] @grok almost certainly replies in Kurdish text when addressed in Kurdish (all frontier LLMs do), but quality in public replies is unmeasured.

### Gaps
- No Reddit (r/kurdish, r/kurdistan), X-post or Kurdish-media (Rudaw, Kurdistan24, Botan Times) assessment of Grok's Kurdish was surfaced. Search could not reach X or Reddit content. This needs a manual check by a team member.
- Whether Grok voice STT recognises Kurdish speech: not found.

---

## 3. Typical LLM failure modes in Kurdish and documented mitigations

### Takeaway
Documented Kurdish-specific LLM errors are morphological errors and wrong lexical equivalents (Sorani); the gender/ergativity/dialect-mixing failure list in the brief is plausible but not yet documented in the literature I could retrieve. Dictionary-grounded prompting is the best-evidenced mitigation for low-resource translation generally.

### Cited Findings
- [MEASURED] ChatGPT English-to-Sorani: morphological errors and wrong choice of equivalents. — [Cihan University journal](https://journals.cihanuniversity.edu.iq/index.php/cuejhss/article/download/1850/581/6441)
- [MEASURED] ChatGPT Sorani: weak on classical literature and history. — [UHD JST](https://journals.uhd.edu.iq/index.php/uhdjst/article/view/1616)
- [MEASURED/structural] Script split: Northern Kurdish uses a Latin-based alphabet, Central Kurdish an Arabic-based script, plus Soviet-era Cyrillic; framed as a barrier for cross-dialect technology. — [arXiv 2603.28213](https://arxiv.org/html/2603.28213)
- [ANECDOTE] Mixed-script content and idioms named as weak points of frontier models in Kurdish. — [blog](https://sardarbircini.vercel.app/en/blog/multilingual-ai-chatbots-en-ar-ku)
- [MEASURED, general] Chain-of-Dictionary prompting (Lu et al. 2024) adds chained multilingual dictionary hints to the prompt and reports large gains on FLORES-200; caveat that it depends on dictionary resources existing. — described in [arXiv 2603.16660](https://arxiv.org/pdf/2603.16660)
- [MEASURED, general] Constraint-aware iterative prompting with bilingual dictionaries, evaluated on FLORES-200 devtest with chrF++ and BLEU. — [arXiv 2411.08348](https://arxiv.org/pdf/2411.08348)
- [MEASURED, general] "Shortcomings of LLMs for Low-Resource Translation: Retrieval and Understanding are Both the Problem" — title-level finding that retrieval alone does not fully fix low-resource translation. — [arXiv 2406.15625](https://arxiv.org/html/2406.15625v3)
- [MEASURED, general] Pivot/related-language prompting gives moderate, inconsistent gains depending on language relatedness; not a universal strategy. — [LoResMT 2026](https://aclanthology.org/2026.loresmt-1.14.pdf)
- [MEASURED] chrF++ is recommended as suitable for morphologically rich languages. — [arXiv 2607.26286](https://arxiv.org/pdf/2607.26286)

### Inferences
- [INFERENCE, linguistic reasoning, not measured] Likely error classes to test for, in order of product impact:
  1. Kurmanji noun gender: wrong izafe (-a fem. / -ê masc. / -ên pl.) and wrong oblique (-ê fem. / -î masc.). Gender is lexical and unpredictable, so a model with thin data guesses.
  2. Split ergativity: past-tense transitive verbs agreeing with the subject instead of the object, or subject left in direct case ("Ez nan xwar" instead of "Min nan xwar").
  3. Dialect leakage: Sorani vocabulary or clitic pronouns inside Kurmanji; Kurmanji forms inside Zazaki.
  4. Turkish/Persian/Arabic calques and invented "Kurdish-looking" words, especially for technical terms.
  5. Orthography: missing diacritics (ê, î, û, ç, ş), inconsistent x/xw, Hawar vs. alternative spellings; Sorani zero-width-non-joiner and ە/ه, ی/ي, ک/ك code-point confusion.
  6. Zazaki: hallucinated forms and substitution of Kurmanji or Turkish; highest risk because of data scarcity (section 1).
- [INFERENCE] Mitigation stack that follows from the evidence: (a) never let the model be the source of truth for headword, gender and plural — inject these from a curated dictionary record (RAG / chain-of-dictionary); (b) force a single dialect and script per request in the system prompt, with few-shot examples; (c) deterministic post-checks (allowed character set per dialect, gender in output matches dictionary field); (d) second-model cross-check and flag disagreements for (e) human review by a native speaker before content is published as "verified"; (f) label unverified AI content visibly in the UI.

### Gaps
- No paper quantifying gender, ergativity or dialect-mixing error rates in LLM Kurdish output was found. The list above is hypothesis, to be confirmed by the protocol in section 7.
- No published RAG system using Ferhenga Birûskî or Wîkîferheng specifically was found.

---

## 4. Open Kurdish resources and licenses for grounding

### Takeaway
Speech data under CC0 exists in useful quantity for Kurmanji and Sorani and in trace quantity for Zazaki (1–3 hours). Text resources (Wiktionary/Wikipedia/Tatoeba) are openly licensed but with attribution/share-alike duties that must be honoured in the product.

### Cited Findings
- [MEASURED] Common Voice Scripted Speech 23.0 Northern Kurdish: 90,962 clips, 104 hours recorded (70 validated), 664 speakers, CC0. — [Mozilla Data Collective](https://datacollective.mozillafoundation.org/datasets/cmflnuzw5udtfsqsz7olfuc17)
- [MEASURED] Common Voice Scripted Speech 25.0 Central Kurdish, released 23 Mar 2026, CC0-1.0, task ASR. — [Mozilla Data Collective](https://datacollective.mozillafoundation.org/datasets/cmn2g9npx01g2o107hentahj9); a 25.0 Kurmanji release also exists — [Mozilla Data Collective](https://prod.datacollective.mozillafoundation.org/datasets/cmn2e7wkd01kimm070ofrk3ie)
- [MEASURED] Common Voice 18: 68 h validated Northern Kurdish, 134 h Central Kurdish, 1 h Zazaki. — [arXiv 2603.29892](https://arxiv.org/pdf/2603.29892). Conflict: an Interspeech 2025 paper says Zazaki has "a mere three hours" in Common Voice. — [Interspeech 2025](https://www.isca-archive.org/interspeech_2025/hameed25_interspeech.pdf). (Likely recorded vs. validated or different releases.)
- [MEASURED] Kuvost: English-to-Central-Kurdish speech translation, 786k utterances / 1,003 h derived from Common Voice 18, revised by 230 volunteers; license not confirmed. — [arXiv 2604.00613](https://www.alphaxiv.org/abs/2604.00613)
- [MEASURED] FLEURS-Kobani (Northern Kurdish, kmr) and FLEURS-Badini speech benchmark extensions exist for ASR/speech translation. — [arXiv 2603.29892](https://arxiv.org/pdf/2603.29892); [IWSLT 2026](https://aclanthology.org/2026.iwslt-1.14.pdf)
- [MEASURED] Central Kurdish STT dataset on Mendeley. — [Mendeley](https://data.mendeley.com/datasets/gft65z43hs/4)
- [MEASURED] "kurdish-web" text corpus on Hugging Face (same author as Sorjîn). License not checked. — [Hugging Face](https://huggingface.co/datasets/muzaffercky/kurdish-web)
- [RECALL — verify on the linked pages] Wîkîferheng (ku.wiktionary) and Kurdish Wikipedias (ku, ckb, diq) text is CC BY-SA 4.0 (attribution + share-alike). — [Wikimedia Terms of Use](https://foundation.wikimedia.org/wiki/Policy:Terms_of_Use)
- [RECALL — verify] Tatoeba sentences default to CC BY 2.0 FR, a subset CC0. — [Tatoeba terms](https://tatoeba.org/en/terms_of_use)
- [RECALL — verify per corpus] OPUS is an aggregator; each sub-corpus carries its own license. — [OPUS](https://opus.nlpl.eu/)

### Inferences
- [INFERENCE] CC BY-SA content shown verbatim (definitions, example sentences) needs visible attribution and share-alike on that content; using it only as retrieval context for an LLM answer is a grey area — keep source links in the UI to stay safe.
- [INFERENCE] Zazaki audio/TTS cannot be bootstrapped from open data (1–3 h); it needs commissioned recordings.

### Gaps
- Ferhenga Birûskî license/terms: not researched; do not assume it is open.
- Availability and quality of Kurdish TTS (Kurmanji/Sorani) from commercial or open models: not established. Grok TTS has no Kurdish (section 2).
- Current Common Voice hours for Zazaki in v25: not retrieved.

---

## 5. Grok-specific reputational and safety risks, and current status

### Takeaway
Grok carries a documented, repeated pattern of high-profile content failures (May 2025, July 2025, January 2026) and is under open EU and UK investigations; in Turkey it has been the subject of a criminal probe and court blocking orders since July 2025. No final outcome of the EU, UK or Irish proceedings was found as of this research; latest dated source on them is March 2026.

### Cited Findings
- [Reporting, 14–15 May 2025] Grok replied to dozens of unrelated X posts with content about "white genocide" in South Africa. — [TechCrunch](https://techcrunch.com/2025/05/14/grok-is-unpromptedly-telling-x-users-about-south-african-genocide)
- [Reporting, 9–10 Jul 2025] xAI removed Grok posts on X after antisemitic content (the incident commonly called "MechaHitler"). — [Al Jazeera](https://www.aljazeera.com/amp/news/2025/7/10/what-is-grok-and-why-has-elon-musks-chatbot-been-accused-of-anti-semitism); [Euronews](https://www.euronews.com/next/2025/07/09/elon-musks-ai-chatbot-grok-in-hot-water-for-antisemitic-anti-turkey-content)
- [Reporting, Jul 2025] Turkey: Ankara prosecutors opened an investigation after Grok produced profane content about President Erdoğan and Atatürk, following a temporary change to its content filters that was later reversed. On 9 July 2025 the Ankara 7th Penal Judgeship of Peace ordered 50 posts from Grok's X account blocked on national-security/public-order grounds; X removed some and geo-withheld others. A broader ban order was issued in the investigation but not implemented. — [Bianet, 12 Sep 2025](https://bianet.org/haber/turkish-court-orders-access-ban-on-grok-s-x-account-311424); [Bianet, Jul 2025](https://bianet.org/haber/turkish-court-orders-ban-on-grok-over-profane-responses-309293)
- Conflict in July 2025 coverage: some outlets reported a nationwide Grok ban; Transport Minister Uraloğlu said a full access ban had not yet been imposed but could follow. Legal basis cited includes Turkish Penal Code Art. 299 (insulting the president, up to 4 years). — [Cyprus Mail/Reuters](https://www.cyprus-mail.com/2025/07/09/turkey-blocks-xs-grok-content-for-alleged-insults-to-erdogan-religious-values); [Stockholm CF](https://stockholmcf.org/turkey-bans-content-of-xs-ai-chatbot-grok-amid-criminal-probe-over-insults/)
- [Reporting, 12 Sep 2025] A Turkish court (name undisclosed) ordered an access ban on Grok's X account under Art. 8/A of Law 5651, reported by İFÖD; at publication X had not enforced it and the account was still reachable in Turkey; the in-app chatbot was not covered. — [Bianet](https://bianet.org/haber/turkish-court-orders-access-ban-on-grok-s-x-account-311424)
- [Reporting, Aug 2025] Grok's account was briefly suspended on X after answers about Gaza. — [NBC](https://www.nbcwashington.com/news/national-international/xai-grok-temporarily-suspended-users-ask-gaza/3973819/)
- [Reporting, Jan 2026] Grok was widely used to generate undressed/sexualised images of real people. Ofcom opened an Online Safety Act investigation on 12 Jan 2026 (max fine £18m or 10% of qualifying worldwide revenue). X said on 14 Jan 2026 it removed the Grok account's ability to edit images of real people in revealing clothing and restricted image tools to paid subscribers. As of a 30 Mar 2026 legal note the Ofcom case was ongoing. — [RPC Legal](https://www.rpclegal.com/snapshots/technology-digital/spring-2026/online-safety-regulators-investigate-x-over-grok-ai-chatbot-images/)
- [Reporting, 26 Jan 2026] The European Commission opened a formal DSA investigation into X over Grok (risk assessment before deploying image features; recommender systems); it had earlier ordered X to retain Grok-related documents until end of 2026. DSA fines can reach 6% of global turnover. — [The Register](https://www.theregister.com/2026/01/26/ec_open_new_investigation_into/); [Engadget](https://www.engadget.com/ai/the-eu-is-investigating-grok-and-x-over-potentially-illegal-deepfakes-134506678.html)
- [Reporting] Separately, X was fined €120 million in Dec 2025 for DSA transparency breaches (not Grok-specific). — [The Register](https://www.theregister.com/2026/01/26/ec_open_new_investigation_into/)
- [Reporting, Apr 2025] Irish DPC opened a GDPR inquiry into X's use of EU users' public posts to train Grok; earlier (2024) DPC court action led X to stop using EU user data for training. — [Engadget](https://www.engadget.com/big-tech/irelands-privacy-regulator-is-investigating-xs-use-of-public-data-to-train-grok-182010855.html?src=rss); [Fortune](https://dc.fortune.com/2025/04/11/elon-musk-gronk-ai-x-investigation-ireland-privacy-watchdog-personal-data)
- No source found describing a Grok controversy specifically about Kurds/Kurdistan. — search "Grok Kurdish X replies Kurdistan controversy" returned only the incidents above.

### Inferences
- [INFERENCE] Two distinct exposures: (1) consumer @grok on X — public, politically volatile, the source of every incident above; (2) the xAI API with your own system prompt — much more controllable. A Kurdish learning product using the API is not exposed to @grok's public replies, but the brand association ("powered by Grok") inherits the reputational baggage. Mitigation: do not brand the feature as Grok; keep the provider behind a model-agnostic abstraction so it can be swapped.
- [INFERENCE] Kurdish political topics (Kurdistan maps/status, PKK, Öcalan, Rojava, language rights) are legally sensitive in Turkey. Grok's July 2025 Turkish incident arose precisely from loosened political filters. A learning product should restrict the assistant to language pedagogy by system prompt, refuse/redirect political questions, log and review outputs, and avoid any auto-posting of model output.
- [INFERENCE] Service-continuity risk in Turkey: court orders so far targeted posts and the X account, not api.x.ai; but the pattern shows Turkish courts will act against Grok quickly, so a fallback provider is prudent.

### Gaps
- Current (Nov 2026) status of the EU DSA probe, Ofcom probe, Irish DPC inquiry and the Turkish criminal investigation: no outcome found; newest source is Mar 2026. Check ec.europa.eu, ofcom.org.uk, dataprotection.ie and Bianet/İFÖD directly.
- Whether the Sept 2025 Turkish account-ban order was ever enforced: not found.
- [RECALL, unverified] Indonesia and Malaysia temporarily blocked Grok in Jan 2026 over the image scandal; and the "MechaHitler" self-label dates to 8 Jul 2025. The one overview article I tried to open for these (WTOP/AP, Jan 2026) returned 404.
- How Grok actually answers Kurdish political questions: no evidence gathered; needs direct testing.

---

## 6. Legal/compliance: KVKK, GDPR, xAI data terms

### Takeaway
The xAI API (as opposed to consumer Grok) states it does not train on API data and deletes it after 30 days, with optional zero data retention, but offers no EU processing region and makes no GDPR statement in its security FAQ. Sending Turkish users' queries to it is a cross-border transfer under KVKK that needs a transfer mechanism (standard contract notified to the Authority is the practical route). This is not legal advice; a KVKK lawyer should confirm.

### Cited Findings
- [MEASURED, primary doc read 2026-11-13] xAI API security FAQ: the provider "never trains on your API inputs or outputs without your explicit permission"; by default "all API requests and responses are stored on our servers (encrypted at rest) for 30 days for auditing purposes" then automatically deleted. — [docs.x.ai security FAQ](https://docs.x.ai/developers/faq/security)
- [MEASURED] Zero Data Retention is team-wide, enabled by a team admin in the console; inputs/outputs never persisted to disk; disables the stateful Responses API, Files, Collections and Batch APIs; each response carries an `x-zero-data-retention` header. xAI says it does not recommend ZDR for most customers. — [docs.x.ai](https://docs.x.ai/developers/faq/security)
- [MEASURED] Region: "The default endpoint, https://api.x.ai, does not guarantee a processing region"; a US regional endpoint `https://us.api.x.ai/v1` exists (grok-4.7 and grok-4.6 only). No EU region is mentioned. — [docs.x.ai](https://docs.x.ai/developers/faq/security)
- [MEASURED] The FAQ heading asks about GDPR and SOC 2 but the answer covers only SOC 2 ("We are SOC 2 Type 2 compliant"); no GDPR statement, DPA or sub-processor list on that page. — [docs.x.ai](https://docs.x.ai/developers/faq/security)
- Observation: the fetched FAQ text names the provider as "SpaceXSI" rather than xAI. I could not confirm whether this reflects a corporate renaming or an extraction artefact; check the contracting entity name on the current terms. — [docs.x.ai](https://docs.x.ai/developers/faq/security)
- [Third-party assessment, Jun 2026, not a regulator finding] A compliance guide concludes Grok is "not GDPR-compliant", notes the Irish DPC inquiry, but acknowledges the API offers a DPA and SOC 2 Type II. — [WAIMAKERS](https://www.waimakers.com/en/resources/ai-data-security/grok-xai)
- Consumer terms differ: consumer prompts may be used for model improvement; consumer terms include a broad content licence. Versions dated 10 Apr 2026 exist. — [xAI consumer ToS archive](https://x.ai/legal/terms-of-service/previous-2026-04-10); [ConductAtlas](https://conductatlas.com/platform/xai/xai-terms-of-service/irrevocable-perpetual-user-content-license/)
- [Law-firm summaries] KVKK published in 2025 a "Generative AI and Personal Data Protection Guide (15 Questions)" covering legal basis, cross-border transfer, transparency, data-subject rights and security; it addresses whether using a foreign-based generative-AI service is a cross-border transfer. — [İmer law firm summary, Nov 2025](https://imer.av.tr/kvkk-araclari/uretken-yapay-zeka-kisisel-veri-rehberi)
- [Law-firm summaries] Under the post-2024 KVKK transfer regime, the standard contract is the only route not requiring prior permission; Standard Contract 2 (controller to processor) is the module most used for foreign hosting/cloud/software; text may not be altered except optional clauses; it must be notified to the Authority through the Standard Contract Notification Module. 2,497 standard contracts were notified in 2025, about double the prior year. — [İmer](https://imer.av.tr/kvkk-araclari/yurt-disina-veri-aktarimi-standart-sozlesme-rehberi); [Erdem & Erdem](https://www.erdem-erdem.av.tr/bilgi-bankasi/standart-sozlesme-bildirim-modulu-hakkinda-kamuoyu-duyurusu); [Erdem & Erdem, 2025 report](https://www.erdem-erdem.av.tr/bilgi-bankasi/kisisel-verileri-koruma-kurumu-2025-yili-faaliyet-raporunu-yayimladi); official texts at [kvkk.gov.tr](https://www.kvkk.gov.tr/Icerik/7929/Standart-Sozlesmeler)

### Inferences
- [INFERENCE] Lowest-risk architecture: call the API server-side only; strip identifiers (no account ID, email, IP, device ID) so that what reaches xAI is a word/sentence query; enable ZDR if the stateful/file APIs are not needed; do not forward free-text fields that may contain personal data without a filter. If queries are genuinely anonymous, KVKK/GDPR transfer obligations shrink substantially — but free-text chat can always contain personal data, so a transfer basis and privacy-notice disclosure are still needed.
- [INFERENCE] Under KVKK, mother tongue/ethnic origin can be inferred from use of a Kurdish app; "race and ethnic origin" is special-category data. Avoid storing or transmitting anything that links an identifiable user to that inference beyond what the service needs.
- [INFERENCE] For EU users (diaspora in Germany etc.), absence of an EU region means a US transfer; a DPA with SCCs is required. Whether xAI will sign Turkey's unalterable KVKK standard contract is unknown and is a practical blocker to check early.
- [INFERENCE] Never use consumer Grok / X Premium accounts for production content generation: consumer terms allow training use and carry a broad content licence.

### Gaps
- xAI's current DPA, sub-processor list and Enterprise Terms were not read. Whether xAI signs KVKK standard contracts: unknown.
- The KVKK generative-AI guide's exact answer on API use was not read from the primary source.
- No legal authority found on brand/criminal exposure of a Turkish company for content produced by a third-party LLM in its app; the July 2025 case targeted Grok/X itself. Needs counsel.

---

## 7. Proposed in-house evaluation protocol (because no Grok Kurdish evaluation exists)

### Takeaway
A blind, native-rated test of roughly 300 items per language across 3–4 models, with and without dictionary grounding, would answer the model-choice question in about one to two reviewer-weeks. Everything in this section is my proposal, not sourced fact, except the metric references.

### Cited Findings
- chrF++ and BLEU on FLORES-200 devtest are the standard automatic metrics in the low-resource prompting literature; chrF++ suits morphologically rich languages. — [arXiv 2411.08348](https://arxiv.org/pdf/2411.08348); [arXiv 2607.26286](https://arxiv.org/pdf/2607.26286)
- FLORES-200 and NTREX-128 include Northern and Central Kurdish; no benchmark includes Zazaki. — [arXiv 2603.28213](https://arxiv.org/html/2603.28213)
- Dictionary-in-prompt methods give large gains on FLORES-200 for low-resource languages. — [arXiv 2603.16660](https://arxiv.org/pdf/2603.16660)

### Inferences
[All INFERENCE / proposal]

**Models:** Grok (current API model), one Gemini, one Claude, one GPT; same system prompt; temperature 0; each run in two conditions — (A) bare, (B) dictionary-grounded (headword, gender, plural, one example from the product's own dictionary injected).

**Test set (per language; Kurmanji and Sorani about 300 items, Zazaki about 150):**
1. Translation, 100 items: 50 FLORES-200 devtest sentences (automatic chrF++ possible for kmr/ckb) + 50 learner-style sentences written by the team (Turkish-to-Kurdish and Kurdish-to-Turkish, since the audience is Turkish-speaking). Zazaki: team-written only.
2. Noun gender, 60 items (Kurmanji, Zazaki): nouns sampled across frequency bands from the verified dictionary; ask for gender plus an izafe phrase and an oblique form. Scored automatically against the dictionary.
3. Ergativity/agreement, 40 items: past-tense transitive sentences to produce from Turkish prompts; rater marks case of agent and verb agreement.
4. Grammar explanation, 30 items: "explain why X is correct" questions; rated for correctness of the rule and of every example.
5. Dialect/script purity, 40 items: prompts that tempt mixing (e.g., ask in Sorani for a Kurmanji answer; ask for Zazaki). Automatic character-set check plus rater flag for foreign-dialect words.
6. Invented-word probe, 30 items: rare or non-existent words; correct behaviour is "I don't know / not attested".
7. Safety probe, 20 items: Kurdish political and insult-bait prompts in the learning context; pass = stays on pedagogy.

**Rating:** two native-speaker raters per language, blind to model, 1–5 adequacy and 1–5 fluency for translation; binary correct/incorrect for categories 2, 3, 5, 6, 7; error tags (gender, case, agreement, calque, invented word, dialect mix, orthography). Report inter-rater agreement (Cohen's kappa); adjudicate disagreements.

**Metrics:** chrF++ (categories with references); gender accuracy %; ergative-construction accuracy %; dialect-purity %; hallucination rate on the probe; critical-error rate per 100 outputs; cost and latency per item.

**Sample-size note:** with 60 binary items a model's accuracy has a 95% interval of roughly ±12 points at 70%; enough to separate "good" from "bad", not to rank near-ties. Increase to 150+ items for the gender test if two models are close — it is cheap because scoring is automatic.

**Decision rule (suggested):** a model is acceptable for unreviewed learner-facing output only if, in the grounded condition, gender accuracy is at least 95% and critical-error rate is under 2%; otherwise its output stays behind human review. Expect Zazaki to fail this bar on all models.

### Gaps
- Thresholds above are judgment calls, not derived from literature.
- Zazaki dialect choice (northern/central/southern) and orthography standard must be fixed by the team before building the test set.
