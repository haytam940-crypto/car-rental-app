"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CARS, Car, Reservation } from "@/lib/data";
import { getMergedReservations } from "@/lib/store";
import { FileText, Download, ArrowLeft, ScrollText } from "lucide-react";

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

function downloadContract(r: Reservation, car: Car | undefined, contractNum: string) {
  const totalHT = Math.round(r.totalPrice / 1.2);
  const tva = r.totalPrice - totalHT;
  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <title>Contrat ${contractNum}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:Arial,sans-serif;font-size:11px;color:#000;padding:12px}
    .page{max-width:190mm;margin:0 auto}
    .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px}
    .logo{font-size:20px;font-weight:900}
    .logo span{color:#e63946}
    .company-info{text-align:right;font-size:9.5px;line-height:1.6}
    h1{text-align:center;font-size:13px;text-decoration:underline;margin:6px 0 4px}
    .intro{font-size:10px;margin-bottom:6px}
    .veh-header{display:flex;border:1px solid #000;margin-bottom:6px}
    .veh-header div{padding:3px 8px;border-right:1px solid #000;flex:1;font-size:10.5px}
    .veh-header div:last-child{border-right:none}
    .main-grid{display:flex;gap:6px;margin-bottom:6px}
    .col-left{flex:1.3}
    .col-right{flex:1}
    .section{border:1px solid #000;margin-bottom:5px}
    .sec-title{background:#eee;padding:2px 6px;font-weight:bold;font-size:10.5px;text-align:center;text-decoration:underline;border-bottom:1px solid #000}
    .sec-body{padding:4px 6px}
    .fr{display:flex;align-items:baseline;margin-bottom:2.5px;font-size:10px}
    .fl{min-width:85px;font-size:9.5px}
    .fv{font-weight:bold;border-bottom:1px solid #999;flex:1;min-height:13px;padding-bottom:1px;font-size:10px}
    .lr-table{width:100%;border-collapse:collapse}
    .lr-table th,.lr-table td{border:1px solid #000;padding:3px 4px;text-align:center;font-size:10px}
    .lr-table th{background:#eee;font-weight:bold}
    .cg{display:grid;grid-template-columns:1fr 1fr;gap:2px;font-size:9.5px}
    .ci{display:flex;align-items:center;gap:3px}
    .cb{width:10px;height:10px;border:1px solid #000;display:inline-flex;align-items:center;justify-content:center;font-size:8px;flex-shrink:0}
    .pt{width:100%;border-collapse:collapse}
    .pt td{border:1px solid #000;padding:2px 5px;font-size:10px}
    .pt td:last-child{text-align:right;font-weight:bold;min-width:55px}
    .diagram-wrap{border:1px solid #000;padding:6px;margin-bottom:5px}
    .diag-inner{display:flex;align-items:center;justify-content:center;gap:8px}
    .side-lbl{font-size:8px;display:flex;flex-direction:column;justify-content:space-between;height:75px}
    .caution{border:1px solid #000;padding:4px 8px;font-size:10px;display:flex;align-items:center;gap:14px;margin-bottom:6px}
    .sig-table{width:100%;border-collapse:collapse;margin-bottom:5px}
    .sig-table td{border:1px solid #000;padding:5px;text-align:center;font-size:9.5px;height:55px;vertical-align:top;width:33%}
    .footer{text-align:center;font-size:8.5px;margin-top:5px;border-top:1px solid #ccc;padding-top:4px;color:#444}
    @media print{body{padding:5px}@page{margin:8mm}}
  </style>
</head>
<body>
<div class="page">
  <div class="header">
    <div>
      <div class="logo">AUTO<span>LOC</span> <span style="font-size:10px;font-weight:400;color:#555">MAROC</span></div>
      <div style="font-size:9px;color:#666">Location de voitures</div>
    </div>
    <div class="company-info">
      123 Boulevard Mohammed V, Casablanca<br>
      GSM : +212 6 00 00 00 00<br>
      E-mail : contact@autoloc.ma &nbsp;·&nbsp; autoloc.ma
    </div>
  </div>

  <h1>Contrat de location N° : &nbsp;&nbsp; ${contractNum}</h1>
  <p class="intro">Contrat de location de voitures entre AutoLoc Maroc S.A.R.L et le preneur mentionné ci-dessous et pour le véhicule mentionné ci-dessous.</p>

  <div class="veh-header">
    <div><strong>Marque :</strong> ${car ? `${car.brand} ${car.name}` : "—"}</div>
    <div><strong>Matricule :</strong> ___________________</div>
    <div><strong>Carburant :</strong> ${car?.fuelType ?? "—"}</div>
  </div>

  <div class="main-grid">
    <div class="col-left">
      <div class="section">
        <div class="sec-title">Conducteur N°1 :</div>
        <div class="sec-body">
          <div class="fr"><span class="fl">Nom :</span><span class="fv">${r.clientLastName.toUpperCase()}</span></div>
          <div class="fr"><span class="fl">Prénom :</span><span class="fv">${r.clientFirstName}</span></div>
          <div class="fr"><span class="fl">Date et Lieu de Naissance :</span><span class="fv"></span></div>
          <div class="fr"><span class="fl">Adresse :</span><span class="fv"></span></div>
          <div class="fr"><span class="fl">Permis de conduire N° :</span><span class="fv">${r.clientLicense}</span></div>
          <div class="fr"><span class="fl">Délivré le :</span><span class="fv" style="flex:.5;margin-right:4px"></span><span style="font-size:9px">À</span><span class="fv" style="flex:.6;margin:0 3px"></span><span style="font-size:9px">Pays :</span><span class="fv" style="flex:.5;margin-left:3px"></span></div>
          <div class="fr"><span class="fl">C.I.N / Passeport N° :</span><span class="fv"></span></div>
          <div class="fr"><span class="fl">Délivré le :</span><span class="fv" style="flex:.5;margin-right:4px"></span><span style="font-size:9px">À</span><span class="fv" style="flex:.6;margin:0 3px"></span><span style="font-size:9px">Pays :</span><span class="fv" style="flex:.5;margin-left:3px"></span></div>
          <div class="fr"><span class="fl">Arrivée au Maroc le :</span><span class="fv" style="flex:.5;margin-right:4px"></span><span style="font-size:9px">N° Entrée :</span><span class="fv" style="margin-left:3px"></span></div>
          <div class="fr"><span class="fl">N° téléphone :</span><span class="fv">${r.clientPhone}</span></div>
        </div>
      </div>
      <div class="section">
        <div class="sec-title">Conducteur N°2 :</div>
        <div class="sec-body">
          <div class="fr"><span class="fl">Nom :</span><span class="fv"></span></div>
          <div class="fr"><span class="fl">Prénom :</span><span class="fv"></span></div>
          <div class="fr"><span class="fl">Date et Lieu de Naissance :</span><span class="fv"></span></div>
          <div class="fr"><span class="fl">Adresse :</span><span class="fv"></span></div>
          <div class="fr"><span class="fl">Permis de conduire N° :</span><span class="fv"></span></div>
          <div class="fr"><span class="fl">Délivré le :</span><span class="fv" style="flex:.5;margin-right:4px"></span><span style="font-size:9px">À</span><span class="fv" style="flex:.6;margin:0 3px"></span><span style="font-size:9px">Pays :</span><span class="fv" style="flex:.5;margin-left:3px"></span></div>
          <div class="fr"><span class="fl">C.I.N / Passeport N° :</span><span class="fv"></span></div>
          <div class="fr"><span class="fl">Délivré le :</span><span class="fv" style="flex:.5;margin-right:4px"></span><span style="font-size:9px">À</span><span class="fv" style="flex:.6;margin:0 3px"></span><span style="font-size:9px">Pays :</span><span class="fv" style="flex:.5;margin-left:3px"></span></div>
          <div class="fr"><span class="fl">Arrivée au Maroc le :</span><span class="fv" style="flex:.5;margin-right:4px"></span><span style="font-size:9px">N° Entrée :</span><span class="fv" style="margin-left:3px"></span></div>
          <div class="fr"><span class="fl">N° téléphone :</span><span class="fv"></span></div>
        </div>
      </div>
    </div>

    <div class="col-right">
      <div class="section">
        <table class="lr-table">
          <tr><th></th><th>LIVRAISON</th><th>REPRISE</th></tr>
          <tr><td>Le</td><td><strong>${r.pickupDate}</strong></td><td><strong>${r.dropoffDate}</strong></td></tr>
          <tr><td>Heure</td><td>08:30:00</td><td>08:30:00</td></tr>
          <tr><td>Lieu</td><td style="font-size:9px">${r.pickupLocation}</td><td style="font-size:9px">${r.dropoffLocation}</td></tr>
          <tr><td>Frais</td><td>0</td><td>0</td></tr>
        </table>
      </div>

      <div class="section">
        <div class="sec-title">Papiers du véhicule</div>
        <div class="sec-body">
          <div class="cg">
            <div class="ci"><div class="cb">✕</div> Contrat de location</div>
            <div class="ci"><div class="cb">✕</div> Assurance</div>
            <div class="ci"><div class="cb">✕</div> Carte grise</div>
            <div class="ci"><div class="cb">✕</div> Visite technique</div>
            <div class="ci"><div class="cb">✕</div> Autorisation</div>
            <div class="ci"><div class="cb">✕</div> Vignette</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="sec-title">Etat général et accessoires</div>
        <div class="sec-body">
          <div class="cg">
            <div class="ci"><div class="cb"></div> Roue de secours</div>
            <div class="ci"><div class="cb"></div> Cric et manivelle</div>
            <div class="ci"><div class="cb"></div> Niveau d'huile</div>
            <div class="ci"><div class="cb"></div> Jili</div>
            <div class="ci"><div class="cb"></div> Niveau d'eau</div>
            <div class="ci"><div class="cb"></div> Triangle</div>
            <div class="ci"><div class="cb"></div> Éclairage très bien</div>
            <div class="ci"><div class="cb"></div> Siège bébé</div>
            <div class="ci"><div class="cb"></div> Pneumatiques très bien</div>
            <div class="ci"><div class="cb"></div></div>
          </div>
          <div class="ci" style="margin-top:3px;font-size:9.5px"><div class="cb"></div>&nbsp;État Propreté : oui &nbsp;&nbsp; non</div>
          <div class="ci" style="margin-top:2px;font-size:9.5px"><div class="cb"></div>&nbsp;Carburant : <span style="border-bottom:1px solid #000;display:inline-block;width:70px">&nbsp;</span></div>
        </div>
      </div>

      <div class="section">
        <table class="pt">
          <tr><td>N° de jours</td><td>${r.durationDays}</td></tr>
          <tr><td>Prix / Jour</td><td>${car?.pricePerDay ?? 0} DH</td></tr>
          <tr><td>Frais Livraison</td><td>0 DH</td></tr>
          <tr><td>Frais Reprise</td><td>0 DH</td></tr>
          <tr><td>Total HT</td><td>${totalHT} DH</td></tr>
          <tr><td>TVA 20%</td><td>${tva} DH</td></tr>
          <tr style="background:#eee"><td><strong>Net à payer TTC</strong></td><td><strong>${r.totalPrice} DH</strong></td></tr>
        </table>
      </div>
    </div>
  </div>

  <div class="diagram-wrap">
    <div style="font-size:10px;margin-bottom:5px">Noter sur ce schéma les dommages existants :</div>
    <div class="diag-inner">
      <div class="side-lbl"><span>A</span><span>R</span><span>R</span><span>I</span><span>È</span><span>R</span><span>E</span></div>
      <svg width="240" height="95" viewBox="0 0 240 95" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="35" y="18" width="170" height="58" rx="10" stroke="#000" stroke-width="1.5"/>
        <rect x="65" y="8" width="110" height="78" rx="8" stroke="#000" stroke-width="1"/>
        <ellipse cx="55" cy="18" rx="13" ry="9" stroke="#000" stroke-width="1.5"/>
        <ellipse cx="185" cy="18" rx="13" ry="9" stroke="#000" stroke-width="1.5"/>
        <ellipse cx="55" cy="77" rx="13" ry="9" stroke="#000" stroke-width="1.5"/>
        <ellipse cx="185" cy="77" rx="13" ry="9" stroke="#000" stroke-width="1.5"/>
        <line x1="70" y1="18" x2="70" y2="77" stroke="#000" stroke-width="1"/>
        <line x1="170" y1="18" x2="170" y2="77" stroke="#000" stroke-width="1"/>
        <line x1="120" y1="18" x2="120" y2="77" stroke="#000" stroke-width="0.7" stroke-dasharray="3,2"/>
      </svg>
      <div class="side-lbl"><span>A</span><span>V</span><span>A</span><span>N</span><span>T</span></div>
    </div>
  </div>

  <div class="caution">
    <span>Caution : ………………………………… Montant : ………………………… Assurance</span>
    <span>R.C <span style="border:1px solid #000;padding:0 5px">✕</span></span>
    <span>Tous risque <span style="border:1px solid #000;padding:0 9px">&nbsp;</span></span>
  </div>

  <table class="sig-table">
    <tr>
      <td><strong>SIGNATURE DE 1<sup>ER</sup> CONDUCTEUR</strong><br><br><br><br></td>
      <td><strong>SIGNATURE DE 2<sup>ème</sup> CONDUCTEUR</strong><br><br><br><br></td>
      <td><strong>SIGNATURE AGENCE</strong><br><br><br><br></td>
    </tr>
  </table>

  <div class="footer">
    ICE : 000000000000000 &nbsp;·&nbsp; RC : 000000 &nbsp;·&nbsp; Patente : 0000000 &nbsp;·&nbsp; IF : 00000000 &nbsp;·&nbsp; CNSS : 0000000
  </div>
</div>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, "_blank");
  if (win) {
    win.onload = () => { win.print(); URL.revokeObjectURL(url); };
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
                      Facture PDF
                    </button>
                    <button
                      onClick={() => downloadContract(r, car, `CTR-${invoiceNum.replace("FAC-", "")}`)}
                      className="mt-1 flex items-center gap-2 text-xs text-[#1a1a2e] hover:underline font-medium"
                    >
                      <ScrollText size={13} />
                      Contrat PDF
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
