"use client";

import axios from "axios";
import {
  Brain,
  ChevronRight,
  Film,
  Gauge,
  Languages,
  Mic2,
  ScanFace,
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

  const router = useRouter()

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

  async function onSubmitHandler(){
    try {
      const { videoId } = await params;
      if(!sourceLanguage|| !targetLanguage || !videoTitle ){
        alert("Select all the fields")
        return
      }

      const response = await axios.post("/api/jobs", {
        videoId: videoId,
        targetLanguage: targetLanguage,
        sourceLanguage: sourceLanguage
      })

      console.log(response)

      if(response.status === 201){
        alert("Job created successfully")
        router.push(`/videos/${videoId}/jobs`)
      }
    } catch (error) {
      console.log("Error occured while submitting form", error)
    }
  }

  return (
    <>
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
              <a className="hover:text-primary transition-colors" href="#">
                Translation Jobs
              </a>
              <ChevronRight className="h-4 w-4 text-slate-400" />
              <span className="text-slate-800 dark:text-slate-200 font-medium">
                New Job
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
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
          <div className="p-8 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 shadow-xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-primary" />
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
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-100 dark:bg-slate-900/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all cursor-pointer"
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
                      className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-100 dark:bg-slate-900/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all cursor-pointer"
                    >
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
                      className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-100 dark:bg-slate-900/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all cursor-pointer"
                    >
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

              {/* Model selection */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700/50">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">
                  Translation Model
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <label className="relative flex flex-col p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 cursor-pointer hover:border-primary/50 dark:hover:border-primary/50 transition-all bg-slate-50 dark:bg-slate-900/40">
                    <input
                      className="sr-only peer"
                      name="model"
                      type="radio"
                      value="standard"
                    />
                    <span className="absolute top-4 right-4 w-4 h-4 rounded-full border border-slate-400 peer-checked:border-primary peer-checked:bg-primary transition-colors"></span>
                    <Gauge className="h-6 w-6 text-slate-400 mb-2 peer-checked:text-primary" />
                    <span className="font-semibold text-sm">Standard</span>
                    <span className="text-xs text-slate-500 mt-1">
                      Fast processing, good accuracy
                    </span>
                  </label>

                  <label className="relative flex flex-col p-4 rounded-xl border-2 border-primary cursor-pointer bg-primary/5 dark:bg-primary/10 transition-all">
                    <input
                      checked=""
                      className="sr-only peer"
                      name="model"
                      type="radio"
                      value="pro"
                    />
                    <span className="absolute top-4 right-4 w-4 h-4 rounded-full border border-slate-400 peer-checked:border-primary peer-checked:bg-primary transition-colors"></span>
                    <Brain className="h-6 w-6 text-primary mb-2" />
                    <span className="font-semibold text-sm">Pro Neural</span>
                    <span className="text-xs text-slate-500 mt-1">
                      Highest accuracy, context aware
                    </span>
                  </label>

                  <label className="relative flex flex-col p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 cursor-pointer hover:border-primary/50 dark:hover:border-primary/50 transition-all bg-slate-50 dark:bg-slate-900/40">
                    <input
                      className="sr-only peer"
                      name="model"
                      type="radio"
                      value="lip"
                    />
                    <span className="absolute top-4 right-4 w-4 h-4 rounded-full border border-slate-400 peer-checked:border-primary peer-checked:bg-primary transition-colors"></span>
                    <ScanFace className="h-6 w-6 text-slate-400 mb-2 peer-checked:text-primary" />
                    <span className="font-semibold text-sm">Lip Sync</span>
                    <span className="text-xs text-slate-500 mt-1">
                      Matches lip movement (Beta)
                    </span>
                  </label>
                </div>
              </div>

              {/* Optional voice cloning */}
              <div>
                <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input className="sr-only peer" type="checkbox" value="" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Clone Speaker Voice</span>
                    <span className="text-xs text-slate-500">
                      Use AI to replicate the original speaker&apos;s tone
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <button onClick={onSubmitHandler} className="w-full mt-4 bg-primary hover:bg-primary/90 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5">
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
