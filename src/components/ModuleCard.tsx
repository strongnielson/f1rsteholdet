import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { ModuleSummary } from "@/lib/types";

type ModuleCardProps = {
  module: ModuleSummary;
};

export function ModuleCard({ module }: ModuleCardProps) {
  return (
    <Link className="module-card" href={`/dashboard/modules/${module.slug}`}>
      <div className="module-card-accent" style={{ background: module.accent_color ?? "#b6522f" }} />
      <div className="module-card-copy">
        <p className="eyebrow">Module</p>
        <h3>{module.name}</h3>
        <p>{module.description || "A shared space for plans, updates, and memories."}</p>
      </div>
      <div className="module-card-meta">
        <span>{module.item_count} items</span>
        <span>{formatDate(module.next_item_at)}</span>
      </div>
    </Link>
  );
}

