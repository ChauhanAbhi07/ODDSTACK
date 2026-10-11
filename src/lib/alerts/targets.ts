import { engagementNames } from "../inquiry-schema";
import { finderIndustries } from "../recommendations";

const LABEL = /^[\p{L}\p{N}][\p{L}\p{N}&/.'’\- ]{0,79}$/u;
const SERVICE_PATH = /^\/services(?:\/[a-z0-9-]{1,80})?$/;
const STACK = /^[a-z0-9-]{1,40}(?:,[a-z0-9-]{1,40}){0,9}$/;

export interface ClickTarget {
  label: string;
  path: string;
}

export function alertLabel(label: string): string | null {
  const cleaned = label.replace(/\s+/g, " ").trim();
  if (!LABEL.test(cleaned)) return null;
  return cleaned;
}

export function clickTarget(href: string, label: string): ClickTarget | null {
  const cleaned = alertLabel(label);
  const path = allowedPath(href);
  if (!cleaned || !path) return null;
  return { label: cleaned, path };
}

export function allowedPath(value: string): string | null {
  if (!value || value.length > 360 || /[\s\\]/.test(value)) return null;
  let url: URL;
  try {
    url = new URL(value, "https://alerts.oddestack.local");
  } catch {
    return null;
  }
  if (
    url.origin !== "https://alerts.oddestack.local" ||
    url.username ||
    url.password
  )
    return null;
  const pathname = url.pathname.replace(/\/+$/, "") || "/";
  if (pathname !== "/contact" && !SERVICE_PATH.test(pathname)) return null;
  if (pathname !== "/contact" && url.search) return null;
  if (!allowedContactQuery(url)) return null;
  return `${pathname}${url.search}`;
}

function allowedContactQuery(url: URL) {
  if (!url.search) return true;
  const allowed = new Set(["stack", "industry", "engagement"]);
  for (const key of url.searchParams.keys())
    if (!allowed.has(key)) return false;
  const stack = url.searchParams.get("stack");
  const industry = url.searchParams.get("industry");
  const engagement = url.searchParams.get("engagement");
  if (stack && !STACK.test(stack)) return false;
  if (
    industry &&
    !finderIndustries.includes(industry as (typeof finderIndustries)[number])
  )
    return false;
  if (
    engagement &&
    !engagementNames.includes(engagement as (typeof engagementNames)[number])
  )
    return false;
  return true;
}

export function alertMessage(event: ClickTarget | { kind: "enquiry" }): string {
  if ("kind" in event) return "ODDESTACK: New enquiry. Check your email.";
  return `ODDESTACK: ${event.label} — ${event.path}`;
}
