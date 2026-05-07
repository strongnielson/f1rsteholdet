import type { ReactNode } from "react";
import Link from "next/link";
import { signOut, updateProfile } from "@/app/actions";
import { ProfileAvatar } from "@/components/ProfileAvatar";
import { getAuthenticatedContext } from "@/lib/data";

export default async function DashboardLayout({
  children
}: Readonly<{ children: ReactNode }>) {
  const { profile } = await getAuthenticatedContext();
  const displayName = profile.full_name || profile.email;

  return (
    <main className="app-shell">
      <aside className="app-sidebar">
        <div className="sidebar-brand">
          <span className="brand-mark">F1</span>
          <span>F1rsteholdet</span>
        </div>

        <nav className="sidebar-nav" aria-label="Primær navigation">
          <Link className="sidebar-link sidebar-link-active" href="/dashboard">
            <span aria-hidden="true">▦</span>
            <span>D1shboard</span>
          </Link>
        </nav>

        <section className="sidebar-profile">
          <ProfileAvatar name={displayName} size="md" />
          <div className="profile-lines">
            <strong>{displayName}</strong>
            <span>{profile.address || "Adresse mangler"}</span>
            <span>{profile.phone || "Telefon mangler"}</span>
            <span>{profile.email}</span>
          </div>

          <details className="profile-edit">
            <summary>Rediger profil</summary>
            <form action={updateProfile} className="profile-edit-form">
              <input name="fullName" placeholder="Fulde navn" defaultValue={profile.full_name ?? ""} />
              <input name="address" placeholder="Adresse" defaultValue={profile.address ?? ""} />
              <input name="phone" placeholder="Telefon" defaultValue={profile.phone ?? ""} />
              <button className="button button-secondary" type="submit">
                Gem
              </button>
            </form>
          </details>

          <form action={signOut}>
            <button className="sidebar-plain-button" type="submit">
              Log ud
            </button>
          </form>
        </section>
      </aside>

      <section className="app-content">{children}</section>
    </main>
  );
}
