import React, { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import "./Cursor.css";

export default function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  const sx = useSpring(x, { damping: 30, stiffness: 400, mass: 0.4 });
  const sy = useSpring(y, { damping: 30, stiffness: 400, mass: 0.4 });

  const [hover, setHover] = useState(false);
  const [text, setText] = useState("");
  const ringRef = useRef(null);

  useEffect(() => {
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const enter = (e) => {
      const t = e.target.closest("[data-cursor]");
      if (!t) return;
      setHover(true);
      const label = t.getAttribute("data-cursor-text");
      if (label) setText(label);
    };
    const leave = (e) => {
      const t = e.target.closest?.("[data-cursor]");
      if (t) {
        setHover(false);
        setText("");
      }
    };
    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", enter);
    document.addEventListener("mouseout", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", enter);
      document.removeEventListener("mouseout", leave);
    };
  }, [x, y]);

  return (
    <>
      <motion.div
        ref={ringRef}
        className={`cursor-ring ${hover ? "hover" : ""}`}
        style={{ x: sx, y: sy }}
      >
        {text && <span>{text}</span>}
      </motion.div>
      <motion.div className="cursor-dot" style={{ x, y }} />
    </>
  );
}
