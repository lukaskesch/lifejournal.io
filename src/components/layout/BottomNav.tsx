"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { HomeIcon, ClockIcon, BookOpenIcon, CheckCircleIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { HomeIcon as HomeIconSolid, ClockIcon as ClockIconSolid, BookOpenIcon as BookOpenIconSolid, CheckCircleIcon as CheckCircleIconSolid, UserCircleIcon as UserCircleIconSolid } from "@heroicons/react/24/solid";

const navItems = [
  {
    path: "/app",
    label: "Home",
    icon: HomeIcon,
    activeIcon: HomeIconSolid,
  },
  {
    path: "/app/activities",
    label: "Activities",
    icon: ClockIcon,
    activeIcon: ClockIconSolid,
  },
  {
    path: "/app/diary",
    label: "Diary",
    icon: BookOpenIcon,
    activeIcon: BookOpenIconSolid,
  },
  {
    path: "/app/habits",
    label: "Habits",
    icon: CheckCircleIcon,
    activeIcon: CheckCircleIconSolid,
  },
  {
    path: "/app/profile",
    label: "Profile",
    icon: UserCircleIcon,
    activeIcon: UserCircleIconSolid,
  },
];

export default function BottomNav() {
  const { data: session } = useSession();
  const pathname = usePathname();

  if (!session) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = item.path === "/app"
            ? pathname === "/app"
            : pathname.startsWith(item.path);
          const Icon = isActive ? item.activeIcon : item.icon;
          
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center justify-center w-full h-full ${
                isActive ? "text-primary" : "text-gray-500"
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
