import { redirect } from "next/navigation";
import { AuthPanel } from "@/components/AuthPanel";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type HomePageProps = {
  searchParams: {
    error?: string;
    message?: string;
  };
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="auth-shell">
      <AuthPanel error={searchParams.error} message={searchParams.message} />
    </main>
  );
}
