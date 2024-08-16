import Link from "next/link";
export default function Header() {
  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          My Focus Journal
        </Link>
        <ul className="flex space-x-4">
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
        </ul>
      </nav>
    </header>
  );
}
