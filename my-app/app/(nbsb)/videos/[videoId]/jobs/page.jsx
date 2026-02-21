"use client";

import {
  AlertTriangle,
  Check,
  Clock,
  Hourglass,
  Plus,
  Trash2,
} from "lucide-react";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function Jobs({ params }) {
  const router = useRouter();

  const [updateData, setUpdateData] = useState(false);
  const [jobs, setJobs] = useState([]);

  const [videoId, setVideoId] = useState("");
  useEffect(() => {
    (async () => {
      const { videoId } = await params;
      setVideoId(videoId);
    })();
  }, [params]);

  // get all jobs of user related to video
  useEffect(() => {
    (async () => {
      try {
        const { videoId } = await params;
        const response = await axios.get(`/api/jobs?videoId=${videoId}`);
        console.log(response.data);

        setJobs(response.data.data);
      } catch (error) {
        console.log("Error occured while fetching jobs");
      }
    })();
  }, [videoId, updateData]);

  function getRelativeTime(dateString) {
    const givenDate = new Date(dateString);
    const now = new Date();

    const diffMs = now - givenDate; // difference in milliseconds

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const years = Math.floor(days / 365);

    if (years > 0) {
      return `${years} year${years > 1 ? "s" : ""} ago`;
    }
    if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }
    if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    }
    if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    }
    return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
  }

  return (
    <>
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        {/* Page header and primary action */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Translation Jobs
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Monitor the status of your active and completed translations.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                router.push(`/videos/${videoId}/jobs/create`);
              }}
              className="bg-primary hover:bg-primary/90 hover:cursor-pointer text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-primary/25"
            >
              <Plus />
              New Job
            </button>
          </div>
        </div>

        {/* Jobs list */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/60">
            <span>Language</span>
            <span>Status</span>
            <span>Relative Time</span>
            <span className="text-right">Actions</span>
          </div>
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {/* DB states and these states may mismatch causing the card to load but not display */}
            {/* TODO: Fix this bug */}
            {jobs.map((job) => (
              <JobCards
                key={job._id}
                jobId={job._id}
                videoId={videoId}
                status={job.status}
                relativeTime={getRelativeTime(job.updatedAt)}
                language={job.targetLanguage}
                options={{ status: job.status }}
              />
            ))}

            {/* <JobCards
              status="COMPLETED"
              relativeTime={"2 hour ago"}
              language={"French"}
            />
            <JobCards
              status="QUEUED"
              relativeTime={"2 hour ago"}
              language={"German"}
              options={{ status: "Translating" }}
            />
            <JobCards
              status="FAILED"
              relativeTime={"2 hour ago"}
              language={"Spanish"}
            /> */}
          </div>
        </div>

        {/* New job CTA */}
        <button
          onClick={() => {
            router.push(`/videos/${videoId}/jobs/create`);
          }}
          className="mt-6 w-full flex items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-100/60 dark:bg-slate-800/40 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:border-primary/60 hover:bg-primary/5 transition-all"
        >
          <Plus className="h-4 w-4" />
          Start New Translation
        </button>
      </div>
    </>
  );
}

export default Jobs;

function JobCards({ jobId, videoId, status, language, relativeTime, options }) {
  const router = useRouter();
  return (
    <>
      {status === "COMPLETED" && (
        <div
          role="button"
          tabIndex={0}
          onClick={() => {
            router.push(`/videos/${videoId}/jobs/${jobId}`);
          }}
          onKeyDown={() => {}}
          className="grid w-full grid-cols-[1fr_1fr_1fr_auto] items-center gap-4 px-6 py-4 text-sm text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <span className="font-medium text-slate-800 dark:text-slate-100">
            {language}
          </span>
          <span className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
            <Check className="h-4 w-4" />
            Completed
          </span>
          <span className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <Clock className="h-4 w-4" />
            {relativeTime}
          </span>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                (async () => {
                  try {
                    const response = await axios.delete(`/api/jobs/${jobId}`);
                    if (response.status === 200) {
                      alert("Job deleted successfully");
                    }
                  } catch (error) {
                    console.log("Error deleting job");
                  }
                })();
              }}
              className="inline-flex items-center justify-center rounded-lg p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              aria-label="Delete job"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {status === "QUEUED" && (
        <div
          role="button"
          tabIndex={0}
          onClick={() => {}}
          onKeyDown={() => {}}
          className="grid w-full grid-cols-[1fr_1fr_1fr_auto] items-center gap-4 px-6 py-4 text-sm text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <span className="font-medium text-slate-800 dark:text-slate-100">
            {language}
          </span>
          <span className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 font-semibold">
            <Hourglass className="h-4 w-4" />
            {options.status}
          </span>
          <span className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <Clock className="h-4 w-4" />
            {relativeTime}
          </span>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                (async () => {
                  try {
                    const response = await axios.delete(`/api/jobs/${jobId}`);
                    if (response.status === 200) {
                      alert("Job deleted successfully");
                    }
                  } catch (error) {
                    console.log("Error deleting job");
                  }
                })();
              }}
              className="inline-flex items-center justify-center rounded-lg p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              aria-label="Delete job"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {status === "FAILED" && (
        <div
          role="button"
          tabIndex={0}
          onClick={() => {}}
          onKeyDown={() => {}}
          className="grid w-full grid-cols-[1fr_1fr_1fr_auto] items-center gap-4 px-6 py-4 text-sm text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <span className="font-medium text-slate-800 dark:text-slate-100">
            {language}
          </span>
          <span className="inline-flex items-center gap-2 text-red-600 dark:text-red-400 font-semibold">
            <AlertTriangle className="h-4 w-4" />
            Failed
          </span>
          <span className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <Clock className="h-4 w-4" />
            {relativeTime}
          </span>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                (async () => {
                  try {
                    const response = await axios.delete(`/api/jobs/${jobId}`);
                    if (response.status === 200) {
                      alert("Job deleted successfully");
                    }
                  } catch (error) {
                    console.log("Error deleting job");
                  }
                })();
              }}
              className="inline-flex items-center justify-center rounded-lg p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              aria-label="Delete job"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
