import React from "react";
import { motion } from "framer-motion";
import { Boxes, Sparkles, Workflow, ArrowUpRight } from "lucide-react";
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
        <motion.div
          className="oovra-intro"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
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
          <a
            href="#contact"
            className="oovra-cta"
            data-cursor
            data-cursor-text="Talk"
          >
            Pitch a project <ArrowUpRight size={16} />
          </a>
        </motion.div>

        <div className="oovra-cards">
          {WORK.map((w, i) => (
            <motion.div
              key={w.title}
              className="oovra-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
            >
              <span className="oovra-card-icon">{w.icon}</span>
              <h4>{w.title}</h4>
              <p>{w.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
