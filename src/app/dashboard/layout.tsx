import type { ReactNode } from "react";
import Link from "next/link";
import { signOut } from "@/app/actions";
import { getAuthenticatedContext } from "@/lib/data";
import { ProfileAvatar } from "@/components/ProfileAvatar";

export default async function DashboardLayout({
  children
}: Readonly<{ children: ReactNode }>) {
  const { profile, avatarUrl } = await getAuthenticatedContext();
  const displayName = profile.full_name || profile.username;

  return (
    <main className="dashboard-shell">
      <nav className="dashboard-nav">
        <div className="brand">
          <span className="brand-mark">F1</span>
          <span>F1rsteholdet</span>
        </div>
        <form action={signOut}>
          <button className="button button-secondary" type="submit">
            Sign out
          </button>
        </form>
      </nav>

      <div className="dashboard-panel">
        <aside className="dashboard-sidebar">
          <div className="dashboard-sidebar-card dashboard-sidebar-card-dark">
            <ProfileAvatar imageUrl={avatarUrl} name={displayName} size="lg" />
            <h2>{displayName}</h2>
            <p>@{profile.username}</p>
          </div>

          <div className="dashboard-sidebar-card">
            <div className="dashboard-sidebar-links">
              <Link href="/dashboard">Overview</Link>
              <Link href="/dashboard/profile">Profile</Link>
              <Link href="/">Public landing page</Link>
            </div>
          </div>
        </aside>

        <section className="dashboard-main">{children}</section>
      </div>
    </main>
  );
}
