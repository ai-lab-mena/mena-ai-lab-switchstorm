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

function bufferToBase64Url(bytes: Uint8Array): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(bytes).toString("base64url");
  }
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToBuffer(str: string): Uint8Array {
  if (typeof Buffer !== "undefined") {
    return new Uint8Array(Buffer.from(str, "base64url"));
  }
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) base64 += "=";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// Create a signed session token
export async function createSessionToken(user: User): Promise<string> {
  const payloadStr = JSON.stringify({
    ...user,
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
  });
  const enc = new TextEncoder();
  const payloadBytes = enc.encode(payloadStr);
  const key = await getCryptoKey();
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    payloadBytes as unknown as BufferSource
  );

  const b64Payload = bufferToBase64Url(payloadBytes);
  const b64Sig = bufferToBase64Url(new Uint8Array(signature));

  return `${b64Payload}.${b64Sig}`;
}

// Verify a session token
export async function verifySessionToken(token: string): Promise<User | null> {
  try {
    const [b64Payload, b64Sig] = token.split(".");
    if (!b64Payload || !b64Sig) return null;

    const payloadBytes = base64UrlToBuffer(b64Payload);
    const dec = new TextDecoder();
    const payloadStr = dec.decode(payloadBytes);
    const payload = JSON.parse(payloadStr);

    if (payload.exp && Date.now() > payload.exp) {
      return null; // Expired
    }

    const key = await getCryptoKey();
    const sigBytes = base64UrlToBuffer(b64Sig);

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes as unknown as BufferSource,
      payloadBytes as unknown as BufferSource
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
