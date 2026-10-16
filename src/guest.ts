export type PrefixKey = "mr" | "mrs" | "miss" | "mrmrs" | "family" | "dear";

/**
 * Turns a bare guest name into the display name, used as-is in both site languages.
 * "Dear" adds nothing, because the greeting itself already starts with "Dear".
 */
export const PREFIXES: Record<PrefixKey, { label: string; format: (name: string) => string }> = {
  mr: { label: "Mr.", format: (n) => `Mr. ${n}` },
  mrs: { label: "Mrs.", format: (n) => `Mrs. ${n}` },
  miss: { label: "Miss", format: (n) => `Miss ${n}` },
  mrmrs: { label: "Mr. & Mrs.", format: (n) => `Mr. & Mrs. ${n}` },
  family: { label: "Family", format: (n) => `${n} and Family` },
  dear: { label: "Dear", format: (n) => n },
};

/** Keys used by links generated before the prefix dropdown existed. */
const LEGACY_PREFIXES: Record<string, PrefixKey> = { obata: "dear", depala: "mrmrs", pavula: "family" };

export const COUPLE = {
  groom: { si: "හසුන්", en: "Hasun" },
  bride: { si: "ජනනි", en: "Janani" },
};
export const COUPLE_SIGNATURE = `${COUPLE.bride.en} & ${COUPLE.groom.en}`;

export function toPrefixKey(value: string | null): PrefixKey {
  if (value && value in PREFIXES) return value as PrefixKey;
  if (value && value in LEGACY_PREFIXES) return LEGACY_PREFIXES[value];
  return "dear";
}

export function displayName(name: string, prefix: PrefixKey) {
  return PREFIXES[prefix].format(name.trim());
}

export function buildGuestUrl(origin: string, name: string, prefix: PrefixKey) {
  return `${origin}/${encodeURIComponent(name.trim())}?p=${prefix}`;
}

export function buildInviteMessage(name: string, prefix: PrefixKey, url: string) {
  return `Dear ${displayName(name, prefix)} ❤️

With joyful hearts, we warmly invite you to celebrate one of the most special days of our lives as we begin our journey together.

Please view our wedding invitation and all the event details through the link below 🌐:

${url}

Your presence would truly mean the world to us, and we would be honored to celebrate this beautiful moment together.

With love,
❤️ ${COUPLE.groom.en} & ${COUPLE.bride.en}`;
}

/** Reads the guest from `/<Name>?p=<prefix>`, falling back to the legacy `?to=` link. */
export function readGuestFromLocation(location: Location) {
  const params = new URLSearchParams(location.search);
  let name = "";
  const segment = location.pathname.replace(/^\/+|\/+$/g, "");
  if (segment && !segment.includes("/")) {
    try {
      name = decodeURIComponent(segment).trim();
    } catch {
      name = segment;
    }
  }
  if (!name) name = params.get("to")?.trim() ?? "";
  if (!name) return null;

  return { name, prefix: toPrefixKey(params.get("p")) };
}
