import crypto from "crypto";

export function deriveKey(masterPassword: string, salt: string) {
  return crypto.pbkdf2Sync(
    masterPassword,
    salt,
    100_000,
    32,
    "sha256"
  );
}
