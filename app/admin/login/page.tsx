"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [attempts, setAttempts] = useState(0);
  const MAX_ATTEMPTS = 5;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (attempts >= MAX_ATTEMPTS) {
      setError("Trop de tentatives. Veuillez patienter avant de réessayer.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setAttempts((n) => n + 1);
        setError(data.error ?? "Identifiants incorrects.");
        setLoading(false);
      }
    } catch {
      setError("Erreur réseau. Veuillez réessayer.");
      setLoading(false);
    }
  };

  const attemptsLeft = MAX_ATTEMPTS - attempts;

  return (
    <div className="min-h-screen bg-[#0d0d1a] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="text-3xl font-black text-white mb-1">
            ESON<span className="text-[#D4A96A]"> MAROC</span>
          </div>
          <p className="text-gray-500 text-sm">Espace Administrateur</p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
          <h1 className="text-xl font-bold text-white mb-6">Connexion</h1>

          <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                autoComplete="username"
                className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D4A96A]/60 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D4A96A]/60 transition-colors"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                {error}
                {attempts > 0 && attempts < MAX_ATTEMPTS && (
                  <span className="block text-xs mt-1 text-red-500/70">
                    {attemptsLeft} tentative(s) restante(s)
                  </span>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || attempts >= MAX_ATTEMPTS}
              className="w-full bg-[#D4A96A] text-black py-3.5 rounded-xl font-bold hover:bg-[#b8894e] transition-colors disabled:opacity-60 mt-2"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
