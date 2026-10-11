"use client";
import { useEffect } from "react";
import { reportClickEmail } from "@/lib/alerts/gmail";
import { reportAlert } from "@/lib/alerts/report";
import { clickTarget } from "@/lib/alerts/targets";
import { touchVisitor } from "@/lib/alerts/visitor";

export function ClickAlerts() {
  useEffect(() => {
    touchVisitor();
    const staticSite = process.env.NEXT_PUBLIC_STATIC_SITE === "true";
    const onClick = (event: MouseEvent) => {
      if (event.button !== 0) return;
      const element = event.target;
      if (!(element instanceof Element)) return;
      const anchor = element.closest("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      const href = anchor.getAttribute("href");
      if (!href) return;
      const heading = anchor.querySelector("h1, h2, h3, h4");
      const label = heading?.textContent || anchor.textContent || "";
      const target = clickTarget(href, label);
      if (!target) return;
      const key = `oddestack-alert:${target.label}|${target.path}`;
      try {
        if (sessionStorage.getItem(key)) return;
        sessionStorage.setItem(key, "1");
      } catch {
        // Private browsing can block storage. This click can still be reported.
      }
      reportClickEmail(target);
      if (!staticSite)
        reportAlert({ kind: "click", label: target.label, path: target.path });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
