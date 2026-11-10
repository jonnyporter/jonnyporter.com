import React from "react";
import { Boxes, Sparkles, Workflow, ArrowUpRight } from "lucide-react";
import Reveal from "../Reveal.jsx";
import { spotlight } from "../../lib/hooks.js";
import "./Oovra.css";

const WORK = [
  {
    icon: <Boxes size={18} />,
    title: "App builds",
    body:
      "From idea to a thing you can click. Web apps, internal tools, dashboards — built to actually be used, not demoed.",
  },
  {
    icon: <Sparkles size={18} />,
    title: "AI inside the work",
    body:
      "Real AI in your day-to-day, not a chatbot bolted on. Drafting, search, classification, summarization — wired into the tools your team already lives in.",
  },
  {
    icon: <Workflow size={18} />,
    title: "Automations & glue",
    body:
      "The boring stuff that eats your week: forms talking to spreadsheets, leads going to the right inbox, reports building themselves.",
  },
];

export default function Oovra() {
  return (
    <section id="oovra" className="oovra">
      <div className="container oovra-grid">
        <Reveal className="oovra-intro">
          <span className="eyebrow">Side studio</span>
          <h2 className="section-title">
            And on the side,{" "}
            <span className="serif-italic gradient-text-cool">Oovra</span>.
          </h2>
          <p className="section-lede">
            A small studio I run for app builds and AI work. If you've got a
            business problem that smells like software — or you're sitting on
            data that should be doing more for you — that's my lane.
          </p>
          <div className="oovra-actions">
            <a
              href="#contact"
              className="oovra-cta"
              data-cursor
              data-cursor-text="Talk"
            >
              Pitch a project <ArrowUpRight size={16} />
            </a>
            <a
              href="https://oovra.net/"
              target="_blank"
              rel="noreferrer"
              className="oovra-link"
              data-cursor
              data-cursor-text="Open"
            >
              oovra.net <ArrowUpRight size={14} />
            </a>
          </div>
        </Reveal>

        <div className="oovra-cards">
          {WORK.map((w, i) => (
            <Reveal
              key={w.title}
              className="oovra-card spot cool"
              delay={100 + i * 80}
              onPointerMove={spotlight}
            >
              <span className="oovra-card-num" aria-hidden="true">
                0{i + 1}
              </span>
              <span className="oovra-card-icon">{w.icon}</span>
              <h3>{w.title}</h3>
              <p>{w.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
