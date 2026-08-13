"use client";

import Image from "next/image";

interface PlayerAvatarProps {
  src?: string | null;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const SIZE_MAP = {
  sm: "w-8 h-8 text-xs",
  md: "w-12 h-12 text-base",
  lg: "w-20 h-20 text-2xl",
  xl: "w-28 h-28 text-4xl",
};

const PIXEL_MAP = {
  sm: 32,
  md: 48,
  lg: 80,
  xl: 112,
};

export default function PlayerAvatar({
  src,
  name,
  size = "md",
  className = "",
}: PlayerAvatarProps) {
  // Get initial character for fallbacks
  const initial = name ? name.charAt(0).toUpperCase() : "?";
  const sizeClasses = SIZE_MAP[size];
  const pxSize = PIXEL_MAP[size];

  return (
    <div
      className={`relative rounded-full overflow-hidden flex items-center justify-center bg-green-100 text-green-800 font-bold border-2 border-green-500/20 shrink-0 ${sizeClasses} ${className}`}
    >
      {src ? (
        <Image
          src={src}
          alt={`${name}'s profile picture`}
          width={pxSize}
          height={pxSize}
          className="object-cover w-full h-full"
          priority={size === "xl"}
        />
      ) : (
        <span>{initial}</span>
      )}
    </div>
  );
}