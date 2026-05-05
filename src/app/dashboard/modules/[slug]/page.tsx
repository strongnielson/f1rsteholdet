import Link from "next/link";
import { notFound } from "next/navigation";
import { createModuleItem } from "@/app/actions";
import { MessageBanner } from "@/components/MessageBanner";
import { getModuleBySlug } from "@/lib/data";
import { formatDate } from "@/lib/utils";

type ModuleDetailPageProps = {
  params: {
    slug: string;
  };
  searchParams: {
    error?: string;
    message?: string;
  };
};

export default async function ModuleDetailPage({ params, searchParams }: ModuleDetailPageProps) {
  const moduleData = await getModuleBySlug(params.slug);

  if (!moduleData) {
    notFound();
  }

  return (
    <div className="dashboard-columns">
      <section className="dashboard-card">
        <div className="module-header">
          <Link href="/dashboard">Back to overview</Link>
          <span className="module-pill">
            <span
              className="module-card-accent"
              style={{ background: moduleData.accent_color ?? "#b6522f", width: "1.2rem", height: "1.2rem" }}
            />
            Module
          </span>
          <div>
            <h1>{moduleData.name}</h1>
            <p>{moduleData.description || "A shared stream for the people, plans, and details around this topic."}</p>
          </div>
        </div>

        {searchParams.error ? <MessageBanner message={searchParams.error} tone="error" /> : null}
        {searchParams.message ? (
          <MessageBanner message={searchParams.message} tone="success" />
        ) : null}

        <div className="timeline">
          {moduleData.items.map((item) => (
            <article className="timeline-card" key={item.id}>
              <h3>{item.title}</h3>
              <div className="timeline-meta">
                <span>{formatDate(item.starts_at)}</span>
                <span>{item.location || "Location not set"}</span>
              </div>
              <p>{item.details || "No extra details yet."}</p>
            </article>
          ))}
        </div>

        {!moduleData.items.length ? (
          <p className="form-note">No items yet. Add the first plan, memory, or meeting note on the right.</p>
        ) : null}
      </section>

      <aside className="dashboard-card">
        <p className="eyebrow">New item</p>
        <h2>Add a moment or plan</h2>
        <p>Create entries for upcoming gatherings, travel ideas, meeting agendas, or recap notes.</p>

        <form action={createModuleItem} className="form-stack">
          <input name="moduleId" type="hidden" value={moduleData.id} />
          <input name="moduleSlug" type="hidden" value={moduleData.slug} />
          <div className="field field-dark">
            <label htmlFor="item-title">Title</label>
            <input id="item-title" name="title" placeholder="Friday dinner plan" required type="text" />
          </div>
          <div className="field field-dark">
            <label htmlFor="item-details">Details</label>
            <textarea
              id="item-details"
              name="details"
              placeholder="What should everyone know, bring, or remember?"
            />
          </div>
          <div className="field field-dark">
            <label htmlFor="item-location">Location</label>
            <input id="item-location" name="location" placeholder="Aarhus, Denmark" type="text" />
          </div>
          <div className="field field-dark">
            <label htmlFor="item-starts-at">Date and time</label>
            <input id="item-starts-at" name="startsAt" type="datetime-local" />
          </div>
          <button className="button" type="submit">
            Add item
          </button>
        </form>
      </aside>
    </div>
  );
}

