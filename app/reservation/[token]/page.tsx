"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Edit3, AlertTriangle, Car, Calendar, MapPin, Clock, Loader2 } from "lucide-react";
import { LOCATIONS } from "@/lib/data";

type Reservation = {
  id: string; carId: string; clientFirstName: string; clientLastName: string;
  clientEmail: string; clientPhone: string; pickupDate: string; dropoffDate: string;
  pickupLocation: string; dropoffLocation: string; pickupTime?: string; dropoffTime?: string;
  totalPrice: number; deliveryFee?: number; recoveryFee?: number;
  durationDays: number; status: string; message?: string; createdAt: string;
};

type View = "loading" | "error" | "detail" | "modify" | "cancel" | "success-modify" | "success-cancel";

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  pending:   { label: "En attente de confirmation", color: "#f59e0b" },
  confirmed: { label: "Confirmée",                   color: "#10b981" },
  cancelled: { label: "Annulée",                     color: "#ef4444" },
};

const inp = "w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-[#D4A96A]/60 transition-colors";

export default function ReservationPortal() {
  const { token } = useParams<{ token: string }>();
  const searchParams = useSearchParams();

  const [view, setView]         = useState<View>("loading");
  const [reservation, setRes]   = useState<Reservation | null>(null);
  const [carName, setCarName]   = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [working, setWorking]   = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const [form, setForm] = useState({
    pickupDate: "", dropoffDate: "", pickupLocation: "", dropoffLocation: "",
    pickupTime: "", dropoffTime: "",
  });

  // Chargement initial
  useEffect(() => {
    if (!token) return;
    fetch(`/api/reservations/${encodeURIComponent(token)}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { setErrorMsg(data.error); setView("error"); return; }
        setRes(data.reservation);
        setCarName(data.carName);
        setForm({
          pickupDate:     data.reservation.pickupDate,
          dropoffDate:    data.reservation.dropoffDate,
          pickupLocation: data.reservation.pickupLocation,
          dropoffLocation:data.reservation.dropoffLocation,
          pickupTime:     data.reservation.pickupTime  ?? "",
          dropoffTime:    data.reservation.dropoffTime ?? "",
        });
        const action = searchParams.get("action");
        setView(action === "cancel" ? "cancel" : action === "modify" ? "modify" : "detail");
      })
      .catch(() => { setErrorMsg("Impossible de charger la réservation."); setView("error"); });
  }, [token, searchParams]);

  const handleModify = async (e: React.FormEvent) => {
    e.preventDefault();
    setWorking(true);
    const res = await fetch(`/api/reservations/${encodeURIComponent(token)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setWorking(false);
    if (!res.ok) { setErrorMsg(data.error ?? "Erreur"); return; }
    setRes(data.reservation);
    setView("success-modify");
  };

  const handleCancel = async () => {
    setWorking(true);
    const res = await fetch(`/api/reservations/${encodeURIComponent(token)}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason: cancelReason }),
    });
    const data = await res.json();
    setWorking(false);
    if (!res.ok) { setErrorMsg(data.error ?? "Erreur"); return; }
    setRes(data.reservation);
    setView("success-cancel");
  };

  /* ── Helpers UI ── */
  const Row = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-start gap-3 py-3 border-b border-white/6 last:border-0">
      <span className="text-gray-500 text-sm w-40 shrink-0">{label}</span>
      <span className="text-white text-sm font-semibold">{value}</span>
    </div>
  );

  /* ── States ── */
  if (view === "loading") return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <Loader2 size={32} className="text-[#D4A96A] animate-spin" />
    </div>
  );

  if (view === "error") return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <XCircle size={48} className="text-red-400 mx-auto mb-4" />
        <h1 className="text-xl font-black text-white mb-2">Lien invalide</h1>
        <p className="text-gray-500 text-sm mb-6">{errorMsg}</p>
        <Link href="/" className="text-[#D4A96A] hover:underline text-sm">← Retour à l'accueil</Link>
      </div>
    </div>
  );

  if (view === "success-modify") return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
        <h1 className="text-xl font-black text-white mb-2">Modification enregistrée !</h1>
        <p className="text-gray-500 text-sm mb-6">Un email de confirmation vous a été envoyé. Notre équipe en est également notifiée.</p>
        <button onClick={() => setView("detail")} className="text-[#D4A96A] hover:underline text-sm">Voir ma réservation</button>
      </div>
    </div>
  );

  if (view === "success-cancel") return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <CheckCircle size={48} className="text-red-400 mx-auto mb-4" />
        <h1 className="text-xl font-black text-white mb-2">Réservation annulée</h1>
        <p className="text-gray-500 text-sm mb-6">Votre réservation a bien été annulée. Un email de confirmation vous a été envoyé.</p>
        <Link href="/fleet" className="yellow-btn px-6 py-3 rounded-xl font-bold text-sm inline-block">Voir notre flotte</Link>
      </div>
    </div>
  );

  const r = reservation!;
  const st = STATUS_LABEL[r.status] ?? { label: r.status, color: "#888" };
  const total = r.totalPrice + (r.deliveryFee ?? 0) + (r.recoveryFee ?? 0);
  const isCancelled = r.status === "cancelled";

  return (
    <main className="min-h-screen bg-[#0a0a0a] py-16 px-4">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-black text-white">
            ESON<span className="text-[#D4A96A]"> MAROC</span>
          </Link>
          <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">Portail de réservation</p>
        </div>

        {/* Card principale */}
        <div className="bg-[#111111] border border-white/8 rounded-2xl overflow-hidden mb-4">
          {/* Top */}
          <div className="bg-[#0d0d0d] border-b border-white/8 px-6 py-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Réservation</p>
              <p className="text-white font-black text-lg">#{r.id.slice(-8).toUpperCase()}</p>
            </div>
            <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: `${st.color}20`, color: st.color }}>
              {st.label}
            </span>
          </div>

          {/* Detail view */}
          {view === "detail" && (
            <div className="px-6 py-5">
              <div className="flex items-center gap-3 mb-5 p-4 bg-[#D4A96A]/5 border border-[#D4A96A]/20 rounded-xl">
                <Car size={20} className="text-[#D4A96A] shrink-0" />
                <div>
                  <p className="text-white font-bold">{carName}</p>
                  <p className="text-gray-500 text-xs">{r.durationDays} jour{r.durationDays > 1 ? "s" : ""} de location</p>
                </div>
                <p className="ml-auto text-[#D4A96A] font-black text-lg">{total.toLocaleString()} DH</p>
              </div>

              <Row label="Client" value={`${r.clientFirstName} ${r.clientLastName}`} />
              <Row label="Email" value={r.clientEmail} />
              <Row label="Téléphone" value={r.clientPhone} />
              <Row label="Livraison" value={`${r.pickupDate}${r.pickupTime ? " à " + r.pickupTime : ""}`} />
              <Row label="Lieu de livraison" value={r.pickupLocation} />
              <Row label="Récupération" value={`${r.dropoffDate}${r.dropoffTime ? " à " + r.dropoffTime : ""}`} />
              <Row label="Lieu récupération" value={r.dropoffLocation} />
              {r.deliveryFee ? <Row label="Frais livraison" value={`${r.deliveryFee} DH`} /> : null}
              {r.recoveryFee ? <Row label="Frais récupération" value={`${r.recoveryFee} DH`} /> : null}

              {!isCancelled && (
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setView("modify")}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#D4A96A] text-black font-bold py-3 rounded-xl text-sm hover:bg-[#b8894e] transition-colors">
                    <Edit3 size={15} /> Modifier
                  </button>
                  <button onClick={() => setView("cancel")}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 font-bold py-3 rounded-xl text-sm hover:bg-red-500/20 transition-colors">
                    <XCircle size={15} /> Annuler
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Modify view */}
          {view === "modify" && (
            <form onSubmit={handleModify} className="px-6 py-5 space-y-4">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Edit3 size={16} className="text-[#D4A96A]" /> Modifier la réservation
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#D4A96A] uppercase tracking-widest mb-1.5">Date livraison</label>
                  <input type="date" value={form.pickupDate} min={new Date().toISOString().split("T")[0]}
                    onChange={e => setForm({ ...form, pickupDate: e.target.value })} className={inp} required />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#D4A96A] uppercase tracking-widest mb-1.5">Heure livraison</label>
                  <input type="time" value={form.pickupTime}
                    onChange={e => setForm({ ...form, pickupTime: e.target.value })} className={inp} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#D4A96A] uppercase tracking-widest mb-1.5">Date récupération</label>
                  <input type="date" value={form.dropoffDate} min={form.pickupDate}
                    onChange={e => setForm({ ...form, dropoffDate: e.target.value })} className={inp} required />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#D4A96A] uppercase tracking-widest mb-1.5">Heure récupération</label>
                  <input type="time" value={form.dropoffTime}
                    onChange={e => setForm({ ...form, dropoffTime: e.target.value })} className={inp} />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#D4A96A] uppercase tracking-widest mb-1.5">Lieu de livraison</label>
                <select value={form.pickupLocation} onChange={e => setForm({ ...form, pickupLocation: e.target.value })} className={inp} style={{ colorScheme: "dark" }}>
                  {LOCATIONS.map(l => <option key={l} value={l} className="bg-[#1a1a1a]">{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#D4A96A] uppercase tracking-widest mb-1.5">Lieu de récupération</label>
                <select value={form.dropoffLocation} onChange={e => setForm({ ...form, dropoffLocation: e.target.value })} className={inp} style={{ colorScheme: "dark" }}>
                  {LOCATIONS.map(l => <option key={l} value={l} className="bg-[#1a1a1a]">{l}</option>)}
                </select>
              </div>
              {errorMsg && <p className="text-red-400 text-sm">{errorMsg}</p>}
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={working}
                  className="flex-1 yellow-btn py-3 rounded-xl font-bold text-sm disabled:opacity-60 flex items-center justify-center gap-2">
                  {working ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} />}
                  Confirmer la modification
                </button>
                <button type="button" onClick={() => setView("detail")}
                  className="px-5 py-3 bg-white/5 border border-white/10 text-gray-400 rounded-xl text-sm hover:bg-white/10 transition-colors">
                  Retour
                </button>
              </div>
            </form>
          )}

          {/* Cancel view */}
          {view === "cancel" && (
            <div className="px-6 py-5">
              <div className="flex items-center gap-3 mb-5 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <AlertTriangle size={20} className="text-red-400 shrink-0" />
                <p className="text-red-300 text-sm">Cette action est irréversible. Votre réservation sera définitivement annulée.</p>
              </div>
              <div className="mb-4">
                <label className="block text-[10px] font-bold text-[#D4A96A] uppercase tracking-widest mb-1.5">Motif d'annulation (optionnel)</label>
                <textarea value={cancelReason} onChange={e => setCancelReason(e.target.value)}
                  rows={3} placeholder="Ex: changement de planning..."
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-red-500/40 resize-none placeholder-gray-600" />
              </div>
              {errorMsg && <p className="text-red-400 text-sm mb-3">{errorMsg}</p>}
              <div className="flex gap-3">
                <button onClick={handleCancel} disabled={working}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl text-sm disabled:opacity-60 flex items-center justify-center gap-2 transition-colors">
                  {working ? <Loader2 size={15} className="animate-spin" /> : <XCircle size={15} />}
                  Confirmer l'annulation
                </button>
                <button onClick={() => setView("detail")}
                  className="px-5 py-3 bg-white/5 border border-white/10 text-gray-400 rounded-xl text-sm hover:bg-white/10 transition-colors">
                  Retour
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-gray-600 text-xs">
          Besoin d'aide ? Appelez-nous au{" "}
          <a href="tel:+212666890899" className="text-[#D4A96A] hover:underline">+212.666.89.08.99</a>
        </p>
      </div>
    </main>
  );
}
