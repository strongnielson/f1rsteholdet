"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

function withQuery(path: string, key: string, value: string) {
  const params = new URLSearchParams({ [key]: value });
  return `${path}?${params.toString()}`;
}

function normalizeUsername(value: string) {
  return value.trim().toLowerCase();
}

function isValidUsername(value: string) {
  return /^[a-z0-9_]{3,24}$/.test(value);
}

export async function signIn(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    redirect(withQuery("/", "error", "Email eller adgangskode er ikke korrekt."));
  }

  redirect("/dashboard");
}

export async function signUp(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const headerStore = headers();
  const origin = headerStore.get("origin") ?? "http://localhost:3000";

  const username = normalizeUsername(String(formData.get("username") ?? ""));
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!isValidUsername(username)) {
    redirect(withQuery("/", "error", "Brugernavn skal være 3-24 tegn og må kun indeholde bogstaver, tal eller underscore."));
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        full_name: fullName
      },
      emailRedirectTo: `${origin}/auth/callback`
    }
  });

  if (error) {
    redirect(withQuery("/", "error", error.message));
  }

  if (!data.session) {
    redirect(withQuery("/", "message", "Bruger oprettet. Tjek din mail for at bekræfte login."));
  }

  redirect("/dashboard");
}

export async function signOut() {
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function createModule(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const accentColor = String(formData.get("accentColor") ?? "#215f9a").trim();

  if (!name) {
    redirect(withQuery("/dashboard", "error", "Module name is required."));
  }

  const baseSlug = slugify(name);
  let slug = baseSlug || `module-${Date.now()}`;
  let suffix = 1;

  while (true) {
    const { data: existing } = await supabase
      .from("group_modules")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (!existing) {
      break;
    }

    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }

  const { error } = await supabase.from("group_modules").insert({
    name,
    slug,
    description: description || null,
    accent_color: accentColor || null,
    created_by: user.id
  });

  if (error) {
    redirect(withQuery("/dashboard", "error", error.message));
  }

  revalidatePath("/dashboard");
  redirect(withQuery("/dashboard", "message", "Module created."));
}

export async function createModuleItem(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const moduleId = String(formData.get("moduleId") ?? "");
  const moduleSlug = String(formData.get("moduleSlug") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const details = String(formData.get("details") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const startsAt = String(formData.get("startsAt") ?? "").trim();

  if (!moduleId || !moduleSlug || !title) {
    redirect(withQuery(`/dashboard/modules/${moduleSlug}`, "error", "Item title is required."));
  }

  const { error } = await supabase.from("module_items").insert({
    module_id: moduleId,
    created_by: user.id,
    title,
    details,
    location: location || null,
    starts_at: startsAt || null
  });

  if (error) {
    redirect(withQuery(`/dashboard/modules/${moduleSlug}`, "error", error.message));
  }

  revalidatePath(`/dashboard/modules/${moduleSlug}`);
  revalidatePath("/dashboard");
  redirect(withQuery(`/dashboard/modules/${moduleSlug}`, "message", "Item added."));
}

export async function updateProfile(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const username = normalizeUsername(String(formData.get("username") ?? ""));
  const fullName = String(formData.get("fullName") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();

  if (!isValidUsername(username)) {
    redirect(
      withQuery(
        "/dashboard/profile",
        "error",
        "Username must be 3-24 characters using only letters, numbers, or underscores."
      )
    );
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      username,
      full_name: fullName || null,
      bio: bio || null
    })
    .eq("id", user.id);

  if (error) {
    redirect(withQuery("/dashboard/profile", "error", error.message));
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/profile");
  redirect(withQuery("/dashboard/profile", "message", "Profile updated."));
}
