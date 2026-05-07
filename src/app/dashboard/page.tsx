import { createModule } from "@/app/actions";
import { MessageBanner } from "@/components/MessageBanner";
import { ModuleCard } from "@/components/ModuleCard";
import { getAuthenticatedContext, getDashboardModules } from "@/lib/data";

type DashboardPageProps = {
  searchParams: {
    error?: string;
    message?: string;
  };
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const [{ profile }, modules] = await Promise.all([getAuthenticatedContext(), getDashboardModules()]);
  const firstName = (profile.full_name || profile.username).split(" ")[0];

  return (
    <div className="dashboard-columns">
      <section className="dashboard-card">
        <div className="dashboard-heading">
          <div>
            <p className="eyebrow">Overview</p>
            <h1>Hej {firstName}</h1>
            <p>The modules below can hold trips, gatherings, memory drops, or whatever the group needs next.</p>
          </div>
        </div>

        {searchParams.error ? <MessageBanner message={searchParams.error} tone="error" /> : null}
        {searchParams.message ? (
          <MessageBanner message={searchParams.message} tone="success" />
        ) : null}

        <div className="dashboard-grid">
          {modules.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>

        {!modules.length ? (
          <p className="form-note">Create the first module and give the group somewhere to start.</p>
        ) : null}
      </section>

      <aside className="dashboard-card">
        <p className="eyebrow">Create module</p>
        <h2>Open a new room for the group</h2>
        <p>Use modules for trips, monthly meetings, ideas, recaps, or internal traditions.</p>

        <form action={createModule} className="form-stack">
          <div className="field field-dark">
            <label htmlFor="module-name">Module name</label>
            <input id="module-name" name="name" placeholder="Summer trip 2026" required type="text" />
          </div>
          <div className="field field-dark">
            <label htmlFor="module-description">Description</label>
            <textarea
              id="module-description"
              name="description"
              placeholder="What belongs in this module and how should the group use it?"
            />
          </div>
          <div className="field field-dark">
            <label htmlFor="module-accent">Accent color</label>
            <input id="module-accent" name="accentColor" placeholder="#215f9a" type="text" />
          </div>
          <button className="button" type="submit">
            Create module
          </button>
        </form>
      </aside>
    </div>
  );
}
