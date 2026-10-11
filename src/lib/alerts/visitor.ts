const COOKIE = "oddestack_visitor";
const SESSION = "oddestack-visit";
const MAX_AGE = 60 * 60 * 24 * 180;
const ID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export interface VisitorRecord {
  id: string;
  firstSeen: string;
  visits: number;
}

export interface VisitorDetails {
  visitor: string;
  first_seen: string;
  visits: string;
  page: string;
  referrer: string;
  language: string;
  timezone: string;
  device: string;
  screen: string;
}

export function parseVisitorCookie(cookieHeader: string): VisitorRecord | null {
  const part = cookieHeader
    .split("; ")
    .find((item) => item.startsWith(`${COOKIE}=`));
  if (!part) return null;
  try {
    const raw = JSON.parse(decodeURIComponent(part.slice(COOKIE.length + 1)));
    if (!raw || typeof raw.id !== "string" || !ID.test(raw.id)) return null;
    if (typeof raw.firstSeen !== "string" || raw.firstSeen.length > 40)
      return null;
    if (!Number.isInteger(raw.visits) || raw.visits < 0 || raw.visits > 100000)
      return null;
    return { id: raw.id, firstSeen: raw.firstSeen, visits: raw.visits };
  } catch {
    return null;
  }
}

export function updateVisitor(
  current: VisitorRecord | null,
  now: string,
  counted: boolean,
): VisitorRecord {
  if (!current) return { id: crypto.randomUUID(), firstSeen: now, visits: 1 };
  if (counted) return current;
  return { ...current, visits: current.visits + 1 };
}

function clip(value: string) {
  return value.replace(/\s+/g, " ").trim().slice(0, 300) || "Unknown";
}

export function touchVisitor(): VisitorRecord {
  try {
    const current = parseVisitorCookie(document.cookie);
    const counted = current
      ? sessionStorage.getItem(SESSION) === current.id
      : false;
    const next = updateVisitor(current, new Date().toISOString(), counted);
    if (!counted) {
      sessionStorage.setItem(SESSION, next.id);
      const secure = location.protocol === "https:" ? "; Secure" : "";
      document.cookie = `${COOKIE}=${encodeURIComponent(JSON.stringify(next))}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax${secure}`;
    }
    return next;
  } catch {
    return {
      id: crypto.randomUUID(),
      firstSeen: new Date().toISOString(),
      visits: 1,
    };
  }
}

export function collectVisitorDetails(): VisitorDetails {
  const record = touchVisitor();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return {
    visitor: record.id,
    first_seen: record.firstSeen,
    visits: String(record.visits),
    page: clip(`${location.pathname}${location.search}`),
    referrer: clip(document.referrer || "Direct"),
    language: clip(navigator.language || "Unknown"),
    timezone: clip(timezone || "Unknown"),
    device: /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
      ? "Mobile"
      : "Desktop",
    screen: `${screen.width}x${screen.height}`,
  };
}
