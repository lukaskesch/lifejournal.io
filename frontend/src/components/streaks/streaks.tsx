import Streak from "./streak";

export default async function Streaks({}) {
  return (
    <div>
      {/* Exercise */}
      <Streak
        tagId="1b73dd00-8797-470b-a2a3-b8c58228c656"
        // startDate={new Date(new Date().setMonth(new Date().getMonth() - 1))}
      />
      {/* Software Development */}

      <Streak
        tagId="32a49b2e-d0b1-442f-8a45-a2f41bce6379"
      />
    </div>
  );
}
