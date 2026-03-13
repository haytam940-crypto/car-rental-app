"use client";
import { useState } from "react";
import Link from "next/link";

export default function TestEmailPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [result, setResult] = useState<{ message?: string; portalLink?: string; error?: string; detail?: string } | null>(null);

  const send = async () => {
    if (!email.includes("@")) return;
    setStatus("sending");
    setResult(null);
    try {
      const res = await fetch(`/api/test-email?to=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (res.ok) {
        setStatus("ok");
        setResult(data);
      } else {
        setStatus("error");
        setResult(data);
      }
    } catch {
      setStatus("error");
      setResult({ error: "Erreur réseau" });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#111111] border border-white/8 rounded-2xl p-8 space-y-6">

        {/* Header */}
        <div>
          <Link href="/admin" className="text-xs text-gray-500 hover:text-[#D4A96A] transition-colors mb-4 block">
            ← Retour admin
          </Link>
          <h1 className="text-xl font-black text-white">Test Email</h1>
          <p className="text-gray-500 text-sm mt-1">
            Envoie un email de confirmation réel avec des liens portail fonctionnels.
          </p>
        </div>

        {/* Input email */}
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">
            Adresse email destinataire
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="votre@email.com"
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#D4A96A]/50 transition-colors"
          />
        </div>

        {/* Contenu de l'email */}
        <div className="bg-[#0a0a0a] border border-white/6 rounded-xl p-4 text-xs text-gray-500 space-y-1">
          <p className="text-gray-400 font-semibold mb-2">L'email contiendra :</p>
          <p>🚗 Véhicule : <span className="text-white">Dacia Duster 2023</span></p>
          <p>📅 Livraison : <span className="text-white">18/03/2026 — 10:00 · Aéroport Ouarzazate</span></p>
          <p>📅 Récupération : <span className="text-white">21/03/2026 — 18:00 · Centre-ville</span></p>
          <p>💰 Total : <span className="text-[#D4A96A] font-bold">1 200 DH</span></p>
          <p className="pt-1 border-t border-white/6">
            🔗 Boutons : <span className="text-white">Gérer · Modifier · Annuler</span> (liens réels)
          </p>
        </div>

        {/* Bouton envoyer */}
        <button
          onClick={send}
          disabled={status === "sending" || !email.includes("@")}
          className="w-full py-3.5 rounded-xl font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-[#D4A96A] hover:bg-[#c49558] text-black"
        >
          {status === "sending" ? "Envoi en cours…" : "Envoyer l'email de test →"}
        </button>

        {/* Résultat */}
        {status === "ok" && result && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 space-y-3">
            <p className="text-green-400 font-bold text-sm">✓ {result.message}</p>
            {result.portalLink && (
              <div>
                <p className="text-gray-500 text-xs mb-1">Lien portail généré (pour tester sans email) :</p>
                <a
                  href={result.portalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#D4A96A] text-xs break-all hover:underline"
                >
                  {result.portalLink}
                </a>
              </div>
            )}
          </div>
        )}

        {status === "error" && result && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <p className="text-red-400 font-bold text-sm">✗ Erreur</p>
            <p className="text-gray-400 text-xs mt-1">{result.error}</p>
            {result.error?.includes("RESEND") || result.detail?.includes("RESEND_API_KEY") ? (
              <p className="text-yellow-400 text-xs mt-2">
                ⚠️ Ajoute <code className="bg-white/10 px-1 rounded">RESEND_API_KEY</code> dans ton .env.local
              </p>
            ) : null}
          </div>
        )}

        {/* Instructions clé API */}
        <div className="border-t border-white/6 pt-4">
          <p className="text-xs text-gray-600">
            Nécessite <code className="text-[#D4A96A]">RESEND_API_KEY</code> dans .env.local<br/>
            Obtenir la clé → <span className="text-[#D4A96A]">resend.com/api-keys</span>
          </p>
        </div>
      </div>
    </div>
  );
}
