"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { navigation } from "@/data/navigation";

export function Wordmark() {
  return (
    <span className="wordmark">
      <span className="brand-symbol" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      ODDESTACK<span className="brand-period">™</span>
    </span>
  );
}
export function Header() {
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const close = () => {
    dialog.current?.close();
    document.body.style.overflow = "";
    trigger.current?.focus();
  };
  return (
    <header className="site-header">
      <div className="header-inner container">
        <Link href="/" aria-label="ODDESTACK home">
          <Wordmark />
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname.startsWith(item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link className="header-cta" href="/contact">
          Build your stack <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
        <button
          className="icon-button menu-trigger"
          ref={trigger}
          aria-label="Open navigation"
          onClick={() => {
            dialog.current?.showModal();
            document.body.style.overflow = "hidden";
          }}
        >
          <Menu />
        </button>
        <dialog
          ref={dialog}
          className="mobile-dialog"
          aria-label="Navigation"
          onCancel={close}
          onClose={() => {
            document.body.style.overflow = "";
          }}
        >
          <div className="mobile-menu-top">
            <Wordmark />
            <button
              className="icon-button"
              onClick={close}
              aria-label="Close navigation"
            >
              <X />
            </button>
          </div>
          <nav aria-label="Mobile navigation">
            {[
              { label: "Home", href: "/" },
              ...navigation,
              { label: "Contact", href: "/contact" },
            ].map((item, i) => (
              <Link key={item.href} href={item.href} onClick={close}>
                <span>0{i + 1}</span>
                {item.label}
                <ArrowUpRight />
              </Link>
            ))}
          </nav>
          <p>Technology × Growth × Intelligence</p>
        </dialog>
      </div>
    </header>
  );
}
