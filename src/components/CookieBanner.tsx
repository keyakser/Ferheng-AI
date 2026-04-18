import { useState, useEffect } from "react";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  };

  const reject = () => {
    localStorage.setItem("cookie-consent", "rejected");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background border-t border-border shadow-lg">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm text-muted-foreground flex-1 leading-relaxed">
          FerhengAI.com, hizmet kalitesini artırmak için çerezler kullanmaktadır. 
          Zorunlu çerezler her zaman aktiftir. Analitik çerezler için onayınız gerekmektedir.{" "}
          <a href="/privacy" className="text-primary underline hover:no-underline">
            Gizlilik Politikası
          </a>
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={reject}
            className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors"
          >
            Reddet
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            Kabul Et
          </button>
        </div>
      </div>
    </div>
  );
}
