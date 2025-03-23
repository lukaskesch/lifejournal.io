"use client";

import Image from "next/image";

interface AvatarProps {
  src?: string | null;
  name?: string | null;
  size?: number;
}

export default function Avatar({ src, name, size = 32 }: AvatarProps) {
  if (src) {
    return (
      <Image
        src={src}
        alt={name || "Profile"}
        width={size}
        height={size}
        className="rounded-full ring-2 ring-white"
      />
    );
  }

  // Create initials from name
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <div
      className="rounded-full bg-primary flex items-center justify-center text-white ring-1 ring-white"
      style={{
        width: size,
        height: size,
        fontSize: `${Math.floor(size * 0.4)}px`,
      }}
    >
      {initials}
    </div>
  );
}
