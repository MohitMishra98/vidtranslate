"use client";
import React, { useState } from "react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

// --- Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="shrink-0 flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
              V
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">
              VideoTranslate
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <a
              href="#features"
              className="text-slate-600 hover:text-indigo-600 transition"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-slate-600 hover:text-indigo-600 transition"
            >
              How it Works
            </a>
            <a
              href="#pricing"
              className="text-slate-600 hover:text-indigo-600 transition"
            >
              Pricing
            </a>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <SignedOut>
              <SignInButton>
                <button className="bg-[#b7b5be] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer mr-2">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton>
                <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-slate-900 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="#features"
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50"
            >
              How it Works
            </a>
            <button className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-indigo-600 hover:bg-indigo-50">
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <span className="inline-block py-1 px-3 rounded-full bg-indigo-100 text-indigo-600 text-sm font-semibold mb-6">
          Now supporting 50+ languages
        </span>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-8">
          Make your videos <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600">
            speak every language.
          </span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-500 mb-10">
          Automatically translate video content, caption accurately, and dub
          voices in minutes using advanced AI. Reach a global audience
          effortlessly.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="flex items-center justify-center px-8 py-4 text-lg font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 transition transform hover:-translate-y-1">
            Try for Free
          </button>
          <button className="flex items-center justify-center px-8 py-4 border border-slate-200 text-lg font-medium rounded-xl text-slate-700 bg-white hover:bg-slate-50 transition">
            <svg
              className="w-5 h-5 mr-2 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            View Demo
          </button>
        </div>

        {/* Hero Visual */}
        <div className="mt-16 relative mx-auto w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 bg-white overflow-hidden p-2">
          <div className="bg-slate-50 rounded-xl overflow-hidden aspect-video relative flex items-center justify-center border border-slate-100">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-indigo-600 ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="text-slate-400 font-medium">
                Upload a video to see the magic
              </p>
            </div>
            {/* UI Element Overlay */}
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur p-4 rounded-lg border border-slate-200 flex items-center gap-4 shadow-sm">
              <div className="h-2 bg-indigo-200 rounded w-1/3"></div>
              <div className="h-2 bg-slate-200 rounded w-1/4"></div>
              <div className="ml-auto text-xs font-bold text-indigo-600">
                Translating...
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Blobs */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full z-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon, title, description, colorClass }) => (
  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition">
    <div
      className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${colorClass}`}
    >
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-600">{description}</p>
  </div>
);

const Features = () => {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
            Features
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Everything you need to go global
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <FeatureCard
            colorClass="bg-indigo-100 text-indigo-600"
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                />
              </svg>
            }
            title="AI Voice Dubbing"
            description="Preserve the original speaker's tone and emotion while switching languages seamlessly."
          />
          <FeatureCard
            colorClass="bg-emerald-100 text-emerald-600"
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            }
            title="Auto-Subtitles"
            description="Generate perfectly synced subtitles in SRT or VTT formats with 99% accuracy."
          />
          <FeatureCard
            colorClass="bg-orange-100 text-orange-600"
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            }
            title="Lightning Fast"
            description="Process hours of video footage in minutes. Optimized for speed without quality loss."
          />
        </div>
      </div>
    </section>
  );
};

const Step = ({ number, title, description, colorClass }) => (
  <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center relative z-10">
    <div
      className={`w-12 h-12 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 ${colorClass}`}
    >
      {number}
    </div>
    <h3 className="font-bold text-lg mb-2">{title}</h3>
    <p className="text-slate-500 text-sm">{description}</p>
  </div>
);

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900">
            How it works
          </h2>
        </div>
        <div className="relative">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Step
              number="1"
              title="Upload Video"
              description="Drag and drop your video file or paste a YouTube link."
              colorClass="bg-slate-900"
            />
            <Step
              number="2"
              title="Select Language"
              description="Choose from over 50+ languages for audio and subtitles."
              colorClass="bg-indigo-600"
            />
            <Step
              number="3"
              title="Download"
              description="Get your translated video or subtitle files instantly."
              colorClass="bg-slate-900"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const CTA = () => {
  return (
    <section className="py-20 bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to expand your reach?
        </h2>
        <p className="text-indigo-200 text-lg mb-10">
          Join 10,000+ creators and businesses localizing their content today.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="px-8 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition">
            Get Started Now
          </button>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-slate-700 rounded flex items-center justify-center text-white text-xs font-bold">
            V
          </div>
          <span className="font-semibold text-white">VideoTranslate</span>
        </div>
        <div className="text-sm">
          &copy; {new Date().getFullYear()} VideoTranslate. All rights reserved.
        </div>
        <div className="flex gap-6 text-sm">
          <a href="#" className="hover:text-white transition">
            Privacy
          </a>
          <a href="#" className="hover:text-white transition">
            Terms
          </a>
          <a href="#" className="hover:text-white transition">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

// --- Main Landing Page Component ---

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
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
