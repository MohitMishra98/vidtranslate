"use client";

import {
  Clapperboard,
  Play,
  Languages,
  Search,
  Sun,
  Bell,
  Trash,
} from "lucide-react";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";


function NavBarAndSideBar({children}) {
  return (
    <>
      <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 transition-colors duration-300">
        {/* Main container with full-height flex layout */}
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          {/* Main content area */}
          <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
            {/* Decorative background blur elements */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-600/10 blur-[100px] rounded-full pointer-events-none"></div>
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
      <aside className="w-64 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col bg-white dark:bg-slate-900/50">
        {/* Logo section */}
        <Link href={"/"}>
          <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Clapperboard className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
              VidTranslate
            </span>
          </div>
        </Link>
        {/* Navigation menu with links to different sections */}
        <nav className="mt-4 px-4 space-y-2 flex-1">
          <Link
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"
            href="/videos"
          >
            <Play className="stroke-primary" />
            Videos
          </Link>
          <Link
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"
            href="/jobs"
          >
            <Languages className="stroke-primary" />
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
      <header className="h-16 flex items-center justify-between px-8 glass-light dark:glass sticky top-0 z-10 border-b border-slate-200/50 dark:border-slate-800/50">
        {/* Search bar */}
        <div className="flex items-center flex-1 max-w-xl">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></Search>

            <input
              className="w-full bg-slate-100/50 dark:bg-slate-900/50 border-transparent focus:border-primary focus:ring-0 rounded-full py-2 pl-10 pr-4 text-sm transition-all duration-200"
              placeholder="Search videos..."
              type="text"
            />
          </div>
        </div>
        {/* Header right actions */}
        <div className="flex items-center gap-4">
          {/* TODO: add theme switch buttons */}
          <button
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            onClick={() => {
              console.log("add functionality to switch themes");
            }}
          >
            <Sun className="dark:hidden"></Sun>
            <Sun className="hidden dark:block"></Sun>
          </button>
          {/* Notification button with badge */}
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full relative transition-colors">
            <Bell></Bell>
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
          </button>
          {/* Divider */}
          <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1"></div>
          {/* User profile section */}
          <div className="flex items-center gap-3 pl-2">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold leading-none">
                {user?.fullName}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-none">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
            <img
              alt="User avatar"
              className="h-9 w-9 rounded-full border-2 border-primary/20"
              src={user?.profileImageUrl}
            />
          </div>
        </div>
      </header>
    </>
  );
}