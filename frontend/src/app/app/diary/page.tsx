import Link from "next/link";

export default function DiaryPage() {
  return (
    <div>
      <Link href="/app/diary/questions">Questions</Link>
      <Link href="/app/diary/entries">Entries</Link>
    </div>
  );
}

