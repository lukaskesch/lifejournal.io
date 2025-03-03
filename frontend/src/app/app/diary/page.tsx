import Toolbar from "@/components/layout/toolbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DiaryPage() {
  return (
    <div>
      <Toolbar>
        <div className="font-bold text-lg">Diary</div>
        <div className="flex flex-row items-center gap-4">
          <Link href="/app/diary/questions">Manage Questions</Link>
          {/* <Link href="/app/diary/entries">Entries</Link> */}
          <Button>Write</Button>
        </div>
      </Toolbar>
    </div>
  );
}

