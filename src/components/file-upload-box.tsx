"use client";

import { useRef, useState } from "react";

interface FileInputProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
}

export function FileUploadBox({ onFileSelect, isLoading = false }: FileInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`card relative rounded-2xl border-2 border-dashed p-8 text-center transition ${
        isDragging
          ? "border-[var(--primary)] bg-blue-50"
          : "border-slate-300 bg-slate-50 hover:border-slate-400"
      } ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
    >
      <input
        ref={inputRef}
        type="file"
        onChange={handleInputChange}
        accept=".pdf,.txt,.doc,.docx"
        className="hidden"
        disabled={isLoading}
      />

      <div className="flex flex-col items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary)]/10">
          <svg
            className="h-6 w-6 text-[var(--primary)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>

        <div>
          <p className="font-semibold text-slate-900">
            {isLoading ? "Processing..." : "Drop your resume here"}
          </p>
          <p className="text-sm text-slate-600">
            or{" "}
            <button
              onClick={() => inputRef.current?.click()}
              disabled={isLoading}
              className="font-semibold text-[var(--primary)] hover:underline disabled:opacity-50"
            >
              click to browse
            </button>
          </p>
        </div>

        <p className="text-xs text-slate-500">Supports PDF, TXT, DOC, DOCX files (max 10 MB)</p>
      </div>
    </div>
  );
}
