"use client";
import { useRef, useState } from "react";
import { CloudUpload } from "lucide-react";

function DragAndDrop() {
  // handling files
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);

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
          ${isDragging ? "border-primary bg-primary/10" : "border-slate-300 dark:border-slate-600"}
          bg-slate-50/50 dark:bg-slate-800/30
          hover:border-primary/60 transition-all duration-300
          flex flex-col items-center justify-center cursor-pointer
        `}
      >
        <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-700/50 flex items-center justify-center mb-4">
          <CloudUpload className="text-4xl text-slate-400 group-hover:text-primary" />
        </div>

        {!file ? (
          <>
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">
              Drag and drop video files
            </h3>
            <p className="text-sm text-slate-500 mt-2">
              or{" "}
              <span className="text-primary font-semibold underline">
                browse files
              </span>
            </p>
            <p className="text-xs text-slate-400 mt-4">
              MP4, MOV, AVI up to 2GB
            </p>
          </>
        ) : (
          <>
            <h3 className="text-lg font-bold text-primary">{file.name}</h3>
            <p className="text-sm text-slate-500 mt-2">
              {(file.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </>
        )}
      </div>
    </>
  );
}

export default DragAndDrop;
