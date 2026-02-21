"use client";

import axios from "axios";
import { Download, Languages, PlayCircle } from "lucide-react";
import { useEffect, useState } from "react";

function VideoPlayer({ params }) {
  const [job, setJob] = useState({});
  const [jobId, setJobId] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { jobId } = await params;
        setJobId(jobId);
        const response = await axios.get(`/api/jobs/${jobId}`);
        setJob(response.data.job);
      } catch (error) {
        console.log("Error fetching job");
      }
    })();
  }, [params]);

  return (
    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
      {/* Page header with primary action */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <PlayCircle className="h-6 w-6 text-primary" />
            Video Player
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Preview the translated video and download the output.
          </p>
        </div>
        <button
          onClick={() => {
            // download logic
            const downloadUrl = job?.secure_url.replace(
              "/upload/",
              "/upload/fl_attachment/",
            );

            const link = document.createElement("a");
            link.href = downloadUrl;
            link.download = job?.public_id; // optional filename
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-primary/25"
        >
          <Download className="h-4 w-4" />
          Download
        </button>
      </div>

      {/* Player card with placeholder and metadata */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        {/* Video player area */}
        <div className="aspect-video bg-slate-100 dark:bg-slate-800">
          <video className="size-full" controls src={job?.secure_url}></video>
        </div>
        <div className="px-6 py-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              {job?.video?.title}
            </h2>
          </div>
          {/* Language indicator */}
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-[10px] font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            <Languages className="h-3.5 w-3.5" />
            {job?.targetLanguage}
          </span>
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer;
