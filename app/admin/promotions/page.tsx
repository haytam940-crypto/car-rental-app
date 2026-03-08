"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Promotion } from "@/lib/data";
import { getStoredPromotions, savePromotion, deletePromotion } from "@/lib/store";
import {
  Tag, Plus, Pencil, Trash2, X, Car, ClipboardList, FileText,
  BarChart2, Mountain, Calendar, Menu, LogOut, LayoutDashboard,
  CheckCircle, Clock, XCircle, AlertCircle, Percent, MapPin,
} from "lucide-react";

const navLinks = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/reservations", icon: ClipboardList, label: "Réservations" },
  { href: "/admin/cars", icon: Car, label: "Voitures" },
  { href: "/admin/invoices", icon: FileText, label: "Factures" },
  { href: "/admin/analytics", icon: BarChart2, label: "Analytique" },
  { href: "/admin/excursions", icon: Mountain, label: "Excursions" },
  { href: "/admin/planning", icon: Calendar, label: "Planning" },
  { href: "/admin/promotions", icon: Tag, label: "Promotions" },
];

const EMPTY_FORM: Omit<Promotion, "id"> = {
  name: "",
  description: "",
  discountPercent: 10,
  startDate: "",
  endDate: "",
  applyTo: "all",
  active: true,
};

function promoStatus(p: Promotion): "active" | "scheduled" | "expired" | "inactive" {
  if (!p.active) return "inactive";
  const today = new Date().toISOString().split("T")[0];
  if (p.endDate < today) return "expired";
  if (p.startDate > today) return "scheduled";
  return "active";
}

const STATUS_STYLES: Record<string, { label: string; cls: string; icon: React.ElementType }> = {
  active:    { label: "Active",    cls: "bg-green-500/15 text-green-400 border border-green-500/20",   icon: CheckCircle },
  scheduled: { label: "Planifiée", cls: "bg-blue-500/15 text-blue-400 border border-blue-500/20",     icon: Clock },
  expired:   { label: "Expirée",   cls: "bg-red-500/15 text-red-400 border border-red-500/20",        icon: XCircle },
  inactive:  { label: "Inactive",  cls: "bg-white/8 text-gray-500 border border-white/8",             icon: AlertCircle },
};

export default function AdminPromotions() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [promos, setPromos] = useState<Promotion[]>([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Promotion | null>(null);
  const [form, setForm] = useState<Omit<Promotion, "id">>(EMPTY_FORM);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    
    setPromos(getStoredPromotions());
  }, [router]);

  const logout = () => { fetch("/api/auth/logout", { method: "POST" }).then(() => router.push("/admin/login")); };

  const inp = "bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-[#D4A96A]/60 transition-colors placeholder-gray-600 w-full";

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setModal(true);
  };

  const openEdit = (p: Promotion) => {
    setEditing(p);
    const { id, ...rest } = p;
    setForm(rest);
    setFormError("");
    setModal(true);
  };

  const handleSave = () => {
    setFormError("");
    if (!form.name.trim()) return setFormError("Le nom est requis.");
    if (!form.description.trim()) return setFormError("La description est requise.");
    if (form.discountPercent < 1 || form.discountPercent > 99) return setFormError("Le pourcentage doit être entre 1 et 99.");
    if (!form.startDate || !form.endDate) return setFormError("Les dates sont requises.");
    if (form.startDate > form.endDate) return setFormError("La date de début doit être avant la date de fin.");
    const promo: Promotion = {
      id: editing?.id ?? `promo-${Date.now()}`,
      ...form,
    };
    savePromotion(promo);
    setPromos(getStoredPromotions());
    setModal(false);
  };

  const handleDelete = (id: string) => {
    deletePromotion(id);
    setPromos(getStoredPromotions());
    setConfirmDelete(null);
  };

  const toggleActive = (p: Promotion) => {
    savePromotion({ ...p, active: !p.active });
    setPromos(getStoredPromotions());
  };

  const today = new Date().toISOString().split("T")[0];
  const activePromo = promos.find(p => p.active && p.startDate <= today && p.endDate >= today);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0d0d0d] border-r border-white/8 flex flex-col transition-transform duration-300 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 lg:static lg:flex`}>
        <div className="p-6 border-b border-white/8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#D4A96A] rounded-lg flex items-center justify-center">
              <Car size={16} className="text-black" />
            </div>
            <div className="text-xl font-black text-white">
              ESON<span className="text-[#D4A96A]"> MAROC</span>
              <span className="text-xs font-normal text-gray-600 ml-1 block -mt-1">Admin</span>
            </div>
          </div>
          <button className="lg:hidden text-gray-500 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navLinks.map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                href === "/admin/promotions"
                  ? "bg-[#D4A96A]/10 text-[#D4A96A] border border-[#D4A96A]/20"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}>
              <Icon size={17} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/8">
          <button onClick={logout} className="flex items-center gap-2 text-gray-500 hover:text-red-400 transition-colors text-sm w-full px-3 py-2">
            <LogOut size={16} />Déconnexion
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-[#0d0d0d] border-b border-white/8 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-gray-400 hover:text-white" onClick={() => setSidebarOpen(true)}>
              <Menu size={22} />
            </button>
            <Tag size={18} className="text-[#D4A96A]" />
            <h1 className="text-lg font-bold text-white">Promotions</h1>
          </div>
          <button onClick={openAdd}
            className="flex items-center gap-2 bg-[#D4A96A] text-black px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#b8894e] transition-colors">
            <Plus size={16} />Nouvelle promotion
          </button>
        </header>

        <div className="flex-1 p-6 space-y-5">
          {/* Active promo banner */}
          {activePromo && (
            <div className="rounded-2xl p-4 flex items-center gap-4 border border-[#D4A96A]/30"
              style={{ background: "linear-gradient(135deg, rgba(212,169,106,0.12) 0%, rgba(212,169,106,0.05) 100%)" }}>
              <div className="w-10 h-10 rounded-xl bg-[#D4A96A] flex items-center justify-center shrink-0">
                <Percent size={20} className="text-black" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#D4A96A] font-black text-sm">Promotion en cours : {activePromo.name}</p>
                <p className="text-gray-400 text-xs mt-0.5">{activePromo.description} · -{activePromo.discountPercent}% · Jusqu'au {activePromo.endDate}</p>
              </div>
              <span className="shrink-0 text-xs font-bold bg-green-500/15 text-green-400 border border-green-500/20 px-3 py-1 rounded-full">ACTIVE</span>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total", value: promos.length, color: "text-white" },
              { label: "Actives", value: promos.filter(p => promoStatus(p) === "active").length, color: "text-green-400" },
              { label: "Planifiées", value: promos.filter(p => promoStatus(p) === "scheduled").length, color: "text-blue-400" },
              { label: "Expirées", value: promos.filter(p => promoStatus(p) === "expired").length, color: "text-red-400" },
            ].map(s => (
              <div key={s.label} className="bg-[#111] border border-white/8 rounded-2xl p-4 text-center">
                <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* List */}
          {promos.length === 0 ? (
            <div className="bg-[#111] border border-white/8 rounded-2xl p-16 text-center">
              <Tag size={36} className="text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500 mb-2">Aucune promotion créée</p>
              <button onClick={openAdd} className="text-[#D4A96A] text-sm hover:underline">+ Créer une promotion</button>
            </div>
          ) : (
            <div className="bg-[#111] border border-white/8 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5 border-b border-white/8">
                    <tr>
                      {["Promotion", "Réduction", "Période", "Appliqué à", "Statut", "Actions"].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {promos.map(p => {
                      const st = promoStatus(p);
                      const { label: stLabel, cls: stCls, icon: StIcon } = STATUS_STYLES[st];
                      return (
                        <tr key={p.id} className="hover:bg-white/3 transition-colors">
                          <td className="px-4 py-4">
                            <p className="font-semibold text-sm text-white">{p.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5 max-w-[220px] truncate">{p.description}</p>
                          </td>
                          <td className="px-4 py-4">
                            <span className="inline-flex items-center gap-1 text-xl font-black text-[#D4A96A]">
                              -{p.discountPercent}%
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-400 whitespace-nowrap">
                            <div>{p.startDate}</div>
                            <div className="text-gray-600 text-xs">au {p.endDate}</div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-xs bg-white/8 text-gray-300 px-2 py-1 rounded-lg capitalize">
                              {p.applyTo === "cars" ? "Voitures" : p.applyTo === "excursions" ? "Excursions" : "Tout"}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <button onClick={() => toggleActive(p)}
                              className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg font-semibold transition-all hover:opacity-80 ${stCls}`}>
                              <StIcon size={11} />
                              {stLabel}
                            </button>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1">
                              <button onClick={() => openEdit(p)}
                                className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-[#D4A96A] hover:bg-[#D4A96A]/10 transition-colors">
                                <Pencil size={13} />
                              </button>
                              <button onClick={() => setConfirmDelete(p.id)}
                                className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                                <Trash2 size={13} />
                              </button>
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
        </div>
      </div>

      {/* Form modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.8)" }}>
          <div className="bg-[#111] border border-white/12 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-white/8">
              <div className="flex items-center gap-2">
                <Tag size={18} className="text-[#D4A96A]" />
                <h2 className="text-lg font-bold text-white">{editing ? "Modifier la promotion" : "Nouvelle promotion"}</h2>
              </div>
              <button onClick={() => setModal(false)} className="text-gray-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {formError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">
                  {formError}
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Nom de la promotion *</label>
                <input className={inp} placeholder="ex: Offre Ramadan, Été 2026..." value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Description affichée aux clients *</label>
                <input className={inp} placeholder="ex: -20% sur toutes les locations de voitures" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Réduction (%)*</label>
                  <div className="relative">
                    <input className={inp + " pr-8"} type="number" min={1} max={99}
                      value={form.discountPercent}
                      onChange={e => setForm(f => ({ ...f, discountPercent: Math.max(1, Math.min(99, Number(e.target.value))) }))} />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-bold">%</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Appliqué à *</label>
                  <select className={inp} value={form.applyTo} onChange={e => setForm(f => ({ ...f, applyTo: e.target.value as Promotion["applyTo"] }))} style={{ colorScheme: "dark" }}>
                    <option value="all" className="bg-[#1a1a1a]">Tout (voitures + excursions)</option>
                    <option value="cars" className="bg-[#1a1a1a]">Voitures seulement</option>
                    <option value="excursions" className="bg-[#1a1a1a]">Excursions seulement</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Début *</label>
                  <input className={inp} type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} style={{ colorScheme: "dark" }} />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Fin *</label>
                  <input className={inp} type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} style={{ colorScheme: "dark" }} />
                </div>
              </div>

              {/* Preview */}
              {form.name && form.discountPercent && (
                <div className="rounded-xl p-4 border border-[#D4A96A]/20"
                  style={{ background: "linear-gradient(135deg, rgba(212,169,106,0.1) 0%, rgba(212,169,106,0.04) 100%)" }}>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Aperçu barre promo</p>
                  <div className="rounded-lg h-9 flex items-center px-3 gap-2 overflow-hidden text-black text-sm font-semibold"
                    style={{ background: "linear-gradient(90deg, #b8894e 0%, #D4A96A 40%, #f0c878 60%, #D4A96A 80%, #b8894e 100%)" }}>
                    <Tag size={12} />
                    <span className="font-black">{form.name}</span>
                    <span className="opacity-70">—</span>
                    <span>{form.description || "Description..."}</span>
                    <span className="bg-black/20 font-black text-xs px-2 py-0.5 rounded-full ml-auto">-{form.discountPercent}%</span>
                  </div>
                </div>
              )}

              {/* Active toggle */}
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-white/4 border border-white/8 hover:border-white/15 transition-colors">
                <div className={`w-11 h-6 rounded-full transition-colors ${form.active ? "bg-[#D4A96A]" : "bg-white/15"} relative`}
                  onClick={() => setForm(f => ({ ...f, active: !f.active }))}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${form.active ? "translate-x-6" : "translate-x-1"}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Activer la promotion</p>
                  <p className="text-xs text-gray-500">Sera visible sur le site dans la période définie</p>
                </div>
              </label>
            </div>

            <div className="p-6 pt-0 flex gap-3">
              <button onClick={() => setModal(false)} className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-colors text-sm font-semibold">
                Annuler
              </button>
              <button onClick={handleSave} className="flex-1 py-3 rounded-xl bg-[#D4A96A] text-black font-bold hover:bg-[#b8894e] transition-colors text-sm">
                {editing ? "Enregistrer" : "Créer la promotion"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm delete */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.8)" }}>
          <div className="bg-[#111] border border-white/12 rounded-2xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500/15 rounded-xl flex items-center justify-center">
                <Trash2 size={18} className="text-red-400" />
              </div>
              <h3 className="font-bold text-white">Supprimer la promotion</h3>
            </div>
            <p className="text-gray-400 text-sm mb-6">Cette action est irréversible. La promotion sera définitivement supprimée.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white transition-colors text-sm font-semibold">
                Annuler
              </button>
              <button onClick={() => handleDelete(confirmDelete)} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors text-sm">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
