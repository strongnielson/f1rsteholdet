import { cache } from "react";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { DashboardFile, DashboardMember, Profile } from "@/lib/types";

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
          email: user.email ?? "",
          full_name: user.user_metadata.full_name ?? null,
          role: user.email === "strongniels@gmail.com" ? "super_admin" : "member"
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
    profile: profile as Profile
  };
});

export async function getD1shboardData() {
  const { supabase, profile } = await getAuthenticatedContext();

  const [itemsResult, membersResult] = await Promise.all([
    supabase
      .from("items")
      .select(
        "id, title, description, category, access_level, created_at, profiles!items_created_by_fkey(full_name, email), item_versions(file_name, file_path, file_size, mime_type, version_number, created_at)"
      )
      .order("created_at", { ascending: false }),
    supabase
      .from("profiles")
      .select("id, full_name, address, phone, email, role")
      .order("full_name", { ascending: true })
  ]);

  if (itemsResult.error) {
    throw new Error(itemsResult.error.message);
  }

  if (membersResult.error) {
    throw new Error(membersResult.error.message);
  }

  const files = (itemsResult.data ?? []).map((item: any) => {
    const latestVersion = (item.item_versions ?? []).sort(
      (left: any, right: any) => Number(right.version_number) - Number(left.version_number)
    )[0];

    return {
      id: item.id,
      title: item.title,
      description: item.description,
      category: item.category,
      access_level: item.access_level,
      created_at: item.created_at,
      uploaded_by: item.profiles?.full_name || item.profiles?.email || "Ukendt",
      latest_version: latestVersion
        ? {
            file_name: latestVersion.file_name,
            file_path: latestVersion.file_path,
            file_size: latestVersion.file_size,
            mime_type: latestVersion.mime_type
          }
        : null
    } satisfies DashboardFile;
  });

  const members = (membersResult.data ?? []) as DashboardMember[];

  return {
    profile: profile as Profile,
    files,
    members
  };
}

export function canManageFiles(profile: Profile) {
  return profile.role === "super_admin" || profile.role === "admin";
}

export function canManageUsers(profile: Profile) {
  return profile.role === "super_admin";
}
