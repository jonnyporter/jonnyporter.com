import React from "react";
import { Mail, MapPin } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./icons/SocialIcons.jsx";
import "./Footer.css";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="footer-mark">JP</div>
          <p className="footer-tagline">
            Tests, photos,
            <br />
            <span className="serif-italic">and a side studio.</span>
          </p>
          <p className="footer-loc">
            <MapPin size={14} /> Meridian, Idaho
          </p>
        </div>

        <div className="footer-col">
          <h5>Sitemap</h5>
          <a href="#about">About</a>
          <a href="#engineer">Engineering</a>
          <a href="#oovra">Oovra</a>
          <a href="#photography">Photography</a>
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
        </div>

        <div className="footer-col">
          <h5>Elsewhere</h5>
          <a
            href="https://www.linkedin.com/in/jonnyporter"
            target="_blank"
            rel="noreferrer"
          >
            <LinkedinIcon size={14} /> LinkedIn
          </a>
          <a
            href="https://github.com/jonnyporter"
            target="_blank"
            rel="noreferrer"
          >
            <GithubIcon size={14} /> GitHub
          </a>
          <a href="mailto:jonny@oovra.net">
            <Mail size={14} /> Email
          </a>
        </div>

        <div className="footer-col footer-cta">
          <h5>Currently</h5>
          <p>
            <span className="dot" /> QA Engineer at{" "}
            <strong>Bonterra</strong>.
          </p>
          <p>
            <span className="dot warm" /> Booking photography &amp; Oovra
            projects.
          </p>
        </div>
      </div>

      <div className="footer-bottom container">
        <span>
          © {year} Jonathan Porter. <em>All frames reserved.</em>
        </span>
        <span className="footer-built">
          Built in React + Three.js, somewhere in Idaho.
        </span>
      </div>
    </footer>
  );
}
