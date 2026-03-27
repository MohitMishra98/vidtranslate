"use client";

import { Play, CloudUpload, Trash, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { getCldImageUrl } from "next-cloudinary";

function Dashboard() {
  const router = useRouter();
  const [videos, setVideos] = useState([]);
  const [videoDeletedSuccessfully, setVideoDeletedSuccessfully] =
    useState(false);

  function getThumbnailUrl(publicId) {
    return getCldImageUrl({
      src: publicId,
      format: "jpg",
      assetType: "video",
    });
  }
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
  function getDuration(duration) {
    return `${Math.floor(Number(duration / 60))}:${Math.floor(Number(duration)) % 60}`;
  }

  async function getVideos() {
    try {
      const videoResponse = await axios.get(
        "/api/videos?limit=100&page=1&sort=desc",
      );
      console.log("testtt", videoResponse.data);

      const response = videoResponse.data.data; // array of videos

      setVideos(response);
      console.log(response);
    } catch (error) {
      console.log("Error fetching videos", error);
    }
  }

  async function deleteVideo(videoId) {
    try {
      const repsonse = await axios.delete(`/api/videos/${videoId}`);

      if (repsonse.status === 200) {
        console.log("video successfully deleted");
        const newVideoList = videos.filter((video) => video._id !== videoId);
        setVideos(newVideoList);
        setVideoDeletedSuccessfully(true);
        setTimeout(() => {
          setVideoDeletedSuccessfully(false);
        }, 5000);
      }
    } catch (error) {
      console.log("Error occured", error);
    }
  }

  useEffect(() => {
    // get the list of video
    getVideos();
  }, []);

  // const videos = [
  //   {
  //     title: "Sample Title",
  //     language: "Engish",
  //     duration: "01:19",
  //     thumbnail:
  //       "https://res.cloudinary.com/dehh7d0sr/video/upload/f_jpg/q_auto/v1/videos/u1vdjvu5qvlw7berj2f6?_a=BAVMn6AQ0",
  //     uploadTime: "2 hours ago",
  //   },
  // ];

  return (
    <>
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        {/* Page header with title and upload button */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Videos Dashboard
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Manage and translate your video content efficiently.
            </p>
          </div>
          <button
            onClick={() => {
              router.push("/upload");
            }}
            className="bg-linear-to-r from-[#FF46A2] to-[#EE4B2B] text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-[#FF46A2]/25 hover:shadow-[#FF46A2]/40"
          >
            <CloudUpload className="text-lg"></CloudUpload>
            Upload New
          </button>
        </div>

        {/* Video cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => (
            <VideoCard
              key={video._id}
              videoId={video._id}
              title={video.title}
              language={video?.language || "English"}
              duration={getDuration(video.duration)}
              thumbnail={getThumbnailUrl(video.public_id)}
              uploadTime={getRelativeTime(video.createdAt)}
              deleteVideo={deleteVideo}
            />
          ))}

          {/* Add new video button */}
          <button
            onClick={() => {
              router.push("/upload");
            }}
            className="flex flex-col items-center justify-center aspect-video sm:aspect-auto sm:h-full bg-slate-900/40 rounded-3xl border-2 border-dashed border-white/20 group hover:border-[#FF46A2]/50 hover:bg-[#FF46A2]/5 transition-all p-8 text-center min-h-70"
          >
            <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-[#FF46A2] group-hover:text-white transition-all duration-300 mb-4 shadow-inner">
              <Plus className="text-3xl"></Plus>
            </div>
            <p className="font-bold text-slate-300 group-hover:text-[#FF46A2] transition-colors">
              Add New Video
            </p>
          </button>
        </div>
        {videoDeletedSuccessfully && (
          <div className="transition duration-1000 fixed right-4 bottom-4 py-2 px-10 bg-green-500/80 text-white text-medium font-bold rounded-xl">
            Video Successfully Deleted
          </div>
        )}
      </div>
    </>
  );
}

export default Dashboard;

function VideoCard({
  videoId,
  title,
  language,
  duration,
  thumbnail,
  uploadTime,
  deleteVideo,
}) {
  const router = useRouter();
  return (
    <>
      <div
        onClick={() => {
          router.push(`/videos/${videoId}/jobs`);
        }}
        className="group bg-slate-900/70 rounded-3xl overflow-hidden border border-white/10 transition-all hover:shadow-2xl hover:shadow-[#FF46A2]/15 hover:-translate-y-1"
      >
        <div className="aspect-video bg-slate-800 relative overflow-hidden">
          <img
            alt="Video Thumbnail"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            src={thumbnail}
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 hover:bg-white/40 transition-all">
              <Play className="text-3xl"></Play>
            </button>
          </div>
          <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-md">
            {/* duration of the video */}
            {duration}
          </div>
        </div>
        <div className="p-5 flex items-start justify-between">
          <div className="min-w-0">
            <h3 className="font-semibold text-slate-100 truncate">
              {/* title */}
              {title}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {/* upload time */}
              {uploadTime}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteVideo(videoId);
            }}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
          >
            <Trash className="text-xl"></Trash>
          </button>
        </div>
        <div className="px-5 pb-5 flex gap-2">
          <span className="px-2 py-1 bg-slate-800 rounded-md text-[10px] font-medium text-slate-300 uppercase tracking-wider">
            {/* language */}
            {language}
          </span>
        </div>
      </div>
      {/* {successfullyDeleted && (
        <div className="transition duration-1000 fixed right-2 bottom-2 p-2 bg-green-500/80 text-white text-medium font-bold rounded-xl">
          Successfully Deleted
        </div>
      )} */}
    </>
  );
}
