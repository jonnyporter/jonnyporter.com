import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import "./Nav.css";

const links = [
  { href: "#about", label: "About" },
  { href: "#engineer", label: "Engineer" },
  { href: "#oovra", label: "Oovra" },
  { href: "#photography", label: "Photography" },
  { href: "#services", label: "Services" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight whichever section is crossing the middle of the viewport.
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const ids = ["top", ...links.map((l) => l.href.slice(1))];
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id === "top" ? "" : entry.target.id);
          }
        }
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header className={`nav ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-inner">
          <a
            href="#top"
            className="nav-logo"
            aria-label="Jonny Porter — back to top"
            data-cursor
            data-cursor-text="Top"
          >
            <Logo />
          </a>
          <nav className="nav-links" aria-label="Sections">
            {links.map((l) => {
              const isActive = active === l.href.slice(1);
              return (
                <a
                  key={l.href}
                  href={l.href}
                  className={isActive ? "active" : ""}
                  aria-current={isActive ? "true" : undefined}
                  data-cursor
                >
                  <span>{l.label}</span>
                </a>
              );
            })}
          </nav>
          <a
            href="#contact"
            className="nav-cta"
            data-cursor
            data-cursor-text="Say Hi"
          >
            Let's Talk
          </a>
          <button
            className="nav-toggle"
            onClick={() => setOpen((s) => !s)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <div
        id="mobile-menu"
        className={`nav-mobile ${open ? "open" : ""}`}
        inert={!open}
      >
        <nav className="nav-mobile-inner" aria-label="Sections">
          {links.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              style={{ "--i": i }}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}

function Logo() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
      <circle cx="20" cy="20" r="11" stroke="url(#nav-logo-g)" strokeWidth="1.5" />
      <circle cx="20" cy="20" r="3" fill="url(#nav-logo-g)" />
      <defs>
        <linearGradient id="nav-logo-g" x1="0" y1="0" x2="40" y2="40">
          <stop offset="0%" stopColor="#ff6b35" />
          <stop offset="50%" stopColor="#ffd166" />
          <stop offset="100%" stopColor="#5fc9f8" />
        </linearGradient>
      </defs>
    </svg>
  );
}
