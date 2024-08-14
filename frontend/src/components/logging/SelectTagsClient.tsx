import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { UserTags } from "../../../drizzle/schema";

export default function SelectTagsClient({
  userTags,
  selectedTagsIds,
  setSelectedTagsIds,
}: {
  userTags: UserTags[];
  selectedTagsIds: string[];
  setSelectedTagsIds: (tags: string[]) => void;
}) {
  userTags.sort((a, b) => a.name.localeCompare(b.name));
  return (
    <div>
      <ToggleGroup
        type="multiple"
        value={selectedTagsIds}
        onValueChange={setSelectedTagsIds}
      >
        {userTags.map((tag) => (
          <ToggleGroupItem key={tag.id} value={tag.id}>
            {"#" + tag.name}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <ul></ul>
    </div>
  );
}
