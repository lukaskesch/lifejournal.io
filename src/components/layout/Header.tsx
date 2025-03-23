"use client";
import React, { Suspense } from "react";
import Link from "next/link";
import Avatar from "../ui/Avatar";
import { useSession, signOut } from "next-auth/react";
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

  const getIsSectionActive = (section: string) => {
    return pathname.startsWith(section);
  };

  return (
    <header className="bg-primary text-white p-4">
      <nav className=" flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Life Journal
        </Link>

        <ul className="flex items-center space-x-4">
          {session ? (
            <>
              <li>
                <Link href="/app" className="hover:text-gray-300">
                  Dashboard
                </Link>
              </li>

              <li>
                <Link
                  href="/app/activities"
                  className={`hover:text-gray-300 ${
                    getIsSectionActive("/app/activities")
                      ? "underline underline-offset-2"
                      : ""
                  }`}>
                  Activities
                </Link>
              </li>
              <li>
                <Link
                  href="/app/diary"
                  className={`hover:text-gray-300 ${
                    getIsSectionActive("/app/diary")
                      ? "underline underline-offset-2"
                      : ""
                  }`}>
                  Diary
                </Link>
              </li>
              <li>
                <Link
                  href="/app/habits"
                  className={`hover:text-gray-300 ${
                    getIsSectionActive("/app/habits")
                      ? "underline underline-offset-2"
                      : ""
                  }`}>
                  Habits
                </Link>
              </li>
              <li>
                <Link href="/app/profile" className="hover:opacity-80">
                  <Avatar
                    src={session.user?.image}
                    name={session.user?.name}
                    size={32}
                  />
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
