type StoredPasskey = {
  factorId: string;
  friendlyName?: string;
  updatedAt: string;
};

const PASSKEY_STORAGE_KEY = "excelero.passkeyFactors";

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const readPasskeys = (): Record<string, StoredPasskey> => {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(PASSKEY_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const writePasskeys = (passkeys: Record<string, StoredPasskey>) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PASSKEY_STORAGE_KEY, JSON.stringify(passkeys));
};

export const getStoredPasskey = (email: string) => {
  return readPasskeys()[normalizeEmail(email)] ?? null;
};

export const saveStoredPasskey = (email: string, passkey: Omit<StoredPasskey, "updatedAt">) => {
  const passkeys = readPasskeys();
  passkeys[normalizeEmail(email)] = {
    ...passkey,
    updatedAt: new Date().toISOString(),
  };
  writePasskeys(passkeys);
};

export const removeStoredPasskey = (email: string) => {
  const passkeys = readPasskeys();
  delete passkeys[normalizeEmail(email)];
  writePasskeys(passkeys);
};
