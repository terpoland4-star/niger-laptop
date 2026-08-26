import "dotenv/config";

/**
 * Client API MyNita (NITA Transfert d'Argent) — Achat en ligne
 * Documentation : ACHAT_-_EN_LIGNE3.pdf
 */

const NITA_BASE_URL = process.env.NITA_BASE_URL ?? "";
const NITA_API_KEY = process.env.NITA_API_KEY ?? "";
const NITA_USERNAME = process.env.NITA_USERNAME ?? "";
const NITA_PASSWORD = process.env.NITA_PASSWORD ?? "";

if (!NITA_BASE_URL || !NITA_API_KEY || !NITA_USERNAME || !NITA_PASSWORD) {
  console.warn(
    "[nita] Variables d'environnement NITA_* manquantes — le client MyNita ne fonctionnera pas tant qu'elles ne sont pas renseignées dans .env"
  );
}

export class NitaApiError extends Error {
  code?: number;
  httpStatus?: number;
  raw?: unknown;

  constructor(message: string, opts?: { code?: number; httpStatus?: number; raw?: unknown }) {
    super(message);
    this.name = "NitaApiError";
    this.code = opts?.code;
    this.httpStatus = opts?.httpStatus;
    this.raw = opts?.raw;
  }
}

// ---------- Gestion du token JWT (cache mémoire) ----------
let cachedToken: string | null = null;
let cachedTokenExpiresAt = 0; // epoch ms

function decodeJwtExpiry(token: string): number | null {
  try {
    const payloadB64 = token.split(".")[1];
    const payloadJson = Buffer.from(payloadB64, "base64").toString("utf-8");
    const payload = JSON.parse(payloadJson);
    if (typeof payload.exp === "number") {
      return payload.exp * 1000; // exp est en secondes
    }
    return null;
  } catch {
    return null;
  }
}

async function authenticate(): Promise<string> {
  const res = await fetch(`${NITA_BASE_URL}/api/authenticate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-NT-API-KEY": NITA_API_KEY,
    },
    body: JSON.stringify({
      username: NITA_USERNAME,
      password: NITA_PASSWORD,
    }),
  });

  const json: any = await res.json().catch(() => null);

  if (!res.ok || json?.status !== "success") {
    throw new NitaApiError(json?.message ?? "Échec de l'authentification NITA", {
      code: json?.code,
      httpStatus: res.status,
      raw: json,
    });
  }

  const token = json.data?.token;
  if (!token) {
    throw new NitaApiError("Token absent de la réponse d'authentification NITA", { raw: json });
  }

  cachedToken = token;
  const exp = decodeJwtExpiry(token);
  // Marge de sécurité de 60s avant l'expiration réelle
  cachedTokenExpiresAt = exp ? exp - 60_000 : Date.now() + 10 * 60_000;

  return token;
}

async function getValidToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedTokenExpiresAt) {
    return cachedToken;
  }
  return authenticate();
}

// ---------- Requête générique authentifiée ----------
async function nitaRequest<T = any>(
  path: string,
  options: { method: "GET" | "POST" | "PUT"; body?: unknown },
  retry = true
): Promise<T> {
  const token = await getValidToken();

  const res = await fetch(`${NITA_BASE_URL}${path}`, {
    method: options.method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-NT-API-KEY": NITA_API_KEY,
      Authorization: `Bearer ${token}`,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const json: any = await res.json().catch(() => null);

  // Token expiré/invalide : on réauthentifie une seule fois puis on réessaie
  if ((res.status === 401 || res.status === 403) && retry) {
    cachedToken = null;
    return nitaRequest<T>(path, options, false);
  }

  if (!res.ok || json?.status?.toLowerCase?.() !== "success") {
    throw new NitaApiError(json?.message ?? `Erreur API NITA (${res.status})`, {
      code: json?.code,
      httpStatus: res.status,
      raw: json,
    });
  }

  return json as T;
}

// ---------- Types ----------
export interface CreateAchatParams {
  descriptionAchat: string[];
  montantTransaction: number;
  motifTransaction: string;
  requestId: string;
  phoneClient: string;
  adresseIp: string;
  longTransaction?: string;
  latTransaction?: string;
  urlCallback?: string;
}

export interface AchatStatusParams {
  requestId: string;
  adresseIp: string;
  longTransaction?: string;
  latTransaction?: string;
}

export interface AchatByCodeParams {
  codeAchat: string;
  requestId: string;
  adresseIp: string;
  longTransaction?: string;
  latTransaction?: string;
}

// ---------- Endpoints ----------

/** Créer un achat en ligne — retourne le codeAchat que le client utilisera pour payer */
export async function createAchat(params: CreateAchatParams) {
  return nitaRequest("/api/nitaServices/achatEnLigne/saveAchatEnLigne", {
    method: "POST",
    body: params,
  });
}

/** Vérifier le statut d'un achat en ligne */
export async function checkAchatStatus(params: AchatStatusParams) {
  return nitaRequest("/api/nitaServices/achatEnLigne/checkAchatStatus", {
    method: "POST",
    body: params,
  });
}

/** Annuler un achat par codeAchat */
export async function cancelAchat(params: AchatByCodeParams) {
  return nitaRequest("/api/nitaServices/achatEnLigne/annulerAchat", {
    method: "PUT",
    body: params,
  });
}

/** Payer un achat par codeAchat */
export async function payAchat(params: AchatByCodeParams) {
  return nitaRequest("/api/nitaServices/achatEnLigne/paiementAchat", {
    method: "PUT",
    body: params,
  });
}

/** Consulter le solde disponible du compte de stock */
export async function getBalance(): Promise<number> {
  const res = await nitaRequest<{ data: number }>("/api/nitaServices/account/balance", {
    method: "GET",
  });
  return res.data;
}
