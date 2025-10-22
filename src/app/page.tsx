import Navbar from "./components/navbarLadingPage";
import Hero from "./components/hero";
import Features from "./components/features";
import Stats from "./components/stats";

export default function LandingPage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Features />
      <Stats />
    </main>
  );
}
