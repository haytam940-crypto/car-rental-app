"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, ClipboardList, Car, FileText, BarChart2, Mountain,
  Calendar, Tag, LogOut, Menu, X, Plus, Send, Trash2, Edit2,
  FilePlus, CheckCircle, XCircle, Clock, RefreshCw, ChevronDown,
  FileCheck, AlertCircle,
} from "lucide-react";
import MIcon from "@/components/MIcon";
import { CARS } from "@/lib/data";
import type { Devis, DevisItem } from "@/lib/server-devis";

const navLinks = [
  { href: "/admin/dashboard",    icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/reservations", icon: ClipboardList,   label: "Réservations" },
  { href: "/admin/cars",         icon: Car,             label: "Voitures" },
  { href: "/admin/devis",        icon: FilePlus,        label: "Devis" },
  { href: "/admin/invoices",     icon: FileText,        label: "Factures" },
  { href: "/admin/analytics",    icon: BarChart2,       label: "Analytique" },
  { href: "/admin/excursions",   icon: Mountain,        label: "Excursions" },
  { href: "/admin/planning",     icon: Calendar,        label: "Planning" },
  { href: "/admin/promotions",   icon: Tag,             label: "Promotions" },
];

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  draft:    { label: "Brouillon",  color: "#888",     bg: "#88888820", icon: Clock },
  sent:     { label: "Envoyé",     color: "#6366f1",  bg: "#6366f120", icon: Send },
  accepted: { label: "Accepté",    color: "#10b981",  bg: "#10b98120", icon: CheckCircle },
  rejected: { label: "Refusé",     color: "#ef4444",  bg: "#ef444420", icon: XCircle },
  expired:  { label: "Expiré",     color: "#f59e0b",  bg: "#f59e0b20", icon: AlertCircle },
};

const TODAY = new Date().toISOString().split("T")[0];

const EMPTY_ITEM: DevisItem = { description: "", quantity: 1, unitPrice: 0, total: 0 };

function emptyForm(): Partial<Devis> {
  return {
    type: "location",
    status: "draft",
    clientFirstName: "", clientLastName: "", clientEmail: "", clientPhone: "",
    carId: "", carName: "", pickupDate: TODAY, dropoffDate: TODAY,
    pickupLocation: "", dropoffLocation: "", pickupTime: "", dropoffTime: "",
    durationDays: 1,
    destination: "", excursionDate: TODAY, participants: 1,
    items: [{ ...EMPTY_ITEM }],
    subtotal: 0, discount: 0, total: 0,
    notes: "", validUntil: "",
  };
}

export default function AdminDevisPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [devisList, setDevisList] = useState<Devis[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState<string | null>(null);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Devis>>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const logout = () => fetch("/api/auth/logout", { method: "POST" }).then(() => router.push("/admin/login"));

  const fetchDevis = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/devis");
    const data = await res.json();
    setDevisList(data.devis ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchDevis(); }, [fetchDevis]);

  /* ── Calculs prix ── */
  const recalc = (items: DevisItem[], discount: number) => {
    const subtotal = items.reduce((s, i) => s + i.total, 0);
    return { subtotal, total: Math.max(0, subtotal - discount) };
  };

  const setItem = (idx: number, field: keyof DevisItem, value: string | number) => {
    const items = [...(form.items ?? [])];
    items[idx] = { ...items[idx], [field]: value };
    if (field === "quantity" || field === "unitPrice") {
      items[idx].total = Number(items[idx].quantity) * Number(items[idx].unitPrice);
    }
    const { subtotal, total } = recalc(items, form.discount ?? 0);
    setForm(f => ({ ...f, items, subtotal, total }));
  };

  const addItem = () => {
    const items = [...(form.items ?? []), { ...EMPTY_ITEM }];
    setForm(f => ({ ...f, items }));
  };

  const removeItem = (idx: number) => {
    const items = (form.items ?? []).filter((_, i) => i !== idx);
    const { subtotal, total } = recalc(items, form.discount ?? 0);
    setForm(f => ({ ...f, items, subtotal, total }));
  };

  const setDiscount = (val: number) => {
    const { subtotal, total } = recalc(form.items ?? [], val);
    setForm(f => ({ ...f, discount: val, subtotal, total }));
  };

  /* ── Durée auto ── */
  useEffect(() => {
    if (form.pickupDate && form.dropoffDate) {
      const d1 = new Date(form.pickupDate);
      const d2 = new Date(form.dropoffDate);
      const diff = Math.max(1, Math.round((d2.getTime() - d1.getTime()) / 86400000));
      setForm(f => ({ ...f, durationDays: diff }));
    }
  }, [form.pickupDate, form.dropoffDate]);

  /* ── Ouvrir formulaire ── */
  const openCreate = () => { setEditId(null); setForm(emptyForm()); setModal(true); };
  const openEdit = (d: Devis) => { setEditId(d.id); setForm({ ...d }); setModal(true); };

  /* ── Sauvegarder ── */
  const handleSave = async () => {
    if (!form.clientFirstName || !form.clientLastName) return alert("Prénom et nom requis");
    if (!form.clientEmail) return alert("Email client requis");
    if (!form.clientPhone) return alert("Téléphone requis");
    if ((form.items ?? []).length === 0) return alert("Ajoutez au moins une prestation");

    setSaving(true);
    const car = CARS.find(c => c.id === form.carId);
    const payload = {
      ...form,
      carName: car ? `${car.brand} ${car.name}` : form.carName,
    };

    if (editId) {
      await fetch(`/api/devis/${editId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/devis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    setSaving(false);
    setModal(false);
    fetchDevis();
  };

  /* ── Envoyer par email ── */
  const handleSend = async (id: string) => {
    setSending(id);
    const res = await fetch(`/api/devis/${id}/send`, { method: "POST" });
    if (res.ok) {
      fetchDevis();
    } else {
      alert("Erreur lors de l'envoi");
    }
    setSending(null);
  };

  /* ── Changer statut ── */
  const handleStatus = async (id: string, status: string) => {
    await fetch(`/api/devis/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchDevis();
  };

  /* ── Supprimer ── */
  const handleDelete = async (id: string) => {
    await fetch(`/api/devis/${id}`, { method: "DELETE" });
    setConfirmDelete(null);
    fetchDevis();
  };

  /* ── Filtres ── */
  const filtered = devisList.filter(d => {
    if (filterStatus !== "all" && d.status !== filterStatus) return false;
    if (filterType !== "all" && d.type !== filterType) return false;
    return true;
  });

  /* ── Stats ── */
  const stats = {
    total: devisList.length,
    draft: devisList.filter(d => d.status === "draft").length,
    sent: devisList.filter(d => d.status === "sent").length,
    accepted: devisList.filter(d => d.status === "accepted").length,
  };

  /* ── Composant badge statut ── */
  const StatusBadge = ({ status }: { status: string }) => {
    const s = STATUS_LABELS[status] ?? STATUS_LABELS.draft;
    const Icon = s.icon;
    return (
      <span style={{ background: s.bg, color: s.color }} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-700">
        <Icon size={11} />
        {s.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#111] border-r border-white/10 flex flex-col transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <span className="font-black text-lg tracking-tight">ESON<span className="text-[#D4A96A]"> MAROC</span></span>
            <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">Administration</p>
          </div>
          <button className="lg:hidden text-white/50 hover:text-white" onClick={() => setSidebarOpen(false)}><X size={20} /></button>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navLinks.map(({ href, icon: Icon, label }) => (
            <a key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${href === "/admin/devis" ? "bg-[#D4A96A]/15 text-[#D4A96A]" : "text-white/60 hover:text-white hover:bg-white/5"}`}>
              <Icon size={16} />{label}
            </a>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={logout} className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors">
            <LogOut size={16} />Déconnexion
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-[#111]/90 backdrop-blur border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-white/60 hover:text-white" onClick={() => setSidebarOpen(true)}><Menu size={22} /></button>
            <div>
              <h1 className="font-black text-xl tracking-tight">Devis</h1>
              <p className="text-white/40 text-xs mt-0.5">Créez et envoyez des devis à vos clients</p>
            </div>
          </div>
          <button onClick={openCreate} className="flex items-center gap-2 bg-[#D4A96A] text-black font-bold px-4 py-2 rounded-xl text-sm hover:bg-[#c49558] transition-colors">
            <Plus size={16} />Nouveau devis
          </button>
        </header>

        <main className="flex-1 p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total devis", value: stats.total, color: "#D4A96A", bg: "#D4A96A15" },
              { label: "Brouillons", value: stats.draft, color: "#888", bg: "#88888815" },
              { label: "Envoyés", value: stats.sent, color: "#6366f1", bg: "#6366f115" },
              { label: "Acceptés", value: stats.accepted, color: "#10b981", bg: "#10b98115" },
            ].map(s => (
              <div key={s.label} style={{ background: s.bg, borderColor: s.color + "30" }} className="rounded-2xl border p-5">
                <p className="text-white/50 text-xs mb-1">{s.label}</p>
                <p style={{ color: s.color }} className="text-3xl font-black">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Filtres */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex gap-1 bg-[#1a1a1a] rounded-xl p-1">
              {["all", "draft", "sent", "accepted", "rejected", "expired"].map(s => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filterStatus === s ? "bg-[#D4A96A] text-black" : "text-white/50 hover:text-white"}`}>
                  {s === "all" ? "Tous" : STATUS_LABELS[s]?.label}
                </button>
              ))}
            </div>
            <div className="flex gap-1 bg-[#1a1a1a] rounded-xl p-1">
              {[["all", "Tous"], ["location", "Location"], ["excursion", "Excursion"]].map(([v, l]) => (
                <button key={v} onClick={() => setFilterType(v)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filterType === v ? "bg-[#D4A96A] text-black" : "text-white/50 hover:text-white"}`}>
                  {l}
                </button>
              ))}
            </div>
            <button onClick={fetchDevis} className="ml-auto text-white/40 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors">
              <RefreshCw size={15} />
            </button>
          </div>

          {/* Liste */}
          {loading ? (
            <div className="text-center py-20 text-white/30">Chargement...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <FilePlus size={40} className="text-white/10 mx-auto mb-4" />
              <p className="text-white/30 text-sm">Aucun devis trouvé</p>
              <button onClick={openCreate} className="mt-4 text-[#D4A96A] text-sm hover:underline">
                Créer le premier devis →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(d => {
                const ref = `#${d.id.slice(-8).toUpperCase()}`;
                const typeColor = d.type === "location" ? "#6366f1" : "#f59e0b";
                const typeLabel = d.type === "location" ? "Location" : "Excursion";
                return (
                  <div key={d.id} className="bg-[#111] border border-white/10 rounded-2xl p-5 hover:border-[#D4A96A]/30 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Infos gauche */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <span className="font-mono text-[#D4A96A] font-bold text-sm">{ref}</span>
                          <StatusBadge status={d.status} />
                          <span style={{ background: typeColor + "20", color: typeColor }} className="text-xs font-semibold px-2 py-0.5 rounded-full">{typeLabel}</span>
                        </div>
                        <p className="text-white font-semibold text-base truncate">
                          {d.clientFirstName} {d.clientLastName}
                        </p>
                        <p className="text-white/40 text-xs mt-0.5">{d.clientEmail} · {d.clientPhone}</p>
                        {d.type === "location" && d.carName && (
                          <p className="text-white/50 text-xs mt-1 flex items-center gap-1">
                            <MIcon name="directions_car" size={13} fill className="text-[#D4A96A]" /> {d.carName} · {d.pickupDate} → {d.dropoffDate}
                          </p>
                        )}
                        {d.type === "excursion" && d.destination && (
                          <p className="text-white/50 text-xs mt-1 flex items-center gap-1">
                            <MIcon name="landscape" size={13} fill className="text-[#D4A96A]" /> {d.destination} · {d.excursionDate} · {d.participants} pers.
                          </p>
                        )}
                        {d.validUntil && (
                          <p className="text-amber-500/60 text-xs mt-1 flex items-center gap-1">
                            <MIcon name="hourglass_empty" size={13} className="text-amber-500" /> Valable jusqu'au {d.validUntil}
                          </p>
                        )}
                      </div>

                      {/* Prix + actions */}
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-[#D4A96A] font-black text-xl">{d.total.toLocaleString("fr-MA")} DH</p>
                          {d.discount > 0 && <p className="text-green-400 text-xs">-{d.discount.toLocaleString("fr-MA")} DH remise</p>}
                          <p className="text-white/30 text-xs">{d.items.length} prestation{d.items.length > 1 ? "s" : ""}</p>
                        </div>

                        <div className="flex flex-col gap-2">
                          {/* Envoyer */}
                          <button onClick={() => handleSend(d.id)} disabled={sending === d.id || !d.clientEmail}
                            className="flex items-center gap-1.5 bg-[#6366f1]/15 text-[#6366f1] hover:bg-[#6366f1]/25 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-40">
                            {sending === d.id ? <RefreshCw size={12} className="animate-spin" /> : <Send size={12} />}
                            Envoyer
                          </button>

                          {/* Modifier */}
                          <button onClick={() => openEdit(d)}
                            className="flex items-center gap-1.5 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors">
                            <Edit2 size={12} />Modifier
                          </button>

                          {/* Statut rapide */}
                          <select value={d.status} onChange={e => handleStatus(d.id, e.target.value)}
                            className="bg-[#1a1a1a] border border-white/10 text-white/60 text-xs rounded-lg px-2 py-1.5 cursor-pointer">
                            {Object.entries(STATUS_LABELS).map(([v, s]) => (
                              <option key={v} value={v}>{s.label}</option>
                            ))}
                          </select>
                        </div>

                        {/* Supprimer */}
                        <button onClick={() => setConfirmDelete(d.id)}
                          className="text-red-500/40 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* ── Modal création/édition ── */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-2xl my-8">
            {/* Header modal */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="font-black text-lg">{editId ? "Modifier le devis" : "Nouveau devis"}</h2>
              <button onClick={() => setModal(false)} className="text-white/40 hover:text-white p-2 rounded-lg hover:bg-white/5">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              {/* Type */}
              <div>
                <label className="text-white/50 text-xs uppercase tracking-widest mb-3 block">Type de devis</label>
                <div className="grid grid-cols-2 gap-3">
                  {([["location", "directions_car", "Location voiture"], ["excursion", "landscape", "Excursion"]] as [string, string, string][]).map(([v, icon, label]) => (
                    <button key={v} onClick={() => setForm(f => ({ ...f, type: v as "location" | "excursion" }))}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 text-sm font-semibold transition-all ${form.type === v ? "border-[#D4A96A] bg-[#D4A96A]/10 text-[#D4A96A]" : "border-white/10 text-white/40 hover:border-white/20"}`}>
                      <MIcon name={icon} size={24} fill={form.type === v} />{label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Client */}
              <div>
                <label className="text-white/50 text-xs uppercase tracking-widest mb-3 block">Informations client</label>
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Prénom" value={form.clientFirstName ?? ""} onChange={v => setForm(f => ({ ...f, clientFirstName: v }))} />
                  <Input label="Nom" value={form.clientLastName ?? ""} onChange={v => setForm(f => ({ ...f, clientLastName: v }))} />
                  <Input label="Email" type="email" value={form.clientEmail ?? ""} onChange={v => setForm(f => ({ ...f, clientEmail: v }))} />
                  <Input label="Téléphone" value={form.clientPhone ?? ""} onChange={v => setForm(f => ({ ...f, clientPhone: v }))} />
                </div>
              </div>

              {/* Détails service */}
              {form.type === "location" ? (
                <div>
                  <label className="text-white/50 text-xs uppercase tracking-widest mb-3 block">Détails location</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className="text-white/50 text-xs mb-1 block">Véhicule</label>
                      <select value={form.carId ?? ""} onChange={e => setForm(f => ({ ...f, carId: e.target.value }))}
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#D4A96A]/50 outline-none">
                        <option value="">— Sélectionner —</option>
                        {CARS.map(c => <option key={c.id} value={c.id}>{c.brand} {c.name}</option>)}
                      </select>
                    </div>
                    <Input label="Date livraison" type="date" value={form.pickupDate ?? ""} onChange={v => setForm(f => ({ ...f, pickupDate: v }))} />
                    <Input label="Heure livraison" type="time" value={form.pickupTime ?? ""} onChange={v => setForm(f => ({ ...f, pickupTime: v }))} />
                    <Input label="Date récupération" type="date" value={form.dropoffDate ?? ""} onChange={v => setForm(f => ({ ...f, dropoffDate: v }))} />
                    <Input label="Heure récupération" type="time" value={form.dropoffTime ?? ""} onChange={v => setForm(f => ({ ...f, dropoffTime: v }))} />
                    <Input label="Lieu livraison" value={form.pickupLocation ?? ""} onChange={v => setForm(f => ({ ...f, pickupLocation: v }))} />
                    <Input label="Lieu récupération" value={form.dropoffLocation ?? ""} onChange={v => setForm(f => ({ ...f, dropoffLocation: v }))} />
                  </div>
                  {form.durationDays && form.durationDays > 0 && (
                    <p className="text-white/30 text-xs mt-2">Durée calculée : <span className="text-[#D4A96A]">{form.durationDays} jour{form.durationDays > 1 ? "s" : ""}</span></p>
                  )}
                </div>
              ) : (
                <div>
                  <label className="text-white/50 text-xs uppercase tracking-widest mb-3 block">Détails excursion</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <Input label="Destination" value={form.destination ?? ""} onChange={v => setForm(f => ({ ...f, destination: v }))} />
                    </div>
                    <Input label="Date excursion" type="date" value={form.excursionDate ?? ""} onChange={v => setForm(f => ({ ...f, excursionDate: v }))} />
                    <Input label="Participants" type="number" value={String(form.participants ?? 1)} onChange={v => setForm(f => ({ ...f, participants: Number(v) }))} />
                  </div>
                </div>
              )}

              {/* Prestations */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-white/50 text-xs uppercase tracking-widest">Prestations & tarifs</label>
                  <button onClick={addItem} className="flex items-center gap-1 text-[#D4A96A] text-xs hover:underline">
                    <Plus size={12} />Ajouter une ligne
                  </button>
                </div>
                <div className="space-y-2">
                  {/* Header */}
                  <div className="grid grid-cols-12 gap-2 px-2">
                    <span className="col-span-5 text-white/30 text-xs">Description</span>
                    <span className="col-span-2 text-white/30 text-xs text-center">Qté</span>
                    <span className="col-span-2 text-white/30 text-xs text-right">Prix unit.</span>
                    <span className="col-span-2 text-white/30 text-xs text-right">Total</span>
                    <span className="col-span-1"></span>
                  </div>
                  {(form.items ?? []).map((item, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                      <input value={item.description} onChange={e => setItem(idx, "description", e.target.value)} placeholder="Description"
                        className="col-span-5 bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#D4A96A]/50 outline-none" />
                      <input type="number" min="1" value={item.quantity} onChange={e => setItem(idx, "quantity", Number(e.target.value))}
                        className="col-span-2 bg-[#1a1a1a] border border-white/10 rounded-lg px-2 py-2 text-sm text-white text-center focus:border-[#D4A96A]/50 outline-none" />
                      <input type="number" min="0" value={item.unitPrice} onChange={e => setItem(idx, "unitPrice", Number(e.target.value))}
                        className="col-span-2 bg-[#1a1a1a] border border-white/10 rounded-lg px-2 py-2 text-sm text-white text-right focus:border-[#D4A96A]/50 outline-none" />
                      <div className="col-span-2 text-right text-[#D4A96A] text-sm font-bold pr-1">
                        {item.total.toLocaleString("fr-MA")}
                      </div>
                      <button onClick={() => removeItem(idx)} className="col-span-1 text-red-400/50 hover:text-red-400 flex justify-center">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Totaux */}
                <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white/40 text-sm">Sous-total</span>
                    <span className="text-white text-sm">{(form.subtotal ?? 0).toLocaleString("fr-MA")} DH</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-white/40 text-sm">Remise (DH)</span>
                    <input type="number" min="0" value={form.discount ?? 0} onChange={e => setDiscount(Number(e.target.value))}
                      className="w-28 bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white text-right focus:border-[#D4A96A]/50 outline-none" />
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-[#D4A96A]/20">
                    <span className="text-[#D4A96A] font-bold">Total HT</span>
                    <span className="text-[#D4A96A] font-black text-xl">{(form.total ?? 0).toLocaleString("fr-MA")} DH</span>
                  </div>
                </div>
              </div>

              {/* Options */}
              <div className="grid grid-cols-2 gap-3">
                <Input label="Valable jusqu'au" type="date" value={form.validUntil ?? ""} onChange={v => setForm(f => ({ ...f, validUntil: v }))} />
                <div>
                  <label className="text-white/50 text-xs mb-1 block">Statut</label>
                  <select value={form.status ?? "draft"} onChange={e => setForm(f => ({ ...f, status: e.target.value as Devis["status"] }))}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#D4A96A]/50 outline-none">
                    {Object.entries(STATUS_LABELS).map(([v, s]) => (
                      <option key={v} value={v}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-white/50 text-xs mb-1 block">Notes / Conditions particulières</label>
                <textarea value={form.notes ?? ""} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3}
                  placeholder="Conditions, remarques, informations complémentaires..."
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#D4A96A]/50 outline-none resize-none" />
              </div>
            </div>

            {/* Footer modal */}
            <div className="p-6 border-t border-white/10 flex items-center justify-between gap-3">
              <button onClick={() => setModal(false)} className="text-white/40 hover:text-white text-sm transition-colors">
                Annuler
              </button>
              <div className="flex gap-3">
                <button onClick={handleSave} disabled={saving}
                  className="flex items-center gap-2 bg-[#D4A96A] text-black font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-[#c49558] disabled:opacity-50 transition-colors">
                  {saving ? <RefreshCw size={15} className="animate-spin" /> : <FileCheck size={15} />}
                  {editId ? "Enregistrer" : "Créer le devis"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Confirmation suppression ── */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-8 max-w-sm w-full text-center">
            <Trash2 size={32} className="text-red-400 mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">Supprimer ce devis ?</h3>
            <p className="text-white/40 text-sm mb-6">Cette action est irréversible.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setConfirmDelete(null)} className="px-5 py-2 bg-white/5 rounded-xl text-sm hover:bg-white/10 transition-colors">Annuler</button>
              <button onClick={() => handleDelete(confirmDelete)} className="px-5 py-2 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-colors">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Composant Input réutilisable ── */
function Input({ label, value, onChange, type = "text", placeholder }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="text-white/50 text-xs mb-1 block">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#D4A96A]/50 outline-none transition-colors" />
    </div>
  );
}
