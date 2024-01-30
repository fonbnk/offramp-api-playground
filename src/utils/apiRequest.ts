export const apiRequest = async <T>({
  isDev,
  path,
  method,
  body,
  clientId,
  secret,
}: {
  isDev: boolean;
  path: string;
  method: "GET" | "POST";
  secret: string;
  clientId: string;
  body?: any;
}) => {
  const endpint = isDev
    ? "https://sandbox-api.fonbnk.com"
    : "https://api.fonbnk.com";
  const timestamp = Date.now();
  const response = await fetch(`${endpint}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-signature": await generateSignature({
        timestamp: timestamp.toString(),
        path,
        secret,
      }),
      "x-timestamp": timestamp.toString(),
      "x-client-id": clientId,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    let error;
    try {
      const errorResponse = await response.json();
      error = new Error(errorResponse.message);
    } catch (e) {
      error = new Error(`Request failed with status ${response.status}`);
    }
    throw error;
  }
  return response.json() as Promise<T>;
};

async function generateSignature({
  timestamp,
  path,
  secret,
}: {
  timestamp: string;
  path: string;
  secret: string;
}) {
  const binaryString = window.atob(secret);
  const byteArray = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    byteArray[i] = binaryString.charCodeAt(i);
  }

  const key = await window.crypto.subtle.importKey(
    "raw",
    byteArray,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const stringToSign = `${timestamp}:${path}`;
  const signature = await window.crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(stringToSign),
  );

  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}
