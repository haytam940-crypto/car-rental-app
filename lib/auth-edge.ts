/**
 * Authentification HMAC-SHA256 — compatible Edge Runtime (middleware) et Node.js
 * Cookie httpOnly signé — impossible à forger sans la clé secrète AUTH_SECRET
 */

export const SESSION_COOKIE = "eson_session";
const TTL_MS = 8 * 60 * 60 * 1000; // 8 heures

function getSecret(): string {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET manquant dans les variables d'environnement");
  return s;
}

async function getKey(): Promise<CryptoKey> {
  const raw = new TextEncoder().encode(getSecret());
  return crypto.subtle.importKey("raw", raw, { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

/** Crée un token signé : `timestamp.signature_hex` */
export async function createSessionToken(): Promise<string> {
  const payload = String(Date.now());
  const key = await getKey();
  const sigBuf = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  const sigHex = [...new Uint8Array(sigBuf)].map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${payload}.${sigHex}`;
}

/** Vérifie la signature et l'expiration — retourne true si valide */
export async function verifySessionToken(token: string): Promise<boolean> {
  try {
    const dot = token.indexOf(".");
    if (dot === -1) return false;
    const payload = token.slice(0, dot);
    const sigHex = token.slice(dot + 1);

    const ts = parseInt(payload, 10);
    if (isNaN(ts) || Date.now() - ts > TTL_MS) return false;

    const key = await getKey();
    const sigBuf = new Uint8Array(sigHex.match(/../g)!.map((h) => parseInt(h, 16)));
    return crypto.subtle.verify("HMAC", key, sigBuf, new TextEncoder().encode(payload));
  } catch {
    return false;
  }
}
