"use client";
import React from "react";
import Navbar from "@/component/Navbar";
import Hero from "@/component/Hero";
import Features from "@/component/Features";
import HowItWorks from "@/component/HowItWorks";
import CTA from "@/component/CTA";
import Footer from "@/component/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-white">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
