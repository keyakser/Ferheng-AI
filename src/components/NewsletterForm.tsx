import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email) { setError("E-posta adresi gereklidir."); return; }
    if (!consent) { setError("Devam etmek için onay vermeniz gerekmektedir."); return; }
    setError("");
    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent: true }),
      });
      if (res.ok) setStatus("success");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") return (
    <p className="text-green-600 dark:text-green-400 font-medium">
      ✓ Abone oldunuz! Hoş geldin maili yolda.
    </p>
  );

  return (
    <div className="space-y-3 max-w-md">
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="email@adresiniz.com"
          className="flex-1 px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
        />
        <button
          onClick={handleSubmit}
          disabled={status === "loading" || !consent}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-40 transition-opacity"
        >
          {status === "loading" ? "..." : "Abone Ol"}
        </button>
      </div>

      {/* KVKK Onay Checkbox */}
      <label className="flex items-start gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={consent}
          onChange={e => setConsent(e.target.checked)}
          className="mt-1 accent-primary"
        />
        <span className="text-xs text-muted-foreground leading-relaxed">
          Kişisel verilerimin (e-posta adresim) bülten gönderimi amacıyla işlenmesine onay veriyorum.{" "}
          <a href="/privacy" className="text-primary underline hover:no-underline">
            Gizlilik Politikası
          </a>
        </span>
      </label>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
