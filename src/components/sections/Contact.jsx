import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, Camera, Code2, Check } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "../icons/SocialIcons.jsx";
import "./Contact.css";

const TOPICS = [
  { id: "qa", label: "QA / SDET role", icon: <Code2 size={14} /> },
  { id: "shoot", label: "Photography session", icon: <Camera size={14} /> },
  { id: "other", label: "Just say hi", icon: <Send size={14} /> },
];

export default function Contact() {
  const [topic, setTopic] = useState("qa");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const onChange = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      `[${TOPICS.find((t) => t.id === topic)?.label || "Inquiry"}] from ${form.name}`
    );
    const body = encodeURIComponent(
      `${form.message}\n\n— ${form.name}\n${form.email}`
    );
    window.location.href = `mailto:hello@jonnyporter.com?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <section id="contact" className="contact">
      <div className="container contact-grid">
        <motion.div
          className="contact-left"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="eyebrow">Contact</span>
          <h2 className="section-title">
            Let's make<br />
            <span className="serif-italic gradient-text">something</span>.
          </h2>
          <p className="contact-lede">
            Hiring for QA / SDET? Booking a shoot? Or you just spotted a
            bug on this very site (it happens)? Drop a line — I read every
            message.
          </p>

          <div className="contact-channels">
            <a
              href="mailto:hello@jonnyporter.com"
              className="channel"
              data-cursor
              data-cursor-text="Email"
            >
              <Mail size={18} />
              <div>
                <span>Email</span>
                <strong>hello@jonnyporter.com</strong>
              </div>
            </a>
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
              <strong>Available now</strong>
              <span>
                For QA / SDET roles · Booking photography for the season
              </span>
            </div>
          </div>
        </motion.div>

        <motion.form
          className="contact-form"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          onSubmit={onSubmit}
        >
          <div className="form-topic">
            <span className="form-label">I'm reaching out about</span>
            <div className="topic-row">
              {TOPICS.map((t) => (
                <button
                  type="button"
                  key={t.id}
                  data-cursor
                  className={`topic ${topic === t.id ? "active" : ""}`}
                  onClick={() => setTopic(t.id)}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
          </div>

          <label className="form-field">
            <span>Your name</span>
            <input
              type="text"
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
              required
              value={form.email}
              onChange={onChange("email")}
              placeholder="you@somewhere.com"
            />
          </label>

          <label className="form-field">
            <span>What's on your mind?</span>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={onChange("message")}
              placeholder={
                topic === "qa"
                  ? "Tell me about the role, stack, and team…"
                  : topic === "shoot"
                  ? "Date, location, vibe — anything you've got…"
                  : "Say hello…"
              }
            />
          </label>

          <button type="submit" className="form-submit" data-cursor>
            {sent ? (
              <>
                <Check size={18} /> Sent — check your mail client
              </>
            ) : (
              <>
                <Send size={18} /> Send the note
              </>
            )}
          </button>

          <p className="form-fineprint">
            Form opens your mail app, no tracking, no list — promise.
          </p>
        </motion.form>
      </div>
    </section>
  );
}
