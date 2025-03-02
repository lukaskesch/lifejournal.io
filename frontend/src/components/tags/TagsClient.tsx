"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { UserTagSelect } from "@/types/database-types";
export default function TagsClient({
  initialTags,
  createTag,
}: {
  initialTags: UserTagSelect[];
  createTag: (name: string) => Promise<UserTagSelect>;
}) {
  const [tags, setTags] = React.useState(initialTags);
  const [newTagName, setNewTagName] = React.useState("");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  async function handleCreateTagButtonClick() {
    if (!newTagName) return;
    const newTag = await createTag(newTagName);
    setNewTagName("");
    setTags([...tags, newTag].sort((a, b) => a.name.localeCompare(b.name)));
    setIsDialogOpen(false);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
        {tags &&
          tags
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((tag) => (
              <div key={tag.id} className=" p-4 rounded-md">
                <div className="text-lg">{tag.name}</div>
                <div className="text-sm text-gray-500">
                  Last used: 28/02/2025
                </div>
                <div className="text-sm text-gray-500">
                  Time logged: 10 hours
                </div>
              </div>
            ))}
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <div className="m-4">
            <Button>Add Tag</Button>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Add a Tag</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col">
            <div className="my-4">
              <Input
                placeholder="Tag Name"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                aria-describedby="input-add-tag-description"
              />
              <div id="input-add-tag-description" className="sr-only">
                Enter the name of the tag you want to add.
              </div>
            </div>
            <div className="self-end mt-4">
              <Button
                disabled={!newTagName}
                onClick={handleCreateTagButtonClick}>
                Add Tag
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
