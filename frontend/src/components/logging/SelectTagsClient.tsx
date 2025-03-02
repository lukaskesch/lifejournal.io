import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { UserTagSelect } from "@/types/database-types";

export default function SelectTagsClient({
  userTags,
  selectedTagsIds,
  setSelectedTagsIds,
}: {
  userTags: UserTagSelect[];
  selectedTagsIds: string[];
  setSelectedTagsIds: (tags: string[]) => void;
}) {
  userTags.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="flex flex-row flex-wrap">
      {userTags.map((tag) => (
        <label
          key={tag.id}
          className={`${
            selectedTagsIds.some((id) => id === tag.id) && "bg-slate-200"
          } m-1 p-2 rounded-lg cursor-pointer`}>
          <input
            type="checkbox"
            className="sr-only"
            checked={selectedTagsIds.includes(tag.id)}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedTagsIds([...selectedTagsIds, tag.id]);
              } else {
                setSelectedTagsIds(
                  selectedTagsIds.filter(
                    (selectedTagId) => selectedTagId !== tag.id
                  )
                );
              }
            }}
          />
          {"#" + tag.name}
        </label>
      ))}
    </div>
  );
}
