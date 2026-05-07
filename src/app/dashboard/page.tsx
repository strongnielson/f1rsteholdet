import { MessageBanner } from "@/components/MessageBanner";
import { ItemForm } from "@/components/ItemForm";
import { canManageFiles, canManageUsers, getD1shboardData } from "@/lib/data";
import { formatDate } from "@/lib/utils";

const tripDate = new Date("2027-05-06T00:00:00+02:00");

type DashboardPageProps = {
  searchParams: {
    error?: string;
    message?: string;
  };
};

function getTripCountdown() {
  const diff = tripDate.getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const { profile, files, members } = await getD1shboardData();
  const canCreateItems = canManageFiles(profile);
  const canCreateMembers = canManageUsers(profile);

  return (
    <div className="d1shboard">
      <div className="dashboard-title">
        <h1>D1shboard</h1>
      </div>

      {searchParams.error ? <MessageBanner message={searchParams.error} tone="error" /> : null}
      {searchParams.message ? <MessageBanner message={searchParams.message} tone="success" /> : null}

      <section className="stat-grid">
        <article className="stat-card">
          <span>Antal filer</span>
          <strong>{files.length}</strong>
        </article>
        <article className="stat-card">
          <span>Antal medlemmer</span>
          <strong>{members.length}</strong>
        </article>
        <article className="stat-card">
          <span>Næste tur om:</span>
          <strong>{getTripCountdown()} dage</strong>
        </article>
      </section>

      <section className="data-card">
        <div className="widget-header">
          <h2>Filer</h2>
          {canCreateItems ? (
            <ItemForm />
          ) : (
            <button className="button" disabled type="button">
              + Tilføj fil
            </button>
          )}
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Navn</th>
                <th>Kategori</th>
                <th>Uploadet af</th>
                <th>Uploadet dato</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file.id}>
                  <td>
                    <strong>{file.title}</strong>
                    {file.latest_version?.file_name ? <span>{file.latest_version.file_name}</span> : null}
                  </td>
                  <td>{file.category}</td>
                  <td>{file.uploaded_by}</td>
                  <td>{formatDate(file.created_at)}</td>
                </tr>
              ))}
              {!files.length ? (
                <tr>
                  <td colSpan={4}>Ingen filer endnu.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section className="data-card">
        <div className="widget-header">
          <h2>Medlemmer</h2>
          <button className="button" disabled={!canCreateMembers} type="button">
            + Tilføj medlem
          </button>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Navn</th>
                <th>Adresse</th>
                <th>Tlf</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id}>
                  <td>
                    <strong>{member.full_name || member.email}</strong>
                    <span>{member.role}</span>
                  </td>
                  <td>{member.address || "-"}</td>
                  <td>{member.phone || "-"}</td>
                  <td>{member.email}</td>
                </tr>
              ))}
              {!members.length ? (
                <tr>
                  <td colSpan={4}>Ingen medlemmer endnu.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
