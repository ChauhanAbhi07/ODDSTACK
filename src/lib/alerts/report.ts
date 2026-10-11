function sessionId() {
  const key = "oddestack-alert-session";
  try {
    const existing = sessionStorage.getItem(key);
    if (
      existing &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        existing,
      )
    )
      return existing;
    const next = crypto.randomUUID();
    sessionStorage.setItem(key, next);
    return next;
  } catch {
    return undefined;
  }
}

export function reportAlert(
  event: { kind: "click"; label: string; path: string } | { kind: "enquiry" },
) {
  if (process.env.NEXT_PUBLIC_STATIC_SITE === "true") return;
  if (typeof navigator === "undefined") return;
  const session = sessionId();
  const payload = JSON.stringify(session ? { ...event, session } : event);
  const blob = new Blob([payload], { type: "application/json" });
  if (navigator.sendBeacon("/api/alerts", blob)) return;
  void fetch("/api/alerts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => undefined);
}
