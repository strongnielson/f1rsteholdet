import Link from "next/link";

const highlights = [
  {
    title: "Trips that actually happen",
    body: "Collect plans, dates, locations, and notes inside dedicated modules so every getaway has one shared home."
  },
  {
    title: "Meetings without chaos",
    body: "Keep practical details visible for everyone and stop losing decisions in scattered chats."
  },
  {
    title: "Moments worth keeping",
    body: "Turn good memories into a living archive the group can keep adding to over time."
  }
];

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero">
        <nav className="hero-nav">
          <div className="brand">
            <span className="brand-mark">F1</span>
            <span>F1rsteholdet</span>
          </div>
          <Link className="button button-secondary" href="/auth">
            Member login
          </Link>
        </nav>

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Trips. Meetings. Great moments.</p>
            <h1>A shared home for the crew.</h1>
            <p>
              F1rsteholdet is built to make the group feel tighter, not busier. Every module becomes
              a place to plan, remember, and keep momentum together.
            </p>
            <div className="hero-actions">
              <Link className="button" href="/auth">
                Enter the clubhouse
              </Link>
              <a className="button button-ghost" href="#how-it-works">
                See the setup
              </a>
            </div>
            <div className="hero-metrics">
              <div className="metric-card">
                <strong>Modules</strong>
                <span>Trips, meetings, memories, side missions</span>
              </div>
              <div className="metric-card">
                <strong>Members</strong>
                <span>Profiles with usernames, bios, and avatars</span>
              </div>
              <div className="metric-card">
                <strong>Moments</strong>
                <span>Every item becomes part of the group story</span>
              </div>
            </div>
          </div>

          <aside className="hero-panel">
            <div className="hero-panel-card">
              <p className="eyebrow">Inside the app</p>
              <strong>Weekend in Aarhus</strong>
              <p>Travel times, who is bringing what, and the plan for Friday night all in one place.</p>
            </div>
            <div className="hero-panel-card">
              <p className="eyebrow">Shared rhythm</p>
              <strong>Monthly meetup</strong>
              <p>Keep the next gathering visible so the group stays active without chasing people down.</p>
            </div>
            <div className="hero-panel-card">
              <p className="eyebrow">Built for continuity</p>
              <strong>Memory bank</strong>
              <p>Capture stories, dates, and the small details that make the friendship feel lived-in.</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="section-shell" id="how-it-works">
        <div className="section-copy">
          <p className="eyebrow">Structure</p>
          <h2>Everything is organized in modules.</h2>
          <p>
            Each module is a container for a theme. You can keep one for trips, one for meetings,
            one for memories, or shape them however the group likes.
          </p>
        </div>
        <div className="section-grid">
          {highlights.map((highlight) => (
            <article className="section-card" key={highlight.title}>
              <h3>{highlight.title}</h3>
              <p>{highlight.body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

