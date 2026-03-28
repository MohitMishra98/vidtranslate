"use client";

import { ArrowLeft, CloudUpload, Pencil, Clapperboard } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

function Upload() {
  // input values
  const [title, setTitle] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("");

  // first we need to get the signed uplaod key from BE
  async function getKeyAndUpload() {
    try {
      if (!file || !title || !sourceLanguage) {
        alert("Please fill in all required fields before uploading.");
        return;
      }

      setIsUploading(true);
      setErrorUploading(false);
      setSuccessfullyUploaded(false);

      // get signed keys
      const response = await axios.post("/api/auth/sign-upload");
      const { signature, timestamp, apiKey, cloudName } = response.data;

      // always provide file in formData format
      // also make sure to give same folder as given in signature generation
      // otherwise it will sign mismatch error
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("signature", signature);
      formData.append("timestamp", timestamp);
      formData.append("folder", "videos");

      // upload to cloudinary
      const uploadResult = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
        formData,
      );

      const { public_id, secure_url, resource_type, duration, bytes } =
        uploadResult.data;

      // now send the request back to server to tell the video has been uploaded
      const beResponse = await axios.post("/api/videos", {
        title,
        public_id,
        secure_url,
        resource_type,
        duration,
        bytes,
        language: sourceLanguage,
      });

      setSuccessfullyUploaded(true);
      setIsUploading(false);
      setErrorUploading(false);
    } catch (error) {
      console.log(error);
      setIsUploading(false);
      setErrorUploading(true);
      setSuccessfullyUploaded(false);
    }
  }

  // handling files
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);

  // handlig uploading states
  const [isUploading, setIsUploading] = useState(false);
  const [errorUploading, setErrorUploading] = useState(false);
  const [successfullyUploaded, setSuccessfullyUploaded] = useState(false);

  // Handle files (drop OR browse)
  const handleFiles = (files) => {
    const selectedFile = files[0];
    if (!selectedFile) return;

    // Validation
    const allowedTypes = ["video/mp4", "video/quicktime", "video/x-msvideo"];
    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Only MP4, MOV, AVI files are allowed");
      return;
    }

    setFile(selectedFile);
  };

  return (
    <>
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-4xl mx-auto">
          {/* Page header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Upload Video
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Add new content to your translation queue.
              </p>
            </div>
            <Link
              className="flex items-center text-sm font-medium text-slate-400 hover:text-[#00F0FF] transition-colors"
              href="/videos"
            >
              <ArrowLeft className="mr-1 text-base"></ArrowLeft>
              Back to Dashboard
            </Link>
          </div>

          {/* Upload form card */}
          <div className="glass-panel rounded-3xl p-8 border border-slate-200 dark:border-white/10 relative overflow-hidden bg-white/50 dark:bg-slate-900/30">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)]/10 dark:bg-[var(--color-primary)]/20 blur-[80px] rounded-full pointer-events-none"></div>

            <div className="relative z-10 space-y-8">
              {/* Dropzone */}
              <input
                ref={inputRef}
                type="file"
                accept="video/mp4,video/quicktime,video/x-msvideo"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />

              {/* Drop Zone */}
              <div
                onClick={() => inputRef.current.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  handleFiles(e.dataTransfer.files);
                }}
                className={`
          group relative w-full h-80 rounded-2xl border-2 border-dashed
          ${isDragging ? "border-[#FF46A2] bg-[#FF46A2]/5 dark:bg-[#FF46A2]/10" : "border-slate-300 dark:border-white/20"}
          bg-slate-50/50 dark:bg-slate-900/40
          hover:border-[#00F0FF]/60 transition-all duration-300
          flex flex-col items-center justify-center cursor-pointer
        `}
              >
                <div className="w-20 h-20 rounded-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 flex items-center justify-center mb-4 shadow-sm">
                  <CloudUpload className="text-4xl text-slate-400 group-hover:text-[#FF46A2]" />
                </div>

                {!file ? (
                  <>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      Drag and drop video files
                    </h3>
                    <p className="text-sm text-slate-500 mt-2">
                      or{" "}
                      <span className="text-[#FF46A2] font-semibold underline">
                        browse files
                      </span>
                    </p>
                    <p className="text-xs text-slate-400 mt-4">
                      MP4, MOV, AVI up to 2GB
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-bold text-[#FF46A2]">
                      {file.name}
                    </h3>
                    <p className="text-sm text-slate-500 mt-2">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </>
                )}
              </div>

              {/* Video title input */}
              <div className="grid gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                    Video Title
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Pencil className="text-slate-400 scale-90"></Pencil>
                    </div>
                    <input
                      className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#FF46A2]/40 focus:border-[#FF46A2] text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-all shadow-sm"
                      placeholder="e.g. Q1 Marketing Update"
                      type="text"
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                      }}
                    />
                  </div>
                </div>

                {/* Source language selection */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                    Source Language
                  </label>
                  <select
                    value={sourceLanguage}
                    onChange={(e) => {
                      setSourceLanguage(e.target.value);
                    }}
                    className="w-full px-4 py-3.5 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#FF46A2]/40 focus:border-[#FF46A2] text-slate-900 dark:text-slate-100 transition-all shadow-sm"
                  >
                    <option>Select a language</option>
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

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-200 dark:border-white/10">
                {successfullyUploaded && (
                  <div className="px-6 py-3 rounded-xl text-white dark:text-white font-medium bg-green-500 dark:hover:bg-green-800 transition-colors">
                    Upload Successfull
                  </div>
                )}
                {errorUploading && (
                  <div className="px-6 py-3 rounded-xl text-slate-600 dark:text-slate-300 font-medium bg-red-500 dark:hover:bg-red-800 transition-colors">
                    Error occured while uploading
                  </div>
                )}
                {!isUploading ? (
                  <button
                    onClick={getKeyAndUpload}
                    className="bg-linear-to-r from-[#FF46A2] to-[#EE4B2B] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-[#FF46A2]/25 hover:shadow-[#FF46A2]/40 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <CloudUpload />
                    Start Upload
                  </button>
                ) : (
                  <button className="bg-[#FF46A2]/15 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all cursor-not-allowed">
                    <CloudUpload />
                    Uploading...
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Upload;
