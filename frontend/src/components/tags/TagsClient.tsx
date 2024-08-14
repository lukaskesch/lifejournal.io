"use client";
import React from "react";
import { User, UserTags } from "../../../drizzle/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function TagsClient({
  initialTags,
  createTag,
}: {
  initialTags: UserTags[];
  createTag: (name: string) => Promise<UserTags>;
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
      {tags && tags.map((tag) => <div key={tag.id}>{tag.name}</div>)}
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
                onClick={handleCreateTagButtonClick}
              >
                Add Tag
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
