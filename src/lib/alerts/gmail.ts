import { site } from "@/config/site";
import { alertMessage, type ClickTarget } from "./targets";
import { collectVisitorDetails, type VisitorDetails } from "./visitor";

export function clickEmailBody(target: ClickTarget, visitor?: VisitorDetails) {
  const message = alertMessage(target);
  return {
    name: "Website click",
    email: site.email,
    message,
    button: target.label,
    button_page: target.path,
    subject: "ODDESTACK website click",
    _subject: "ODDESTACK website click",
    _gotcha: "",
    ...(visitor ?? {}),
  };
}

export function reportClickEmail(target: ClickTarget) {
  if (typeof fetch === "undefined") return;
  const visitor =
    typeof document === "undefined" ? undefined : collectVisitorDetails();
  void fetch(site.inquiryEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(clickEmailBody(target, visitor)),
    keepalive: true,
  }).catch(() => undefined);
}
