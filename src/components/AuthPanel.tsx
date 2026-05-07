import Link from "next/link";
import { MessageBanner } from "@/components/MessageBanner";
import { signIn, signUp } from "@/app/actions";

type AuthPanelProps = {
  error?: string;
  message?: string;
};

export function AuthPanel({ error, message }: AuthPanelProps) {
  return (
    <section className="auth-card auth-card-light auth-card-centered">
      <div className="auth-header">
        <Link className="brand auth-brand" href="/">
          <span className="brand-mark">F1</span>
          <span>F1rsteholdet</span>
        </Link>
        <p className="eyebrow">Medlemslogin</p>
        <h1>Log ind</h1>
        <p>Fortsæt til F1rsteholdets fælles rum.</p>
      </div>

      {error ? <MessageBanner message={error} tone="error" /> : null}
      {message ? <MessageBanner message={message} tone="success" /> : null}

      <div className="auth-forms">
        <form action={signIn} className="auth-form auth-form-primary">
          <div className="field field-dark">
            <label htmlFor="sign-in-email">Email</label>
            <input id="sign-in-email" name="email" placeholder="navn@email.dk" required type="email" />
          </div>
          <div className="field field-dark">
            <label htmlFor="sign-in-password">Adgangskode</label>
            <input id="sign-in-password" name="password" required type="password" />
          </div>
          <button className="button" type="submit">
            Log ind
          </button>
        </form>

        <details className="signup-panel">
          <summary>Opret ny bruger</summary>
          <form action={signUp} className="auth-form">
            <div className="field field-dark">
              <label htmlFor="sign-up-username">Brugernavn</label>
              <input
                id="sign-up-username"
                maxLength={24}
                name="username"
                pattern="[a-z0-9_]{3,24}"
                placeholder="niels"
                required
                type="text"
              />
            </div>
            <div className="field field-dark">
              <label htmlFor="sign-up-name">Fulde navn</label>
              <input id="sign-up-name" maxLength={60} name="fullName" placeholder="Niels Moller Jensen" type="text" />
            </div>
            <div className="field field-dark">
              <label htmlFor="sign-up-email">Email</label>
              <input id="sign-up-email" name="email" placeholder="navn@email.dk" required type="email" />
            </div>
            <div className="field field-dark">
              <label htmlFor="sign-up-password">Adgangskode</label>
              <input id="sign-up-password" minLength={8} name="password" required type="password" />
            </div>
            <button className="button" type="submit">
              Opret bruger
            </button>
          </form>
        </details>
      </div>
    </section>
  );
}
