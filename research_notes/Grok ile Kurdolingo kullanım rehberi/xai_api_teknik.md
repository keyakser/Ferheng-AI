# xAI Developer API (api.x.ai) — Technical Notes for Integration (state as of 2026-11-13)

All prices are USD and were read from live vendor pages on 2026-11-13 unless marked otherwise. "Stale?" marks anything confirmed only from older or third-party sources. Note: the xAI docs now refer to the company as "SpaceXSI" in several places (security FAQ, examples), and the Vercel AI Gateway slug is `spacexai/grok-4.7`; the API host is still `api.x.ai` and the key env var is still `XAI_API_KEY`.

## 1. Current API model lineup: IDs, context windows, prices, rate limits

### Takeaway
As of 2026-11-13 the public xAI text lineup is grok-4.7 (flagship, $2/$6), grok-4.6, grok-4.5, grok-4.3 ($1.25/$2.50, 1M context), the grok-4.20 trio, and grok-build-0.1 ($1/$2, coding). There is no longer a cheap "fast/mini" tier: the $0.20/$0.50 grok-4-1-fast family was retired on 2026-05-15 and those slugs silently redirect to grok-4.3 at grok-4.3 prices, so the cheapest general-purpose Grok is about 5-10x the per-token price of the cheapest Gemini/Claude/OpenAI small models.

### Cited Findings
Text models (per 1M tokens; the long-context rate applies to ALL tokens once the prompt reaches 200k):

| Model ID | Context | Input | Cached input | Output | >=200k prompt (in / cached / out) |
|---|---|---|---|---|---|
| grok-4.7 | 500k | $2.00 | $0.50 | $6.00 | $4.00 / $1.00 / $12.00 |
| grok-4.6 | 500k | $2.00 | $0.50 | $6.00 | $4.00 / $1.00 / $12.00 |
| grok-4.5 | 500k | $2.00 | $0.30 | $6.00 | $4.00 / $0.60 / $12.00 |
| grok-4.3 | 1M | $1.25 | $0.20 | $2.50 | $2.50 / $0.40 / $5.00 |
| grok-4.20-0309-reasoning | 1M | $1.25 | $0.20 | $2.50 | $2.50 / $0.40 / $5.00 |
| grok-4.20-0309-non-reasoning | 1M | $1.25 | $0.20 | $2.50 | $2.50 / $0.40 / $5.00 |
| grok-4.20-multi-agent-0309 | 1M | $1.25 | $0.20 | $2.50 | $2.50 / $0.40 / $5.00 |
| grok-build-0.1 (coding) | 256k | $1.00 | $0.20 | $2.00 | $2.00 / $0.40 / $4.00 |

— [xAI pricing](https://docs.x.ai/developers/pricing); same table on [xAI models](https://docs.x.ai/docs/models)

- Grok 4.7 Fast exists but is 2x standard token rates ($4 / $1 / $12 below 200k) and is available only in Cursor and Grok Build, NOT on the public API. "Fast" here means faster serving, not cheaper. — [xAI pricing](https://docs.x.ai/developers/pricing); [xAI release notes](https://docs.x.ai/docs/release-notes)
- Grok 4.7 (September 2026): model ID `grok-4.7`, 500k context, text+image input, text output, reasoning effort low/medium/high (default)/xhigh. Grok 4.6 released August 2026 at the same price; Grok 4.5 released July 2026 (also made available to EU users in the API console in July). — [xAI release notes](https://docs.x.ai/docs/release-notes)
- Retirement: effective 2026-05-15 12:00 PT, `grok-4-1-fast-reasoning` and `grok-4-1-fast-non-reasoning` (and other older slugs) were retired; requests to retired slugs automatically redirect to grok-4.3 and are billed at grok-4.3 pricing ($1.25 in / $2.50 out). Grok 4.3 has 4 reasoning-effort levels: none, low, medium, high. — [xAI migration guide](https://docs.x.ai/developers/migration/may-15-retirement)
- A third-party write-up reports 8 Grok models were retired on May 15 and that the old slugs still resolve, so bills and output quality change silently. — [dev.to](https://dev.to/flarecanary/xai-retired-8-grok-models-on-may-15-the-slugs-still-resolve-so-your-bill-and-output-quality-26jd)
- Aliases follow the pattern `<modelname>`, `<modelname>-latest`, and dated versions. — [xAI models](https://docs.x.ai/docs/models)
- Image/video: `grok-imagine-image-2.0` $0.04/image; `grok-imagine-image` $0.02/image; `grok-imagine-video-1.5` $0.080/sec; `grok-imagine-video-1.5-lite` $0.020/sec; `grok-imagine-video` $0.050/sec. `grok-imagine-image-quality`/`-pro` were retired 2026-11-02 and are served by `grok-imagine-image-2.0-low`. — [xAI pricing](https://docs.x.ai/developers/pricing); [xAI release notes](https://docs.x.ai/docs/release-notes)
- Voice models: `grok-voice-3.0` (speech-to-speech, October 2026; `grok-voice-latest` points to it), `grok-voice-2.0` deprecated, `grok-voice-transcribe-2.0` (STT default; 1.0 reached end of life 2026-10-02). Prices in section 5. — [xAI release notes](https://docs.x.ai/docs/release-notes)
- Priority Processing (`service_tier: "priority"`): 2x standard rates on all token types, billed only when the response confirms `"service_tier": "priority"`; Chat Completions and Responses only. — [xAI pricing](https://docs.x.ai/developers/pricing)
- US regional endpoint `https://us.api.x.ai/v1`: 1.1x token rates, grok-4.7 and grok-4.6 only. — [xAI pricing](https://docs.x.ai/developers/pricing)
- Usage-guideline violation fee: $0.05 per request for violations caught before generation in the Responses API. — [xAI pricing](https://docs.x.ai/developers/pricing)
- Rate limits: per model and per team, measured in requests per second (RPS) and tokens per minute (TPM). Tiers are automatic by cumulative API spend since 2026-01-01: Tier 0 default, Tier 1 $50, Tier 2 $250, Tier 3 $1,000, Tier 4 $5,000, Enterprise on request; tiers never drop. Example: grok-4.7 is 150 RPS / 50M TPM at Tier 0 and 500 RPS / 100M TPM at Tier 4. Prompt, completion, reasoning and cached tokens all count toward TPM. Exceeding returns HTTP 429; exponential backoff recommended. Actual per-team limits are shown on the Console Models page. — [xAI rate limits](https://docs.x.ai/developers/rate-limits)

### Inferences
- For a dictionary-lookup workload the only sensible Grok candidates are `grok-4.3` with reasoning effort `none` or `grok-4.20-0309-non-reasoning` (same price). grok-build-0.1 is nominally cheaper ($1/$2) but is a coding model with no batch discount.
- Any tutorial or code sample that references `grok-4-1-fast-*`, `grok-4-fast-*`, `grok-3-mini` or `grok-code-fast-1` at $0.20-$0.50 prices is stale; using those slugs today bills at grok-4.3 rates.
- Tier 0 limits (150 RPS on the flagship) are far above what a dictionary app needs; rate limits are not a practical constraint.

### Gaps
- Per-model RPS/TPM for grok-4.3 and grok-4.20 were not shown on the public page (only the grok-4.7 example); they must be read in the Console.
- No "Grok 5" was found on any official page; no evidence it exists on the API as of this date.
- Whether grok-3 / grok-3-mini / grok-code-fast-1 slugs still resolve (the Vercel AI SDK page still lists them) was not confirmed against xAI docs; treat as retired/redirected.

## 2. Compatibility: OpenAI SDK, Anthropic SDK, Responses API, official SDKs, Vercel AI SDK

### Takeaway
The supported integration surface is OpenAI-compatible: `baseURL: https://api.x.ai/v1` with both Chat Completions and the Responses API (the Responses API is the primary one and is required for server-side tools). Anthropic-SDK compatibility appears to be deprecated. Vercel's `@ai-sdk/xai` provider is first-class and current.

### Cited Findings
- xAI doc examples use the OpenAI Python SDK with `base_url="https://api.x.ai/v1"` and `client.responses.create(model="grok-4.7", ...)`. — [xAI X Search docs](https://docs.x.ai/developers/tools/x-search)
- The OpenAI JS SDK works for structured output via `client.chat.completions.parse` with `zodResponseFormat(schema, name)` and `baseURL` set to `https://api.x.ai/v1`. — [xAI structured outputs](https://docs.x.ai/docs/guides/structured-outputs)
- Anthropic compatibility: an older xAI integrations page says the API is "fully compatible with OpenAI and Anthropic SDKs", but a mirror of xAI's legacy-endpoints doc marks `POST /v1/messages` as deprecated with the Responses API as the replacement, and a developer reference lists Anthropic SDK compatibility as deprecated. Conflict; the live legacy page was not read directly. — [xAI integrations (older)](https://docs.x.ai/api/integrations); contradicted by [developersdigest compatibility reference](https://www.developersdigest.tech/reference/api-compatibility/xai)
- No 2026 release-notes entry mentions Anthropic compatibility. — [xAI release notes](https://docs.x.ai/docs/release-notes)
- Other API surfaces mentioned in release notes: gRPC (`GetCompletionsRequest`), WebSocket Responses API mode (May 2026), Context Compaction API (May 2026), `cost_in_usd_ticks` in the `usage` object (April 2026), `safety_identifier` field (September 2026), custom moderation `guidelines` array (October 2026). — [xAI release notes](https://docs.x.ai/docs/release-notes)
- An official xAI Python SDK exists (docs show `chat.stream()`, `chat.sample()`, `parse()` with Pydantic). — [xAI structured outputs](https://docs.x.ai/docs/guides/structured-outputs)
- Vercel AI SDK: `pnpm add ai @ai-sdk/xai`; `xai(modelId)` uses the xAI Responses API by default since AI SDK 7; `createXai({ apiKey, baseURL, headers, fetch })`; default baseURL `https://api.x.ai/v1`. Provider options include `reasoningEffort` ('none'|'low'|'medium'|'high'|'xhigh'), `serviceTier`, `maxTurns`, `promptCacheKey`, `store`, `previousResponseId`, `safetyIdentifier`. Also reachable through Vercel AI Gateway as `spacexai/grok-4.7`, though the Gateway does not expose every `@ai-sdk/xai` API. — [AI SDK xAI provider](https://ai-sdk.dev/providers/ai-sdk-providers/xai)
- Vercel provider limitations: server-side provider tools cannot be mixed with client-side function tools in one request; `grok-4.5` cannot disable reasoning; `grok-4.20-*` do not accept `reasoningEffort`; Batch API has no webhooks; realtime is experimental. — [AI SDK xAI provider](https://ai-sdk.dev/providers/ai-sdk-providers/xai)
- Cost tracking for per-user logging: the `usage` object includes `cost_in_usd_ticks`, and server-side tool usage is reported under `usage.server_side_tool_usage_details`. — [xAI release notes](https://docs.x.ai/docs/release-notes); [xAI X Search docs](https://docs.x.ai/developers/tools/x-search)

### Inferences
- Do not build on the Anthropic-compatible endpoint. Use the OpenAI SDK with a baseURL override, or `@ai-sdk/xai`.
- The app's existing per-user token logging maps directly onto the OpenAI-style `usage` object (prompt/completion/cached/reasoning tokens) plus `cost_in_usd_ticks`.

### Gaps
- No official xAI JavaScript/TypeScript SDK was confirmed; docs point JS users to the OpenAI SDK and Vercel AI SDK.
- OpenRouter's current Grok model pages (slugs, markup) were not checked in this session.

## 3. Structured outputs, function calling, streaming, prompt caching, batch, deferred completions

### Takeaway
Structured output with enforced JSON Schema is fully supported (`response_format: json_schema` on Chat Completions, `text.format` on Responses, Zod via OpenAI SDK or Vercel `Output.object`), which is a direct functional replacement for the current Gemini structured-JSON call. Prompt caching is automatic; the Batch API discount is only 20% (versus 50% at Google, Anthropic and OpenAI).

### Cited Findings
- `response_format.type` can be `"json_schema"` (schema under `response_format.json_schema`), `"json_object"`, or `"text"`. With supported schema features the response is guaranteed to match the schema. Tool-call arguments always conform to the tool schema (`strict` implicitly true). — [xAI structured outputs](https://docs.x.ai/docs/guides/structured-outputs)
- Supported schema features: string/number/integer/boolean/null/enum/const/array/object; anyOf, oneOf (treated as anyOf), allOf with a single subschema; non-circular `$ref`/`$defs`; enforced formats date, time, date-time, email, uuid, ipv4, ipv6, uri; nullable via type arrays; optional fields (anything not in `required`); `additionalProperties` defaults to false. — [xAI structured outputs](https://docs.x.ai/docs/guides/structured-outputs)
- Enforcement limits: `minLength`/`maxLength` up to 2,048; `minItems`/`maxItems` up to 256; `minProperties`/`maxProperties` up to 64. Best-effort only: `not`, `if/then/else`, multi-subschema `allOf`. Rejected with 400: zero-variant enum/anyOf, boolean property schemas, `minContains`/`maxContains`, array-form `items`. Regex `pattern` supports an ECMAScript subset without lookarounds, backreferences or `\p{}`. — [xAI structured outputs](https://docs.x.ai/docs/guides/structured-outputs)
- Structured output can be combined with server-side agentic tools (model searches, then returns schema-conforming JSON) and with client-side function calling (loop on tool calls, then a final schema call). Structured outputs with tools requires a Grok 4 family model. — [xAI structured outputs](https://docs.x.ai/docs/guides/structured-outputs)
- Streaming structured output is documented for the xAI Python SDK (partial JSON chunks, parse at the end). — [xAI structured outputs](https://docs.x.ai/docs/guides/structured-outputs)
- Prompt caching is automatic for matching message prefixes; setting the `x-grok-conv-id` header (or `prompt_cache_key`) improves hit rate; cached tokens are billed at the cached-input rate. — [xAI prompt caching](https://docs.x.ai/developers/advanced-api-usage/prompt-caching)
- Cached-input rates: $0.20/M on grok-4.3 and grok-4.20 (84% off the $1.25 input rate), $0.50/M on grok-4.7/4.6, $0.30/M on grok-4.5. — [xAI pricing](https://docs.x.ai/developers/pricing)
- Batch API: 20% off standard rates for grok-4.7, 4.6, 4.5, 4.3 and the grok-4.20 models (input, output, cached, reasoning tokens); models not listed (e.g., grok-build-0.1) get no discount; image/video at standard rates; batch requests do not count toward rate limits. Released January 2026; JSONL upload via Files API and tool support added March 2026. No webhooks. — [xAI pricing](https://docs.x.ai/developers/pricing); [xAI release notes](https://docs.x.ai/docs/release-notes); [AI SDK xAI provider](https://ai-sdk.dev/providers/ai-sdk-providers/xai)
- Deferred chat completions exist as a distinct API surface (listed alongside Chat Completions, Responses and Batch in the September 2026 `safety_identifier` note, and listed among features disabled by Zero Data Retention). — [xAI release notes](https://docs.x.ai/docs/release-notes); [xAI security FAQ](https://docs.x.ai/developers/faq/security)

### Inferences
- The app's dictionary schema (word, dialect variants, gender enum, example arrays) uses only features in the "guaranteed enforcement" set, so a port from Gemini `responseSchema` to xAI `json_schema` should be mechanical.
- A stable system prompt plus schema preamble shared across lookups will hit the automatic cache; on grok-4.3 that moves the fixed part of the ~600 input tokens from $1.25/M to $0.20/M, but output tokens dominate cost anyway.
- For offline bulk jobs (pre-generating dictionary entries), xAI's 20% batch discount is much weaker than competitors' 50%.

### Gaps
- Minimum cacheable prefix length and cache TTL are not stated on the caching overview page.
- Deferred completions details (polling endpoint, result retention window, pricing) were not read.
- JS streaming of structured output is not explicitly documented by xAI (it works via Vercel AI SDK streaming in principle; unverified here).

## 4. Server-side tools: web search, X search, code execution, collections, MCP

### Takeaway
All server-side tools run through the Responses API with per-invocation fees on top of tokens. X Search can be restricted to up to 20 handles and to a date range, but there is no documented language filter; language targeting has to be done through the prompt/keyword operators or by whitelisting Kurdish-language accounts. X Search bills per item returned ($5 per 1k posts), so cost scales with how many posts the model pulls.

### Cited Findings
Tool pricing (2026-11-13):

| Tool | Price |
|---|---|
| Web Search (`web_search`, includes image search) | $5 per 1k calls |
| X Search (`x_search`) | $5 per 1k posts fetched; $10 per 1k user profiles fetched |
| Code Execution (`code_execution` / `code_interpreter`) | $5 per 1k calls |
| File Attachments (`attachment_search`) | $5 per 1k calls |
| Collections Search (`collections_search` / `file_search`) | $2.50 per 1k calls |
| View Image, View X Video, Remote MCP tools | tokens only, no invocation fee |
| Image Generation tool | Imagine API rates |
| File storage / Collection storage | $0.025 / $0.10 per GiB per day; downloads $0.20 per GiB |

— [xAI pricing](https://docs.x.ai/developers/pricing)

- X Search bills per item returned, including parent and quoted posts; counts accumulate across calls and are not de-duplicated. Usage is reported in `usage.server_side_tool_usage_details` (`x_posts_fetched`, `x_users_fetched`, `x_search_calls`). xAI advises narrowing handles and dates and using `max_turns` to limit cost. — [xAI pricing](https://docs.x.ai/developers/pricing); [xAI X Search docs](https://docs.x.ai/developers/tools/x-search)
- X Search exposes four internal functions the model chooses among: `x_keyword_search` (uses X advanced search operators, sorted Top or Latest), `x_semantic_search`, `x_user_search`, `x_thread_fetch`. — [xAI X Search docs](https://docs.x.ai/developers/tools/x-search)
- X Search parameters: `allowed_x_handles` (max 20; 10 per the xAI page for the Vercel SDK, 20 per the Vercel page; no `@`; mutually exclusive with `excluded_x_handles`), `excluded_x_handles` (max 20), `from_date` / `to_date` (`YYYY-MM-DD`, UTC, `to_date` exclusive; date-times not applied), `enable_image_understanding`, `enable_video_understanding`. Handle and date filters apply to keyword and semantic searches but not to thread fetches. No language filter parameter is documented. — [xAI X Search docs](https://docs.x.ai/developers/tools/x-search); [AI SDK xAI provider](https://ai-sdk.dev/providers/ai-sdk-providers/xai)
- Web Search parameters: `allowed_domains` or `excluded_domains` (max 5 each, mutually exclusive), `enable_image_understanding`, `enable_image_search` (May 2026). Responses API shape: `tools: [{ type: "web_search", filters: { allowed_domains: [...] } }]`. — [xAI web search docs](https://docs.x.ai/docs/guides/tools/search-tools)
- Results carry citations (Vercel AI SDK returns them as `sources`). — [xAI X Search docs](https://docs.x.ai/developers/tools/x-search)
- Vercel provider tools: `xai.tools.webSearch()`, `xSearch()`, `codeExecution()`, `viewImage()`, `viewXVideo()`, `imageGeneration()`, `mcpServer({ serverUrl, serverLabel, allowedTools, headers, authorization })`, `fileSearch({ vectorStoreIds, maxNumResults })` (grok-4 family; needs `include: ['file_search_call.results']`). — [AI SDK xAI provider](https://ai-sdk.dev/providers/ai-sdk-providers/xai)
- Files API supports TTL (`expires_after`/`expires_at`, April 2026) and public URLs (June 2026). — [xAI release notes](https://docs.x.ai/docs/release-notes)

### Inferences
- For mining real Kurdish usage examples: because `x_keyword_search` accepts X's advanced search operators, the model can be instructed to include a `lang:` operator in its queries, but this relies on prompt compliance and on X's own language detection (which is weak for Kurmanji/Sorani/Zazaki and likely absent for Zazaki). A curated whitelist of up to 20 Kurdish-language accounts per request via `allowed_x_handles`, plus a date window, is the only hard, documented restriction.
- Cost shape of an "attested example" lookup on grok-4.3: tokens (search results inflate input to several thousand tokens) plus roughly $0.05-$0.15 if the model pulls 10-30 posts. That is 25-75x the cost of a plain dictionary lookup, so it should be a premium or cached feature, not the default path.
- This X-search capability is the one thing Grok offers that Gemini/Claude/OpenAI cannot replicate; it is the main argument for adding Grok at all.

### Gaps
- No documented `lang` or language filter parameter on `x_search`; whether the `lang:` operator is honored inside `x_keyword_search` was not verified.
- Collections (RAG) limits (file types, max size, embedding model) and code-execution sandbox details were not read.
- Whether server-side tools are available on Chat Completions (vs Responses only) was not confirmed from xAI's page; the Vercel docs state provider tools require the Responses API.

## 5. Voice: speech-to-speech, TTS, STT — languages and pricing

### Takeaway
Kurdish is not on any xAI voice language list. Turkish and Arabic are officially supported in both STT and TTS; Persian is supported in STT only. Voice pricing is low (STT $0.10/hour, TTS $15 per 1M characters, realtime $0.08/minute), but it is not usable for Kurdish pronunciation or dictation on documented evidence.

### Cited Findings
- Pricing: Speech-to-Speech (`grok-voice-3.0`) $0.08/min ($4.80/hr) plus $0.004 per text input; Speech-to-Text $0.10/hr (REST) and $0.20/hr (streaming); Text-to-Speech $15.00 per 1M characters. — [xAI pricing](https://docs.x.ai/developers/pricing)
- Endpoints: realtime `wss://api.x.ai/v1/realtime?model=grok-voice-latest`; TTS `https://api.x.ai/v1/tts` (plus WebSocket streaming); STT `https://api.x.ai/v1/stt`; custom voices `https://api.x.ai/v1/custom-voices`. Ephemeral tokens are supported for client-side use. Custom voice cloning from a reference clip of up to 120 seconds (May 2026). — [xAI voice overview](https://docs.x.ai/developers/model-capabilities/audio/voice)
- STT languages (38 listed): Arabic (ar, plus ar-EG/ar-AE/ar-SA), Bosnian, Bulgarian, Cantonese, Catalan, Chinese, Croatian, Czech, Danish, Dutch, English, Filipino, Finnish, French, German, Greek, Hindi, Hungarian, Indonesian, Italian, Japanese, Korean, Macedonian, Malay, Norwegian Bokmål, Persian (fa), Polish, Portuguese, Romanian, Russian, Slovak, Spanish, Swedish, Thai, Turkish (tr), Ukrainian, Urdu, Vietnamese. Kurdish is not listed. Max file 500 MB; word-level timestamps, diarization, multichannel. — [xAI speech-to-text](https://docs.x.ai/developers/model-capabilities/audio/speech-to-text)
- TTS languages: English, Arabic (ar-EG, ar-SA, ar-AE only), Bengali, Chinese (Simplified), French, German, Hindi, Indonesian, Italian, Japanese, Korean, Portuguese (pt-BR, pt-PT), Russian, Spanish (es-MX, es-ES), Turkish, Vietnamese, plus `auto`. Kurdish and Persian are not listed; the page says other languages may work "with varying degrees of accuracy". Voices include `eve` (default), `ara`, `rex`; full list via `GET https://api.x.ai/v1/tts/voices`. Limit 60,000 characters per unary request. — [xAI text-to-speech](https://docs.x.ai/developers/model-capabilities/audio/text-to-speech)
- Timeline: TTS GA March 2026; STT GA April 2026 (25 languages at launch); Grok Voice 1.0 April 2026; 2.0 July 2026; 3.0 October 2026. — [xAI release notes](https://docs.x.ai/docs/release-notes)
- Voice endpoints are rate-limited by RPS and concurrent sessions, not tokens. — [xAI rate limits](https://docs.x.ai/developers/rate-limits)

### Inferences
- xAI voice is usable for the Turkish/Arabic/English UI side (e.g., reading definitions aloud in Turkish) but not for Kurdish headwords. Feeding Kurmanji (Latin script) to the Turkish TTS voice would produce Turkish-accented and partly wrong phonology (e.g., ê, û, x, q, w); Sorani in Arabic script through an Arabic voice would be worse. This should be tested before any user-facing use.

### Gaps
- No documented language list for speech-to-speech (`grok-voice-3.0`) was found; the overview only says voices speak "every supported language".
- No evidence either way on actual Kurdish quality; only absence from official lists.

## 6. Free credits, data sharing, retention/training, residency, EU/Turkey

### Takeaway
API data is retained 30 days by default and is not used for training without explicit permission; Zero Data Retention is available team-wide but disables the stateful Responses API, Files, Collections, Batch and deferred completions. There is no EU regional endpoint (only a US one), and current free-credit programs could not be confirmed from xAI's own pages.

### Cited Findings
- "By default, all API requests and responses are stored on our servers (encrypted at rest) for 30 days" for auditing, then automatically deleted. — [xAI security FAQ](https://docs.x.ai/developers/faq/security)
- The FAQ states the company "never trains on your API inputs or outputs without your explicit permission." — [xAI security FAQ](https://docs.x.ai/developers/faq/security)
- Zero Data Retention: prompts/outputs never persisted to disk; set team-wide in Console Team Settings (after deleting Files and Collections); verified by the `x-zero-data-retention` response header. Disables stateful Responses API, Files, Collections, Batch API, deferred completions, stored image/video outputs, voice agent history. — [xAI security FAQ](https://docs.x.ai/developers/faq/security)
- The default endpoint `https://api.x.ai` does not guarantee a processing region. The only regional endpoint documented is the US one (`https://us.api.x.ai/v1`, grok-4.7 and grok-4.6 only, +10%). No EU endpoint is mentioned. SOC 2 Type 2 is stated; GDPR and a DPA are not mentioned in the FAQ; HIPAA via BAA questionnaire; enterprise contact sales@x.ai. — [xAI security FAQ](https://docs.x.ai/developers/faq/security); [xAI pricing](https://docs.x.ai/developers/pricing)
- Grok 4.5 was made available in the API console for EU users in July 2026 (implies newer models can reach EU accounts with a delay). — [xAI release notes](https://docs.x.ai/docs/release-notes)
- Free credits (conflicting, possibly stale): a mirror of xAI docs describes $150/month in API credits for teams that opt in to data sharing, requiring $5 prior spend, with no opt-out after opting in. — [apidog mirror](https://share.apidog.com/apidoc/docs-site/750118/free-credits-934025m0); contradicted by a review of xAI's own pages that found no signup credit and no free-credit program — [benchlm.ai](https://benchlm.ai/md/free-tier/xai.md), and by a tracker stating free API credits are no longer offered as of 2026-04-13 — [agentdeals.dev](https://agentdeals.dev/vendor/xai)
- xAI's pricing page does not mention free credits or data sharing. — [xAI pricing](https://docs.x.ai/developers/pricing)
- Turkey: in July 2025 a Turkish court ordered a block on Grok content on X; in September 2025 a court ordered Grok's entire X account blocked (reported as not enforced); at least 12 Grok posts were blocked in four cases between February 2025 and August 2026. The reporting concerns Grok on X, not the developer API. — [bianet](https://bianet.org/haber/turkish-court-orders-access-ban-on-grok-over-national-security-concerns-311424); [Stockholm Center for Freedom](https://stockholmcf.org/?p=74600)

### Inferences
- If the data-sharing credit program still exists, opting in is irreversible and would send users' Kurdish queries to xAI for training; for a product serving a politically sensitive minority-language community, and with EU users, that trade is hard to justify.
- With no EU residency option and no DPA visible in public docs, GDPR-sensitive deployment requires a signed DPA via sales, or routing only non-personal content (the looked-up word, no user identifiers) to xAI. A dictionary lookup can easily be sent without personal data.
- Server-to-server API calls from the Express backend are not affected by Turkish blocks on Grok's X content; the risk is reputational/regulatory (Grok's output on Kurdish political topics) rather than technical. Hosting region of the backend, not the end user, determines API reachability.

### Gaps
- Current status of the data-sharing credit program: not confirmable from xAI's own pages; check the Console billing page.
- No xAI startup program information was found in this session.
- No source addresses whether api.x.ai is reachable from Turkish IP ranges or whether Turkish billing addresses are accepted.
- Enterprise terms (SLA, DPA, EU processing) are behind sales/Trust Center.

## 7. Practical integration for Node/Express TypeScript and cost per 1,000 lookups

### Takeaway
Integration is a small adapter: either the OpenAI SDK with `baseURL: "https://api.x.ai/v1"` and a Zod schema, or `@ai-sdk/xai` behind a provider-agnostic `generateText` + `Output.object` call that also covers Google and Anthropic. On cost, Grok is not competitive for plain lookups: about $2.00 per 1,000 lookups on grok-4.3 versus $0.90 on gemini-3.1-flash-lite, $0.31 on Claude Haiku 5.5 and $0.23-$0.75 on GPT nano-class.

### Cited Findings
Comparison prices (per 1M tokens, standard tier, read 2026-11-13):

| Model | Input | Cached | Output | Batch discount | Source |
|---|---|---|---|---|---|
| grok-4.3 / grok-4.20-0309-non-reasoning | $1.25 | $0.20 | $2.50 | 20% | [xAI](https://docs.x.ai/developers/pricing) |
| grok-build-0.1 | $1.00 | $0.20 | $2.00 | none | [xAI](https://docs.x.ai/developers/pricing) |
| grok-4.7 | $2.00 | $0.50 | $6.00 | 20% | [xAI](https://docs.x.ai/developers/pricing) |
| gemini-3.1-flash-lite | $0.25 | $0.025 | $1.50 | 50% | [Google](https://aistudio.google.com/docs/pricing) |
| gemini-3.5-flash-lite | $0.30 | $0.03 | $2.50 | 50% | [Google](https://aistudio.google.com/docs/pricing) |
| gemini-2.5-flash-lite | $0.10 | $0.01 | $0.40 | 50% | [Google](https://aistudio.google.com/docs/pricing) |
| gemini-3.8-flash / 3.6-flash | $0.75 (doubles to $1.50 on 2027-01-01) | $0.075 | $3.75 (to $7.50) | 50% | [Google](https://aistudio.google.com/docs/pricing) |
| Claude Haiku 5.5 (prompts up to 100k) | $0.10 | $0.01 (cache hit) | $0.50 | 50% | [Anthropic](https://platform.claude.com/docs/en/about-claude/pricing) |
| Claude Haiku 4.5 | $1.00 | $0.10 | $5.00 | 50% | [Anthropic](https://platform.claude.com/docs/en/about-claude/pricing) |
| gpt-5.4-mini | $0.75 | $0.075 | $4.50 | 50% | [OpenAI](https://developers.openai.com/api/docs/pricing) |
| gpt-5.4-nano | $0.20 | $0.02 | $1.25 | 50% | [OpenAI](https://developers.openai.com/api/docs/pricing) |
| gpt-5-mini | $0.25 | $0.025 | $2.00 | 50% | [OpenAI](https://developers.openai.com/api/docs/pricing) |
| gpt-5-nano | $0.05 | $0.005 | $0.40 | 50% | [OpenAI](https://developers.openai.com/api/docs/pricing) |

- Google's page lists the GA ID `gemini-3.1-flash-lite`; the `gemini-3.1-flash-lite-preview` ID the app uses is not on the pricing page. `gemini-2.5-flash` is marked deprecated and routes to `gemini-3.5-flash-lite` on 2026-12-01. Gemini output prices include thinking tokens. — [Google AI pricing](https://aistudio.google.com/docs/pricing)
- OpenAI's page also lists `gpt-5.6-luna` and `gpt-6-luna` models that are not labelled mini/nano; they were not priced here. — [OpenAI pricing](https://developers.openai.com/api/docs/pricing)
- Vercel AI SDK pattern for xAI structured output: `generateText` with `model: xai.responses('grok-4.7')` and `output: Output.object({ schema })` where `schema` is a Zod object. — [xAI structured outputs](https://docs.x.ai/docs/guides/structured-outputs); [AI SDK xAI provider](https://ai-sdk.dev/providers/ai-sdk-providers/xai)
- OpenAI SDK pattern: `client.chat.completions.parse` with `response_format: zodResponseFormat(schema, name)`, result at `choices[0].message.parsed`; Responses variant uses `text.format` with `type: "json_schema"`, `strict: true`. — [xAI structured outputs](https://docs.x.ai/docs/guides/structured-outputs)

### Inferences
Cost per 1,000 lookups at 600 input + 500 output tokens each (= 0.6M input + 0.5M output tokens; my arithmetic from the cited prices; no caching; assumes reasoning/thinking is off or negligible, otherwise output cost rises):

| Model | Standard | With batch discount |
|---|---|---|
| gpt-5-nano | $0.23 | $0.115 |
| gemini-2.5-flash-lite | $0.26 | $0.13 |
| Claude Haiku 5.5 | $0.31 | $0.155 |
| gpt-5.4-nano | $0.745 | $0.37 |
| gemini-3.1-flash-lite (current app model family) | $0.90 | $0.45 |
| gpt-5-mini | $1.15 | $0.575 |
| gemini-3.5-flash-lite | $1.43 | $0.715 |
| grok-build-0.1 | $1.60 | $1.60 (no discount) |
| grok-4.3 / grok-4.20-non-reasoning | $2.00 | $1.60 |
| gemini-3.8-flash | $2.325 (becomes $4.65 on 2027-01-01) | $1.16 |
| gpt-5.4-mini | $2.70 | $1.35 |
| Claude Haiku 4.5 | $3.10 | $1.55 |
| grok-4.7 | $4.20 | $3.36 |

- Grok's cheapest suitable model (grok-4.3) is about 2.2x gemini-3.1-flash-lite, 6.5x Claude Haiku 5.5 and 8.7x gpt-5-nano for this workload. It is in the price band of mid-tier "Flash/mini" models, not the "lite/nano" band. Grok should be positioned as an optional premium/secondary model or as the engine for the X-search feature, not as the default lookup model.
- Caution on reasoning tokens: on grok-4.3 set reasoning effort to `none` (or use `grok-4.20-0309-non-reasoning`); with reasoning on, hidden reasoning tokens are billed as output and can multiply the $1.25 output share.

Minimal code shape, option A (OpenAI SDK; sketch assembled from the documented patterns, not copied verbatim from docs, and untested):

```ts
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

const Entry = z.object({
  word: z.string(),
  dialect: z.enum(["kurmanji", "sorani", "zazaki"]),
  variants: z.array(z.object({ dialect: z.string(), form: z.string() })),
  gender: z.enum(["masculine", "feminine", "none"]).nullable(),
  examples: z.array(z.object({ text: z.string(), translation: z.string() })),
});

const xai = new OpenAI({ apiKey: process.env.XAI_API_KEY, baseURL: "https://api.x.ai/v1" });

export async function lookupWithGrok(word: string, uiLang: string) {
  const r = await xai.chat.completions.parse({
    model: "grok-4.3",                       // or "grok-4.20-0309-non-reasoning"
    messages: [
      { role: "system", content: SYSTEM_PROMPT },   // keep byte-identical for cache hits
      { role: "user", content: `Word: ${word}\nExplain in: ${uiLang}` },
    ],
    response_format: zodResponseFormat(Entry, "dictionary_entry"),
  });
  return { entry: r.choices[0].message.parsed, usage: r.usage }; // log usage per user
}
```

Option B (Vercel AI SDK, one call site for all providers; sketch):

```ts
import { generateText, Output } from "ai";
import { xai } from "@ai-sdk/xai";
import { google } from "@ai-sdk/google";
import { anthropic } from "@ai-sdk/anthropic";

const chain = [google("gemini-3.1-flash-lite"), anthropic("claude-haiku-5-5"), xai("grok-4.3")];

export async function lookup(prompt: string) {
  let lastErr: unknown;
  for (const model of chain) {
    try {
      const res = await generateText({ model, system: SYSTEM_PROMPT, prompt,
        output: Output.object({ schema: Entry }),
        providerOptions: { xai: { reasoningEffort: "none" } } });
      return { entry: res.output, usage: res.usage, model: model.modelId };
    } catch (e) { lastErr = e; }           // 429/5xx/schema failure -> next provider
  }
  throw lastErr;
}
```

- Routing options: (1) keep `@google/genai` as-is and add a thin `LLMProvider` interface with a second OpenAI-SDK-based adapter for xAI (smallest diff); (2) migrate all providers to the Vercel AI SDK for uniform structured output, usage objects and fallback; (3) Vercel AI Gateway (`spacexai/grok-4.7` slugs) or OpenRouter for a single key and built-in fallback, at the cost of an extra hop/processor and incomplete feature exposure (the Gateway does not expose every xAI API, per the AI SDK docs).
- The X-search feature needs the Responses API (`tools: [{ type: "x_search", allowed_x_handles: [...], from_date, to_date }]` or `xai.tools.xSearch({ allowedXHandles, fromDate, toDate })`), with `max_turns` capped and results cached in Firestore per headword to bound the per-post fees.
- Usage logging: record `prompt_tokens`, `completion_tokens`, cached and reasoning tokens, plus `cost_in_usd_ticks` and `server_side_tool_usage_details` where present; per-provider price tables are needed because cached/reasoning accounting differs.

### Gaps
- The exact Anthropic API model ID string for Haiku 5.5 and the exact property name for the parsed object in the current AI SDK version (`output` vs `_output`; xAI's docs page shows `result._output`) were not verified; check before coding.
- No quality evidence was gathered on Grok's Kurmanji/Sorani/Zazaki accuracy versus Gemini/Claude; price comparison alone does not settle model choice. A small blind evaluation on a fixed word list is needed.
- OpenRouter pricing/markup and current Grok slugs were not checked.
- Google's pricing page was read only up to its first 100k characters; additional Flash-Lite variants further down may exist. The summary also hinted at a 2026-12-01 price change for `gemini-3.5-flash-lite` without showing the new figures.
