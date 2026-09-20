import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/config/site";
import { navigation } from "@/data/navigation";
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <p>
            Good things happen
            <br />
            when different minds connect.
          </p>
          <Link href="/contact">
            Build your stack <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>
        <div className="footer-links">
          <p>Technology × Growth × Intelligence</p>
          <nav aria-label="Footer navigation">
            {[
              ...navigation,
              { label: "About", href: "/about" },
              { label: "Contact", href: "/contact" },
            ].map((n) => (
              <Link key={n.href} href={n.href}>
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="footer-word" aria-hidden="true">
          ODDESTACK<span>™</span>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} ODDESTACK</span>
          <span>A different kind of together.</span>
          <div>
            {site.socials.map((s) => (
              <a key={s.label} href={s.href}>
                {s.label}
              </a>
            ))}
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
