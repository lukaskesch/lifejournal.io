"use client";
import React, { Suspense } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname, useSearchParams } from "next/navigation";

export default function Header() {
  return (
    <Suspense fallback={null}>
      <InnerHeader />
    </Suspense>
  );
}

function InnerHeader() {
  const { data: session, status } = useSession();

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentUrl = pathname + searchParams.toString();

  return (
    <header className="bg-primary text-white p-4">
      <nav className=" flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          My Focus Journal
        </Link>
        <ul className="flex space-x-4">
          {session ? (
            <>
              <li>
                <Link href="/app" className="hover:text-gray-300">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/app/logs" className="hover:text-gray-300">
                  Logs
                </Link>
              </li>
              <li>
                <Link href="/app/tags" className="hover:text-gray-300">
                  Tags
                </Link>
              </li>
              <li>
                <Link
                  href={`/app/logs/new?callbackUrl=${encodeURIComponent(currentUrl)}`}
                  className="hover:text-gray-300"
                >
                  Log Time
                </Link>
              </li>
            </>
          ) : (
            <li>
              <Link href="/api/auth/signin" className="hover:text-gray-300">
                Sign in
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
