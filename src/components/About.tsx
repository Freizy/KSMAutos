import React from "react";
import { ShieldCheck, Car, Globe, Sparkles } from "lucide-react";

const About = () => {
  return (
    <section className="glass p-8 rounded-sm border border-white/10">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center text-accent">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter">
              About Us
            </h1>
            <p className="text-sm text-muted uppercase tracking-widest font-bold mt-2">
              Driven by precision, luxury, and a passion for high-performance
              vehicles.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="glass p-6 rounded-sm border border-white/10">
            <div className="flex items-center gap-3 mb-4 text-accent">
              <Car className="w-5 h-5" />
              <h2 className="text-lg font-bold uppercase tracking-widest">
                Our Fleet
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-muted">
              KSM Autos curates an exclusive selection of performance vehicles
              for collectors, enthusiasts, and ambitious buyers.
            </p>
          </div>

          <div className="glass p-6 rounded-sm border border-white/10">
            <div className="flex items-center gap-3 mb-4 text-accent">
              <Globe className="w-5 h-5" />
              <h2 className="text-lg font-bold uppercase tracking-widest">
                Global Reach
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-muted">
              From local delivery to international logistics, our team handles
              every detail with white-glove service.
            </p>
          </div>

          <div className="glass p-6 rounded-sm border border-white/10">
            <div className="flex items-center gap-3 mb-4 text-accent">
              <Sparkles className="w-5 h-5" />
              <h2 className="text-lg font-bold uppercase tracking-widest">
                Premium Service
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-muted">
              Every client receives personalized guidance, tailored financing,
              and a seamless ownership transition.
            </p>
          </div>
        </div>

        <div className="glass p-6 rounded-sm border border-white/10">
          <h2 className="text-2xl font-black uppercase tracking-tighter">
            Why Choose KSM Autos?
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            We combine cutting-edge inventory discovery with trusted customer
            care. Our philosophy is simple: source exceptional vehicles, present
            them with clarity, and support buyers through every step of
            acquisition.
          </p>
          <ul className="mt-6 grid gap-4 text-sm">
            <li className="flex gap-3 items-start">
              <span className="mt-1 text-accent">•</span>
              <span className="leading-relaxed text-muted">
                Transparent pricing and curated vehicle insights.
              </span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="mt-1 text-accent">•</span>
              <span className="leading-relaxed text-muted">
                Dedicated support for authenticated buyers and collectors.
              </span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="mt-1 text-accent">•</span>
              <span className="leading-relaxed text-muted">
                Secure, reliable inventory backed by expert vetting.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default About;
