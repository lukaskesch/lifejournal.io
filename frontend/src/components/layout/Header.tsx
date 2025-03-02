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

  return (
    <header className="bg-primary text-white p-4">
      <nav className=" flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Life Journal
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
                <Link href="/app/activities" className="hover:text-gray-300">
                  Activities
                </Link>
              </li>
              <li>
                <Link href="/app/diary" className="hover:text-gray-300">
                  Diary
                </Link>
              </li>
              <li>
                <Link href="/app/habits" className="hover:text-gray-300">
                  Habits
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
