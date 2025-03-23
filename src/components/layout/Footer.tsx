"use client";

import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/app")) return null;
  return (
    <footer>
      <hr />
      <div className="flex justify-between px-4 py-2">
        <div>&copy; Life Journal {new Date().getFullYear()}</div>
        <div>
          <a href="https://kesch.dev">kesch.dev</a> production
        </div>
      </div>
    </footer>
  );
}
