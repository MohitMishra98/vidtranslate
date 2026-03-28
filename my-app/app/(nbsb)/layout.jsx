"use client";

import {
  Clapperboard,
  Play,
  Languages,
} from "lucide-react";

import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import ThemeButton from "@/component/ThemeButton";

function NavBarAndSideBar({ children }) {
  return (
    <>
      <div className="bg-slate-50 dark:bg-[#0f1117] text-slate-900 dark:text-slate-100 transition-colors duration-300">
        {/* Main container with full-height flex layout */}
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          {/* Main content area */}
          <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
            {/* Decorative background blur elements */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#FF46A2]/20 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#00F0FF]/15 blur-[100px] rounded-full pointer-events-none"></div>
            {/* nav */}
            <Navbar />
            {/* Main scrollable content area */}

            {/* this area */}
            {children}
            {/* this area */}
          </main>
        </div>
      </div>
    </>
  );
}

export default NavBarAndSideBar;

function Sidebar() {
  return (
    <>
      {/* Sidebar Navigation - Hidden on mobile, visible on md+ screens */}
      <aside className="w-64 shrink-0 border-r border-slate-200 dark:border-white/10 hidden md:flex flex-col bg-white/80 dark:bg-slate-950/80">
        {/* Logo section */}
        <Link href={"/"}>
          <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-[#FFFF00] to-[#FF46A2] rounded-xl flex items-center justify-center shadow-lg shadow-[#FF46A2]/30">
              <Clapperboard className="text-slate-950" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-[#00F0FF] via-[#FF46A2] to-[#FFFF00]">
              VidTranslate
            </span>
          </div>
        </Link>
        {/* Navigation menu with links to different sections */}
        <nav className="mt-4 px-4 space-y-2 flex-1">
          <Link
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            href="/videos"
          >
            <Play className="stroke-[var(--color-primary)] dark:stroke-[#00F0FF]" />
            Videos
          </Link>
          <Link
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            href="/jobs"
          >
            <Languages className="stroke-[var(--color-primary)] dark:stroke-[#00F0FF]" />
            More if want
          </Link>
        </nav>
      </aside>
    </>
  );
}

function Navbar() {
  const { user } = useUser();

  return (
    <>
      {/* Top header bar with search and user menu */}
      <header className="h-16 flex items-center justify-end px-8 glass-light dark:glass sticky top-0 z-10 border-b border-slate-200 dark:border-white/10">
        {/* Header right actions */}
        <div className="flex items-center gap-4">
          {/* Theme switch button */}
          <ThemeButton />

          {/* Divider */}
          <div className="h-8 w-px bg-slate-200 dark:bg-white/10 mx-1"></div>

          {/* User profile section */}
          <div className="flex items-center gap-3 pl-2">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold leading-none text-slate-900 dark:text-slate-100">
                {user?.fullName}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-none">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
            <UserButton />
          </div>
        </div>
      </header>
    </>
  );
}
