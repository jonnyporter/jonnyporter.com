import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import "./Nav.css";

const links = [
  { href: "#about", label: "About" },
  { href: "#engineer", label: "Engineer" },
  { href: "#photography", label: "Photography" },
  { href: "#services", label: "Services" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header className={`nav ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-inner">
          <a href="#top" className="nav-logo" data-cursor data-cursor-text="Top">
            <Logo />
          </a>
          <nav className="nav-links">
            {links.map((l) => (
              <a key={l.href} href={l.href} data-cursor>
                <span>{l.label}</span>
              </a>
            ))}
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
            aria-label="Menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="nav-mobile"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="nav-mobile-inner">
              {links.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Logo() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
      <circle cx="20" cy="20" r="11" stroke="url(#g)" strokeWidth="1.5" />
      <circle cx="20" cy="20" r="3" fill="url(#g)" />
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="40" y2="40">
          <stop offset="0%" stopColor="#ff6b35" />
          <stop offset="50%" stopColor="#ffd166" />
          <stop offset="100%" stopColor="#5fc9f8" />
        </linearGradient>
      </defs>
    </svg>
  );
}
