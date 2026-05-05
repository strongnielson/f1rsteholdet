export type Profile = {
  id: string;
  username: string;
  full_name: string | null;
  bio: string | null;
  avatar_path: string | null;
  created_at: string;
  updated_at: string;
};

export type ModuleSummary = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  accent_color: string | null;
  sort_order: number;
  created_at: string;
  item_count: number;
  next_item_at: string | null;
};

export type ModuleItem = {
  id: string;
  module_id: string;
  created_by: string | null;
  title: string;
  details: string;
  location: string | null;
  starts_at: string | null;
  created_at: string;
};

export type ModuleWithItems = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  accent_color: string | null;
  sort_order: number;
  created_at: string;
  items: ModuleItem[];
};

