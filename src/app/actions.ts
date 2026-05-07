"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

const categories = new Set(["Vedtægter", "Referater", "Anekdoter", "Ture", "Dokumenter", "Nyheder", "Andet"]);
const accessLevels = new Set(["all", "admins"]);

function withQuery(path: string, key: string, value: string) {
  const params = new URLSearchParams({ [key]: value });
  return `${path}?${params.toString()}`;
}

function canManageFiles(profile: Pick<Profile, "role">) {
  return profile.role === "super_admin" || profile.role === "admin";
}

function cleanFileName(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function getSignedInProfile() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    redirect(withQuery("/", "error", "Profilen kunne ikke findes."));
  }

  return {
    supabase,
    user,
    profile: profile as Profile
  };
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

export async function signOut() {
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function createItem(formData: FormData) {
  const { supabase, user, profile } = await getSignedInProfile();

  if (!canManageFiles(profile)) {
    redirect(withQuery("/dashboard", "error", "Du har ikke adgang til at oprette items."));
  }

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "");
  const accessLevel = String(formData.get("accessLevel") ?? "all");
  const file = formData.get("file");

  if (!title || !categories.has(category) || !accessLevels.has(accessLevel)) {
    redirect(withQuery("/dashboard", "error", "Udfyld titel, kategori og adgang."));
  }

  if (!(file instanceof File) || file.size === 0) {
    redirect(withQuery("/dashboard", "error", "Vælg en fil før du gemmer itemet."));
  }

  const itemId = crypto.randomUUID();
  const fileName = cleanFileName(file.name) || "fil";
  const filePath = `${itemId}/v1-${Date.now()}-${fileName}`;

  const { error: fileError } = await supabase.storage.from("documents").upload(filePath, file, {
    cacheControl: "3600",
    upsert: false
  });

  if (fileError) {
    redirect(withQuery("/dashboard", "error", fileError.message));
  }

  const { error: itemError } = await supabase.from("items").insert({
    id: itemId,
    title,
    description: description || null,
    category,
    access_level: accessLevel,
    created_by: user.id
  });

  if (itemError) {
    await supabase.storage.from("documents").remove([filePath]);
    redirect(withQuery("/dashboard", "error", itemError.message));
  }

  const { error: versionError } = await supabase.from("item_versions").insert({
    item_id: itemId,
    version_number: 1,
    file_path: filePath,
    file_name: file.name,
    file_size: file.size,
    mime_type: file.type || null,
    change_note: "Første version",
    created_by: user.id
  });

  if (versionError) {
    redirect(withQuery("/dashboard", "error", versionError.message));
  }

  revalidatePath("/dashboard");
  redirect(withQuery("/dashboard", "message", "Itemet er gemt."));
}

export async function updateProfile(formData: FormData) {
  const { supabase, user } = await getSignedInProfile();
  const fullName = String(formData.get("fullName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName || null,
      phone: phone || null,
      address: address || null
    })
    .eq("id", user.id);

  if (error) {
    redirect(withQuery("/dashboard", "error", error.message));
  }

  revalidatePath("/dashboard");
  redirect(withQuery("/dashboard", "message", "Profilen er opdateret."));
}
