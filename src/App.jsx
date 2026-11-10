import React from "react";
import Nav from "./components/Nav.jsx";
import Cursor from "./components/Cursor.jsx";
import ScrollProgress from "./components/ScrollProgress.jsx";
import Marquee from "./components/Marquee.jsx";
import Footer from "./components/Footer.jsx";
import { BugHuntProvider, BugTracker } from "./components/BugHunt.jsx";
import Hero from "./components/sections/Hero.jsx";
import About from "./components/sections/About.jsx";
import Engineer from "./components/sections/Engineer.jsx";
import Oovra from "./components/sections/Oovra.jsx";
import Viewfinder from "./components/sections/Viewfinder.jsx";
import Services from "./components/sections/Services.jsx";
import Contact from "./components/sections/Contact.jsx";

export default function App() {
  return (
    <BugHuntProvider>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Cursor />
      <ScrollProgress />
      <Nav />
      <main id="main">
        <Hero />
        <Marquee
          items={[
            "Playwright",
            "TypeScript",
            "GitHub Actions",
            "TestRail",
            "Oovra Studio",
            "AI Integration",
            "Photography",
            "On Location",
          ]}
        />
        <About />
        <Engineer />
        <Oovra />
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
            "Idaho + Travel",
          ]}
        />
        <Viewfinder />
        <Services />
        <Contact />
      </main>
      <Footer />
      <BugTracker />
    </BugHuntProvider>
  );
}
