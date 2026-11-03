"use client";

import Image, { StaticImageData } from "next/image";
import React from "react";
import { cn } from "@/lib/utils";

export interface Safari_01Props {
  image?: StaticImageData | string;
  className?: string;
  children?: React.ReactNode;
  url?: string;
  title?: string;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
}

const Safari_01: React.FC<Safari_01Props> = ({
  image,
  className,
  children,
  url,
  title,
  onClose,
  onMinimize,
  onMaximize,
}) => {
  return (
    <div
      className={cn(
        "min-w-[700px] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-muted shadow-md overflow-hidden",
        className
      )}
    >
      {/* Browser top bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 select-none">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-3 h-3 bg-red-400 hover:bg-red-500 rounded-full transition-colors cursor-pointer border-0 p-0 focus:outline-none"
          />
          <button
            type="button"
            onClick={onMinimize}
            aria-label="Minimize"
            className="w-3 h-3 bg-yellow-400 hover:bg-yellow-500 rounded-full transition-colors cursor-pointer border-0 p-0 focus:outline-none"
          />
          <button
            type="button"
            onClick={onMaximize}
            aria-label="Maximize"
            className="w-3 h-3 bg-green-500 hover:bg-green-600 rounded-full transition-colors cursor-pointer border-0 p-0 focus:outline-none"
          />
        </div>
        <div className="flex-1 mx-4 bg-gray-200 dark:bg-zinc-800/80 rounded-md h-6 max-w-md flex items-center justify-center px-3 border border-white/5">
          <span className="text-[11px] text-zinc-400 truncate font-mono">
            {url || title || "https://rudar.dev"}
          </span>
        </div>
        <div className="w-4 h-4" /> {/* Placeholder for right side icons */}
      </div>

      {/* Preview / Content area */}
      <div className="bg-gray-100 dark:bg-zinc-900 aspect-video flex items-center justify-center overflow-auto">
        {children ? (
          children
        ) : image ? (
          <Image
            src={image}
            alt="Preview"
            width={800}
            height={450}
            className="object-contain max-h-full max-w-full"
          />
        ) : (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            No preview image
          </div>
        )}
      </div>
    </div>
  );
};

export default Safari_01;
