/**
 * Cryptographically secure client-side password verification fallback.
 * Uses Web Crypto API PBKDF2-HMAC-SHA256 with random salt.
 * Ensures NO plain text admin password is EVER hard-coded in client bundles.
 */

const STORAGE_KEY = 'hgs_auth_meta';

// Pre-computed PBKDF2 hash of initial master key with salt (never plaintext)
const DEFAULT_SALT = '7a9f8b2c4e1d3f5a8b0c2e4d6f8a0b2c';
// PBKDF2-HMAC-SHA256 (100,000 iterations)
const DEFAULT_HASH = '1f44059045b85a1a15f070b4c80388d75cf1a95576a92892976bcf643f8e580e';

function hexToBuf(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

function bufToHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function derivePbkdf2Hash(password: string, saltHex: string): Promise<string> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const saltBuf = hexToBuf(saltHex);
  const derivedBits = await window.crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBuf as unknown as BufferSource,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );

  return bufToHex(derivedBits);
}

function getStoredAuth(): { salt: string; hash: string } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.salt && parsed.hash) return parsed;
    }
  } catch {}
  return { salt: DEFAULT_SALT, hash: DEFAULT_HASH };
}

export async function verifyFallbackPassword(password: string): Promise<boolean> {
  try {
    const { salt, hash } = getStoredAuth();
    const computed = await derivePbkdf2Hash(password, salt);
    return computed === hash;
  } catch {
    return false;
  }
}

export async function updateFallbackPassword(
  currentPass: string,
  newPass: string
): Promise<{ success: boolean; message: string }> {
  try {
    const isCurrentValid = await verifyFallbackPassword(currentPass);
    if (!isCurrentValid) {
      return { success: false, message: 'Incorrect current password' };
    }

    if (!newPass || newPass.length < 4) {
      return { success: false, message: 'New password must be at least 4 characters long' };
    }

    // Generate new random salt
    const randomBytes = new Uint8Array(16);
    window.crypto.getRandomValues(randomBytes);
    const newSalt = Array.from(randomBytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    const newHash = await derivePbkdf2Hash(newPass, newSalt);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ salt: newSalt, hash: newHash }));

    return { success: true, message: 'Admin Password successfully updated!' };
  } catch (err) {
    return { success: false, message: 'Failed to update password' };
  }
}
