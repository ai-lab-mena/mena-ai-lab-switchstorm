export interface User {
  username: string;
  name: string;
  role: "admin" | "executive" | "marketing";
}

// Authorized users configuration
export const AUTHORIZED_USERS: Record<string, { password: string; user: User }> = {
  aeye: {
    password: "samsung@123",
    user: {
      username: "aeye",
      name: "AEYE Intelligence",
      role: "admin",
    },
  },
  samsung: {
    password: "samsung2026!",
    user: {
      username: "samsung",
      name: "Samsung MENA Executive",
      role: "executive",
    },
  },
};

export const AUTH_COOKIE_NAME = "samsung_auth_session";
const SECRET_KEY = "samsung_mena_marketing_ai_lab_secret_key_2026";

async function getCryptoKey() {
  const enc = new TextEncoder();
  return await crypto.subtle.importKey(
    "raw",
    enc.encode(SECRET_KEY),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

// Create a signed session token
export async function createSessionToken(user: User): Promise<string> {
  const payload = JSON.stringify({
    ...user,
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
  });
  const enc = new TextEncoder();
  const key = await getCryptoKey();
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(payload));

  const b64Payload = btoa(unescape(encodeURIComponent(payload)));
  const b64Sig = btoa(String.fromCharCode(...new Uint8Array(signature)));

  return `${b64Payload}.${b64Sig}`;
}

// Verify a session token
export async function verifySessionToken(token: string): Promise<User | null> {
  try {
    const [b64Payload, b64Sig] = token.split(".");
    if (!b64Payload || !b64Sig) return null;

    const payloadStr = decodeURIComponent(escape(atob(b64Payload)));
    const payload = JSON.parse(payloadStr);

    if (payload.exp && Date.now() > payload.exp) {
      return null; // Expired
    }

    const enc = new TextEncoder();
    const key = await getCryptoKey();
    const sigBytes = Uint8Array.from(atob(b64Sig), (c) => c.charCodeAt(0));

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes,
      enc.encode(payloadStr)
    );

    if (!isValid) return null;

    return {
      username: payload.username,
      name: payload.name,
      role: payload.role,
    };
  } catch {
    return null;
  }
}
