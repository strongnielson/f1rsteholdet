export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  role: "super_admin" | "admin" | "member";
  created_at: string;
  updated_at: string;
};

export type DashboardFile = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  access_level: "all" | "admins";
  created_at: string;
  uploaded_by: string;
  latest_version: {
    file_name: string | null;
    file_path: string | null;
    file_size: number | null;
    mime_type: string | null;
  } | null;
};

export type DashboardMember = {
  id: string;
  full_name: string | null;
  address: string | null;
  phone: string | null;
  email: string;
  role: "super_admin" | "admin" | "member";
};
