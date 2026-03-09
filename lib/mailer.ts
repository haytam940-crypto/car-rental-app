/**
 * Envoi d'emails HTML branded via Resend (https://resend.com).
 * Les emails ont exactement le même design que le site ESON MAROC.
 * Aucun package externe — utilise fetch natif.
 *
 * Setup requis :
 *  1. Créez un compte sur resend.com (gratuit — 3000 emails/mois)
 *  2. Récupérez votre API Key dans Resend → API Keys
 *  3. Ajoutez RESEND_API_KEY dans .env.local
 *  4. Vérifiez le domaine eson-maroc.com dans Resend → Domains
 */

const RESEND_API = "https://api.resend.com/emails";

/** Icône Material Symbols Rounded inline (chargée via Google Fonts dans le <head>) */
function mi(name: string, color = "#D4A96A", size = 20) {
  return `<span style="font-family:'Material Symbols Rounded';font-size:${size}px;color:${color};vertical-align:middle;line-height:1;font-variation-settings:'FILL' 1,'wght' 400,'GRAD' 0,'opsz' ${size};">${name}</span>`;
}
const FROM = "Eson Maroc <reservations@eson-maroc.com>";
const ADMIN_EMAIL = process.env.ADMIN_NOTIFY_EMAIL ?? "contact@eson-maroc.com";
const SITE_URL    = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/* ─── Envoi via Resend ───────────────────────────────────────────────── */

async function sendEmail(to: string, subject: string, html: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("[mailer] RESEND_API_KEY manquant — email non envoyé");
    return;
  }

  const res = await fetch(RESEND_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM, to, subject, html }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[mailer] Erreur Resend:", err);
  }
}

/* ─── Layout HTML — design identique au site ────────────────────────── */

function baseLayout(content: string, accentBg = "#0a0a0a") {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Eson Maroc</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
</head>
<body style="margin:0;padding:0;background:#111111;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#111111;padding:40px 0;">
<tr><td align="center">
<table width="620" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border-radius:16px;overflow:hidden;border:1px solid #2a2a2a;">

  <!-- Header -->
  <tr><td style="background:${accentBg};padding:32px 48px;text-align:center;border-bottom:2px solid #D4A96A;">
    <div style="display:inline-block;">
      <span style="font-size:26px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;text-transform:uppercase;">
        ESON<span style="color:#D4A96A;"> MAROC</span>
      </span>
      <p style="color:#888888;font-size:11px;margin:5px 0 0;text-transform:uppercase;letter-spacing:3px;">Location de Voitures Premium</p>
    </div>
  </td></tr>

  <!-- Body -->
  <tr><td style="padding:40px 48px;background:#1a1a1a;">${content}</td></tr>

  <!-- Separator -->
  <tr><td style="padding:0 48px;">
    <div style="height:1px;background:linear-gradient(to right,transparent,#D4A96A44,transparent);"></div>
  </td></tr>

  <!-- Footer -->
  <tr><td style="background:#111111;padding:24px 48px;text-align:center;">
    <p style="color:#555555;font-size:12px;margin:0;">Av. Mohamed VI, en face de la RAM, Ouarzazate, Maroc</p>
    <p style="color:#555555;font-size:12px;margin:5px 0 0;">
      Tél : <span style="color:#D4A96A;">+212.524.89.05.62</span>
      &nbsp;|&nbsp;
      GSM : <span style="color:#D4A96A;">+212.666.89.08.99</span>
    </p>
    <p style="color:#333333;font-size:11px;margin:10px 0 0;">© ${new Date().getFullYear()} Eson Maroc — Tous droits réservés</p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

/* ─── Composants HTML ───────────────────────────────────────────────── */

function badge(status: string) {
  const map: Record<string, [string, string, string]> = {
    pending:   ["#f59e0b", "#000", "En attente"],
    confirmed: ["#10b981", "#fff", "Confirmée"],
    cancelled: ["#ef4444", "#fff", "Annulée"],
    modified:  ["#6366f1", "#fff", "Modifiée"],
  };
  const [bg, color, label] = map[status] ?? ["#555", "#fff", status];
  return `<span style="background:${bg};color:${color};padding:4px 14px;border-radius:20px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">${label}</span>`;
}

function infoRow(label: string, value: string) {
  return `<tr>
    <td style="padding:10px 16px;color:#666666;font-size:13px;width:42%;border-bottom:1px solid #2a2a2a;vertical-align:top;">${label}</td>
    <td style="padding:10px 16px;color:#e5e5e5;font-size:13px;font-weight:600;border-bottom:1px solid #2a2a2a;">${value}</td>
  </tr>`;
}

function goldButton(href: string, text: string) {
  return `<a href="${href}" style="display:inline-block;background:#D4A96A;color:#000000;font-weight:700;padding:14px 32px;border-radius:10px;text-decoration:none;font-size:14px;letter-spacing:0.3px;">${text}</a>`;
}

function outlineButton(href: string, text: string, danger = false) {
  const border = danger ? "#ef4444" : "#3a3a3a";
  const color  = danger ? "#ef4444" : "#cccccc";
  return `<a href="${href}" style="display:inline-block;background:transparent;color:${color};font-weight:600;padding:11px 22px;border-radius:8px;text-decoration:none;font-size:13px;border:1px solid ${border};">${text}</a>`;
}

function infoTable(rows: string) {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="background:#111111;border-radius:10px;overflow:hidden;border:1px solid #2a2a2a;margin-bottom:28px;">${rows}</table>`;
}

/* ─── Email client : confirmation + lien portail ─────────────────────── */
export async function sendClientConfirmation(params: {
  clientName: string;
  clientEmail: string;
  reservation: {
    id: string; carName: string; pickupDate: string; dropoffDate: string;
    pickupLocation: string; dropoffLocation: string; totalPrice: number;
    deliveryFee?: number; recoveryFee?: number; durationDays: number;
    pickupTime?: string; dropoffTime?: string; status: string;
  };
  portalToken: string;
}) {
  const { clientName, clientEmail, reservation: r, portalToken } = params;
  const portalUrl = `${SITE_URL}/reservation/${encodeURIComponent(portalToken)}`;
  const total = r.totalPrice + (r.deliveryFee ?? 0) + (r.recoveryFee ?? 0);

  const content = `
    <h2 style="color:#ffffff;font-size:22px;font-weight:900;margin:0 0 8px;">
      Confirmation de réservation &nbsp;${badge(r.status)}
    </h2>
    <p style="color:#999999;font-size:14px;margin:0 0 32px;">
      Bonjour <strong style="color:#D4A96A;">${clientName}</strong>, voici le récapitulatif de votre réservation.
    </p>

    ${infoTable(`
      ${infoRow("Référence", `<span style="color:#D4A96A;font-family:monospace;">#${r.id.slice(-8).toUpperCase()}</span>`)}
      ${infoRow("Véhicule", r.carName)}
      ${infoRow("Date de livraison", `${r.pickupDate}${r.pickupTime ? " &mdash; " + r.pickupTime : ""}`)}
      ${infoRow("Lieu de livraison", r.pickupLocation)}
      ${infoRow("Date de récupération", `${r.dropoffDate}${r.dropoffTime ? " &mdash; " + r.dropoffTime : ""}`)}
      ${infoRow("Lieu de récupération", r.dropoffLocation)}
      ${infoRow("Durée", `${r.durationDays} jour${r.durationDays > 1 ? "s" : ""}`)}
      ${infoRow("Prix location", `${r.totalPrice.toLocaleString("fr-MA")} DH`)}
      ${r.deliveryFee ? infoRow("Frais livraison", `${r.deliveryFee.toLocaleString("fr-MA")} DH`) : ""}
      ${r.recoveryFee ? infoRow("Frais récupération", `${r.recoveryFee.toLocaleString("fr-MA")} DH`) : ""}
      ${infoRow("Total HT", `<span style="color:#D4A96A;font-size:16px;font-weight:900;">${total.toLocaleString("fr-MA")} DH</span>`)}
    `)}

    <p style="color:#999999;font-size:14px;margin:0 0 18px;">Gérez votre réservation depuis votre portail personnel :</p>

    <div style="text-align:center;margin-bottom:18px;">
      ${goldButton(portalUrl, "Gérer ma réservation →")}
    </div>
    <div style="text-align:center;margin-bottom:32px;">
      ${outlineButton(`${portalUrl}?action=modify`, `${mi("edit", "#1a202c", 15)} Modifier`)}
      &nbsp;&nbsp;
      ${outlineButton(`${portalUrl}?action=cancel`, "✕ Annuler", true)}
    </div>

    <div style="background:#1f1a0e;border:1px solid #D4A96A44;border-radius:10px;padding:16px 20px;">
      <p style="color:#D4A96A;font-size:13px;margin:0;line-height:1.6;">
        <strong>${mi("local_cafe", "#D4A96A", 18)} Un verre de thé vous attend !</strong><br/>
        <span style="color:#999999;">Notre équipe vous accueille chaleureusement.
        Pour toute question appelez-nous au <strong style="color:#D4A96A;">+212.666.89.08.99</strong></span>
      </p>
    </div>
  `;

  await sendEmail(clientEmail, `Confirmation réservation — #${r.id.slice(-8).toUpperCase()}`, baseLayout(content));
}

/* ─── Email admin : nouvelle réservation ────────────────────────────── */
export async function sendAdminNewReservation(params: {
  reservation: {
    id: string; carName: string;
    clientFirstName: string; clientLastName: string;
    clientEmail: string; clientPhone: string;
    pickupDate: string; dropoffDate: string;
    pickupLocation: string; dropoffLocation: string;
    totalPrice: number; deliveryFee?: number; recoveryFee?: number;
    durationDays: number; pickupTime?: string; dropoffTime?: string; message?: string;
  };
}) {
  const r = params.reservation;
  const total = r.totalPrice + (r.deliveryFee ?? 0) + (r.recoveryFee ?? 0);

  const content = `
    <h2 style="color:#10b981;font-size:20px;font-weight:900;margin:0 0 8px;">
      ${mi("add_circle", "#10b981", 22)} Nouvelle réservation reçue
    </h2>
    <p style="color:#999999;font-size:14px;margin:0 0 28px;">
      Réf : <span style="color:#D4A96A;font-family:monospace;font-weight:700;">#${r.id.slice(-8).toUpperCase()}</span>
    </p>

    ${infoTable(`
      ${infoRow("Client", `<strong style="color:#ffffff;">${r.clientFirstName} ${r.clientLastName}</strong>`)}
      ${infoRow("Email", `<a href="mailto:${r.clientEmail}" style="color:#D4A96A;text-decoration:none;">${r.clientEmail}</a>`)}
      ${infoRow("Téléphone", `<a href="tel:${r.clientPhone}" style="color:#D4A96A;text-decoration:none;">${r.clientPhone}</a>`)}
      ${infoRow("Véhicule", r.carName)}
      ${infoRow("Livraison", `${r.pickupDate}${r.pickupTime ? " &mdash; " + r.pickupTime : ""}`)}
      ${infoRow("Lieu livraison", r.pickupLocation)}
      ${infoRow("Récupération", `${r.dropoffDate}${r.dropoffTime ? " &mdash; " + r.dropoffTime : ""}`)}
      ${infoRow("Lieu récupération", r.dropoffLocation)}
      ${infoRow("Durée", `${r.durationDays} jour(s)`)}
      ${infoRow("Total HT", `<span style="color:#D4A96A;font-size:15px;font-weight:900;">${total.toLocaleString("fr-MA")} DH</span>`)}
      ${r.message ? infoRow("Message client", `<em style="color:#cccccc;">${r.message}</em>`) : ""}
    `)}

    <div style="text-align:center;">
      ${goldButton(`${SITE_URL}/admin/reservations`, "Voir dans l'admin →")}
    </div>
  `;

  await sendEmail(
    ADMIN_EMAIL,
    `[Eson Maroc] Nouvelle réservation #${r.id.slice(-8).toUpperCase()} — ${r.clientFirstName} ${r.clientLastName}`,
    baseLayout(content, "#0d1a0f")
  );
}

/* ─── Email admin : modification ────────────────────────────────────── */
export async function sendAdminModification(params: {
  reservationId: string;
  clientName: string;
  changes: Record<string, { before: string; after: string }>;
}) {
  const { reservationId, clientName, changes } = params;

  const changeRows = Object.entries(changes)
    .map(([field, { before, after }]) =>
      infoRow(field, `<s style="color:#666666;">${before}</s> <span style="color:#D4A96A;margin:0 4px;">→</span> <strong style="color:#10b981;">${after}</strong>`)
    )
    .join("");

  const content = `
    <h2 style="color:#6366f1;font-size:20px;font-weight:900;margin:0 0 8px;">
      ${mi("edit", "#6366f1", 22)} Réservation modifiée
    </h2>
    <p style="color:#999999;font-size:14px;margin:0 0 28px;">
      <strong style="color:#ffffff;">${clientName}</strong> a modifié sa réservation
      <span style="color:#D4A96A;font-family:monospace;font-weight:700;">#${reservationId.slice(-8).toUpperCase()}</span>
    </p>

    ${infoTable(changeRows)}

    <div style="text-align:center;">
      ${goldButton(`${SITE_URL}/admin/reservations`, "Voir la réservation →")}
    </div>
  `;

  await sendEmail(
    ADMIN_EMAIL,
    `[Eson Maroc] Réservation modifiée #${reservationId.slice(-8).toUpperCase()} — ${clientName}`,
    baseLayout(content, "#0d0d1f")
  );
}

/* ─── Email admin : annulation ──────────────────────────────────────── */
export async function sendAdminCancellation(params: {
  reservationId: string;
  clientName: string;
  clientEmail: string;
  carName: string;
  reason?: string;
}) {
  const { reservationId, clientName, clientEmail, carName, reason } = params;

  const content = `
    <h2 style="color:#ef4444;font-size:20px;font-weight:900;margin:0 0 8px;">
      ${mi("cancel", "#ef4444", 22)} Réservation annulée
    </h2>
    <p style="color:#999999;font-size:14px;margin:0 0 28px;">
      Réf : <span style="color:#D4A96A;font-family:monospace;font-weight:700;">#${reservationId.slice(-8).toUpperCase()}</span>
    </p>

    ${infoTable(`
      ${infoRow("Référence", `<span style="color:#D4A96A;font-family:monospace;">#${reservationId.slice(-8).toUpperCase()}</span>`)}
      ${infoRow("Client", `<strong style="color:#ffffff;">${clientName}</strong>`)}
      ${infoRow("Email", `<a href="mailto:${clientEmail}" style="color:#D4A96A;text-decoration:none;">${clientEmail}</a>`)}
      ${infoRow("Véhicule", carName)}
      ${reason ? infoRow("Motif", `<em style="color:#cccccc;">${reason}</em>`) : ""}
    `)}

    <div style="text-align:center;">
      ${goldButton(`${SITE_URL}/admin/reservations`, "Voir dans l'admin →")}
    </div>
  `;

  await sendEmail(
    ADMIN_EMAIL,
    `[Eson Maroc] Annulation réservation #${reservationId.slice(-8).toUpperCase()} — ${clientName}`,
    baseLayout(content, "#1f0d0d")
  );
}

/* ─── Email client : confirmation modification ──────────────────────── */
export async function sendClientModificationConfirm(params: {
  clientName: string;
  clientEmail: string;
  reservationId: string;
  changes: Record<string, { before: string; after: string }>;
  portalToken: string;
}) {
  const { clientName, clientEmail, reservationId, changes, portalToken } = params;
  const portalUrl = `${SITE_URL}/reservation/${encodeURIComponent(portalToken)}`;

  const changeRows = Object.entries(changes)
    .map(([field, { before, after }]) =>
      infoRow(field, `<s style="color:#666666;">${before}</s> <span style="color:#D4A96A;margin:0 4px;">→</span> <strong style="color:#10b981;">${after}</strong>`)
    )
    .join("");

  const content = `
    <h2 style="color:#ffffff;font-size:22px;font-weight:900;margin:0 0 8px;">
      Modification confirmée ${mi("check_circle", "#10b981", 22)}
    </h2>
    <p style="color:#999999;font-size:14px;margin:0 0 32px;">
      Bonjour <strong style="color:#D4A96A;">${clientName}</strong>, votre réservation
      <span style="color:#D4A96A;font-family:monospace;font-weight:700;">#${reservationId.slice(-8).toUpperCase()}</span> a bien été modifiée.
    </p>

    ${infoTable(changeRows)}

    <div style="text-align:center;">
      ${goldButton(portalUrl, "Voir ma réservation →")}
    </div>
  `;

  await sendEmail(clientEmail, `[Eson Maroc] Modification confirmée — #${reservationId.slice(-8).toUpperCase()}`, baseLayout(content));
}

/* ─── Email client : confirmation annulation ────────────────────────── */
export async function sendClientCancellationConfirm(params: {
  clientName: string;
  clientEmail: string;
  reservationId: string;
  carName: string;
}) {
  const { clientName, clientEmail, reservationId, carName } = params;

  const content = `
    <h2 style="color:#ef4444;font-size:22px;font-weight:900;margin:0 0 8px;">
      Réservation annulée
    </h2>
    <p style="color:#999999;font-size:14px;margin:0 0 20px;">
      Bonjour <strong style="color:#D4A96A;">${clientName}</strong>, votre réservation
      <span style="color:#D4A96A;font-family:monospace;">#${reservationId.slice(-8).toUpperCase()}</span>
      pour <strong style="color:#ffffff;">${carName}</strong> a bien été annulée.
    </p>

    <div style="background:#1f1a0e;border:1px solid #D4A96A44;border-radius:10px;padding:16px 20px;margin-bottom:28px;">
      <p style="color:#999999;font-size:13px;margin:0;line-height:1.6;">
        Vous souhaitez réserver à nouveau ? Consultez notre flotte en ligne
        ou appelez-nous au <strong style="color:#D4A96A;">+212.666.89.08.99</strong>
      </p>
    </div>

    <div style="text-align:center;">
      ${goldButton(`${SITE_URL}/fleet`, "Voir notre flotte →")}
    </div>
  `;

  await sendEmail(clientEmail, `[Eson Maroc] Annulation confirmée — #${reservationId.slice(-8).toUpperCase()}`, baseLayout(content));
}

/* ─── Email client : devis ──────────────────────────────────────────── */
export async function sendDevisToClient(devis: {
  id: string;
  type: "location" | "excursion";
  clientFirstName: string;
  clientLastName: string;
  clientEmail: string;
  clientPhone: string;
  carName?: string;
  pickupDate?: string; dropoffDate?: string;
  pickupLocation?: string; dropoffLocation?: string;
  pickupTime?: string; dropoffTime?: string;
  durationDays?: number;
  destination?: string;
  excursionDate?: string;
  participants?: number;
  items: Array<{ description: string; quantity: number; unitPrice: number; total: number }>;
  subtotal: number;
  discount: number;
  total: number;
  notes?: string;
  validUntil?: string;
}) {
  const clientName = `${devis.clientFirstName} ${devis.clientLastName}`;
  const ref = `#${devis.id.slice(-8).toUpperCase()}`;
  const typeLabel = devis.type === "location" ? "Location de voiture" : "Excursion";

  const serviceRows = devis.type === "location"
    ? `
      ${infoRow("Véhicule", devis.carName ?? "")}
      ${infoRow("Date de livraison", `${devis.pickupDate ?? ""}${devis.pickupTime ? " à " + devis.pickupTime : ""}`)}
      ${infoRow("Lieu de livraison", devis.pickupLocation ?? "")}
      ${infoRow("Date de récupération", `${devis.dropoffDate ?? ""}${devis.dropoffTime ? " à " + devis.dropoffTime : ""}`)}
      ${infoRow("Lieu de récupération", devis.dropoffLocation ?? "")}
      ${devis.durationDays ? infoRow("Durée", `${devis.durationDays} jour${devis.durationDays > 1 ? "s" : ""}`) : ""}
    `
    : `
      ${infoRow("Destination", devis.destination ?? "")}
      ${infoRow("Date", devis.excursionDate ?? "")}
      ${infoRow("Participants", String(devis.participants ?? 1))}
    `;

  const itemsRows = devis.items.map(item => `
    <tr>
      <td style="padding:10px 16px;color:#e5e5e5;font-size:13px;border-bottom:1px solid #2a2a2a;">${item.description}</td>
      <td style="padding:10px 16px;color:#999;font-size:13px;border-bottom:1px solid #2a2a2a;text-align:center;">${item.quantity}</td>
      <td style="padding:10px 16px;color:#999;font-size:13px;border-bottom:1px solid #2a2a2a;text-align:right;">${item.unitPrice.toLocaleString("fr-MA")} DH</td>
      <td style="padding:10px 16px;color:#D4A96A;font-size:13px;font-weight:700;border-bottom:1px solid #2a2a2a;text-align:right;">${item.total.toLocaleString("fr-MA")} DH</td>
    </tr>
  `).join("");

  const content = `
    <h2 style="color:#ffffff;font-size:22px;font-weight:900;margin:0 0 4px;">
      Votre devis Eson Maroc
    </h2>
    <p style="color:#999999;font-size:13px;margin:0 0 6px;">
      Réf : <span style="color:#D4A96A;font-family:monospace;font-weight:700;">${ref}</span>
      &nbsp;·&nbsp;
      <span style="background:#D4A96A22;color:#D4A96A;padding:2px 10px;border-radius:20px;font-size:11px;font-weight:700;text-transform:uppercase;">${typeLabel}</span>
    </p>
    ${devis.validUntil ? `<p style="color:#666;font-size:12px;margin:0 0 28px;">Valable jusqu'au <strong style="color:#f59e0b;">${devis.validUntil}</strong></p>` : `<div style="margin-bottom:28px;"></div>`}

    <p style="color:#999999;font-size:14px;margin:0 0 16px;">
      Bonjour <strong style="color:#D4A96A;">${clientName}</strong>,<br/>
      Veuillez trouver ci-dessous le détail de votre devis.
    </p>

    <!-- Détails service -->
    <p style="color:#888;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px;">Détails de la prestation</p>
    ${infoTable(serviceRows)}

    <!-- Tableau des prestations -->
    <p style="color:#888;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px;">Récapitulatif tarifaire</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#111111;border-radius:10px;overflow:hidden;border:1px solid #2a2a2a;margin-bottom:28px;">
      <thead>
        <tr style="background:#1f1f1f;">
          <th style="padding:10px 16px;color:#888;font-size:11px;text-align:left;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #2a2a2a;">Prestation</th>
          <th style="padding:10px 16px;color:#888;font-size:11px;text-align:center;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #2a2a2a;">Qté</th>
          <th style="padding:10px 16px;color:#888;font-size:11px;text-align:right;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #2a2a2a;">Prix unit.</th>
          <th style="padding:10px 16px;color:#888;font-size:11px;text-align:right;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #2a2a2a;">Total</th>
        </tr>
      </thead>
      <tbody>${itemsRows}</tbody>
      <tfoot>
        ${devis.discount > 0 ? `
        <tr>
          <td colspan="3" style="padding:8px 16px;color:#888;font-size:13px;text-align:right;border-top:1px solid #2a2a2a;">Sous-total</td>
          <td style="padding:8px 16px;color:#e5e5e5;font-size:13px;text-align:right;border-top:1px solid #2a2a2a;">${devis.subtotal.toLocaleString("fr-MA")} DH</td>
        </tr>
        <tr>
          <td colspan="3" style="padding:8px 16px;color:#10b981;font-size:13px;text-align:right;">Remise</td>
          <td style="padding:8px 16px;color:#10b981;font-size:13px;text-align:right;">- ${devis.discount.toLocaleString("fr-MA")} DH</td>
        </tr>
        ` : ""}
        <tr style="background:#1f1a0e;">
          <td colspan="3" style="padding:14px 16px;color:#D4A96A;font-size:15px;font-weight:900;text-align:right;border-top:2px solid #D4A96A44;">Total HT</td>
          <td style="padding:14px 16px;color:#D4A96A;font-size:18px;font-weight:900;text-align:right;border-top:2px solid #D4A96A44;">${devis.total.toLocaleString("fr-MA")} DH</td>
        </tr>
      </tfoot>
    </table>

    ${devis.notes ? `
    <div style="background:#1a1a2e;border:1px solid #3a3a6a;border-radius:10px;padding:16px 20px;margin-bottom:28px;">
      <p style="color:#888;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px;">Notes</p>
      <p style="color:#cccccc;font-size:13px;margin:0;line-height:1.7;">${devis.notes}</p>
    </div>
    ` : ""}

    <div style="background:#1f1a0e;border:1px solid #D4A96A44;border-radius:10px;padding:16px 20px;margin-bottom:28px;">
      <p style="color:#D4A96A;font-size:13px;margin:0;line-height:1.6;">
        Pour accepter ce devis ou pour toute question, contactez-nous :<br/>
        <strong>Tél : +212.524.89.05.62</strong> &nbsp;|&nbsp; <strong>GSM : +212.666.89.08.99</strong><br/>
        <span style="color:#999999;">Av. Mohamed VI, en face de la RAM, Ouarzazate, Maroc</span>
      </p>
    </div>
  `;

  await sendEmail(
    devis.clientEmail,
    `Devis Eson Maroc ${ref} — ${typeLabel}`,
    baseLayout(content)
  );
}
