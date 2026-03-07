"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CARS, Car, Reservation } from "@/lib/data";
import { getMergedReservations } from "@/lib/store";
import { FileText, Download, ArrowLeft } from "lucide-react";

function downloadInvoice(r: Reservation, car: Car | undefined, invoiceNum: string) {
  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>Facture ${invoiceNum}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 700px; margin: 40px auto; color: #1a1a2e; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
    .logo { font-size: 28px; font-weight: 900; }
    .logo span { color: #e63946; }
    .badge { background: #e63946; color: white; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: bold; }
    h2 { font-size: 22px; margin-bottom: 4px; }
    .meta { color: #888; font-size: 13px; margin-bottom: 30px; }
    .section { background: #f9f9f9; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
    .section h3 { margin: 0 0 14px; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #888; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; font-size: 14px; }
    .row:last-child { border-bottom: none; }
    .row .label { color: #666; }
    .total-row { display: flex; justify-content: space-between; align-items: center; background: #1a1a2e; color: white; padding: 16px 20px; border-radius: 12px; margin-top: 10px; }
    .total-row .amount { font-size: 24px; font-weight: 900; color: #e63946; }
    .footer { text-align: center; color: #aaa; font-size: 12px; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px; }
    @media print { body { margin: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">AUTO<span>LOC</span> <small style="font-size:13px;font-weight:400;color:#888;">Maroc</small></div>
    <div>
      <span class="badge">FACTURE</span>
      <div style="font-size:13px;color:#888;margin-top:6px;text-align:right;">${invoiceNum}</div>
    </div>
  </div>

  <h2>Facture de location</h2>
  <p class="meta">Émise le ${new Date().toLocaleDateString("fr-FR")} · Statut : <strong style="color:#16a34a;">Confirmée</strong></p>

  <div class="section">
    <h3>Client</h3>
    <div class="row"><span class="label">Nom</span><span><strong>${r.clientFirstName} ${r.clientLastName}</strong></span></div>
    <div class="row"><span class="label">Téléphone</span><span>${r.clientPhone}</span></div>
    <div class="row"><span class="label">Email</span><span>${r.clientEmail}</span></div>
    <div class="row"><span class="label">Permis de conduire</span><span>${r.clientLicense}</span></div>
  </div>

  <div class="section">
    <h3>Véhicule</h3>
    <div class="row"><span class="label">Voiture</span><span><strong>${car ? `${car.brand} ${car.name}` : r.carId}</strong></span></div>
    ${car ? `<div class="row"><span class="label">Catégorie</span><span>${car.category}</span></div>
    <div class="row"><span class="label">Carburant</span><span>${car.fuelType}</span></div>
    <div class="row"><span class="label">Transmission</span><span>${car.transmission}</span></div>` : ""}
  </div>

  <div class="section">
    <h3>Location</h3>
    <div class="row"><span class="label">Lieu de départ</span><span>${r.pickupLocation}</span></div>
    <div class="row"><span class="label">Lieu de retour</span><span>${r.dropoffLocation}</span></div>
    <div class="row"><span class="label">Date de départ</span><span>${r.pickupDate}</span></div>
    <div class="row"><span class="label">Date de retour</span><span>${r.dropoffDate}</span></div>
    <div class="row"><span class="label">Durée</span><span><strong>${r.durationDays} jour(s)</strong></span></div>
    ${car ? `<div class="row"><span class="label">Tarif journalier</span><span>${car.pricePerDay} DH/j</span></div>` : ""}
  </div>

  <div class="total-row">
    <span style="font-size:15px;font-weight:600;">TOTAL À PAYER</span>
    <span class="amount">${r.totalPrice} DH</span>
  </div>

  <div class="footer">
    <p>AutoLoc Maroc · 123 Boulevard Mohammed V, Casablanca · +212 6 00 00 00 00 · contact@autoloc.ma</p>
    <p>Merci pour votre confiance.</p>
  </div>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, "_blank");
  if (win) {
    win.onload = () => {
      win.print();
      URL.revokeObjectURL(url);
    };
  }
}

export default function AdminInvoicesPage() {
  const router = useRouter();
  const [confirmedReservations, setConfirmedReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    if (!sessionStorage.getItem("admin_token")) {
      router.push("/admin/login");
      return;
    }
    setConfirmedReservations(getMergedReservations().filter((r) => r.status === "confirmed"));
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#0d0d1a] text-white px-6 py-4 flex items-center gap-4">
        <Link href="/admin/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white">
          <ArrowLeft size={18} />
          Dashboard
        </Link>
        <h1 className="text-lg font-bold ml-2">Factures</h1>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {confirmedReservations.length === 0 ? (
          <div className="text-center py-20">
            <FileText size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-400">Aucune facture disponible</h3>
            <p className="text-gray-400 text-sm mt-2">Les factures sont generees après confirmation des réservations</p>
          </div>
        ) : (
          <div className="space-y-4">
            {confirmedReservations.map((r, i) => {
              const car = CARS.find((c) => c.id === r.carId);
              const invoiceNum = `FAC-2026-${String(i + 1).padStart(4, "0")}`;
              return (
                <div key={r.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#e63946]/10 rounded-xl flex items-center justify-center">
                      <FileText size={22} className="text-[#e63946]" />
                    </div>
                    <div>
                      <p className="font-bold text-[#1a1a2e]">{invoiceNum}</p>
                      <p className="text-sm text-gray-500">{r.clientFirstName} {r.clientLastName} — {car?.brand} {car?.name}</p>
                      <p className="text-xs text-gray-400">{r.pickupDate} → {r.dropoffDate} ({r.durationDays}j)</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-[#1a1a2e]">{r.totalPrice} DH</p>
                    <button
                      onClick={() => downloadInvoice(r, car, invoiceNum)}
                      className="mt-2 flex items-center gap-2 text-xs text-[#e63946] hover:underline font-medium"
                    >
                      <Download size={13} />
                      Télécharger PDF
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
