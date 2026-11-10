import React, { useEffect, useState } from "react";
import { Mail, Send, Camera, Code2, Check, Copy } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "../icons/SocialIcons.jsx";
import Reveal from "../Reveal.jsx";
import "./Contact.css";

const EMAIL = "jonny@oovra.net";

const TOPICS = [
  { id: "shoot", label: "Photography session", icon: <Camera size={14} /> },
  { id: "oovra", label: "Oovra: app or AI build", icon: <Code2 size={14} /> },
  { id: "other", label: "Just say hi", icon: <Send size={14} /> },
];

export default function Contact() {
  const [topic, setTopic] = useState("shoot");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const onChange = (k) => (e) => {
    setForm({ ...form, [k]: e.target.value });
    setSent(false);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      `[${TOPICS.find((t) => t.id === topic)?.label || "Inquiry"}] from ${form.name}`
    );
    const body = encodeURIComponent(
      `${form.message}\n\n— ${form.name}\n${form.email}`
    );
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
    } catch {
      /* clipboard blocked: the mailto link right beside it still works */
    }
  };

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(t);
  }, [copied]);

  return (
    <section id="contact" className="contact">
      <div className="container contact-grid">
        <Reveal className="contact-left">
          <span className="eyebrow">Contact</span>
          <h2 className="section-title">
            Say<br />
            <span className="serif-italic gradient-text">hello</span>.
          </h2>
          <p className="contact-lede">
            Booking a shoot? Want to talk about an Oovra project — apps,
            AI, automations? Or you spotted a bug on this very site (it
            happens). Drop a line.
          </p>

          <div className="contact-channels">
            <div className="channel-row">
              <a
                href={`mailto:${EMAIL}`}
                className="channel"
                data-cursor
                data-cursor-text="Email"
              >
                <Mail size={18} />
                <div>
                  <span>Email</span>
                  <strong>{EMAIL}</strong>
                </div>
              </a>
              <button
                type="button"
                className={`channel-copy ${copied ? "copied" : ""}`}
                onClick={copyEmail}
                aria-label={copied ? "Email address copied" : "Copy email address"}
                data-cursor
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
            <a
              href="https://www.linkedin.com/in/jonnyporter"
              target="_blank"
              rel="noreferrer"
              className="channel"
              data-cursor
              data-cursor-text="Open"
            >
              <LinkedinIcon size={18} />
              <div>
                <span>LinkedIn</span>
                <strong>/in/jonnyporter</strong>
              </div>
            </a>
            <a
              href="https://github.com/jonnyporter"
              target="_blank"
              rel="noreferrer"
              className="channel"
              data-cursor
              data-cursor-text="Open"
            >
              <GithubIcon size={18} />
              <div>
                <span>GitHub</span>
                <strong>/jonnyporter</strong>
              </div>
            </a>
          </div>

          <div className="contact-availability">
            <span className="dot" />
            <div>
              <strong>Open for work</strong>
              <span>
                Booking photography clients · Taking new Oovra projects
              </span>
            </div>
          </div>
        </Reveal>

        <Reveal as="form" className="contact-form" delay={100} onSubmit={onSubmit}>
          <fieldset className="form-topic">
            <legend className="form-label">I'm reaching out about</legend>
            <div className="topic-row">
              {TOPICS.map((t) => (
                <button
                  type="button"
                  key={t.id}
                  data-cursor
                  aria-pressed={topic === t.id}
                  className={`topic ${topic === t.id ? "active" : ""}`}
                  onClick={() => setTopic(t.id)}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="form-field">
            <span>Your name</span>
            <input
              type="text"
              name="name"
              autoComplete="name"
              required
              value={form.name}
              onChange={onChange("name")}
              placeholder="Jane Cooper"
            />
          </label>

          <label className="form-field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={onChange("email")}
              placeholder="you@somewhere.com"
            />
          </label>

          <label className="form-field">
            <span>What's on your mind?</span>
            <textarea
              name="message"
              required
              rows={5}
              value={form.message}
              onChange={onChange("message")}
              placeholder={
                topic === "shoot"
                  ? "Date, location, vibe — anything you've got…"
                  : topic === "oovra"
                  ? "What are you building, and what's getting in the way?"
                  : "Say hello…"
              }
            />
          </label>

          <button type="submit" className="form-submit" data-cursor>
            <Send size={18} /> Send the note
          </button>

          <p className="form-fineprint" role="status">
            {sent
              ? "Your mail app should have opened with the note ready to send."
              : "Form opens your mail app, no tracking, no list — promise."}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
