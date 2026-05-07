import { cache } from "react";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";
import { getAvatarUrl } from "@/lib/utils";
import type { ModuleSummary, ModuleWithItems, Profile } from "@/lib/types";

export const getAuthenticatedContext = cache(async () => {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  let { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    const candidateUsername = String(
      user.user_metadata.username || user.email?.split("@")[0] || `member_${user.id.slice(0, 8)}`
    )
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "")
      .slice(0, 24);

    const fallbackUsername = candidateUsername.length >= 3 ? candidateUsername : `member_${user.id.slice(0, 8)}`;

    const { data: insertedProfile } = await supabase
      .from("profiles")
      .upsert(
        {
          id: user.id,
          username: fallbackUsername,
          full_name: user.user_metadata.full_name ?? null
        },
        {
          onConflict: "id"
        }
      )
      .select("*")
      .single();

    if (!insertedProfile) {
      throw new Error("Unable to create a profile for the authenticated user.");
    }

    profile = insertedProfile as Profile;
  }

  if (!profile) {
    throw new Error("Unable to load the authenticated profile.");
  }

  return {
    supabase,
    user,
    profile: profile as Profile,
    avatarUrl: getAvatarUrl(env.supabaseUrl, profile.avatar_path)
  };
});

export async function getDashboardModules() {
  const { supabase } = await getAuthenticatedContext();
  const { data, error } = await supabase
    .from("group_modules")
    .select(
      "id, name, slug, description, accent_color, sort_order, created_at, module_items(id, starts_at)"
    )
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const modules = (data ?? []).map((moduleRow: any) => {
    const futureItems = (moduleRow.module_items ?? [])
      .map((item: { starts_at: string | null }) => item.starts_at)
      .filter((value: string | null): value is string => Boolean(value))
      .sort((left: string, right: string) => left.localeCompare(right));

    return {
      id: moduleRow.id,
      name: moduleRow.name,
      slug: moduleRow.slug,
      description: moduleRow.description,
      accent_color: moduleRow.accent_color,
      sort_order: moduleRow.sort_order,
      created_at: moduleRow.created_at,
      item_count: (moduleRow.module_items ?? []).length,
      next_item_at: futureItems[0] ?? null
    } satisfies ModuleSummary;
  });

  return modules;
}

export async function getModuleBySlug(slug: string) {
  const { supabase } = await getAuthenticatedContext();
  const { data, error } = await supabase
    .from("group_modules")
    .select(
      "id, name, slug, description, accent_color, sort_order, created_at, module_items(id, module_id, created_by, title, details, location, starts_at, created_at)"
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    description: data.description,
    accent_color: data.accent_color,
    sort_order: data.sort_order,
    created_at: data.created_at,
    items: (data.module_items ?? []).sort((left: any, right: any) => {
      const leftValue = left.starts_at ?? left.created_at;
      const rightValue = right.starts_at ?? right.created_at;
      return leftValue.localeCompare(rightValue);
    })
  } satisfies ModuleWithItems;
}
