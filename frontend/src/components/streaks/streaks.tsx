import Streak from "./streak";

export default async function Streaks({}) {
  return (
    <div>
      <div className="py-2">
        {/* Exercise */}
        <Streak
          tagId="1b73dd00-8797-470b-a2a3-b8c58228c656"
      />
      </div>

      <div className="py-2">
        {/* Software Development */}
        <Streak tagId="32a49b2e-d0b1-442f-8a45-a2f41bce6379" />
      </div>

      <div className="py-2">
        {/* Reading */}
        <Streak tagId="86ee71f4-2c84-4eab-a056-28883bad352c" />
      </div>

      <div className="py-2">
        {/* Mindfulness */}
        <Streak tagId="823c9a67-454d-4cac-b13f-93e676cc032c" />
      </div>
    </div>
  );
}
