import { useState } from "react";

export function DataDeletion() {
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");

  const handleSubmit = async () => {
    if (!email || !consent) return;
    setStatus("loading");

    try {
      const res = await fetch("/api/request-deletion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, reason }),
      });
      if (res.ok) setStatus("success");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") return (
    <div className="max-w-lg mx-auto px-6 py-16 text-center">
      <div className="text-4xl mb-4">✓</div>
      <h2 className="text-xl font-semibold mb-2 text-foreground">Talebiniz Alındı</h2>
      <p className="text-muted-foreground">
        Veri silme talebiniz alınmıştır. 30 gün içinde verileriniz sistemlerimizden 
        kalıcı olarak silinecek ve size e-posta ile bildirim yapılacaktır.
      </p>
    </div>
  );

  return (
    <div className="max-w-lg mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold mb-2 text-foreground">Veri Silme Talebi</h1>
      <p className="text-muted-foreground mb-8 leading-relaxed">
        KVKK kapsamındaki haklarınız doğrultusunda FerhengAI.com'daki kişisel 
        verilerinizin silinmesini talep edebilirsiniz. Talebiniz 30 gün içinde işleme alınır.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            E-posta Adresiniz <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Hesabınıza kayıtlı e-posta"
            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Talep Sebebi (isteğe bağlı)
          </label>
          <textarea
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="Belirtmek istediğiniz bir neden varsa..."
            rows={3}
            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={consent}
            onChange={e => setConsent(e.target.checked)}
            className="mt-1 accent-primary"
          />
          <span className="text-xs text-muted-foreground leading-relaxed">
            Bu talebin geri alınamaz olduğunu ve hesabımın ile tüm verilerimin kalıcı olarak 
            silineceğini anlıyor ve onaylıyorum.
          </span>
        </label>

        <button
          onClick={handleSubmit}
          disabled={!email || !consent || status === "loading"}
          className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-40 transition-colors font-medium"
        >
          {status === "loading" ? "İşleniyor..." : "Verilerimi Sil"}
        </button>

        {status === "error" && (
          <p className="text-sm text-red-500 text-center">
            Bir hata oluştu. Lütfen{" "}
            <a href="mailto:kvkk@ferhengai.com" className="underline">kvkk@ferhengai.com</a>
            {" "}adresine yazın.
          </p>
        )}
      </div>
    </div>
  );
}
