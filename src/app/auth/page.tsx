import Link from "next/link";
import { redirect } from "next/navigation";
import { MessageBanner } from "@/components/MessageBanner";
import { signIn, signUp } from "@/app/actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type AuthPageProps = {
  searchParams: {
    error?: string;
    message?: string;
  };
};

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="auth-shell">
      <div className="auth-grid">
        <section className="auth-card auth-card-dark">
          <p className="eyebrow">Member access</p>
          <h1>Welcome back to F1rsteholdet.</h1>
          <p>
            Sign in to continue the trip planning, keep the meetings moving, and add the moments
            nobody wants forgotten.
          </p>
          <div className="hero-panel-card">
            <strong>How the setup works</strong>
            <p>
              Members sign in with email and password, then carry a visible username and profile
              picture inside the app.
            </p>
          </div>
          <p>
            <Link href="/">Back to the landing page</Link>
          </p>
        </section>

        <section className="auth-card auth-card-light">
          <p className="eyebrow">Start here</p>
          <h2>Create account or sign in</h2>

          {searchParams.error ? <MessageBanner message={searchParams.error} tone="error" /> : null}
          {searchParams.message ? (
            <MessageBanner message={searchParams.message} tone="success" />
          ) : null}

          <div className="auth-forms">
            <form action={signIn} className="auth-form">
              <div className="field field-dark">
                <label htmlFor="sign-in-email">Email</label>
                <input id="sign-in-email" name="email" placeholder="crew@example.com" required type="email" />
              </div>
              <div className="field field-dark">
                <label htmlFor="sign-in-password">Password</label>
                <input id="sign-in-password" name="password" required type="password" />
              </div>
              <button className="button" type="submit">
                Sign in
              </button>
            </form>

            <form action={signUp} className="auth-form">
              <div className="field field-dark">
                <label htmlFor="sign-up-username">Username</label>
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
                <label htmlFor="sign-up-name">Full name</label>
                <input id="sign-up-name" maxLength={60} name="fullName" placeholder="Niels Moller Jensen" type="text" />
              </div>
              <div className="field field-dark">
                <label htmlFor="sign-up-email">Email</label>
                <input id="sign-up-email" name="email" placeholder="crew@example.com" required type="email" />
              </div>
              <div className="field field-dark">
                <label htmlFor="sign-up-password">Password</label>
                <input id="sign-up-password" minLength={8} name="password" required type="password" />
              </div>
              <button className="button" type="submit">
                Create account
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
