"use client";

import { type ChangeEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type ProfilePictureUploaderProps = {
  userId: string;
  currentPath: string | null;
};

export function ProfilePictureUploader({ userId, currentPath }: ProfilePictureUploaderProps) {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [status, setStatus] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploading(true);
    setStatus("");

    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const filePath = `${userId}/avatar-${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file, {
      cacheControl: "3600",
      upsert: true
    });

    if (uploadError) {
      setStatus(uploadError.message);
      setUploading(false);
      return;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update({ avatar_path: filePath })
      .eq("id", userId);

    if (profileError) {
      setStatus(profileError.message);
      setUploading(false);
      return;
    }

    if (currentPath && currentPath !== filePath) {
      await supabase.storage.from("avatars").remove([currentPath]);
    }

    setStatus("Profile picture updated.");
    setUploading(false);
    router.refresh();
  }

  return (
    <div className="upload-card">
      <label className="button button-secondary" htmlFor="avatar-upload">
        {uploading ? "Uploading..." : "Upload new profile picture"}
      </label>
      <input
        accept="image/*"
        className="sr-only"
        disabled={uploading}
        id="avatar-upload"
        onChange={handleChange}
        type="file"
      />
      {status ? <p className="upload-status">{status}</p> : null}
    </div>
  );
}
