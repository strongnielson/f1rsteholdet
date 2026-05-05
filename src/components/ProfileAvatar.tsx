import { getInitials } from "@/lib/utils";

type ProfileAvatarProps = {
  name: string;
  imageUrl?: string | null;
  size?: "sm" | "md" | "lg";
};

export function ProfileAvatar({ name, imageUrl, size = "md" }: ProfileAvatarProps) {
  return (
    <div className={`avatar avatar-${size}`}>
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img alt={name} className="avatar-image" src={imageUrl} />
      ) : (
        <span>{getInitials(name || "FH")}</span>
      )}
    </div>
  );
}

