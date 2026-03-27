"use client";
import React, { useState } from "react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/10 shadow-[0_0_18px_rgba(255,70,162,0.2)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="shrink-0 flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 bg-linear-to-br from-[#FFFF00] to-[#FF46A2] rounded-lg flex items-center justify-center text-slate-950 font-bold shadow-[0_0_15px_rgba(255,70,162,0.45)] group-hover:shadow-[0_0_25px_rgba(255,255,0,0.55)] transition-shadow">
              V
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              VideoTranslate
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <a
              href="#features"
              className="text-slate-300 hover:text-[#00F0FF] transition"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-slate-300 hover:text-[#00F0FF] transition"
            >
              How it Works
            </a>
            <a
              href="#pricing"
              className="text-slate-300 hover:text-[#00F0FF] transition"
            >
              Pricing
            </a>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <SignedOut>
              <SignInButton>
                <button className="bg-slate-700 hover:bg-slate-600 text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer mr-2 transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton>
                <button className="bg-linear-to-r from-[#FF46A2] to-[#EE4B2B] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer shadow-[0_0_18px_rgba(255,70,162,0.45)] hover:shadow-[0_0_28px_rgba(255,70,162,0.6)] transition-all">
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
              className="text-slate-300 hover:text-white focus:outline-none"
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
        <div className="md:hidden bg-slate-950 border-t border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="#features"
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:text-[#00F0FF] hover:bg-white/5"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:text-[#00F0FF] hover:bg-white/5"
            >
              How it Works
            </a>
            <button className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-[#FF46A2] hover:bg-white/5">
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
