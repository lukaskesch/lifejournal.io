import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export default async function Header() {
  const session = await getServerSession(authOptions);
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
