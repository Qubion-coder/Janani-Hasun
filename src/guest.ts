export type SalutationKey = "obata" | "depala" | "pavula";

export const SALUTATIONS: Record<SalutationKey, { si: string; en: string; hint: string }> = {
  obata: { si: "ඔබට", en: "for you", hint: "One person" },
  depala: { si: "ඔබ දෙපළට", en: "for you both", hint: "A couple" },
  pavula: { si: "ඔබ ඇතුළු පවුලේ සැමට", en: "for you & your family", hint: "Whole family" },
};

export const COUPLE_SIGNATURE = "Janani & Hasun";

export function isSalutationKey(value: string | null): value is SalutationKey {
  return value !== null && value in SALUTATIONS;
}

export function buildGuestUrl(origin: string, name: string, salutation: SalutationKey) {
  return `${origin}/${encodeURIComponent(name.trim())}?p=${salutation}`;
}

export function buildInviteMessage(name: string, salutation: SalutationKey, url: string) {
  return `${name.trim()} ${SALUTATIONS[salutation].si} ❤️

අපගේ විවාහ මංගල උත්සවය සඳහා ඔබට අපගේ ආදරණීය ආරාධනයයි.

අපගේ විවාහ මංගල උත්සවයේ සියලුම විස්තර පහත සබැඳිය ඔස්සේ නැරඹිය හැකිය 🌐

${url}

ඔබගේ පැමිණීම අපට මහත් සතුටක් වනු ඇත.

ආදරයෙන්,
❤️ ${COUPLE_SIGNATURE}`;
}

/** Reads the guest from `/<Name>?p=<salutation>`, falling back to the legacy `?to=` link. */
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

  const p = params.get("p");
  return { name, salutation: isSalutationKey(p) ? p : ("obata" as SalutationKey) };
}
