"use client";

import axios from "axios";
import {
  Film,
  Languages,
  Mic2,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// TODO: source language has no use (maybe fix it)
// TODO: also the additional options are just placeholders

function CreateJob({ params }) {
  const [video, setVideo] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("");

  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        // get video details
        const { videoId } = await params;
        const video = await axios.get(`/api/videos/${videoId}`);
        const videoTitle = video.data.data.title;
        setVideoTitle(videoTitle);
      } catch (error) {
        console.log("Error occured while fetching details");
      }
    })();
  }, [params]);

  async function onSubmitHandler() {
    try {
      const { videoId } = await params;
      if (!sourceLanguage || !targetLanguage || !videoTitle) {
        alert("Select all the fields");
        return;
      }

      const response = await axios.post("/api/jobs", {
        videoId: videoId,
        targetLanguage: targetLanguage,
        sourceLanguage: sourceLanguage,
      });

      console.log(response);

      if (response.status === 201) {
        alert("Job created successfully");
        router.push(`/videos/${videoId}/jobs`);
      }
    } catch (error) {
      console.log("Error occured while submitting form", error);
    }
  }

  return (
    <>
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Initiate New Translation
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Configure language settings and AI model preferences.
            </p>
          </div>
        </div>

        {/* Main layout: form */}
        <div className="space-y-6">
          {/* Configuration form */}
          <div className="p-8 rounded-3xl glass-card border border-slate-200 dark:border-white/10 shadow-xl bg-white/50 dark:bg-slate-900/40">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
              <SlidersHorizontal className="h-5 w-5 text-[var(--color-primary)] dark:text-[#00F0FF]" />
              Configuration
            </h2>

            <div className="space-y-6">
              {/* Video selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Select Video Source
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Film className="h-4 w-4 text-slate-500" />
                  </div>
                  <select
                    disabled
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-[#FF46A2]/40 focus:border-[#FF46A2] transition-all cursor-pointer"
                  >
                    {/* add the title of selected video here */}
                    <option value="0">{videoTitle}</option>
                  </select>
                </div>
              </div>

              {/* Language selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Source Language
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mic2 className="h-4 w-4 text-slate-500" />
                    </div>
                    <select
                      value={sourceLanguage}
                      onChange={(e) => {
                        setSourceLanguage(e.target.value);
                      }}
                      className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-[#FF46A2]/40 focus:border-[#FF46A2] transition-all cursor-pointer"
                    >
                      <option>Select source language</option>
                      <option>English (US)</option>
                      <option>Spanish (ES)</option>
                      <option>French (FR)</option>
                      <option>German (DE)</option>
                      <option>Hindi (IN)</option>
                      <option>Chinese (CN)</option>
                      <option>Korean (KR)</option>
                      <option>Russian (RU)</option>
                      <option>Portuguese (BR)</option>
                      <option>Italian (IT)</option>
                      <option>Japanese (JP)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Target Language
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Languages className="h-4 w-4 text-slate-500" />
                    </div>
                    <select
                      value={targetLanguage}
                      onChange={(e) => {
                        setTargetLanguage(e.target.value);
                      }}
                      className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-[#FF46A2]/40 focus:border-[#FF46A2] transition-all cursor-pointer"
                    >
                      <option>Select a target language</option>
                      <option>English (US)</option>
                      <option>Spanish (ES)</option>
                      <option>French (FR)</option>
                      <option>German (DE)</option>
                      <option>Hindi (IN)</option>
                      <option>Chinese (CN)</option>
                      <option>Korean (KR)</option>
                      <option>Russian (RU)</option>
                      <option>Portuguese (BR)</option>
                      <option>Italian (IT)</option>
                      <option>Japanese (JP)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={onSubmitHandler}
              className="w-full mt-8 bg-linear-to-r from-[#FF46A2] to-[#EE4B2B] text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#FF46A2]/25 hover:shadow-[#FF46A2]/40 hover:-translate-y-0.5"
            >
              <Sparkles className="h-5 w-5" />
              Start Translation
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateJob;
