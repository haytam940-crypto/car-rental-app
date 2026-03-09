/**
 * Génère et vérifie des tokens sécurisés pour les liens portail client.
 * Utilise HMAC-SHA256 (Web Crypto API — compatible Edge + Node.js).
 */

function getSecret(): string {
  return process.env.AUTH_SECRET ?? "fallback-secret";
}

async function getKey(): Promise<CryptoKey> {
  const raw = new TextEncoder().encode(getSecret());
  return crypto.subtle.importKey("raw", raw, { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

/** Crée un token = `reservationId.signature` */
export async function createPortalToken(reservationId: string): Promise<string> {
  const key = await getKey();
  const sigBuf = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(reservationId));
  const sigHex = [...new Uint8Array(sigBuf)].map(b => b.toString(16).padStart(2, "0")).join("");
  return `${reservationId}.${sigHex}`;
}

/** Vérifie le token et retourne le reservationId si valide, sinon null */
export async function verifyPortalToken(token: string): Promise<string | null> {
  try {
    const dot = token.lastIndexOf(".");
    if (dot === -1) return null;
    const reservationId = token.slice(0, dot);
    const sigHex = token.slice(dot + 1);
    const key = await getKey();
    const sigBuf = new Uint8Array(sigHex.match(/../g)!.map(h => parseInt(h, 16)));
    const valid = await crypto.subtle.verify("HMAC", key, sigBuf, new TextEncoder().encode(reservationId));
    return valid ? reservationId : null;
  } catch {
    return null;
  }
}
