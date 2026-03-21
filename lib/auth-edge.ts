/**
 * Authentification HMAC-SHA256 — compatible Edge Runtime (middleware) et Node.js
 * Cookie httpOnly signé — impossible à forger sans la clé secrète AUTH_SECRET
 * Format token : `timestamp:role.signature_hex`
 */

export const SESSION_COOKIE = "eson_session";
export const ROLE_COOKIE    = "eson_role"; // non-httpOnly, lisible côté client
const TTL_MS = 8 * 60 * 60 * 1000; // 8 heures

export type UserRole = "admin" | "agent" | "viewer";

function getSecret(): string {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET manquant dans les variables d'environnement");
  return s;
}

async function getKey(): Promise<CryptoKey> {
  const raw = new TextEncoder().encode(getSecret());
  return crypto.subtle.importKey("raw", raw, { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

/** Crée un token signé : `timestamp:role.signature_hex` */
export async function createSessionToken(role: UserRole): Promise<string> {
  const payload = `${Date.now()}:${role}`;
  const key = await getKey();
  const sigBuf = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  const sigHex = [...new Uint8Array(sigBuf)].map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${payload}.${sigHex}`;
}

/** Vérifie la signature et l'expiration — retourne le rôle si valide, null sinon */
export async function verifySessionToken(token: string): Promise<UserRole | null> {
  try {
    const dot = token.lastIndexOf(".");
    if (dot === -1) return null;
    const payload = token.slice(0, dot);
    const sigHex  = token.slice(dot + 1);

    const [tsStr, role] = payload.split(":");
    const ts = parseInt(tsStr, 10);
    if (isNaN(ts) || Date.now() - ts > TTL_MS) return null;
    if (role !== "admin" && role !== "agent" && role !== "viewer") return null;

    const key = await getKey();
    const sigBuf = new Uint8Array(sigHex.match(/../g)!.map((h) => parseInt(h, 16)));
    const valid = await crypto.subtle.verify("HMAC", key, sigBuf, new TextEncoder().encode(payload));
    return valid ? (role as UserRole) : null;
  } catch {
    return null;
  }
}
