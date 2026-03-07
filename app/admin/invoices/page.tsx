"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CARS, Car, Reservation } from "@/lib/data";
import { getMergedReservations } from "@/lib/store";
import { FileText, Download, ArrowLeft, ScrollText, X } from "lucide-react";

function downloadInvoice(r: Reservation, car: Car | undefined, invoiceNum: string) {
  const priceHT = Math.round(r.totalPrice / 1.2);
  const tva = r.totalPrice - priceHT;
  const pricePerDayHT = car ? Math.round(car.pricePerDay / 1.2) : 0;
  const issueDate = new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <title>Facture ${invoiceNum}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    @page{size:A4;margin:12mm}
    body{font-family:Arial,sans-serif;font-size:13px;color:#1a1a2e;background:#fff;padding:10px;width:190mm}
    /* Header */
    .header{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:16px;border-bottom:3px solid #e63946;margin-bottom:20px}
    .logo{font-size:30px;font-weight:900;line-height:1}
    .logo span{color:#e63946}
    .logo small{display:block;font-size:11px;font-weight:400;color:#888;letter-spacing:2px;margin-top:3px}
    .company-block{text-align:right;font-size:11px;line-height:1.8;color:#555}
    .company-block strong{font-size:13px;color:#1a1a2e}
    /* Invoice meta */
    .inv-meta{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;gap:20px}
    .inv-title{font-size:22px;font-weight:900;color:#1a1a2e}
    .inv-title span{display:block;font-size:12px;font-weight:400;color:#888;margin-top:3px}
    .inv-badge{background:#e63946;color:#fff;padding:6px 16px;border-radius:6px;font-size:11px;font-weight:bold;letter-spacing:1px}
    .inv-num{font-size:14px;font-weight:bold;text-align:right;margin-top:5px}
    .inv-date{font-size:11px;color:#888;text-align:right}
    /* Client + Véhicule */
    .two-col{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:18px}
    .card{background:#f8f8f8;border-radius:10px;padding:14px 16px;border:1px solid #ebebeb}
    .card-title{font-size:10px;font-weight:bold;text-transform:uppercase;letter-spacing:1.5px;color:#999;margin-bottom:10px}
    .card-row{display:flex;justify-content:space-between;font-size:12.5px;padding:4px 0;border-bottom:1px solid #eee}
    .card-row:last-child{border-bottom:none}
    .card-row .lbl{color:#777}
    .card-row .val{font-weight:600;text-align:right;max-width:55%}
    /* Periode */
    .period-bar{display:flex;align-items:center;justify-content:space-between;background:#1a1a2e;color:#fff;border-radius:10px;padding:12px 18px;margin-bottom:18px;gap:10px}
    .period-item{text-align:center;flex:1}
    .period-item .p-label{font-size:10px;color:#aaa;text-transform:uppercase;letter-spacing:1px}
    .period-item .p-value{font-size:14px;font-weight:bold;margin-top:3px}
    .period-sep{font-size:22px;color:#e63946;font-weight:900}
    /* Table de facturation */
    .billing-table{width:100%;border-collapse:collapse;margin-bottom:16px}
    .billing-table thead tr{background:#1a1a2e;color:#fff}
    .billing-table thead th{padding:10px 14px;text-align:left;font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:.8px}
    .billing-table thead th:last-child{text-align:right}
    .billing-table tbody tr{border-bottom:1px solid #f0f0f0}
    .billing-table tbody tr:hover{background:#fafafa}
    .billing-table tbody td{padding:10px 14px;font-size:13px}
    .billing-table tbody td:last-child{text-align:right;font-weight:600}
    /* Totaux */
    .totals{margin-left:auto;width:280px;margin-bottom:18px}
    .totals-row{display:flex;justify-content:space-between;padding:7px 14px;font-size:13px;border-bottom:1px solid #f0f0f0}
    .totals-row .t-lbl{color:#555}
    .totals-row .t-val{font-weight:600}
    .totals-tva{background:#fff8e1;border-radius:6px;padding:7px 14px;display:flex;justify-content:space-between;font-size:13px;margin-bottom:2px}
    .totals-tva .t-lbl{color:#b45309}
    .totals-tva .t-val{font-weight:700;color:#b45309}
    .totals-final{background:#e63946;border-radius:8px;padding:12px 16px;display:flex;justify-content:space-between;align-items:center}
    .totals-final .t-lbl{color:#fff;font-size:13px;font-weight:600;letter-spacing:.5px}
    .totals-final .t-val{color:#fff;font-size:20px;font-weight:900}
    /* Statut paiement */
    .payment-bar{display:flex;align-items:center;gap:10px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:10px 16px;margin-bottom:20px;font-size:12.5px}
    .paid-badge{background:#16a34a;color:#fff;padding:3px 12px;border-radius:20px;font-weight:bold;font-size:11px}
    /* Mentions légales */
    .legal{background:#f8f8f8;border-radius:8px;padding:10px 14px;font-size:10px;color:#888;line-height:1.6;margin-bottom:14px}
    /* Footer */
    .footer{border-top:2px solid #e63946;padding-top:12px;display:flex;justify-content:space-between;align-items:center;font-size:10px;color:#999}
    .footer-ids{font-size:9.5px;color:#bbb;margin-top:4px}
    @media print{body{padding:0}}
  </style>
</head>
<body>

  <!-- En-tête société -->
  <div class="header">
    <div>
      <div class="logo">AUTO<span>LOC</span><small>MAROC</small></div>
    </div>
    <div class="company-block">
      <strong>AutoLoc Maroc S.A.R.L</strong><br>
      123 Boulevard Mohammed V, Casablanca<br>
      Tél : +212 6 00 00 00 00<br>
      Email : contact@autoloc.ma<br>
      Site : autoloc.ma
    </div>
  </div>

  <!-- Numéro et date facture -->
  <div class="inv-meta">
    <div>
      <div class="inv-title">FACTURE<span>Location de véhicule</span></div>
    </div>
    <div>
      <div class="inv-badge">FACTURE</div>
      <div class="inv-num">${invoiceNum}</div>
      <div class="inv-date">Émise le ${issueDate}</div>
    </div>
  </div>

  <!-- Client + Véhicule -->
  <div class="two-col">
    <div class="card">
      <div class="card-title">Facturé à</div>
      <div class="card-row"><span class="lbl">Nom complet</span><span class="val">${r.clientFirstName} ${r.clientLastName}</span></div>
      <div class="card-row"><span class="lbl">Téléphone</span><span class="val">${r.clientPhone}</span></div>
      ${r.clientEmail ? `<div class="card-row"><span class="lbl">Email</span><span class="val">${r.clientEmail}</span></div>` : ""}
      <div class="card-row"><span class="lbl">N° Permis</span><span class="val">${r.clientLicense}</span></div>
    </div>
    <div class="card">
      <div class="card-title">Véhicule loué</div>
      <div class="card-row"><span class="lbl">Modèle</span><span class="val">${car ? `${car.brand} ${car.name}` : r.carId}</span></div>
      ${car ? `
      <div class="card-row"><span class="lbl">Catégorie</span><span class="val">${car.category}</span></div>
      <div class="card-row"><span class="lbl">Carburant</span><span class="val">${car.fuelType}</span></div>
      <div class="card-row"><span class="lbl">Transmission</span><span class="val">${car.transmission}</span></div>
      <div class="card-row"><span class="lbl">Année</span><span class="val">${car.year}</span></div>
      ` : ""}
    </div>
  </div>

  <!-- Période de location -->
  <div class="period-bar">
    <div class="period-item">
      <div class="p-label">Départ</div>
      <div class="p-value">${r.pickupDate}</div>
      <div style="font-size:10px;color:#aaa;margin-top:2px">${r.pickupLocation}</div>
    </div>
    <div class="period-sep">→</div>
    <div class="period-item">
      <div class="p-label">Retour</div>
      <div class="p-value">${r.dropoffDate}</div>
      <div style="font-size:10px;color:#aaa;margin-top:2px">${r.dropoffLocation}</div>
    </div>
    <div class="period-sep" style="color:#aaa;font-size:14px">|</div>
    <div class="period-item">
      <div class="p-label">Durée</div>
      <div class="p-value">${r.durationDays} jour${r.durationDays > 1 ? "s" : ""}</div>
    </div>
  </div>

  <!-- Tableau de facturation -->
  <table class="billing-table">
    <thead>
      <tr>
        <th>Description</th>
        <th>Qté</th>
        <th>P.U. HT</th>
        <th>TVA</th>
        <th>Montant HT</th>
        <th>Montant TTC</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <strong>Location ${car ? `${car.brand} ${car.name}` : "véhicule"}</strong><br>
          <span style="font-size:11px;color:#888">Du ${r.pickupDate} au ${r.dropoffDate} · ${r.pickupLocation}</span>
        </td>
        <td>${r.durationDays} j</td>
        <td>${pricePerDayHT} DH</td>
        <td>20%</td>
        <td>${priceHT} DH</td>
        <td>${r.totalPrice} DH</td>
      </tr>
      <tr style="background:#fafafa">
        <td colspan="4" style="font-size:11px;color:#aaa;padding-top:6px;padding-bottom:6px">Frais de livraison</td>
        <td>0 DH</td><td>0 DH</td>
      </tr>
      <tr style="background:#fafafa">
        <td colspan="4" style="font-size:11px;color:#aaa;padding-top:6px;padding-bottom:6px">Frais de reprise</td>
        <td>0 DH</td><td>0 DH</td>
      </tr>
    </tbody>
  </table>

  <!-- Totaux -->
  <div class="totals">
    <div class="totals-row"><span class="t-lbl">Sous-total HT</span><span class="t-val">${priceHT} DH</span></div>
    <div class="totals-tva"><span class="t-lbl">TVA 20%</span><span class="t-val">+ ${tva} DH</span></div>
    <div class="totals-final"><span class="t-lbl">NET À PAYER TTC</span><span class="t-val">${r.totalPrice} DH</span></div>
  </div>

  <!-- Statut paiement -->
  <div class="payment-bar">
    <span class="paid-badge">✓ PAYÉ</span>
    <span style="color:#166534;font-weight:600">Règlement reçu — Merci pour votre confiance</span>
    <span style="margin-left:auto;color:#888;font-size:11px">Réf. ${r.id}</span>
  </div>

  <!-- Mentions légales -->
  <div class="legal">
    <strong>Conditions générales :</strong> La location est soumise aux conditions générales d'AutoLoc Maroc. Le locataire est responsable de tout dommage causé au véhicule pendant la période de location.
    Le véhicule doit être restitué dans l'état initial, avec le même niveau de carburant. Toute heure supplémentaire dépassant l'heure de restitution convenue sera facturée.
    En cas de sinistre, le locataire doit contacter immédiatement l'agence au +212 6 00 00 00 00.
  </div>

  <!-- Footer -->
  <div class="footer">
    <div>
      <div><strong>AutoLoc Maroc S.A.R.L</strong> — 123 Bd Mohammed V, Casablanca</div>
      <div class="footer-ids">ICE : 000000000000000 &nbsp;·&nbsp; RC : 000000 &nbsp;·&nbsp; Patente : 0000000 &nbsp;·&nbsp; IF : 00000000 &nbsp;·&nbsp; CNSS : 0000000</div>
    </div>
    <div style="text-align:right">
      <div style="font-size:11px;color:#e63946;font-weight:bold">${invoiceNum}</div>
      <div style="font-size:10px;color:#bbb">Document généré le ${issueDate}</div>
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

type ContractExtras = {
  // Conducteur 1
  dateNaissance: string; lieuNaissance: string; adresse: string;
  permisDelivreLe: string; permisDelivreVille: string; permisDelivrePays: string;
  cinPasseport: string; cinDelivreLe: string; cinDelivreVille: string; cinDelivrePays: string;
  arriveeMaroc: string; numEntree: string; matricule: string;
  pickupTime: string; dropoffTime: string;
  // Conducteur 2 (optionnel)
  d2Nom: string; d2Prenom: string; d2DateNaissance: string; d2LieuNaissance: string; d2Adresse: string;
  d2Permis: string; d2PermisDelivreLe: string; d2PermisDelivreVille: string; d2PermisDelivrePays: string;
  d2CinPasseport: string; d2CinDelivreLe: string; d2CinDelivreVille: string; d2CinDelivrePays: string;
  d2ArriveeMaroc: string; d2NumEntree: string; d2Telephone: string;
};

function downloadContract(r: Reservation, car: Car | undefined, contractNum: string, x: ContractExtras) {
  const totalHT = Math.round(r.totalPrice / 1.2);
  const tva = r.totalPrice - totalHT;
  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <title>Contrat ${contractNum}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    @page{size:A4;margin:10mm}
    body{font-family:Arial,sans-serif;font-size:13px;color:#000;padding:10px;width:190mm;min-height:267mm}
    .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px}
    .logo{font-size:22px;font-weight:900}
    .logo span{color:#e63946}
    .company-info{text-align:right;font-size:11px;line-height:1.7}
    h1{text-align:center;font-size:15px;text-decoration:underline;margin:8px 0 5px;font-weight:bold}
    .intro{font-size:11.5px;margin-bottom:8px}
    .veh-header{display:flex;border:1px solid #000;margin-bottom:8px}
    .veh-header div{padding:4px 10px;border-right:1px solid #000;flex:1;font-size:12px}
    .veh-header div:last-child{border-right:none}
    .main-grid{display:flex;gap:8px;margin-bottom:8px}
    .col-left{flex:1.3}
    .col-right{flex:1}
    .section{border:1px solid #000;margin-bottom:6px}
    .sec-title{background:#eee;padding:3px 8px;font-weight:bold;font-size:12px;text-align:center;text-decoration:underline;border-bottom:1px solid #000}
    .sec-body{padding:5px 8px}
    .fr{display:flex;align-items:baseline;margin-bottom:3px;font-size:11.5px}
    .fl{min-width:100px;font-size:11px;color:#333}
    .fv{font-weight:bold;font-size:12px;border-bottom:1px solid #888;flex:1;min-height:15px;padding-bottom:1px}
    .lr-table{width:100%;border-collapse:collapse}
    .lr-table th,.lr-table td{border:1px solid #000;padding:4px 5px;text-align:center;font-size:12px}
    .lr-table th{background:#eee;font-weight:bold;font-size:12px}
    .lr-table td strong{font-size:12px}
    .cg{display:grid;grid-template-columns:1fr 1fr;gap:3px;font-size:11px}
    .ci{display:flex;align-items:center;gap:4px}
    .cb{width:11px;height:11px;border:1px solid #000;display:inline-flex;align-items:center;justify-content:center;font-size:9px;flex-shrink:0}
    .pt{width:100%;border-collapse:collapse}
    .pt td{border:1px solid #000;padding:3px 7px;font-size:12px}
    .pt td:last-child{text-align:right;font-weight:bold;min-width:60px}
    .diagram-wrap{border:1px solid #000;padding:8px;margin-bottom:7px}
    .diag-inner{display:flex;align-items:center;justify-content:center;gap:10px}
    .side-lbl{font-size:10px;font-weight:bold;display:flex;flex-direction:column;justify-content:space-around;height:100px;letter-spacing:1px}
    .caution{border:1px solid #000;padding:6px 10px;font-size:12px;display:flex;align-items:center;gap:18px;margin-bottom:8px;flex-wrap:wrap}
    .sig-table{width:100%;border-collapse:collapse;margin-bottom:6px}
    .sig-table td{border:1px solid #000;padding:6px 8px;text-align:center;font-size:11.5px;height:65px;vertical-align:top;width:33%}
    .footer{text-align:center;font-size:10px;margin-top:6px;border-top:1px solid #bbb;padding-top:5px;color:#333}
    @media print{body{padding:0}}
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">AUTO<span>LOC</span> <span style="font-size:11px;font-weight:400;color:#555">MAROC</span></div>
      <div style="font-size:10px;color:#666;margin-top:2px">Location de voitures</div>
    </div>
    <div class="company-info">
      123 Boulevard Mohammed V, Casablanca<br>
      GSM : +212 6 00 00 00 00<br>
      E-mail : contact@autoloc.ma &nbsp;·&nbsp; autoloc.ma
    </div>
  </div>

  <h1>Contrat de location N° : &nbsp;&nbsp;&nbsp; ${contractNum}</h1>
  <p class="intro">Contrat de location de voitures entre AutoLoc Maroc S.A.R.L et le preneur mentionné ci-dessous et pour le véhicule mentionné ci-dessous.</p>

  <div class="veh-header">
    <div><strong>Marque :</strong> <strong>${car ? `${car.brand} ${car.name}` : "—"}</strong></div>
    <div><strong>Matricule :</strong> <strong>${x.matricule || "_____________________"}</strong></div>
    <div><strong>Carburant :</strong> <strong>${car?.fuelType ?? "—"}</strong></div>
  </div>

  <div class="main-grid">
    <div class="col-left">
      <div class="section">
        <div class="sec-title">Conducteur N°1 :</div>
        <div class="sec-body">
          <div class="fr"><span class="fl">Nom :</span><span class="fv">${r.clientLastName.toUpperCase()}</span></div>
          <div class="fr"><span class="fl">Prénom :</span><span class="fv">${r.clientFirstName}</span></div>
          <div class="fr"><span class="fl">Date et Lieu de Naissance :</span><span class="fv">${x.dateNaissance}${x.lieuNaissance ? " — " + x.lieuNaissance : ""}</span></div>
          <div class="fr"><span class="fl">Adresse :</span><span class="fv">${x.adresse}</span></div>
          <div class="fr"><span class="fl">Permis de conduire N° :</span><span class="fv">${r.clientLicense}</span></div>
          <div class="fr"><span class="fl">Délivré le :</span><span class="fv" style="flex:.5;margin-right:5px">${x.permisDelivreLe}</span><span style="font-size:11px">À</span><span class="fv" style="flex:.6;margin:0 4px">${x.permisDelivreVille}</span><span style="font-size:11px">Pays :</span><span class="fv" style="flex:.5;margin-left:4px">${x.permisDelivrePays}</span></div>
          <div class="fr"><span class="fl">C.I.N / Passeport N° :</span><span class="fv">${x.cinPasseport}</span></div>
          <div class="fr"><span class="fl">Délivré le :</span><span class="fv" style="flex:.5;margin-right:5px">${x.cinDelivreLe}</span><span style="font-size:11px">À</span><span class="fv" style="flex:.6;margin:0 4px">${x.cinDelivreVille}</span><span style="font-size:11px">Pays :</span><span class="fv" style="flex:.5;margin-left:4px">${x.cinDelivrePays}</span></div>
          <div class="fr"><span class="fl">Arrivée au Maroc le :</span><span class="fv" style="flex:.5;margin-right:5px">${x.arriveeMaroc}</span><span style="font-size:11px">N° Entrée :</span><span class="fv" style="margin-left:4px">${x.numEntree}</span></div>
          <div class="fr"><span class="fl">N° téléphone :</span><span class="fv">${r.clientPhone}</span></div>
        </div>
      </div>
      <div class="section">
        <div class="sec-title">Conducteur N°2 :</div>
        <div class="sec-body">
          <div class="fr"><span class="fl">Nom :</span><span class="fv">${x.d2Nom}</span></div>
          <div class="fr"><span class="fl">Prénom :</span><span class="fv">${x.d2Prenom}</span></div>
          <div class="fr"><span class="fl">Date et Lieu de Naissance :</span><span class="fv">${x.d2DateNaissance}${x.d2LieuNaissance ? " — " + x.d2LieuNaissance : ""}</span></div>
          <div class="fr"><span class="fl">Adresse :</span><span class="fv">${x.d2Adresse}</span></div>
          <div class="fr"><span class="fl">Permis de conduire N° :</span><span class="fv">${x.d2Permis}</span></div>
          <div class="fr"><span class="fl">Délivré le :</span><span class="fv" style="flex:.5;margin-right:5px">${x.d2PermisDelivreLe}</span><span style="font-size:11px">À</span><span class="fv" style="flex:.6;margin:0 4px">${x.d2PermisDelivreVille}</span><span style="font-size:11px">Pays :</span><span class="fv" style="flex:.5;margin-left:4px">${x.d2PermisDelivrePays}</span></div>
          <div class="fr"><span class="fl">C.I.N / Passeport N° :</span><span class="fv">${x.d2CinPasseport}</span></div>
          <div class="fr"><span class="fl">Délivré le :</span><span class="fv" style="flex:.5;margin-right:5px">${x.d2CinDelivreLe}</span><span style="font-size:11px">À</span><span class="fv" style="flex:.6;margin:0 4px">${x.d2CinDelivreVille}</span><span style="font-size:11px">Pays :</span><span class="fv" style="flex:.5;margin-left:4px">${x.d2CinDelivrePays}</span></div>
          <div class="fr"><span class="fl">Arrivée au Maroc le :</span><span class="fv" style="flex:.5;margin-right:5px">${x.d2ArriveeMaroc}</span><span style="font-size:11px">N° Entrée :</span><span class="fv" style="margin-left:4px">${x.d2NumEntree}</span></div>
          <div class="fr"><span class="fl">N° téléphone :</span><span class="fv">${x.d2Telephone}</span></div>
        </div>
      </div>
    </div>

    <div class="col-right">
      <div class="section">
        <table class="lr-table">
          <tr><th></th><th>LIVRAISON</th><th>REPRISE</th></tr>
          <tr><td>Le</td><td><strong>${r.pickupDate}</strong></td><td><strong>${r.dropoffDate}</strong></td></tr>
          <tr><td>Heure</td><td><strong>${x.pickupTime}</strong></td><td><strong>${x.dropoffTime}</strong></td></tr>
          <tr><td>Lieu</td><td><strong style="font-size:10.5px">${r.pickupLocation}</strong></td><td><strong style="font-size:10.5px">${r.dropoffLocation}</strong></td></tr>
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
          <div class="ci" style="margin-top:4px;font-size:11px"><div class="cb"></div>&nbsp;État Propreté : oui &nbsp;&nbsp;&nbsp; non</div>
          <div class="ci" style="margin-top:3px;font-size:11px"><div class="cb"></div>&nbsp;Carburant : <span style="border-bottom:1px solid #000;display:inline-block;width:75px">&nbsp;</span></div>
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

  <!-- Schéma dommages -->
  <div class="diagram-wrap">
    <div style="font-size:12px;margin-bottom:7px;font-weight:500">Noter sur ce schéma les dommages existants :</div>
    <div class="diag-inner">
      <div class="side-lbl"><span>A</span><span>R</span><span>R</span><span>I</span><span>È</span><span>R</span><span>E</span></div>
      <svg width="320" height="110" viewBox="0 0 320 110" xmlns="http://www.w3.org/2000/svg">
        <!-- Corps principal de la voiture (vue de dessus) -->
        <path d="M 55,10 L 265,10 Q 295,10 298,30 L 298,80 Q 295,100 265,100 L 55,100 Q 25,100 22,80 L 22,30 Q 25,10 55,10 Z"
              fill="white" stroke="#000" stroke-width="2"/>
        <!-- Toit / habitacle -->
        <path d="M 90,26 L 230,26 Q 255,26 258,40 L 258,70 Q 255,84 230,84 L 90,84 Q 65,84 62,70 L 62,40 Q 65,26 90,26 Z"
              fill="#f5f5f5" stroke="#000" stroke-width="1.2"/>
        <!-- Pare-brise avant (droite) -->
        <path d="M 258,40 Q 272,45 275,55 Q 272,65 258,70" fill="none" stroke="#000" stroke-width="1"/>
        <!-- Pare-brise arrière (gauche) -->
        <path d="M 62,40 Q 48,45 45,55 Q 48,65 62,70" fill="none" stroke="#000" stroke-width="1"/>
        <!-- Ligne de séparation portes avant/arrière -->
        <line x1="160" y1="26" x2="160" y2="84" stroke="#000" stroke-width="1"/>
        <!-- Poignées de portes -->
        <rect x="118" y="49" width="16" height="5" rx="2" fill="#ccc" stroke="#000" stroke-width="0.7"/>
        <rect x="186" y="49" width="16" height="5" rx="2" fill="#ccc" stroke="#000" stroke-width="0.7"/>
        <rect x="118" y="56" width="16" height="5" rx="2" fill="#ccc" stroke="#000" stroke-width="0.7"/>
        <rect x="186" y="56" width="16" height="5" rx="2" fill="#ccc" stroke="#000" stroke-width="0.7"/>
        <!-- Roue AV-gauche (bas-droite) -->
        <rect x="255" y="82" width="38" height="22" rx="5" fill="#ccc" stroke="#000" stroke-width="1.5"/>
        <rect x="261" y="86" width="26" height="14" rx="3" fill="#999" stroke="#000" stroke-width="0.8"/>
        <!-- Roue AV-droite (haut-droite) -->
        <rect x="255" y="6" width="38" height="22" rx="5" fill="#ccc" stroke="#000" stroke-width="1.5"/>
        <rect x="261" y="10" width="26" height="14" rx="3" fill="#999" stroke="#000" stroke-width="0.8"/>
        <!-- Roue AR-gauche (bas-gauche) -->
        <rect x="27" y="82" width="38" height="22" rx="5" fill="#ccc" stroke="#000" stroke-width="1.5"/>
        <rect x="33" y="86" width="26" height="14" rx="3" fill="#999" stroke="#000" stroke-width="0.8"/>
        <!-- Roue AR-droite (haut-gauche) -->
        <rect x="27" y="6" width="38" height="22" rx="5" fill="#ccc" stroke="#000" stroke-width="1.5"/>
        <rect x="33" y="10" width="26" height="14" rx="3" fill="#999" stroke="#000" stroke-width="0.8"/>
      </svg>
      <div class="side-lbl"><span>A</span><span>V</span><span>A</span><span>N</span><span>T</span></div>
    </div>
  </div>

  <div class="caution">
    <span>Caution : ………………………………… Montant : ………………………… Assurance</span>
    <span>R.C <span style="border:1px solid #000;padding:1px 6px;font-weight:bold">✕</span></span>
    <span>Tous risque <span style="border:1px solid #000;padding:1px 12px">&nbsp;</span></span>
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
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, "_blank");
  if (win) {
    win.onload = () => { win.print(); URL.revokeObjectURL(url); };
  }
}

const EMPTY_EXTRAS: ContractExtras = {
  dateNaissance: "", lieuNaissance: "", adresse: "",
  permisDelivreLe: "", permisDelivreVille: "", permisDelivrePays: "Maroc",
  cinPasseport: "", cinDelivreLe: "", cinDelivreVille: "", cinDelivrePays: "Maroc",
  arriveeMaroc: "", numEntree: "", matricule: "",
  pickupTime: "09:00", dropoffTime: "09:00",
  d2Nom: "", d2Prenom: "", d2DateNaissance: "", d2LieuNaissance: "", d2Adresse: "",
  d2Permis: "", d2PermisDelivreLe: "", d2PermisDelivreVille: "", d2PermisDelivrePays: "Maroc",
  d2CinPasseport: "", d2CinDelivreLe: "", d2CinDelivreVille: "", d2CinDelivrePays: "Maroc",
  d2ArriveeMaroc: "", d2NumEntree: "", d2Telephone: "",
};

export default function AdminInvoicesPage() {
  const router = useRouter();
  const [confirmedReservations, setConfirmedReservations] = useState<Reservation[]>([]);
  const [contractModal, setContractModal] = useState<{
    open: boolean; r: Reservation | null; car: Car | undefined; contractNum: string;
  }>({ open: false, r: null, car: undefined, contractNum: "" });
  const [extras, setExtras] = useState<ContractExtras>(EMPTY_EXTRAS);

  const openContractModal = (r: Reservation, car: Car | undefined, contractNum: string) => {
    setExtras({ ...EMPTY_EXTRAS });
    setContractModal({ open: true, r, car, contractNum });
  };

  const handleGenerateContract = () => {
    if (!contractModal.r) return;
    downloadContract(contractModal.r, contractModal.car, contractModal.contractNum, extras);
    setContractModal({ open: false, r: null, car: undefined, contractNum: "" });
  };

  const ef = (label: string, key: keyof ContractExtras, placeholder = "") => (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
      <input
        type="text"
        value={extras[key]}
        onChange={(e) => setExtras({ ...extras, [key]: e.target.value })}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#e63946]"
      />
    </div>
  );

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
                      onClick={() => openContractModal(r, car, `CTR-${invoiceNum.replace("FAC-", "")}`)}
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

      {/* Modal informations complémentaires contrat */}
      {contractModal.open && contractModal.r && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="font-bold text-[#1a1a2e] text-lg">Informations pour le contrat</h2>
                <p className="text-sm text-gray-400 mt-0.5">{contractModal.r.clientFirstName} {contractModal.r.clientLastName} — {contractModal.contractNum}</p>
              </div>
              <button onClick={() => setContractModal({ open: false, r: null, car: undefined, contractNum: "" })} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Infos pré-remplies (lecture seule) */}
              <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Client</p>
                  <p className="text-sm font-bold">{contractModal.r.clientFirstName} {contractModal.r.clientLastName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Téléphone</p>
                  <p className="text-sm font-bold">{contractModal.r.clientPhone}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">N° Permis</p>
                  <p className="text-sm font-bold">{contractModal.r.clientLicense}</p>
                </div>
              </div>

              {/* Champs manquants */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Identité du conducteur</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ef("Date de naissance", "dateNaissance", "JJ/MM/AAAA")}
                  {ef("Lieu de naissance", "lieuNaissance", "Ville")}
                  {ef("Adresse complète", "adresse", "Rue, Ville, Pays")}
                  {ef("CIN / Passeport N°", "cinPasseport", "AB123456")}
                  {ef("CIN délivré le", "cinDelivreLe", "JJ/MM/AAAA")}
                  {ef("CIN délivré à (ville)", "cinDelivreVille", "Casablanca")}
                  {ef("CIN délivré (pays)", "cinDelivrePays", "Maroc")}
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Permis de conduire</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {ef("Délivré le", "permisDelivreLe", "JJ/MM/AAAA")}
                  {ef("Délivré à (ville)", "permisDelivreVille", "Casablanca")}
                  {ef("Pays", "permisDelivrePays", "Maroc")}
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Arrivée au Maroc (si étranger)</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ef("Date d'arrivée au Maroc", "arriveeMaroc", "JJ/MM/AAAA")}
                  {ef("N° d'entrée", "numEntree", "—")}
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Véhicule & Horaires</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {ef("Matricule véhicule", "matricule", "12345-A-6")}
                  {ef("Heure de départ", "pickupTime", "09:00")}
                  {ef("Heure de retour", "dropoffTime", "09:00")}
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  Conducteur N°2
                  <span className="ml-2 text-gray-400 font-normal normal-case">(optionnel)</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ef("Nom", "d2Nom", "DUPONT")}
                  {ef("Prénom", "d2Prenom", "Jean")}
                  {ef("Date de naissance", "d2DateNaissance", "JJ/MM/AAAA")}
                  {ef("Lieu de naissance", "d2LieuNaissance", "Ville")}
                  {ef("Adresse complète", "d2Adresse", "Rue, Ville, Pays")}
                  {ef("N° téléphone", "d2Telephone", "+212 6 00 00 00 00")}
                  {ef("Permis de conduire N°", "d2Permis", "AB123456")}
                  {ef("Permis délivré le", "d2PermisDelivreLe", "JJ/MM/AAAA")}
                  {ef("Permis délivré à (ville)", "d2PermisDelivreVille", "Casablanca")}
                  {ef("Permis délivré (pays)", "d2PermisDelivrePays", "Maroc")}
                  {ef("CIN / Passeport N°", "d2CinPasseport", "AB123456")}
                  {ef("CIN délivré le", "d2CinDelivreLe", "JJ/MM/AAAA")}
                  {ef("CIN délivré à (ville)", "d2CinDelivreVille", "Casablanca")}
                  {ef("CIN délivré (pays)", "d2CinDelivrePays", "Maroc")}
                  {ef("Arrivée au Maroc le", "d2ArriveeMaroc", "JJ/MM/AAAA")}
                  {ef("N° d'entrée", "d2NumEntree", "—")}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
              <button
                onClick={() => setContractModal({ open: false, r: null, car: undefined, contractNum: "" })}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleGenerateContract}
                className="px-5 py-2.5 rounded-xl bg-[#1a1a2e] text-white text-sm font-bold hover:bg-[#2d2d4e] transition-colors flex items-center gap-2"
              >
                <ScrollText size={15} />
                Générer le contrat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
