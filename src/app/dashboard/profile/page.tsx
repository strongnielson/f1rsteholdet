import { MessageBanner } from "@/components/MessageBanner";
import { ProfileAvatar } from "@/components/ProfileAvatar";
import { ProfilePictureUploader } from "@/components/ProfilePictureUploader";
import { getAuthenticatedContext } from "@/lib/data";
import { updateProfile } from "@/app/actions";

type ProfilePageProps = {
  searchParams: {
    error?: string;
    message?: string;
  };
};

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const { user, profile, avatarUrl } = await getAuthenticatedContext();
  const displayName = profile.full_name || profile.username;

  return (
    <div className="profile-grid">
      <aside className="profile-card">
        <p className="eyebrow">Profile</p>
        <ProfileAvatar imageUrl={avatarUrl} name={displayName} size="lg" />
        <div className="profile-meta">
          <strong>{displayName}</strong>
          <span>@{profile.username}</span>
          <span>{user.email}</span>
        </div>
        <ProfilePictureUploader currentPath={profile.avatar_path} userId={user.id} />
      </aside>

      <section className="profile-card">
        <p className="eyebrow">Edit details</p>
        <h1>Keep your member card up to date</h1>
        <p>This is the identity the rest of the group will see throughout the app.</p>

        {searchParams.error ? <MessageBanner message={searchParams.error} tone="error" /> : null}
        {searchParams.message ? (
          <MessageBanner message={searchParams.message} tone="success" />
        ) : null}

        <form action={updateProfile} className="form-stack">
          <div className="field field-dark">
            <label htmlFor="profile-username">Username</label>
            <input
              defaultValue={profile.username}
              id="profile-username"
              maxLength={24}
              name="username"
              pattern="[a-z0-9_]{3,24}"
              required
              type="text"
            />
          </div>
          <div className="field field-dark">
            <label htmlFor="profile-full-name">Full name</label>
            <input defaultValue={profile.full_name ?? ""} id="profile-full-name" maxLength={60} name="fullName" type="text" />
          </div>
          <div className="field field-dark">
            <label htmlFor="profile-bio">Bio</label>
            <textarea
              defaultValue={profile.bio ?? ""}
              id="profile-bio"
              name="bio"
              placeholder="A few words about what you bring to the group."
            />
          </div>
          <button className="button" type="submit">
            Save profile
          </button>
        </form>
      </section>
    </div>
  );
}
