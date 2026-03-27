"use client";

import React, { useState, useEffect } from "react";
import {
  Globe,
  Mic,
  Video,
  Zap,
  Play,
  ChevronRight,
  CheckCircle2,
  Star,
  Volume2,
  Wand2,
  ArrowRight,
  Menu,
  X,
  AudioLines,
} from "lucide-react";

import Link from "next/link"
import { useRouter } from "next/navigation";
import useHandleSignUp from "@/component/useHandleSignUp";
import useHandleSignIn from "@/component/useHandleSignIn"

// --- Sub-components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleSignUpClick = useHandleSignUp();
  const handleSignInClick = useHandleSignIn()
  const router = useRouter()

  return (
    <nav className="fixed w-full z-50 top-0 transition-all duration-300 backdrop-blur-md bg-slate-950/80 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFFF00] to-[#FF46A2] flex items-center justify-center shadow-[0_0_15px_rgba(255,70,162,0.4)] group-hover:shadow-[0_0_25px_rgba(255,255,0,0.6)] transition-all duration-300">
              <AudioLines className="text-slate-950 w-6 h-6" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              VoxShift<span className="text-[#FF46A2]">.ai</span>
            </span>
          </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
            >
              Features
            </a>
            <a
              href="#demo"
              className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
            >
              How it Works
            </a>
            <a
              href="#pricing"
              className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
            >
              Pricing
            </a>
            <button onClick={handleSignInClick} className="text-slate-300 hover:text-white font-medium text-sm transition-colors">
              Log In
            </button>
            <button
              onClick={handleSignUpClick}
              className="bg-white text-slate-950 px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-slate-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)]"
            >
              Start Free Trial
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-300 hover:text-white"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 border-b border-white/10 px-4 pt-2 pb-6 space-y-4">
          <a
            href="#features"
            className="block text-slate-300 hover:text-white font-medium"
          >
            Features
          </a>
          <a
            href="#demo"
            className="block text-slate-300 hover:text-white font-medium"
          >
            How it Works
          </a>
          <a
            href="#pricing"
            className="block text-slate-300 hover:text-white font-medium"
          >
            Pricing
          </a>
          <div className="pt-4 flex flex-col gap-3">
            <button className="w-full text-center text-slate-300 hover:text-white font-medium py-2">
              Log In
            </button>
            <button onClick={handleSignUpClick} className="w-full bg-white text-slate-950 px-5 py-3 rounded-xl font-semibold hover:bg-slate-200 transition-colors">
              Start Free Trial
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

const Hero = () => {
  const router = useRouter()
  const handleSignUpClick = useHandleSignUp()
  return (
    <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background glowing effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF46A2]/30 rounded-full blur-[128px] -z-10 mix-blend-screen"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00F0FF]/20 rounded-full blur-[128px] -z-10 mix-blend-screen"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-[#00F0FF] font-medium mb-8 backdrop-blur-sm">
            <Wand2 className="w-4 h-4" />
            <span>VoxShift v2.0 is live: Now with 100+ languages</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
            Make your videos <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#FF46A2] to-[#FFFF00]">
              speak every language.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Upload your video and let our AI translate, voice-dub, and perfectly
            lip-sync your content into over 50 languages. Keep your original
            voice and emotion.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={handleSignUpClick} className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#FF46A2] to-[#EE4B2B] hover:opacity-90 text-white rounded-full font-semibold text-lg transition-all shadow-[0_0_30px_rgba(255,70,162,0.4)] hover:shadow-[0_0_40px_rgba(255,70,162,0.6)] flex items-center justify-center gap-2">
              Translate a Video Free
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full font-semibold text-lg transition-all flex items-center justify-center gap-2 backdrop-blur-sm">
              <Play className="w-5 h-5 fill-current" />
              Watch Demo
            </button>
          </div>

          <p className="mt-6 text-sm text-slate-500">
            No credit card required • Free 5-minute translation • Cancel anytime
          </p>
        </div>

        {/* Hero Video Mockup */}
        <div className="mt-20 relative mx-auto max-w-5xl">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#00F0FF] via-[#FF46A2] to-[#FFFF00] rounded-2xl blur opacity-30 animate-pulse"></div>
          <div className="relative rounded-2xl bg-slate-900 border border-white/10 p-2 shadow-2xl">
            <div className="rounded-xl overflow-hidden relative aspect-video bg-slate-800 flex items-center justify-center group cursor-pointer">
              {/* Fake Video Thumbnail */}
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
                alt="Video Thumbnail"
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500"
              />

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform duration-300">
                  <Play className="w-8 h-8 text-white fill-current ml-1" />
                </div>
              </div>

              {/* Subtitle Mock */}
              <div className="absolute bottom-8 left-0 right-0 flex justify-center z-20">
                <div className="bg-black/60 backdrop-blur-sm px-6 py-3 rounded-lg border border-white/10">
                  <p className="text-white text-lg md:text-2xl font-medium text-center">
                    "こんにちは、私のチャンネルへようこそ！" <br />
                    <span className="text-sm text-slate-300 block mt-1">
                      (Hello, and welcome to my channel!)
                    </span>
                  </p>
                </div>
              </div>

              {/* Language Floating Badges */}
              <div className="absolute top-6 left-6 flex flex-col gap-3 z-20">
                <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                  <span className="text-lg">🇺🇸</span>
                  <span className="text-white text-sm font-medium">
                    Original: English
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-[#FF46A2]/80 backdrop-blur-md px-4 py-2 rounded-full border border-[#FF46A2]/50 shadow-[0_0_15px_rgba(255,70,162,0.5)]">
                  <span className="text-lg">🇯🇵</span>
                  <span className="text-white text-sm font-medium">
                    Translating: Japanese
                  </span>
                  <div className="flex gap-1 ml-2">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
                    <div
                      className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Logos = () => {
  return (
    <div className="py-10 border-y border-white/5 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium text-slate-400 mb-6 uppercase tracking-wider">
          Trusted by innovative creators & teams at
        </p>
        <div className="flex flex-wrap justify-center gap-10 md:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          {[
            "Acme Corp",
            "GlobalTech",
            "Nexus Media",
            "Stark Ind.",
            "Wayne Ent.",
          ].map((logo, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-xl font-bold text-white"
            >
              <div className="w-8 h-8 rounded bg-white/20 flex items-center justify-center">
                <Star className="w-4 h-4" />
              </div>
              {logo}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Features = () => {
  const features = [
    {
      icon: <Mic className="w-6 h-6 text-[#00F0FF]" />,
      title: "Voice Cloning",
      description:
        "We preserve your unique vocal tone, pitch, and emotion. The translated audio sounds exactly like you, just in a different language.",
    },
    {
      icon: <Video className="w-6 h-6 text-[#FF46A2]" />,
      title: "Flawless Lip-Sync",
      description:
        "Our AI modifies the video frames so your mouth movements match the new translated audio perfectly. No jarring dubbing effects.",
    },
    {
      icon: <Globe className="w-6 h-6 text-[#FFFF00]" />,
      title: "100+ Languages",
      description:
        "Reach a truly global audience. Translate your content into Spanish, Hindi, Mandarin, Arabic, French, and dozens more instantly.",
    },
    {
      icon: <Zap className="w-6 h-6 text-[#EE4B2B]" />,
      title: "Lightning Fast",
      description:
        "Get your translated video back in minutes, not days. Traditional dubbing takes weeks; VoxShift happens over your coffee break.",
    },
    {
      icon: <Volume2 className="w-6 h-6 text-[#00F0FF]" />,
      title: "Background Audio Preservation",
      description:
        "Music, sound effects, and background noise are intelligently isolated and preserved while only the speech is translated.",
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-[#FF46A2]" />,
      title: "Auto-Subtitles (SRT/VTT)",
      description:
        "Automatically generate and download highly accurate subtitles in the translated language for maximum accessibility.",
    },
  ];

  return (
    <div id="features" className="py-24 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Everything you need to{" "}
            <span className="text-[#00F0FF]">go global.</span>
          </h2>
          <p className="text-slate-400 text-lg">
            Traditional dubbing is expensive, slow, and unnatural. VoxShift uses
            cutting-edge generative AI to solve all three problems at once.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-slate-900/50 border border-white/5 p-8 rounded-2xl hover:bg-slate-800/50 transition-colors group"
            >
              <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const InteractiveDemo = () => {
  const [activeLang, setActiveLang] = useState("es");

  const languages = [
    {
      id: "es",
      name: "Spanish",
      flag: "🇪🇸",
      text: '"¡Hola a todos, bienvenidos a mi nuevo video!"',
    },
    {
      id: "fr",
      name: "French",
      flag: "🇫🇷",
      text: '"Bonjour à tous, bienvenue dans ma nouvelle vidéo !"',
    },
    {
      id: "hi",
      name: "Hindi",
      flag: "🇮🇳",
      text: '"नमस्ते सभी को, मेरे नए वीडियो में आपका स्वागत है!"',
    },
    {
      id: "de",
      name: "German",
      flag: "🇩🇪",
      text: '"Hallo zusammen, willkommen zu meinem neuen Video!"',
    },
  ];

  return (
    <div id="demo" className="py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00F0FF]/10 rounded-full blur-[100px] -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Experience the{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF46A2] to-[#FFFF00]">
                magic
              </span>{" "}
              yourself.
            </h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              Select a language below to see how our AI instantly adapts the
              video. The lip movements change to match the new language
              perfectly.
            </p>

            <div className="space-y-4">
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => setActiveLang(lang.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                    activeLang === lang.id
                      ? "bg-[#00F0FF]/10 border-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                      : "bg-slate-900 border-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{lang.flag}</span>
                    <span
                      className={`font-semibold ${activeLang === lang.id ? "text-[#00F0FF]" : "text-slate-300"}`}
                    >
                      {lang.name}
                    </span>
                  </div>
                  {activeLang === lang.id && (
                    <div className="flex items-center gap-2">
                      <span className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F0FF] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00F0FF]"></span>
                      </span>
                      <span className="text-[#00F0FF] text-sm font-medium">
                        Active
                      </span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="relative rounded-2xl border border-white/10 bg-slate-900 p-2 shadow-2xl">
            <div className="aspect-[9/16] md:aspect-square lg:aspect-[4/5] rounded-xl overflow-hidden relative bg-slate-800">
              <img
                src="https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Creator talking"
                className="absolute inset-0 w-full h-full object-cover opacity-80"
              />

              {/* Visualizer overlay */}
              <div className="absolute top-4 right-4 flex gap-1 items-end h-8">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 bg-[#FF46A2] rounded-full animate-pulse"
                    style={{
                      height: activeLang ? `${Math.random() * 100}%` : "20%",
                      animationDelay: `${i * 0.1}s`,
                      animationDuration: "0.5s",
                    }}
                  ></div>
                ))}
              </div>

              <div className="absolute bottom-8 left-0 right-0 px-6">
                <div className="bg-slate-950/80 backdrop-blur-md p-4 rounded-xl border border-white/10 text-center transform transition-all duration-300">
                  <p className="text-white font-medium text-lg md:text-xl transition-all duration-300 key={activeLang}">
                    {languages.find((l) => l.id === activeLang)?.text}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Pricing = () => {
  return (
    <div id="pricing" className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Simple, transparent pricing
          </h2>
          <p className="text-slate-400 text-lg">
            Start for free, upgrade when you need more minutes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Starter Tier */}
          <div className="bg-slate-900 rounded-3xl p-8 border border-white/5 hover:border-white/10 transition-colors">
            <h3 className="text-xl font-semibold text-white mb-2">Creator</h3>
            <p className="text-slate-400 text-sm mb-6">
              Perfect for testing the waters.
            </p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">$29</span>
              <span className="text-slate-500">/mo</span>
            </div>
            <ul className="space-y-4 mb-8">
              {[
                "30 minutes of translation",
                "15 languages included",
                "Standard voice cloning",
                "720p export quality",
              ].map((feature, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-slate-300 text-sm"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#00F0FF] shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors">
              Get Started
            </button>
          </div>

          {/* Pro Tier */}
          <div className="bg-gradient-to-b from-[#00F0FF]/10 to-slate-900 rounded-3xl p-8 border border-[#00F0FF]/50 relative transform md:-translate-y-4 shadow-2xl shadow-[#00F0FF]/10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-[#00F0FF] to-[#FF46A2] text-slate-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              Most Popular
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Pro</h3>
            <p className="text-slate-300 text-sm mb-6">
              For serious content creators.
            </p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">$99</span>
              <span className="text-slate-400">/mo</span>
            </div>
            <ul className="space-y-4 mb-8">
              {[
                "120 minutes of translation",
                "All 100+ languages",
                "Premium emotional voice cloning",
                "Flawless lip-syncing",
                "4K export quality",
                "Priority processing",
              ].map((feature, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-slate-100 text-sm"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#FF46A2] shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button className="w-full py-3 px-4 bg-gradient-to-r from-[#FF46A2] to-[#EE4B2B] hover:opacity-90 text-white rounded-xl font-semibold transition-all shadow-[0_0_20px_rgba(255,70,162,0.3)]">
              Start Free Trial
            </button>
          </div>

          {/* Enterprise Tier */}
          <div className="bg-slate-900 rounded-3xl p-8 border border-white/5 hover:border-white/10 transition-colors">
            <h3 className="text-xl font-semibold text-white mb-2">
              Enterprise
            </h3>
            <p className="text-slate-400 text-sm mb-6">
              For teams and media agencies.
            </p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">Custom</span>
            </div>
            <ul className="space-y-4 mb-8">
              {[
                "Unlimited minutes",
                "Custom API access",
                "Dedicated account manager",
                "Custom voice modeling",
                "SSO & advanced security",
                "Multi-user collaboration",
              ].map((feature, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-slate-300 text-sm"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#00F0FF] shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors">
              Get Started
            </button>
          </div>

          {/* Pro Tier */}
          <div className="bg-gradient-to-b from-indigo-900/50 to-slate-900 rounded-3xl p-8 border border-indigo-500/50 relative transform md:-translate-y-4 shadow-2xl shadow-indigo-900/20">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              Most Popular
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Pro</h3>
            <p className="text-indigo-200 text-sm mb-6">
              For serious content creators.
            </p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">$99</span>
              <span className="text-indigo-300">/mo</span>
            </div>
            <ul className="space-y-4 mb-8">
              {[
                "120 minutes of translation",
                "All 100+ languages",
                "Premium emotional voice cloning",
                "Flawless lip-syncing",
                "4K export quality",
                "Priority processing",
              ].map((feature, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-slate-100 text-sm"
                >
                  <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-semibold transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)]">
              Start Free Trial
            </button>
          </div>

          {/* Enterprise Tier */}
          <div className="bg-slate-900 rounded-3xl p-8 border border-white/5 hover:border-white/10 transition-colors">
            <h3 className="text-xl font-semibold text-white mb-2">
              Enterprise
            </h3>
            <p className="text-slate-400 text-sm mb-6">
              For teams and media agencies.
            </p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">Custom</span>
            </div>
            <ul className="space-y-4 mb-8">
              {[
                "Unlimited minutes",
                "Custom API access",
                "Dedicated account manager",
                "Custom voice modeling",
                "SSO & advanced security",
                "Multi-user collaboration",
              ].map((feature, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-slate-300 text-sm"
                >
                  <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CTA = () => {
    const handleSignUpClick = useHandleSignUp()
  return (
    <div className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[#EE4B2B]"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-[#EE4B2B] via-[#FF46A2] to-slate-900"></div>

      {/* Abstract geometric shapes */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#FFFF00]/10 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#00F0FF]/20 blur-3xl"></div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to reach the world?
        </h2>
        <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
          Join 10,000+ creators and brands who are expanding their audience
          globally with VoxShift.
        </p>
        <button onClick={handleSignUpClick} className="px-8 py-4 bg-[#FFFF00] text-slate-900 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-2xl inline-flex items-center gap-2">
          Translate Your First Video Free
          <ChevronRight className="w-5 h-5" />
        </button>
        <p className="mt-6 text-white/60 text-sm">
          No credit card required. 5 free minutes included.
        </p>
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4 group cursor-pointer w-fit">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFFF00] to-[#FF46A2] flex items-center justify-center shadow-[0_0_10px_rgba(255,70,162,0.4)] group-hover:shadow-[0_0_15px_rgba(255,255,0,0.6)] transition-all duration-300">
                <AudioLines className="text-slate-950 w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white">
                VoxShift<span className="text-[#FF46A2]">.ai</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-xs mb-6">
              The world's most advanced AI video translation, voice dubbing, and
              lip-sync platform. Break language barriers instantly.
            </p>
            <div className="flex gap-4">
              {/* Social placeholders */}
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#FF46A2] transition-colors cursor-pointer">
                <span className="text-xs">𝕏</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#FF46A2] transition-colors cursor-pointer">
                <span className="text-xs">in</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#FF46A2] transition-colors cursor-pointer">
                <span className="text-xs">YT</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a href="#" className="hover:text-[#00F0FF] transition-colors">
                  Video Translation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#00F0FF] transition-colors">
                  Voice Cloning
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#00F0FF] transition-colors">
                  Lip-Sync API
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#00F0FF] transition-colors">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a href="#" className="hover:text-[#00F0FF] transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#00F0FF] transition-colors">
                  API Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#00F0FF] transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#00F0FF] transition-colors">
                  Case Studies
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a href="#" className="hover:text-[#00F0FF] transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#00F0FF] transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#00F0FF] transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#00F0FF] transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 text-center flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} VoxShift AI Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Globe className="w-4 h-4" />
            <span>English (US)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30">
      <Navbar />
      <main>
        <Hero />
        <Logos />
        <Features />
        <InteractiveDemo />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
