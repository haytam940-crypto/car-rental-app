"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Car, CarCharge, ChargeCategory, CHARGE_LABELS } from "@/lib/data";
import { getStoredCars, saveCar, deleteCar, getStoredCharges, saveCharge, deleteCharge } from "@/lib/store";
import { Fuel, Settings, Edit2, Trash2, Plus, X, Receipt, LayoutDashboard, ClipboardList, FileText, BarChart2, Globe, LogOut, Menu, Mountain, Calendar, Search, Filter, RotateCcw, Tag, MapPin } from "lucide-react";

const CHARGE_CATEGORIES: ChargeCategory[] = [
  "gazoil", "lavage", "vidange", "vignette", "assurance", "credit_bail", "accident", "autre",
];

const CHARGE_COLORS: Record<ChargeCategory, string> = {
  gazoil:      "bg-orange-500/15 text-orange-400 border-orange-500/20",
  lavage:      "bg-blue-500/15 text-blue-400 border-blue-500/20",
  vidange:     "bg-[#D4A96A]/15 text-[#D4A96A] border-[#D4A96A]/20",
  vignette:    "bg-purple-500/15 text-purple-400 border-purple-500/20",
  assurance:   "bg-green-500/15 text-green-400 border-green-500/20",
  credit_bail: "bg-indigo-500/15 text-indigo-400 border-indigo-500/20",
  accident:    "bg-red-500/15 text-red-400 border-red-500/20",
  autre:       "bg-gray-500/15 text-gray-400 border-gray-500/20",
};

const statusStyle = {
  available:   "bg-green-500/15 text-green-400 border border-green-500/20",
  rented:      "bg-red-500/15 text-red-400 border border-red-500/20",
  maintenance: "bg-[#D4A96A]/15 text-[#D4A96A] border border-[#D4A96A]/20",
};
const statusLabel = { available: "Disponible", rented: "Loué", maintenance: "Maintenance" };

const EMPTY_CAR: Omit<Car, "id"> = {
  name: "", brand: "", pricePerDay: 0, discount: 0,
  fuelType: "Essence", transmission: "Manuelle",
  description: "", images: [""], status: "available",
  year: new Date().getFullYear(), seats: 5, doors: 5, category: "Économique",
};
const EMPTY_CHARGE = { category: "gazoil" as ChargeCategory, amount: 0, date: new Date().toISOString().split("T")[0], note: "" };

const navLinks = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/reservations", icon: ClipboardList, label: "Réservations" },
  { href: "/admin/cars", icon: Settings, label: "Voitures" },
  { href: "/admin/invoices", icon: FileText, label: "Factures" },
  { href: "/admin/analytics", icon: BarChart2, label: "Analytique" },
  { href: "/admin/excursions", icon: Mountain, label: "Excursions" },
  { href: "/admin/planning",   icon: Calendar, label: "Planning" },
  { href: "/admin/promotions", icon: Tag, label: "Promotions" },
];

export default function AdminCarsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cars, setCars] = useState<Car[]>([]);
  const [carSearch, setCarSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilterCar, setStatusFilterCar] = useState("");
  const [charges, setCharges] = useState<CarCharge[]>([]);
  const [modal, setModal] = useState<{ open: boolean; car: Car | null }>({ open: false, car: null });
  const [form, setForm] = useState<Omit<Car, "id"> & { id?: string }>(EMPTY_CAR);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [chargeModal, setChargeModal] = useState<Car | null>(null);
  const [chargeForm, setChargeForm] = useState(EMPTY_CHARGE);

  useEffect(() => {
    if (!sessionStorage.getItem("admin_token")) { router.push("/admin/login"); return; }
    setCars(getStoredCars());
    setCharges(getStoredCharges());
  }, [router]);

  const logout = () => { sessionStorage.removeItem("admin_token"); router.push("/admin/login"); };
  const refreshCharges = () => setCharges(getStoredCharges());

  const handleAddCharge = () => {
    if (!chargeModal || !chargeForm.amount || !chargeForm.date) return;
    saveCharge({ id: `chg-${Date.now()}`, carId: chargeModal.id, category: chargeForm.category, amount: Number(chargeForm.amount), date: chargeForm.date, note: chargeForm.note || undefined });
    refreshCharges();
    setChargeForm(EMPTY_CHARGE);
  };

  const handleDeleteCharge = (id: string) => { deleteCharge(id); refreshCharges(); };

  const handleSave = () => {
    const car: Car = { ...form, id: form.id ?? String(Date.now()), pricePerDay: Number(form.pricePerDay), discount: Number(form.discount) || 0, year: Number(form.year), seats: Number(form.seats), doors: Number(form.doors), images: form.images.filter(Boolean) };
    saveCar(car);
    setCars(getStoredCars());
    setModal({ open: false, car: null });
  };

  const handleDelete = (id: string) => { deleteCar(id); setCars(getStoredCars()); setConfirmDelete(null); };

  const inp = "w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-[#D4A96A]/60 transition-colors placeholder-gray-600";
  const lbl = "block text-[10px] font-bold text-[#D4A96A] uppercase tracking-widest mb-1.5";
  const filterInp = "bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-[#D4A96A]/60 transition-colors placeholder-gray-600";

  const CATEGORIES = [...new Set(cars.map(c => c.category))].sort();
  const hasCarFilters = !!(carSearch || categoryFilter || statusFilterCar);
  const resetCarFilters = () => { setCarSearch(""); setCategoryFilter(""); setStatusFilterCar(""); };

  const displayedCars = cars.filter(c => {
    if (carSearch && !`${c.brand} ${c.name} ${c.category}`.toLowerCase().includes(carSearch.toLowerCase())) return false;
    if (categoryFilter && c.category !== categoryFilter) return false;
    if (statusFilterCar && c.status !== statusFilterCar) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0d0d0d] border-r border-white/8 flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:flex`}>
        <div className="p-6 border-b border-white/8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#D4A96A] rounded-lg flex items-center justify-center">
              <Settings size={16} className="text-black" />
            </div>
            <div className="text-xl font-black text-white">ESON<span className="text-[#D4A96A]"> MAROC</span>
              <span className="text-xs font-normal text-gray-600 ml-1 block -mt-1">Admin</span>
            </div>
          </div>
          <button className="lg:hidden text-gray-500 hover:text-white" onClick={() => setSidebarOpen(false)}><X size={20} /></button>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navLinks.map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${href === "/admin/cars" ? "bg-[#D4A96A] text-black font-bold" : "text-gray-500 hover:bg-white/5 hover:text-white"}`}>
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

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-[#0d0d0d] border-b border-white/8 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-gray-500 hover:text-white" onClick={() => setSidebarOpen(true)}><Menu size={22} /></button>
            <h1 className="text-lg font-bold text-white">Gestion des voitures</h1>
          </div>
          <button onClick={() => { setForm({ ...EMPTY_CAR }); setModal({ open: true, car: null }); }}
            className="flex items-center gap-2 bg-[#D4A96A] text-black px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#b8894e] transition-colors">
            <Plus size={16} />Ajouter
          </button>
        </header>

        <div className="flex-1 p-6 space-y-5">
          {/* ── Filter bar ── */}
          <div className="bg-[#111] border border-white/8 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
              <Filter size={12} />Filtres
              {hasCarFilters && (
                <button onClick={resetCarFilters} className="ml-auto flex items-center gap-1 text-[#D4A96A] hover:text-[#b8894e] transition-colors font-semibold">
                  <RotateCcw size={11} />Réinitialiser
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                <input
                  className={filterInp + " pl-8 w-full"}
                  placeholder="Rechercher marque, modèle..."
                  value={carSearch}
                  onChange={e => setCarSearch(e.target.value)}
                />
              </div>
              <select className={filterInp + " w-full"} value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} style={{ colorScheme: "dark" }}>
                <option value="" className="bg-[#1a1a1a]">Toutes les catégories</option>
                {CATEGORIES.map(cat => <option key={cat} value={cat} className="bg-[#1a1a1a]">{cat}</option>)}
              </select>
            </div>
            <div className="flex gap-2 flex-wrap">
              {[{ v: "", l: "Tous" }, { v: "available", l: "Disponible" }, { v: "rented", l: "Loué" }, { v: "maintenance", l: "Maintenance" }].map(o => (
                <button key={o.v} onClick={() => setStatusFilterCar(o.v)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    statusFilterCar === o.v
                      ? "bg-[#D4A96A] text-black font-bold"
                      : "bg-[#111] text-gray-400 border border-white/8 hover:border-[#D4A96A]/30 hover:text-white"
                  }`}>
                  {o.l}
                  <span className="ml-2 text-xs opacity-70">
                    ({o.v === "" ? cars.length : cars.filter(c => c.status === o.v).length})
                  </span>
                </button>
              ))}
            </div>
            {hasCarFilters && (
              <p className="text-xs text-gray-500">
                <span className="text-[#D4A96A] font-semibold">{displayedCars.length}</span> véhicule(s) sur {cars.length}
              </p>
            )}
          </div>

          {displayedCars.length === 0 ? (
            <div className="bg-[#111] border border-white/8 rounded-2xl p-16 text-center">
              <p className="text-gray-500">Aucun véhicule trouvé</p>
              {hasCarFilters && <button onClick={resetCarFilters} className="mt-3 text-[#D4A96A] text-sm hover:underline">Effacer les filtres</button>}
            </div>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {displayedCars.map((car) => (
              <div key={car.id} className="bg-[#111111] border border-white/8 rounded-2xl overflow-hidden hover:border-[#D4A96A]/30 transition-colors">
                <div className="relative h-40 bg-[#1a1a1a]">
                  <img src={car.images[0]} alt={car.name} className="w-full h-full object-cover opacity-90" />
                  <span className={`absolute top-2 right-2 text-xs px-2.5 py-1 rounded-full font-semibold border ${statusStyle[car.status]}`}>
                    {statusLabel[car.status]}
                  </span>
                  {car.discount && car.discount > 0 ? (
                    <span className="absolute top-2 left-2 bg-[#D4A96A] text-black text-xs px-2 py-0.5 rounded-full font-black">
                      -{car.discount}%
                    </span>
                  ) : null}
                </div>
                <div className="p-4">
                  <p className="text-xs text-[#D4A96A] font-semibold uppercase tracking-wider">{car.brand}</p>
                  <h3 className="font-bold text-white mb-2">{car.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1"><Fuel size={11} className="text-[#D4A96A]" />{car.fuelType}</span>
                    <span className="flex items-center gap-1"><Settings size={11} className="text-[#D4A96A]" />{car.transmission}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      {car.discount && car.discount > 0 ? (
                        <>
                          <span className="text-xs line-through text-gray-600">{car.pricePerDay} DH/j</span>
                          <span className="text-lg font-black text-[#D4A96A] ml-1">{Math.round(car.pricePerDay * (1 - car.discount / 100))} <span className="text-xs font-normal text-gray-500">DH/j</span></span>
                        </>
                      ) : (
                        <span className="text-lg font-black text-[#D4A96A]">{car.pricePerDay} <span className="text-xs font-normal text-gray-500">DH/j</span></span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setChargeModal(car); setChargeForm(EMPTY_CHARGE); }}
                        className="p-1.5 bg-orange-500/15 text-orange-400 border border-orange-500/20 rounded-lg hover:bg-orange-500/25 transition-colors" title="Charges">
                        <Receipt size={14} />
                      </button>
                      <button onClick={() => { setForm({ ...car }); setModal({ open: true, car }); }}
                        className="p-1.5 bg-blue-500/15 text-blue-400 border border-blue-500/20 rounded-lg hover:bg-blue-500/25 transition-colors">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => setConfirmDelete(car.id)}
                        className="p-1.5 bg-red-500/15 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/25 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </div>

      {/* Modal édition / ajout */}
      {modal.open && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
          <div className="bg-[#111111] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-white/8">
              <h2 className="font-bold text-white text-lg">{modal.car ? "Modifier la voiture" : "Ajouter une voiture"}</h2>
              <button onClick={() => setModal({ open: false, car: null })} className="text-gray-500 hover:text-white"><X size={20} /></button>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className={lbl}>Marque</label><input type="text" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className={inp} /></div>
              <div><label className={lbl}>Modèle</label><input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inp} /></div>
              <div><label className={lbl}>Prix / jour (DH)</label><input type="number" value={form.pricePerDay} onChange={(e) => setForm({ ...form, pricePerDay: Number(e.target.value) })} className={inp} /></div>
              <div>
                <label className={lbl}>Promotion (%)</label>
                <div className="flex items-center gap-2">
                  <input type="number" min={0} max={99} value={form.discount ?? 0} onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })} className={inp} placeholder="0" />
                  <span className="text-sm font-bold text-gray-400">%</span>
                </div>
                {(form.discount ?? 0) > 0 && (
                  <p className="text-xs text-[#D4A96A] mt-1 font-medium">
                    Prix remisé : {Math.round(Number(form.pricePerDay) * (1 - (form.discount ?? 0) / 100))} DH/j
                  </p>
                )}
              </div>
              <div><label className={lbl}>Année</label><input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} className={inp} /></div>
              <div><label className={lbl}>Places</label><input type="number" value={form.seats} onChange={(e) => setForm({ ...form, seats: Number(e.target.value) })} className={inp} /></div>
              <div><label className={lbl}>Portes</label><input type="number" value={form.doors} onChange={(e) => setForm({ ...form, doors: Number(e.target.value) })} className={inp} /></div>
              <div>
                <label className={lbl}>Carburant</label>
                <select value={form.fuelType} onChange={(e) => setForm({ ...form, fuelType: e.target.value as Car["fuelType"] })} className={inp} style={{ colorScheme: "dark" }}>
                  {["Essence", "Diesel", "Hybride", "Electrique"].map((v) => <option key={v} className="bg-[#1a1a1a]">{v}</option>)}
                </select>
              </div>
              <div>
                <label className={lbl}>Transmission</label>
                <select value={form.transmission} onChange={(e) => setForm({ ...form, transmission: e.target.value as Car["transmission"] })} className={inp} style={{ colorScheme: "dark" }}>
                  {["Manuelle", "Automatique"].map((v) => <option key={v} className="bg-[#1a1a1a]">{v}</option>)}
                </select>
              </div>
              <div>
                <label className={lbl}>Catégorie</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inp} style={{ colorScheme: "dark" }}>
                  {["Économique", "Citadine", "Compacte", "SUV", "Luxe"].map((v) => <option key={v} className="bg-[#1a1a1a]">{v}</option>)}
                </select>
              </div>
              <div>
                <label className={lbl}>Statut</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Car["status"] })} className={inp} style={{ colorScheme: "dark" }}>
                  <option value="available" className="bg-[#1a1a1a]">Disponible</option>
                  <option value="rented" className="bg-[#1a1a1a]">Loué</option>
                  <option value="maintenance" className="bg-[#1a1a1a]">Maintenance</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={lbl}>URL Image principale</label>
                <input type="text" value={form.images[0] ?? ""} onChange={(e) => setForm({ ...form, images: [e.target.value, ...(form.images.slice(1))] })} className={inp} placeholder="https://..." />
              </div>
              <div className="sm:col-span-2">
                <label className={lbl}>Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inp + " resize-none"} />
              </div>
            </div>
            <div className="p-6 border-t border-white/8 flex gap-3 justify-end">
              <button onClick={() => setModal({ open: false, car: null })} className="px-5 py-2.5 rounded-xl border border-white/10 text-sm font-medium text-gray-400 hover:bg-white/5">Annuler</button>
              <button onClick={handleSave} className="px-5 py-2.5 rounded-xl bg-[#D4A96A] text-black text-sm font-bold hover:bg-[#b8894e] transition-colors">
                {modal.car ? "Enregistrer" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation suppression */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
          <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 max-w-sm w-full text-center">
            <h3 className="font-bold text-white text-lg mb-2">Supprimer cette voiture ?</h3>
            <p className="text-gray-500 text-sm mb-6">Cette action est irréversible.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setConfirmDelete(null)} className="px-5 py-2.5 rounded-xl border border-white/10 text-sm font-medium text-gray-400 hover:bg-white/5">Annuler</button>
              <button onClick={() => handleDelete(confirmDelete)} className="px-5 py-2.5 rounded-xl bg-red-500/80 text-white text-sm font-bold hover:bg-red-500 transition-colors">Supprimer</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Charges */}
      {chargeModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
          <div className="bg-[#111111] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-white/8">
              <div>
                <h2 className="font-bold text-white text-lg flex items-center gap-2">
                  <Receipt size={18} className="text-orange-400" />
                  Charges — {chargeModal.brand} {chargeModal.name}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Total : <span className="text-[#D4A96A] font-bold">{charges.filter(c => c.carId === chargeModal.id).reduce((s, c) => s + c.amount, 0).toLocaleString("fr-FR")} DH</span>
                </p>
              </div>
              <button onClick={() => setChargeModal(null)} className="text-gray-500 hover:text-white"><X size={20} /></button>
            </div>

            {/* Formulaire ajout charge */}
            <div className="p-6 border-b border-white/8 bg-white/3">
              <p className="text-[10px] font-bold text-[#D4A96A] uppercase tracking-widest mb-3">Ajouter une charge</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Catégorie</label>
                  <select value={chargeForm.category} onChange={(e) => setChargeForm({ ...chargeForm, category: e.target.value as ChargeCategory })} className={inp} style={{ colorScheme: "dark" }}>
                    {CHARGE_CATEGORIES.map(c => <option key={c} value={c} className="bg-[#1a1a1a]">{CHARGE_LABELS[c]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Montant (DH)</label>
                  <input type="number" min={0} value={chargeForm.amount} onChange={(e) => setChargeForm({ ...chargeForm, amount: Number(e.target.value) })} className={inp} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Date</label>
                  <input type="date" value={chargeForm.date} onChange={(e) => setChargeForm({ ...chargeForm, date: e.target.value })} className={inp} style={{ colorScheme: "dark" }} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Note (optionnel)</label>
                  <input type="text" value={chargeForm.note} onChange={(e) => setChargeForm({ ...chargeForm, note: e.target.value })} placeholder="Ex: révision 50 000 km" className={inp} />
                </div>
              </div>
              <button onClick={handleAddCharge} className="mt-3 flex items-center gap-2 bg-[#D4A96A] text-black px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#b8894e] transition-colors">
                <Plus size={15} /> Ajouter
              </button>
            </div>

            {/* Liste des charges */}
            <div className="p-6">
              {charges.filter(c => c.carId === chargeModal.id).length === 0 ? (
                <p className="text-center text-gray-600 text-sm py-6">Aucune charge enregistrée</p>
              ) : (
                <div className="space-y-2">
                  {charges.filter(c => c.carId === chargeModal.id).sort((a, b) => b.date.localeCompare(a.date)).map(charge => (
                    <div key={charge.id} className="flex items-center justify-between bg-white/5 border border-white/8 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${CHARGE_COLORS[charge.category]}`}>
                          {CHARGE_LABELS[charge.category]}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-[#D4A96A]">{charge.amount.toLocaleString("fr-FR")} DH</p>
                          {charge.note && <p className="text-xs text-gray-500">{charge.note}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-xs text-gray-600">{new Date(charge.date).toLocaleDateString("fr-FR")}</p>
                        <button onClick={() => handleDeleteCharge(charge.id)} className="text-red-500/60 hover:text-red-400 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
