"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Car, CarCharge, ChargeCategory, CHARGE_LABELS } from "@/lib/data";
import { getStoredCars, saveCar, deleteCar, getStoredCharges, saveCharge, deleteCharge } from "@/lib/store";
import { Fuel, Settings, Edit2, Trash2, Plus, ArrowLeft, X, Receipt } from "lucide-react";

const CHARGE_CATEGORIES: ChargeCategory[] = [
  "gazoil", "lavage", "vidange", "vignette", "assurance", "credit_bail", "accident", "autre",
];

const CHARGE_COLORS: Record<ChargeCategory, string> = {
  gazoil: "bg-orange-100 text-orange-700",
  lavage: "bg-blue-100 text-blue-700",
  vidange: "bg-yellow-100 text-yellow-700",
  vignette: "bg-purple-100 text-purple-700",
  assurance: "bg-green-100 text-green-700",
  credit_bail: "bg-indigo-100 text-indigo-700",
  accident: "bg-red-100 text-red-700",
  autre: "bg-gray-100 text-gray-700",
};

const EMPTY_CAR: Omit<Car, "id"> = {
  name: "", brand: "", pricePerDay: 0, discount: 0,
  fuelType: "Essence", transmission: "Manuelle",
  description: "", images: [""], status: "available",
  year: new Date().getFullYear(), seats: 5, doors: 5, category: "Économique",
};

const statusStyle = {
  available: "bg-green-100 text-green-700",
  rented: "bg-red-100 text-red-700",
  maintenance: "bg-yellow-100 text-yellow-700",
};
const statusLabel = { available: "Disponible", rented: "Loué", maintenance: "Maintenance" };

const EMPTY_CHARGE = { category: "gazoil" as ChargeCategory, amount: 0, date: new Date().toISOString().split("T")[0], note: "" };

export default function AdminCarsPage() {
  const router = useRouter();
  const [cars, setCars] = useState<Car[]>([]);
  const [charges, setCharges] = useState<CarCharge[]>([]);
  const [modal, setModal] = useState<{ open: boolean; car: Car | null }>({ open: false, car: null });
  const [form, setForm] = useState<Omit<Car, "id"> & { id?: string }>(EMPTY_CAR);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [chargeModal, setChargeModal] = useState<Car | null>(null);
  const [chargeForm, setChargeForm] = useState(EMPTY_CHARGE);

  useEffect(() => {
    if (!sessionStorage.getItem("admin_token")) {
      router.push("/admin/login");
      return;
    }
    setCars(getStoredCars());
    setCharges(getStoredCharges());
  }, [router]);

  const refreshCharges = () => setCharges(getStoredCharges());

  const handleAddCharge = () => {
    if (!chargeModal || !chargeForm.amount || !chargeForm.date) return;
    saveCharge({
      id: `chg-${Date.now()}`,
      carId: chargeModal.id,
      category: chargeForm.category,
      amount: Number(chargeForm.amount),
      date: chargeForm.date,
      note: chargeForm.note || undefined,
    });
    refreshCharges();
    setChargeForm(EMPTY_CHARGE);
  };

  const handleDeleteCharge = (id: string) => {
    deleteCharge(id);
    refreshCharges();
  };

  const openEdit = (car: Car) => {
    setForm({ ...car });
    setModal({ open: true, car });
  };

  const openAdd = () => {
    setForm({ ...EMPTY_CAR });
    setModal({ open: true, car: null });
  };

  const handleSave = () => {
    const car: Car = {
      ...form,
      id: form.id ?? String(Date.now()),
      pricePerDay: Number(form.pricePerDay),
      discount: Number(form.discount) || 0,
      year: Number(form.year),
      seats: Number(form.seats),
      doors: Number(form.doors),
      images: form.images.filter(Boolean),
    };
    saveCar(car);
    setCars(getStoredCars());
    setModal({ open: false, car: null });
  };

  const handleDelete = (id: string) => {
    deleteCar(id);
    setCars(getStoredCars());
    setConfirmDelete(null);
  };

  const field = (label: string, key: keyof typeof form, type = "text") => (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
      <input
        type={type}
        value={form[key] as string | number}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#e63946]"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#0d0d1a] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white">
            <ArrowLeft size={18} />
            Dashboard
          </Link>
          <h1 className="text-lg font-bold ml-2">Gestion des voitures</h1>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#e63946] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#c1121f] transition-colors">
          <Plus size={16} />
          Ajouter
        </button>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {cars.map((car) => (
            <div key={car.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="relative h-40 bg-gray-100">
                <img src={car.images[0]} alt={car.name} className="w-full h-full object-cover" />
                <span className={`absolute top-2 right-2 text-xs px-2.5 py-1 rounded-full font-semibold ${statusStyle[car.status]}`}>
                  {statusLabel[car.status]}
                </span>
                {car.discount && car.discount > 0 ? (
                  <span className="absolute top-2 left-2 bg-[#e63946] text-white text-xs px-2 py-0.5 rounded-full font-bold">
                    -{car.discount}%
                  </span>
                ) : null}
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-400 font-medium">{car.brand}</p>
                <h3 className="font-bold text-[#1a1a2e] mb-2">{car.name}</h3>
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                  <span className="flex items-center gap-1"><Fuel size={11} className="text-[#e63946]" />{car.fuelType}</span>
                  <span className="flex items-center gap-1"><Settings size={11} className="text-[#e63946]" />{car.transmission}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    {car.discount && car.discount > 0 ? (
                      <>
                        <span className="text-xs line-through text-gray-400">{car.pricePerDay} DH/j</span>
                        <span className="text-lg font-black text-[#e63946] ml-1">{Math.round(car.pricePerDay * (1 - car.discount / 100))} <span className="text-xs font-normal text-gray-400">DH/j</span></span>
                      </>
                    ) : (
                      <span className="text-lg font-black text-[#e63946]">{car.pricePerDay} <span className="text-xs font-normal text-gray-400">DH/j</span></span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setChargeModal(car); setChargeForm(EMPTY_CHARGE); }} className="p-1.5 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors" title="Charges">
                      <Receipt size={14} />
                    </button>
                    <button onClick={() => openEdit(car)} className="p-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => setConfirmDelete(car.id)} className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal édition / ajout */}
      {modal.open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-bold text-[#1a1a2e] text-lg">
                {modal.car ? "Modifier la voiture" : "Ajouter une voiture"}
              </h2>
              <button onClick={() => setModal({ open: false, car: null })} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {field("Marque", "brand")}
              {field("Modèle", "name")}
              {field("Prix / jour (DH)", "pricePerDay", "number")}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Promotion (%)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number" min={0} max={99}
                    value={form.discount ?? 0}
                    onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#e63946]"
                    placeholder="0"
                  />
                  <span className="text-sm font-bold text-gray-400">%</span>
                </div>
                {(form.discount ?? 0) > 0 && (
                  <p className="text-xs text-[#e63946] mt-1 font-medium">
                    Prix remisé : {Math.round(Number(form.pricePerDay) * (1 - (form.discount ?? 0) / 100))} DH/j
                  </p>
                )}
              </div>
              {field("Année", "year", "number")}
              {field("Places", "seats", "number")}
              {field("Portes", "doors", "number")}

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Carburant</label>
                <select value={form.fuelType} onChange={(e) => setForm({ ...form, fuelType: e.target.value as Car["fuelType"] })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#e63946]">
                  {["Essence", "Diesel", "Hybride", "Electrique"].map((v) => <option key={v}>{v}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Transmission</label>
                <select value={form.transmission} onChange={(e) => setForm({ ...form, transmission: e.target.value as Car["transmission"] })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#e63946]">
                  {["Manuelle", "Automatique"].map((v) => <option key={v}>{v}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Catégorie</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#e63946]">
                  {["Économique", "Citadine", "Compacte", "SUV", "Luxe"].map((v) => <option key={v}>{v}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Statut</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Car["status"] })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#e63946]">
                  <option value="available">Disponible</option>
                  <option value="rented">Loué</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">URL Image principale</label>
                <input type="text" value={form.images[0] ?? ""} onChange={(e) => setForm({ ...form, images: [e.target.value, ...(form.images.slice(1))] })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#e63946]" placeholder="https://..." />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#e63946] resize-none" />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
              <button onClick={() => setModal({ open: false, car: null })} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">
                Annuler
              </button>
              <button onClick={handleSave} className="px-5 py-2.5 rounded-xl bg-[#e63946] text-white text-sm font-bold hover:bg-[#c1121f] transition-colors">
                {modal.car ? "Enregistrer" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation suppression */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center">
            <h3 className="font-bold text-[#1a1a2e] text-lg mb-2">Supprimer cette voiture ?</h3>
            <p className="text-gray-500 text-sm mb-6">Cette action est irréversible.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setConfirmDelete(null)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">
                Annuler
              </button>
              <button onClick={() => handleDelete(confirmDelete)} className="px-5 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Charges */}
      {chargeModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="font-bold text-[#1a1a2e] text-lg flex items-center gap-2">
                  <Receipt size={18} className="text-orange-500" />
                  Charges — {chargeModal.brand} {chargeModal.name}
                </h2>
                <p className="text-sm text-gray-400 mt-0.5">
                  Total : {charges.filter(c => c.carId === chargeModal.id).reduce((s, c) => s + c.amount, 0).toLocaleString("fr-FR")} DH
                </p>
              </div>
              <button onClick={() => setChargeModal(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>

            {/* Formulaire ajout charge */}
            <div className="p-6 border-b border-gray-100 bg-gray-50">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Ajouter une charge</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Catégorie</label>
                  <select value={chargeForm.category} onChange={(e) => setChargeForm({ ...chargeForm, category: e.target.value as ChargeCategory })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#e63946]">
                    {CHARGE_CATEGORIES.map(c => <option key={c} value={c}>{CHARGE_LABELS[c]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Montant (DH)</label>
                  <input type="number" min={0} value={chargeForm.amount}
                    onChange={(e) => setChargeForm({ ...chargeForm, amount: Number(e.target.value) })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#e63946]" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Date</label>
                  <input type="date" value={chargeForm.date}
                    onChange={(e) => setChargeForm({ ...chargeForm, date: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#e63946]" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Note (optionnel)</label>
                  <input type="text" value={chargeForm.note}
                    onChange={(e) => setChargeForm({ ...chargeForm, note: e.target.value })}
                    placeholder="Ex: révision 50 000 km"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#e63946]" />
                </div>
              </div>
              <button onClick={handleAddCharge}
                className="mt-3 flex items-center gap-2 bg-[#e63946] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#c1121f] transition-colors">
                <Plus size={15} /> Ajouter
              </button>
            </div>

            {/* Liste des charges */}
            <div className="p-6">
              {charges.filter(c => c.carId === chargeModal.id).length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-6">Aucune charge enregistrée</p>
              ) : (
                <div className="space-y-2">
                  {charges.filter(c => c.carId === chargeModal.id).sort((a, b) => b.date.localeCompare(a.date)).map(charge => (
                    <div key={charge.id} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${CHARGE_COLORS[charge.category]}`}>
                          {CHARGE_LABELS[charge.category]}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-[#1a1a2e]">{charge.amount.toLocaleString("fr-FR")} DH</p>
                          {charge.note && <p className="text-xs text-gray-400">{charge.note}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-xs text-gray-400">{new Date(charge.date).toLocaleDateString("fr-FR")}</p>
                        <button onClick={() => handleDeleteCharge(charge.id)} className="text-red-400 hover:text-red-600">
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
