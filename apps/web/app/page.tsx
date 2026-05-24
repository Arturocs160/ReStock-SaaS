import { Hero } from "./components/hero";
import { Features } from "./components/features";
import { CTA } from "./components/cta";
import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <CTA />
      <Footer />
    </div>
  );
}
