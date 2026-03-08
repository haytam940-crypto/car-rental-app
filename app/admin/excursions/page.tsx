"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Excursion, ExcursionBooking } from "@/lib/data";
import {
  getMergedExcursionBookings, updateExcursionBookingStatus,
  saveExcursionBooking, getMergedExcursions, saveExcursion, deleteExcursion,
} from "@/lib/store";
import {
  LayoutDashboard, ClipboardList, Car, FileText, BarChart2,
  Mountain, Calendar, Globe, LogOut, X, Plus, CheckCircle, XCircle,
  MapPin, Clock, Users, Download, Search, Filter, RotateCcw,
  Edit2, Trash2, ImageIcon, Tag,
} from "lucide-react";

const TODAY = new Date().toISOString().split("T")[0];

const navLinks = [
  { href: "/admin/dashboard",    icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/reservations", icon: ClipboardList,   label: "Réservations" },
  { href: "/admin/cars",         icon: Car,             label: "Voitures" },
  { href: "/admin/invoices",     icon: FileText,        label: "Factures" },
  { href: "/admin/analytics",    icon: BarChart2,       label: "Analytique" },
  { href: "/admin/excursions",   icon: Mountain,        label: "Excursions" },
  { href: "/admin/planning",     icon: Calendar,        label: "Planning" },
  { href: "/admin/promotions",   icon: Tag, label: "Promotions" },
];

const statusStyle: Record<string, string> = {
  pending:   "bg-[#D4A96A]/15 text-[#D4A96A] border border-[#D4A96A]/20",
  confirmed: "bg-green-500/15 text-green-400 border border-green-500/20",
  cancelled: "bg-red-500/15 text-red-400 border border-red-500/20",
};
const statusLabel: Record<string, string> = {
  pending: "En attente", confirmed: "Confirmé", cancelled: "Annulé",
};

const DIFFICULTY_OPTIONS = ["Facile", "Modéré", "Difficile"] as const;
const CATEGORY_OPTIONS   = ["Désert", "Montagne", "Côte", "Ville", "Circuit"] as const;

const EMPTY_BOOKING_FORM = {
  excursionId: "", clientFirstName: "", clientLastName: "",
  clientPhone: "", clientEmail: "", participants: 1,
  date: TODAY, status: "confirmed" as ExcursionBooking["status"], message: "",
};

const EMPTY_EXC_FORM: Omit<Excursion, "id"> = {
  title: "", description: "", destination: "",
  duration: "1 jour", pricePerPerson: 0, maxParticipants: 10,
  includes: [], image: "",
  difficulty: "Facile", category: "Circuit",
};

// ─── Invoice generator ────────────────────────────────────────────────────────

function downloadExcursionInvoice(b: ExcursionBooking, exc: Excursion | undefined, invNum: string) {
  const priceHT  = Math.round(b.totalPrice / 1.2);
  const tva      = b.totalPrice - priceHT;
  const ppHT     = exc ? Math.round(exc.pricePerPerson / 1.2) : 0;
  const issued   = new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });

  const html = `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8"/><title>Facture Excursion ${invNum}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  @page{size:A4;margin:12mm}
  body{font-family:Arial,sans-serif;font-size:13px;color:#1a1a2e;background:#fff;padding:10px;width:190mm}
  .header{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:16px;border-bottom:3px solid #D4A96A;margin-bottom:20px}
  .logo{font-size:30px;font-weight:900;line-height:1}.logo span{color:#D4A96A}
  .logo small{display:block;font-size:11px;font-weight:400;color:#888;letter-spacing:2px;margin-top:3px}
  .company-block{text-align:right;font-size:11px;line-height:1.8;color:#555}
  .company-block strong{font-size:13px;color:#1a1a2e}
  .inv-meta{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px}
  .inv-title{font-size:22px;font-weight:900}.inv-title span{display:block;font-size:12px;font-weight:400;color:#888;margin-top:3px}
  .inv-badge{background:#D4A96A;color:#fff;padding:6px 16px;border-radius:6px;font-size:11px;font-weight:bold;letter-spacing:1px;display:inline-block;margin-top:8px}
  .inv-num{font-size:14px;font-weight:bold;text-align:right;margin-top:5px}
  .inv-date{font-size:11px;color:#888;text-align:right}
  .two-col{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:18px}
  .card{background:#f8f8f8;border-radius:10px;padding:14px 16px;border:1px solid #ebebeb}
  .card-title{font-size:10px;font-weight:bold;text-transform:uppercase;letter-spacing:1.5px;color:#999;margin-bottom:10px}
  .card-row{display:flex;justify-content:space-between;font-size:12.5px;padding:4px 0;border-bottom:1px solid #eee}
  .card-row:last-child{border-bottom:none}.card-row .lbl{color:#777}.card-row .val{font-weight:600;text-align:right;max-width:60%}
  .exc-bar{background:#1a1a2e;color:#fff;border-radius:10px;padding:14px 20px;margin-bottom:18px}
  .exc-bar-title{font-size:10px;color:#D4A96A;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;font-weight:bold}
  .exc-bar-name{font-size:16px;font-weight:900;margin-bottom:4px}.exc-bar-meta{font-size:11px;color:#aaa}
  .billing-table{width:100%;border-collapse:collapse;margin-bottom:16px}
  .billing-table thead tr{background:#1a1a2e;color:#fff}
  .billing-table thead th{padding:10px 14px;text-align:left;font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:.8px}
  .billing-table thead th:last-child{text-align:right}
  .billing-table tbody tr{border-bottom:1px solid #f0f0f0}
  .billing-table tbody td{padding:10px 14px;font-size:13px}.billing-table tbody td:last-child{text-align:right;font-weight:600}
  .totals{margin-left:auto;width:280px;margin-bottom:18px}
  .totals-row{display:flex;justify-content:space-between;padding:7px 14px;font-size:13px;border-bottom:1px solid #f0f0f0}
  .totals-row .t-lbl{color:#555}.totals-row .t-val{font-weight:600}
  .totals-tva{background:#fff8e1;border-radius:6px;padding:7px 14px;display:flex;justify-content:space-between;font-size:13px;margin-bottom:2px}
  .totals-tva .t-lbl{color:#b45309}.totals-tva .t-val{font-weight:700;color:#b45309}
  .totals-final{background:#D4A96A;border-radius:8px;padding:12px 16px;display:flex;justify-content:space-between;align-items:center}
  .totals-final .t-lbl{color:#fff;font-size:13px;font-weight:600}.totals-final .t-val{color:#fff;font-size:20px;font-weight:900}
  .payment-bar{display:flex;align-items:center;gap:10px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:10px 16px;margin-bottom:20px;font-size:12.5px}
  .paid-badge{background:#16a34a;color:#fff;padding:3px 12px;border-radius:20px;font-weight:bold;font-size:11px}
  .legal{background:#f8f8f8;border-radius:8px;padding:10px 14px;font-size:10px;color:#888;line-height:1.6;margin-bottom:14px}
  .footer{border-top:2px solid #D4A96A;padding-top:12px;display:flex;justify-content:space-between;align-items:center;font-size:10px;color:#999}
  .footer-ids{font-size:9.5px;color:#bbb;margin-top:4px}
  @media print{body{padding:0}}
</style></head><body>
  <div class="header">
    <div><div class="logo">ESON<span> MAROC</span><small>EXCURSIONS &amp; CIRCUITS</small></div></div>
    <div class="company-block">
      <strong>Eson Maroc S.A.R.L</strong><br>Av. Mohamed VI, en face de la RAM, Ouarzazate<br>
      Tél : +212.524.89.05.62 — GSM : +212.666.89.08.99<br>Email : contact@eson-maroc.com<br>Site : eson-maroc.com
    </div>
  </div>
  <div class="inv-meta">
    <div><div class="inv-title">FACTURE<span>Excursion &amp; Circuit</span></div><div class="inv-badge">EXCURSION</div></div>
    <div><div class="inv-num">${invNum}</div><div class="inv-date">Émise le ${issued}</div></div>
  </div>
  <div class="two-col">
    <div class="card">
      <div class="card-title">Facturé à</div>
      <div class="card-row"><span class="lbl">Nom complet</span><span class="val">${b.clientFirstName} ${b.clientLastName}</span></div>
      <div class="card-row"><span class="lbl">Téléphone</span><span class="val">${b.clientPhone}</span></div>
      ${b.clientEmail ? `<div class="card-row"><span class="lbl">Email</span><span class="val">${b.clientEmail}</span></div>` : ""}
      <div class="card-row"><span class="lbl">Participants</span><span class="val">${b.participants} personne(s)</span></div>
    </div>
    <div class="card">
      <div class="card-title">Détails Excursion</div>
      <div class="card-row"><span class="lbl">Destination</span><span class="val">${exc?.destination ?? "-"}</span></div>
      <div class="card-row"><span class="lbl">Durée</span><span class="val">${exc?.duration ?? "-"}</span></div>
      <div class="card-row"><span class="lbl">Date</span><span class="val">${b.date}</span></div>
      <div class="card-row"><span class="lbl">Difficulté</span><span class="val">${exc?.difficulty ?? "-"}</span></div>
    </div>
  </div>
  <div class="exc-bar">
    <div class="exc-bar-title">Excursion réservée</div>
    <div class="exc-bar-name">${exc?.title ?? "Excursion"}</div>
    <div class="exc-bar-meta">${exc?.includes?.join(" · ") ?? ""}</div>
  </div>
  <table class="billing-table">
    <thead><tr><th>Description</th><th>Quantité</th><th>P.U. HT</th><th>TVA</th><th>Montant HT</th><th>Montant TTC</th></tr></thead>
    <tbody>
      <tr>
        <td><strong>${exc?.title ?? "Excursion"}</strong><br><span style="font-size:11px;color:#888">Date : ${b.date} · Destination : ${exc?.destination ?? "-"}</span></td>
        <td>${b.participants} pers.</td><td>${ppHT} DH</td><td>20%</td><td>${priceHT} DH</td><td>${b.totalPrice} DH</td>
      </tr>
    </tbody>
  </table>
  <div class="totals">
    <div class="totals-row"><span class="t-lbl">Sous-total HT</span><span class="t-val">${priceHT} DH</span></div>
    <div class="totals-tva"><span class="t-lbl">TVA 20%</span><span class="t-val">+ ${tva} DH</span></div>
    <div class="totals-final"><span class="t-lbl">NET À PAYER TTC</span><span class="t-val">${b.totalPrice} DH</span></div>
  </div>
  <div class="payment-bar">
    <span class="paid-badge">✓ PAYÉ</span>
    <span style="color:#166534;font-weight:600">Règlement reçu — Merci pour votre confiance</span>
    <span style="margin-left:auto;color:#888;font-size:11px">Réf. ${b.id}</span>
  </div>
  <div class="legal">Excursion organisée par Eson Maroc S.A.R.L. Les participants doivent être en bonne condition physique. Eson Maroc se réserve le droit d'annuler ou modifier une excursion pour raisons de sécurité ou météorologiques. Annulation &lt; 48h : frais 50%.</div>
  <div class="footer">
    <div><div><strong>Eson Maroc S.A.R.L</strong> — Av. Mohamed VI, en face de la RAM, Ouarzazate</div><div class="footer-ids">ICE : 000000000000000 &nbsp;·&nbsp; RC : 000000 &nbsp;·&nbsp; Patente : 0000000</div></div>
    <div style="text-align:right"><div style="font-size:11px;color:#D4A96A;font-weight:bold">${invNum}</div><div style="font-size:10px;color:#bbb">Généré le ${issued}</div></div>
  </div>
</body></html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url  = URL.createObjectURL(blob);
  const win  = window.open(url, "_blank");
  if (win) { win.onload = () => { win.print(); URL.revokeObjectURL(url); }; }
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function AdminExcursionsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Bookings state
  const [bookings, setBookings] = useState<ExcursionBooking[]>([]);
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "confirmed" | "cancelled">("all");
  const [bookingModal, setBookingModal] = useState(false);
  const [bookingForm, setBookingForm] = useState(EMPTY_BOOKING_FORM);
  const [bookingError, setBookingError] = useState("");
  const [search, setSearch] = useState("");
  const [excFilter, setExcFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Excursion packages state
  const [excursions, setExcursions] = useState<Excursion[]>([]);
  const [tab, setTab] = useState<"bookings" | "packages">("bookings");
  const [excModal, setExcModal] = useState(false);
  const [excEditing, setExcEditing] = useState<Excursion | null>(null);
  const [excForm, setExcForm] = useState<Omit<Excursion, "id">>(EMPTY_EXC_FORM);
  const [excError, setExcError] = useState("");
  const [includeInput, setIncludeInput] = useState("");
  const [confirmDeleteExc, setConfirmDeleteExc] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionStorage.getItem("admin_token")) { router.push("/admin/login"); return; }
    setBookings(getMergedExcursionBookings());
    setExcursions(getMergedExcursions());
  }, [router]);

  const logout        = () => { sessionStorage.removeItem("admin_token"); router.push("/admin/login"); };
  const refreshB      = () => setBookings(getMergedExcursionBookings());
  const refreshExc    = () => setExcursions(getMergedExcursions());
  const resetFilters  = () => { setSearch(""); setExcFilter(""); setDateFrom(""); setDateTo(""); setStatusFilter("all"); };
  const hasFilters    = !!(search || excFilter || dateFrom || dateTo || statusFilter !== "all");

  // ── Booking handlers ──────────────────────────────────────────────────────
  const changeStatus = (id: string, status: "confirmed" | "cancelled") => {
    updateExcursionBookingStatus(id, status); refreshB();
  };

  const handleAddBooking = () => {
    setBookingError("");
    const { excursionId, clientFirstName, clientLastName, clientPhone, date, participants } = bookingForm;
    if (!excursionId)               return setBookingError("Veuillez sélectionner une excursion.");
    if (!clientFirstName || !clientLastName) return setBookingError("Veuillez remplir prénom et nom.");
    if (!clientPhone)               return setBookingError("Veuillez saisir un numéro de téléphone.");
    if (!date)                      return setBookingError("Veuillez choisir une date.");
    const exc = excursions.find(e => e.id === excursionId);
    saveExcursionBooking({
      id: `excb-manual-${Date.now()}`,
      excursionId, clientFirstName, clientLastName,
      clientPhone, clientEmail: bookingForm.clientEmail,
      participants, date,
      totalPrice: (exc?.pricePerPerson ?? 0) * participants,
      status: bookingForm.status,
      message: bookingForm.message || undefined,
      createdAt: TODAY,
    });
    refreshB(); setBookingModal(false); setBookingForm(EMPTY_BOOKING_FORM);
  };

  // ── Excursion package handlers ────────────────────────────────────────────
  const openAddExc = () => {
    setExcEditing(null);
    setExcForm(EMPTY_EXC_FORM);
    setExcError(""); setIncludeInput("");
    setExcModal(true);
  };

  const openEditExc = (exc: Excursion) => {
    setExcEditing(exc);
    setExcForm({ title: exc.title, description: exc.description, destination: exc.destination,
      duration: exc.duration, pricePerPerson: exc.pricePerPerson, maxParticipants: exc.maxParticipants,
      includes: [...exc.includes], image: exc.image, difficulty: exc.difficulty, category: exc.category });
    setExcError(""); setIncludeInput("");
    setExcModal(true);
  };

  const handleSaveExc = () => {
    setExcError("");
    if (!excForm.title.trim())       return setExcError("Le titre est requis.");
    if (!excForm.destination.trim()) return setExcError("La destination est requise.");
    if (!excForm.duration.trim())    return setExcError("La durée est requise.");
    if (excForm.pricePerPerson <= 0) return setExcError("Le prix doit être supérieur à 0.");
    if (excForm.maxParticipants <= 0) return setExcError("Le nombre max de participants doit être > 0.");

    const exc: Excursion = {
      id: excEditing?.id ?? `exc-custom-${Date.now()}`,
      ...excForm,
      title: excForm.title.trim(),
      destination: excForm.destination.trim(),
    };
    saveExcursion(exc);
    refreshExc();
    setExcModal(false);
  };

  const handleDeleteExc = (id: string) => {
    deleteExcursion(id);
    refreshExc();
    setConfirmDeleteExc(null);
  };

  const addInclude = () => {
    const val = includeInput.trim();
    if (val && !excForm.includes.includes(val)) {
      setExcForm(f => ({ ...f, includes: [...f.includes, val] }));
      setIncludeInput("");
    }
  };
  const removeInclude = (item: string) =>
    setExcForm(f => ({ ...f, includes: f.includes.filter(i => i !== item) }));

  // ── Filtered bookings ─────────────────────────────────────────────────────
  const filteredBookings = useMemo(() => bookings.filter(b => {
    if (statusFilter !== "all" && b.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!`${b.clientFirstName} ${b.clientLastName} ${b.clientPhone} ${b.clientEmail}`.toLowerCase().includes(q)) return false;
    }
    if (excFilter && b.excursionId !== excFilter) return false;
    if (dateFrom && b.date < dateFrom) return false;
    if (dateTo   && b.date > dateTo)   return false;
    return true;
  }), [bookings, statusFilter, search, excFilter, dateFrom, dateTo]);

  const totalRevenue = bookings.filter(b => b.status === "confirmed").reduce((s, b) => s + b.totalPrice, 0);
  const inp       = "w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-[#D4A96A]/60 transition-colors placeholder-gray-600";
  const filterInp = "bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-[#D4A96A]/60 transition-colors placeholder-gray-600";

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* ── Sidebar ── */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0d0d0d] border-r border-white/8 flex flex-col transition-transform duration-300 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 lg:static lg:flex`}>
        <div className="p-6 border-b border-white/8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#D4A96A] rounded-lg flex items-center justify-center"><Car size={16} className="text-black" /></div>
            <div className="text-xl font-black text-white">
              ESON<span className="text-[#D4A96A]"> MAROC</span>
              <span className="text-xs font-normal text-gray-600 ml-1 block -mt-1">Admin</span>
            </div>
          </div>
          <button className="lg:hidden text-gray-500 hover:text-white" onClick={() => setSidebarOpen(false)}><X size={20} /></button>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navLinks.map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                href === "/admin/excursions" ? "bg-[#D4A96A] text-black font-bold" : "text-gray-500 hover:bg-white/5 hover:text-white"
              }`}>
              <Icon size={17} />{label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/8 space-y-1">
          <Link href="/" className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-white/5 hover:text-white transition-colors"><Globe size={17} />Voir le site</Link>
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-red-500/10 hover:text-red-400 transition-colors"><LogOut size={17} />Déconnexion</button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-[#0d0d0d] border-b border-white/8 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-gray-500 hover:text-white" onClick={() => setSidebarOpen(true)}><LayoutDashboard size={22} /></button>
            <h1 className="text-lg font-bold text-white">Excursions</h1>
          </div>
          <div className="flex items-center gap-3">
            {tab === "packages" && (
              <button onClick={openAddExc}
                className="flex items-center gap-2 bg-[#D4A96A] text-black px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#b8894e] transition-colors">
                <Plus size={16} />Nouvelle excursion
              </button>
            )}
            <button
              onClick={() => { setBookingForm(EMPTY_BOOKING_FORM); setBookingError(""); setBookingModal(true); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                tab === "bookings" ? "bg-[#D4A96A] text-black hover:bg-[#b8894e]" : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"
              }`}>
              <Plus size={16} />Nouvelle réservation
            </button>
          </div>
        </header>

        <div className="flex-1 p-6 space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total réservations", value: bookings.length, color: "text-white" },
              { label: "En attente",   value: bookings.filter(b => b.status === "pending").length,   color: "text-[#D4A96A]" },
              { label: "Confirmées",   value: bookings.filter(b => b.status === "confirmed").length, color: "text-green-400" },
              { label: "Excursions",   value: excursions.length, color: "text-[#D4A96A]" },
            ].map(s => (
              <div key={s.label} className="bg-[#111] border border-white/8 rounded-2xl p-5">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">{s.label}</p>
                <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            {(["bookings", "packages"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  tab === t ? "bg-[#D4A96A] text-black" : "bg-[#111] text-gray-400 border border-white/8 hover:text-white"
                }`}>
                {t === "bookings" ? `Réservations clients (${bookings.length})` : `Catalogue (${excursions.length})`}
              </button>
            ))}
          </div>

          {/* ══ BOOKINGS TAB ══ */}
          {tab === "bookings" && (
            <>
              {/* Filter bar */}
              <div className="bg-[#111] border border-white/8 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                  <Filter size={12} />Filtres
                  {hasFilters && (
                    <button onClick={resetFilters} className="ml-auto flex items-center gap-1 text-[#D4A96A] hover:text-[#b8894e] transition-colors font-semibold">
                      <RotateCcw size={11} />Réinitialiser
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    <input className={filterInp + " pl-8 w-full"} placeholder="Rechercher client..." value={search} onChange={e => setSearch(e.target.value)} />
                  </div>
                  <select className={filterInp + " w-full"} value={excFilter} onChange={e => setExcFilter(e.target.value)} style={{ colorScheme: "dark" }}>
                    <option value="" className="bg-[#1a1a1a]">Toutes les excursions</option>
                    {excursions.map(e => <option key={e.id} value={e.id} className="bg-[#1a1a1a]">{e.title}</option>)}
                  </select>
                  <div className="flex items-center gap-2">
                    <input className={filterInp + " flex-1"} type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ colorScheme: "dark" }} />
                    <span className="text-gray-600 text-xs">→</span>
                    <input className={filterInp + " flex-1"} type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={{ colorScheme: "dark" }} />
                  </div>
                </div>
                {hasFilters && <p className="text-xs text-gray-500"><span className="text-[#D4A96A] font-semibold">{filteredBookings.length}</span> résultat(s) sur {bookings.length}</p>}
              </div>

              {/* Status tabs */}
              <div className="flex gap-2 flex-wrap">
                {(["all", "pending", "confirmed", "cancelled"] as const).map(s => (
                  <button key={s} onClick={() => setStatusFilter(s)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      statusFilter === s
                        ? "bg-[#D4A96A] text-black font-bold"
                        : "bg-[#111] text-gray-400 border border-white/8 hover:border-[#D4A96A]/30 hover:text-white"
                    }`}>
                    {s === "all" ? "Toutes" : statusLabel[s]}
                    <span className="ml-2 text-xs opacity-70">
                      ({s === "all" ? bookings.length : bookings.filter(b => b.status === s).length})
                    </span>
                  </button>
                ))}
              </div>

              {filteredBookings.length === 0 ? (
                <div className="bg-[#111] border border-white/8 rounded-2xl p-16 text-center">
                  <Mountain size={32} className="text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-500">Aucune réservation trouvée</p>
                  {hasFilters && <button onClick={resetFilters} className="mt-3 text-[#D4A96A] text-sm hover:underline">Effacer les filtres</button>}
                </div>
              ) : (
                <div className="bg-[#111] border border-white/8 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-white/5 border-b border-white/8">
                        <tr>
                          {["Client", "Excursion", "Date", "Participants", "Total", "Statut", "Actions"].map(h => (
                            <th key={h} className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredBookings.map(b => {
                          const exc    = excursions.find(e => e.id === b.excursionId);
                          const invNum = `EXC-${b.id.replace(/\D/g, "").slice(-6).padStart(6, "0")}`;
                          return (
                            <tr key={b.id} className="hover:bg-white/3 transition-colors">
                              <td className="px-4 py-4">
                                <p className="font-semibold text-sm text-white">{b.clientFirstName} {b.clientLastName}</p>
                                <p className="text-xs text-gray-500">{b.clientPhone}</p>
                                {b.clientEmail && <p className="text-xs text-gray-600">{b.clientEmail}</p>}
                              </td>
                              <td className="px-4 py-4">
                                <p className="text-sm font-medium text-white max-w-[180px] leading-tight">{exc?.title ?? b.excursionId}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{exc?.destination} · {exc?.duration}</p>
                              </td>
                              <td className="px-4 py-4 text-sm text-gray-400 whitespace-nowrap">{b.date}</td>
                              <td className="px-4 py-4">
                                <span className="inline-flex items-center gap-1 text-sm text-gray-300">
                                  <Users size={13} className="text-[#D4A96A]" />{b.participants}
                                </span>
                              </td>
                              <td className="px-4 py-4"><span className="font-bold text-[#D4A96A] whitespace-nowrap">{b.totalPrice} DH</span></td>
                              <td className="px-4 py-4">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${statusStyle[b.status]}`}>
                                  {statusLabel[b.status]}
                                </span>
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-2">
                                  {b.status === "pending" && (
                                    <>
                                      <button onClick={() => changeStatus(b.id, "confirmed")} className="p-1.5 bg-green-500/15 text-green-400 rounded-lg hover:bg-green-500/25 transition-colors" title="Confirmer"><CheckCircle size={16} /></button>
                                      <button onClick={() => changeStatus(b.id, "cancelled")} className="p-1.5 bg-red-500/15 text-red-400 rounded-lg hover:bg-red-500/25 transition-colors" title="Annuler"><XCircle size={16} /></button>
                                    </>
                                  )}
                                  {b.status === "confirmed" && (
                                    <button onClick={() => downloadExcursionInvoice(b, exc, invNum)} className="p-1.5 bg-[#D4A96A]/15 text-[#D4A96A] rounded-lg hover:bg-[#D4A96A]/25 transition-colors" title="Télécharger la facture"><Download size={16} /></button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ══ PACKAGES TAB ══ */}
          {tab === "packages" && (
            <>
              {excursions.length === 0 ? (
                <div className="bg-[#111] border border-white/8 rounded-2xl p-16 text-center">
                  <Mountain size={40} className="text-gray-700 mx-auto mb-4" />
                  <p className="text-gray-400 font-semibold mb-2">Aucune excursion dans le catalogue</p>
                  <button onClick={openAddExc} className="mt-2 flex items-center gap-2 mx-auto bg-[#D4A96A] text-black px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#b8894e] transition-colors">
                    <Plus size={15} />Ajouter la première excursion
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {excursions.map(e => {
                    const excBookings = bookings.filter(b => b.excursionId === e.id);
                    const revenue = excBookings.filter(b => b.status === "confirmed").reduce((s, b) => s + b.totalPrice, 0);
                    return (
                      <div key={e.id} className="bg-[#111] border border-white/8 rounded-2xl overflow-hidden hover:border-[#D4A96A]/30 transition-all group">
                        <div className="relative h-36 overflow-hidden bg-[#1a1a1a]">
                          {e.image ? (
                            <img src={e.image} alt={e.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon size={32} className="text-gray-600" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                          <div className="absolute top-2 left-2 flex gap-1.5">
                            <span className="bg-[#D4A96A]/90 text-black text-[10px] font-bold px-2 py-0.5 rounded-full">{e.category}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              e.difficulty === "Facile" ? "bg-green-500/90 text-white" : e.difficulty === "Modéré" ? "bg-[#D4A96A]/90 text-black" : "bg-red-500/90 text-white"
                            }`}>{e.difficulty}</span>
                          </div>
                          <div className="absolute bottom-2 right-2">
                            <span className="text-[#D4A96A] font-black text-lg">{e.pricePerPerson}</span>
                            <span className="text-white/60 text-xs"> DH/pers.</span>
                          </div>
                          {/* Edit / Delete overlay */}
                          <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEditExc(e)} className="p-1.5 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-[#D4A96A] hover:text-black transition-colors" title="Modifier"><Edit2 size={13} /></button>
                            <button onClick={() => setConfirmDeleteExc(e.id)} className="p-1.5 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-red-500 transition-colors" title="Supprimer"><Trash2 size={13} /></button>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-white text-sm mb-1 leading-tight">{e.title}</h3>
                          <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                            <span className="flex items-center gap-1"><MapPin size={10} className="text-[#D4A96A]" />{e.destination}</span>
                            <span className="flex items-center gap-1"><Clock size={10} className="text-[#D4A96A]" />{e.duration}</span>
                            <span className="flex items-center gap-1"><Users size={10} className="text-[#D4A96A]" />{e.maxParticipants} max</span>
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-white/8">
                            <div><p className="text-xs text-gray-600">Réservations</p><p className="text-sm font-bold text-white">{excBookings.length}</p></div>
                            <div className="text-right"><p className="text-xs text-gray-600">CA confirmé</p><p className="text-sm font-bold text-[#D4A96A]">{revenue} DH</p></div>
                            <div className="flex gap-1.5">
                              <button onClick={() => openEditExc(e)} className="p-1.5 bg-blue-500/15 text-blue-400 rounded-lg hover:bg-blue-500/25 transition-colors" title="Modifier"><Edit2 size={14} /></button>
                              <button onClick={() => setConfirmDeleteExc(e.id)} className="p-1.5 bg-red-500/15 text-red-400 rounded-lg hover:bg-red-500/25 transition-colors" title="Supprimer"><Trash2 size={14} /></button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ══ Modal réservation manuelle ══ */}
      {bookingModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-white/8">
              <div><h2 className="font-bold text-white text-lg">Nouvelle réservation</h2><p className="text-xs text-gray-500 mt-0.5">Saisie manuelle depuis l'agence</p></div>
              <button onClick={() => setBookingModal(false)} className="text-gray-500 hover:text-white"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <h3 className="text-[10px] font-bold text-[#D4A96A] uppercase tracking-widest mb-3">Excursion</h3>
                <select className={inp} value={bookingForm.excursionId} onChange={e => setBookingForm({ ...bookingForm, excursionId: e.target.value })} style={{ colorScheme: "dark" }}>
                  <option value="" className="bg-[#1a1a1a]">Sélectionner une excursion...</option>
                  {excursions.map(e => <option key={e.id} value={e.id} className="bg-[#1a1a1a]">{e.title} — {e.pricePerPerson} DH/pers.</option>)}
                </select>
                {bookingForm.excursionId && (() => {
                  const exc = excursions.find(e => e.id === bookingForm.excursionId);
                  return exc ? <p className="text-xs text-[#D4A96A] font-semibold mt-1.5">{bookingForm.participants} pers. × {exc.pricePerPerson} DH = <strong>{bookingForm.participants * exc.pricePerPerson} DH</strong></p> : null;
                })()}
              </div>
              <div>
                <h3 className="text-[10px] font-bold text-[#D4A96A] uppercase tracking-widest mb-3">Client</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[{ l: "Prénom *", k: "clientFirstName", p: "Prénom" }, { l: "Nom *", k: "clientLastName", p: "Nom" }, { l: "Téléphone *", k: "clientPhone", p: "+212 6 XX" }, { l: "Email", k: "clientEmail", p: "email@..." }].map(f => (
                    <div key={f.k}><label className="block text-xs text-gray-500 mb-1">{f.l}</label><input className={inp} value={(bookingForm as Record<string,unknown>)[f.k] as string} onChange={e => setBookingForm({ ...bookingForm, [f.k]: e.target.value })} placeholder={f.p} /></div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-[10px] font-bold text-[#D4A96A] uppercase tracking-widest mb-3">Détails</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-xs text-gray-500 mb-1">Date *</label><input className={inp} type="date" value={bookingForm.date} onChange={e => setBookingForm({ ...bookingForm, date: e.target.value })} style={{ colorScheme: "dark" }} /></div>
                  <div><label className="block text-xs text-gray-500 mb-1">Participants *</label><input className={inp} type="number" min={1} value={bookingForm.participants} onChange={e => setBookingForm({ ...bookingForm, participants: parseInt(e.target.value) || 1 })} /></div>
                </div>
              </div>
              <div>
                <h3 className="text-[10px] font-bold text-[#D4A96A] uppercase tracking-widest mb-3">Statut initial</h3>
                <div className="flex gap-3">
                  {(["confirmed", "pending"] as const).map(s => (
                    <button key={s} onClick={() => setBookingForm({ ...bookingForm, status: s })}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${bookingForm.status === s ? (s === "confirmed" ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-[#D4A96A]/15 text-[#D4A96A] border-[#D4A96A]/30") : "bg-white/5 text-gray-500 border-white/10 hover:border-white/20"}`}>
                      {s === "confirmed" ? "✓ Confirmée" : "⏳ En attente"}
                    </button>
                  ))}
                </div>
              </div>
              <div><label className="block text-xs text-gray-500 mb-1">Note interne</label><textarea className={inp + " resize-none"} rows={2} value={bookingForm.message} onChange={e => setBookingForm({ ...bookingForm, message: e.target.value })} placeholder="Demandes spéciales..." /></div>
              {bookingError && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">{bookingError}</div>}
            </div>
            <div className="p-6 border-t border-white/8 flex gap-3 justify-end">
              <button onClick={() => setBookingModal(false)} className="px-5 py-2.5 rounded-xl border border-white/10 text-sm text-gray-400 hover:bg-white/5">Annuler</button>
              <button onClick={handleAddBooking} className="px-6 py-2.5 rounded-xl bg-[#D4A96A] text-black text-sm font-bold hover:bg-[#b8894e] transition-colors">Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ Modal ajout / édition excursion ══ */}
      {excModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4 py-6">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[94vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-white/8">
              <div>
                <h2 className="font-bold text-white text-lg">{excEditing ? "Modifier l'excursion" : "Nouvelle excursion"}</h2>
                <p className="text-xs text-gray-500 mt-0.5">{excEditing ? "Mettez à jour les informations de cette excursion" : "Ajoutez une nouvelle excursion au catalogue"}</p>
              </div>
              <button onClick={() => setExcModal(false)} className="text-gray-500 hover:text-white"><X size={20} /></button>
            </div>

            <div className="p-6 space-y-6">
              {/* Informations principales */}
              <div>
                <h3 className="text-[10px] font-bold text-[#D4A96A] uppercase tracking-widest mb-3">Informations principales</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Titre de l'excursion *</label>
                    <input className={inp} value={excForm.title} onChange={e => setExcForm(f => ({ ...f, title: e.target.value }))} placeholder="Ex : Nuit dans le Désert de Merzouga" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Destination *</label>
                      <input className={inp} value={excForm.destination} onChange={e => setExcForm(f => ({ ...f, destination: e.target.value }))} placeholder="Ex : Merzouga" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Durée *</label>
                      <input className={inp} value={excForm.duration} onChange={e => setExcForm(f => ({ ...f, duration: e.target.value }))} placeholder="Ex : 1 jour / 2 jours 1 nuit" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Catégorie *</label>
                      <select className={inp} value={excForm.category} onChange={e => setExcForm(f => ({ ...f, category: e.target.value as Excursion["category"] }))} style={{ colorScheme: "dark" }}>
                        {CATEGORY_OPTIONS.map(c => <option key={c} value={c} className="bg-[#1a1a1a]">{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Difficulté *</label>
                      <select className={inp} value={excForm.difficulty} onChange={e => setExcForm(f => ({ ...f, difficulty: e.target.value as Excursion["difficulty"] }))} style={{ colorScheme: "dark" }}>
                        {DIFFICULTY_OPTIONS.map(d => <option key={d} value={d} className="bg-[#1a1a1a]">{d}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tarif & Capacité */}
              <div>
                <h3 className="text-[10px] font-bold text-[#D4A96A] uppercase tracking-widest mb-3">Tarif &amp; Capacité</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Prix par personne (DH) *</label>
                    <input className={inp} type="number" min={0} value={excForm.pricePerPerson || ""} onChange={e => setExcForm(f => ({ ...f, pricePerPerson: parseFloat(e.target.value) || 0 }))} placeholder="350" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Max participants *</label>
                    <input className={inp} type="number" min={1} value={excForm.maxParticipants || ""} onChange={e => setExcForm(f => ({ ...f, maxParticipants: parseInt(e.target.value) || 1 }))} placeholder="12" />
                  </div>
                </div>
              </div>

              {/* Image */}
              <div>
                <h3 className="text-[10px] font-bold text-[#D4A96A] uppercase tracking-widest mb-3">Image</h3>
                <input className={inp} value={excForm.image} onChange={e => setExcForm(f => ({ ...f, image: e.target.value }))} placeholder="https://images.unsplash.com/..." />
                {excForm.image && (
                  <div className="mt-2 h-24 rounded-xl overflow-hidden bg-[#1a1a1a]">
                    <img src={excForm.image} alt="Preview" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="text-[10px] font-bold text-[#D4A96A] uppercase tracking-widest mb-3">Description</h3>
                <textarea className={inp + " resize-none"} rows={3} value={excForm.description} onChange={e => setExcForm(f => ({ ...f, description: e.target.value }))} placeholder="Décrivez l'expérience, le programme, les paysages traversés..." />
              </div>

              {/* Ce qui est inclus */}
              <div>
                <h3 className="text-[10px] font-bold text-[#D4A96A] uppercase tracking-widest mb-3">Ce qui est inclus</h3>
                <div className="flex gap-2 mb-3">
                  <input
                    className={inp}
                    value={includeInput}
                    onChange={e => setIncludeInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addInclude(); } }}
                    placeholder="Ex : Transport inclus, Guide certifié..."
                  />
                  <button onClick={addInclude} className="shrink-0 px-4 py-2.5 bg-[#D4A96A]/20 border border-[#D4A96A]/30 text-[#D4A96A] rounded-xl text-sm font-semibold hover:bg-[#D4A96A]/30 transition-colors whitespace-nowrap">
                    <Plus size={15} />
                  </button>
                </div>
                {excForm.includes.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {excForm.includes.map(item => (
                      <span key={item} className="flex items-center gap-1.5 bg-[#D4A96A]/10 border border-[#D4A96A]/20 text-[#D4A96A] px-3 py-1.5 rounded-full text-xs font-medium">
                        {item}
                        <button onClick={() => removeInclude(item)} className="hover:text-red-400 transition-colors"><X size={11} /></button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-600">Aucun élément ajouté. Appuyez sur Entrée ou + pour ajouter.</p>
                )}
              </div>

              {excError && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">{excError}</div>}
            </div>

            <div className="p-6 border-t border-white/8 flex gap-3 justify-end">
              <button onClick={() => setExcModal(false)} className="px-5 py-2.5 rounded-xl border border-white/10 text-sm text-gray-400 hover:bg-white/5">Annuler</button>
              <button onClick={handleSaveExc} className="px-6 py-2.5 rounded-xl bg-[#D4A96A] text-black text-sm font-bold hover:bg-[#b8894e] transition-colors">
                {excEditing ? "Enregistrer les modifications" : "Créer l'excursion"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ Confirm delete excursion ══ */}
      {confirmDeleteExc && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 bg-red-500/15 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={20} className="text-red-400" />
            </div>
            <h2 className="font-bold text-white mb-2">Supprimer cette excursion ?</h2>
            <p className="text-sm text-gray-400 mb-6">Cette action est irréversible. Les réservations existantes ne seront pas supprimées.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDeleteExc(null)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm text-gray-400 hover:bg-white/5">Annuler</button>
              <button onClick={() => handleDeleteExc(confirmDeleteExc)} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
