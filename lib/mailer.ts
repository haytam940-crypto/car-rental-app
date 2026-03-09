/**
 * Envoi d'emails via l'API REST Resend (https://resend.com).
 * Aucun package externe nécessaire — utilise fetch natif.
 */

const RESEND_API = "https://api.resend.com/emails";
const FROM = "Eson Maroc <reservations@eson-maroc.com>";
const ADMIN_EMAIL = process.env.ADMIN_NOTIFY_EMAIL ?? "contact@eson-maroc.com";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

async function sendEmail(to: string, subject: string, html: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("[mailer] RESEND_API_KEY manquant — email non envoyé");
    return;
  }
  const res = await fetch(RESEND_API, {
    method: "POST",
    headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to, subject, html }),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error("[mailer] Erreur Resend:", err);
  }
}

/* ─── Templates HTML ─────────────────────────────────────────────────── */

function baseLayout(content: string) {
  return `<!DOCTYPE html><html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Eson Maroc</title></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:30px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
  <!-- Header -->
  <tr><td style="background:#0a0a0a;padding:28px 40px;text-align:center;">
    <span style="font-size:24px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">
      ESON<span style="color:#D4A96A;"> MAROC</span>
    </span>
    <p style="color:#888;font-size:11px;margin:4px 0 0;text-transform:uppercase;letter-spacing:2px;">Location de Voitures</p>
  </td></tr>
  <!-- Body -->
  <tr><td style="padding:40px;">${content}</td></tr>
  <!-- Footer -->
  <tr><td style="background:#f8f8f8;border-top:1px solid #eee;padding:20px 40px;text-align:center;">
    <p style="color:#999;font-size:12px;margin:0;">Av. Mohamed VI, en face de la RAM, Ouarzazate, Maroc</p>
    <p style="color:#999;font-size:12px;margin:4px 0 0;">Tél : +212.524.89.05.62 &nbsp;|&nbsp; GSM : +212.666.89.08.99</p>
    <p style="color:#ccc;font-size:11px;margin:8px 0 0;">© ${new Date().getFullYear()} Eson Maroc — Tous droits réservés</p>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;
}

function badge(status: string) {
  const map: Record<string, [string, string]> = {
    pending:   ["#f59e0b", "En attente"],
    confirmed: ["#10b981", "Confirmée"],
    cancelled: ["#ef4444", "Annulée"],
    modified:  ["#6366f1", "Modifiée"],
  };
  const [color, label] = map[status] ?? ["#888", status];
  return `<span style="background:${color};color:#fff;padding:3px 12px;border-radius:20px;font-size:12px;font-weight:700;">${label}</span>`;
}

function infoRow(label: string, value: string) {
  return `<tr>
    <td style="padding:8px 12px;color:#888;font-size:13px;width:40%;border-bottom:1px solid #f0f0f0;">${label}</td>
    <td style="padding:8px 12px;color:#1a1a1a;font-size:13px;font-weight:600;border-bottom:1px solid #f0f0f0;">${value}</td>
  </tr>`;
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

  const html = baseLayout(`
    <h2 style="color:#1a1a1a;font-size:22px;font-weight:900;margin:0 0 6px;">
      Confirmation de réservation ${badge(r.status)}
    </h2>
    <p style="color:#666;font-size:14px;margin:0 0 28px;">Bonjour <strong>${clientName}</strong>, voici le récapitulatif de votre réservation.</p>

    <div style="background:#f9f9f9;border-radius:10px;padding:6px 0;margin-bottom:28px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${infoRow("Référence", `#${r.id.slice(-8).toUpperCase()}`)}
        ${infoRow("Véhicule", r.carName)}
        ${infoRow("Livraison", `${r.pickupDate}${r.pickupTime ? " à " + r.pickupTime : ""}`)}
        ${infoRow("Lieu de livraison", r.pickupLocation)}
        ${infoRow("Récupération", `${r.dropoffDate}${r.dropoffTime ? " à " + r.dropoffTime : ""}`)}
        ${infoRow("Lieu de récupération", r.dropoffLocation)}
        ${infoRow("Durée", `${r.durationDays} jour${r.durationDays > 1 ? "s" : ""}`)}
        ${infoRow("Prix location HT", `${r.totalPrice.toLocaleString()} DH`)}
        ${r.deliveryFee ? infoRow("Frais livraison", `${r.deliveryFee.toLocaleString()} DH`) : ""}
        ${r.recoveryFee ? infoRow("Frais récupération", `${r.recoveryFee.toLocaleString()} DH`) : ""}
        ${infoRow("Total HT", `<span style="color:#D4A96A;font-size:15px;">${total.toLocaleString()} DH</span>`)}
      </table>
    </div>

    <p style="color:#555;font-size:14px;margin:0 0 20px;">Vous pouvez gérer votre réservation depuis votre portail personnel :</p>

    <div style="text-align:center;margin-bottom:28px;">
      <a href="${portalUrl}" style="display:inline-block;background:#D4A96A;color:#000;font-weight:700;padding:14px 32px;border-radius:10px;text-decoration:none;font-size:15px;letter-spacing:0.3px;">
        Gérer ma réservation
      </a>
    </div>

    <div style="display:flex;gap:12px;margin-bottom:28px;">
      <a href="${portalUrl}?action=modify" style="display:inline-block;background:#f1f5f9;color:#1a202c;font-weight:600;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:13px;border:1px solid #e2e8f0;">
        ✏️ Modifier ma réservation
      </a>
      &nbsp;&nbsp;
      <a href="${portalUrl}?action=cancel" style="display:inline-block;background:#fff5f5;color:#e53e3e;font-weight:600;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:13px;border:1px solid #fed7d7;">
        ✕ Annuler ma réservation
      </a>
    </div>

    <div style="background:#fffbeb;border:1px solid #fcd34d;border-radius:8px;padding:14px 18px;">
      <p style="color:#92400e;font-size:13px;margin:0;">
        <strong>🍵 Un verre de thé vous attend !</strong><br/>
        Notre équipe vous accueille chaleureusement. Pour toute question appelez-nous au <strong>+212.666.89.08.99</strong>.
      </p>
    </div>
  `);

  await sendEmail(clientEmail, `Confirmation réservation Eson Maroc — #${r.id.slice(-8).toUpperCase()}`, html);
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

  const html = baseLayout(`
    <h2 style="color:#1a1a1a;font-size:20px;font-weight:900;margin:0 0 6px;">
      🆕 Nouvelle réservation reçue
    </h2>
    <p style="color:#666;font-size:14px;margin:0 0 24px;">Réf : <strong>#${r.id.slice(-8).toUpperCase()}</strong></p>

    <div style="background:#f9f9f9;border-radius:10px;padding:6px 0;margin-bottom:24px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${infoRow("Client", `${r.clientFirstName} ${r.clientLastName}`)}
        ${infoRow("Email", r.clientEmail)}
        ${infoRow("Téléphone", r.clientPhone)}
        ${infoRow("Véhicule", r.carName)}
        ${infoRow("Livraison", `${r.pickupDate}${r.pickupTime ? " à " + r.pickupTime : ""}`)}
        ${infoRow("Lieu livraison", r.pickupLocation)}
        ${infoRow("Récupération", `${r.dropoffDate}${r.dropoffTime ? " à " + r.dropoffTime : ""}`)}
        ${infoRow("Lieu récupération", r.dropoffLocation)}
        ${infoRow("Durée", `${r.durationDays} jour(s)`)}
        ${infoRow("Total HT", `${total.toLocaleString()} DH`)}
        ${r.message ? infoRow("Message", r.message) : ""}
      </table>
    </div>

    <div style="text-align:center;">
      <a href="${SITE_URL}/admin/reservations" style="display:inline-block;background:#0a0a0a;color:#D4A96A;font-weight:700;padding:12px 28px;border-radius:10px;text-decoration:none;font-size:14px;">
        Voir dans l'admin →
      </a>
    </div>
  `);

  await sendEmail(ADMIN_EMAIL, `[Eson Maroc] Nouvelle réservation #${r.id.slice(-8).toUpperCase()} — ${r.clientFirstName} ${r.clientLastName}`, html);
}

/* ─── Email admin : modification ────────────────────────────────────── */
export async function sendAdminModification(params: {
  reservationId: string;
  clientName: string;
  changes: Record<string, { before: string; after: string }>;
}) {
  const { reservationId, clientName, changes } = params;
  const rows = Object.entries(changes)
    .map(([field, { before, after }]) => infoRow(field, `<s style="color:#999;">${before}</s> → <strong>${after}</strong>`))
    .join("");

  const html = baseLayout(`
    <h2 style="color:#1a1a1a;font-size:20px;font-weight:900;margin:0 0 6px;">
      ✏️ Réservation modifiée
    </h2>
    <p style="color:#666;font-size:14px;margin:0 0 24px;">
      <strong>${clientName}</strong> a modifié sa réservation <strong>#${reservationId.slice(-8).toUpperCase()}</strong>
    </p>
    <div style="background:#f9f9f9;border-radius:10px;padding:6px 0;margin-bottom:24px;">
      <table width="100%" cellpadding="0" cellspacing="0">${rows}</table>
    </div>
    <div style="text-align:center;">
      <a href="${SITE_URL}/admin/reservations" style="display:inline-block;background:#6366f1;color:#fff;font-weight:700;padding:12px 28px;border-radius:10px;text-decoration:none;font-size:14px;">
        Voir la réservation →
      </a>
    </div>
  `);

  await sendEmail(ADMIN_EMAIL, `[Eson Maroc] Réservation modifiée #${reservationId.slice(-8).toUpperCase()} — ${clientName}`, html);
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

  const html = baseLayout(`
    <h2 style="color:#ef4444;font-size:20px;font-weight:900;margin:0 0 6px;">
      ✕ Réservation annulée
    </h2>
    <div style="background:#fff5f5;border-radius:10px;padding:6px 0;margin:20px 0;">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${infoRow("Référence", `#${reservationId.slice(-8).toUpperCase()}`)}
        ${infoRow("Client", clientName)}
        ${infoRow("Email", clientEmail)}
        ${infoRow("Véhicule", carName)}
        ${reason ? infoRow("Motif", reason) : ""}
      </table>
    </div>
    <div style="text-align:center;">
      <a href="${SITE_URL}/admin/reservations" style="display:inline-block;background:#0a0a0a;color:#D4A96A;font-weight:700;padding:12px 28px;border-radius:10px;text-decoration:none;font-size:14px;">
        Voir dans l'admin →
      </a>
    </div>
  `);

  await sendEmail(ADMIN_EMAIL, `[Eson Maroc] Annulation réservation #${reservationId.slice(-8).toUpperCase()} — ${clientName}`, html);
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
  const rows = Object.entries(changes)
    .map(([field, { before, after }]) => infoRow(field, `<s style="color:#999;">${before}</s> → <strong>${after}</strong>`))
    .join("");

  const html = baseLayout(`
    <h2 style="color:#1a1a1a;font-size:22px;font-weight:900;margin:0 0 6px;">Modification confirmée ✓</h2>
    <p style="color:#666;font-size:14px;margin:0 0 24px;">Bonjour <strong>${clientName}</strong>, votre réservation <strong>#${reservationId.slice(-8).toUpperCase()}</strong> a bien été modifiée.</p>
    <div style="background:#f9f9f9;border-radius:10px;padding:6px 0;margin-bottom:24px;">
      <table width="100%" cellpadding="0" cellspacing="0">${rows}</table>
    </div>
    <div style="text-align:center;">
      <a href="${portalUrl}" style="display:inline-block;background:#D4A96A;color:#000;font-weight:700;padding:14px 32px;border-radius:10px;text-decoration:none;font-size:15px;">
        Voir ma réservation
      </a>
    </div>
  `);

  await sendEmail(clientEmail, `[Eson Maroc] Modification confirmée — #${reservationId.slice(-8).toUpperCase()}`, html);
}

/* ─── Email client : confirmation annulation ────────────────────────── */
export async function sendClientCancellationConfirm(params: {
  clientName: string;
  clientEmail: string;
  reservationId: string;
  carName: string;
}) {
  const { clientName, clientEmail, reservationId, carName } = params;

  const html = baseLayout(`
    <h2 style="color:#ef4444;font-size:22px;font-weight:900;margin:0 0 6px;">Réservation annulée</h2>
    <p style="color:#666;font-size:14px;margin:0 0 20px;">Bonjour <strong>${clientName}</strong>, votre réservation <strong>#${reservationId.slice(-8).toUpperCase()}</strong> pour <strong>${carName}</strong> a bien été annulée.</p>
    <div style="background:#fffbeb;border:1px solid #fcd34d;border-radius:8px;padding:14px 18px;margin-bottom:24px;">
      <p style="color:#92400e;font-size:13px;margin:0;">
        Vous souhaitez réserver à nouveau ? Consultez notre flotte en ligne ou appelez-nous au <strong>+212.666.89.08.99</strong>.
      </p>
    </div>
    <div style="text-align:center;">
      <a href="${SITE_URL}/fleet" style="display:inline-block;background:#D4A96A;color:#000;font-weight:700;padding:12px 28px;border-radius:10px;text-decoration:none;font-size:14px;">
        Voir notre flotte
      </a>
    </div>
  `);

  await sendEmail(clientEmail, `[Eson Maroc] Annulation confirmée — #${reservationId.slice(-8).toUpperCase()}`, html);
}
