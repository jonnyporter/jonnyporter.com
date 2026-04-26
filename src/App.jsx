import React from "react";
import Nav from "./components/Nav.jsx";
import Cursor from "./components/Cursor.jsx";
import ScrollProgress from "./components/ScrollProgress.jsx";
import Hero from "./components/sections/Hero.jsx";
import About from "./components/sections/About.jsx";
import Engineer from "./components/sections/Engineer.jsx";
import Photography from "./components/sections/Photography.jsx";
import Services from "./components/sections/Services.jsx";
import Contact from "./components/sections/Contact.jsx";
import Footer from "./components/Footer.jsx";
import Marquee from "./components/Marquee.jsx";

export default function App() {
  return (
    <>
      <Cursor />
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <Marquee
          items={[
            "Playwright",
            "CI / CD",
            "Test Automation",
            "API Testing",
            "Photography",
            "Visual Storytelling",
            "Quality Engineering",
            "On Location",
          ]}
        />
        <About />
        <Engineer />
        <Marquee
          variant="reverse"
          items={[
            "Portraits",
            "Events",
            "Lifestyle",
            "Street",
            "Brand",
            "Editorial",
            "Now Booking",
            "Available 2026",
          ]}
        />
        <Photography />
        <Services />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
