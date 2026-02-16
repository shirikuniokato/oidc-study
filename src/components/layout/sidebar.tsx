"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { getSectionFromPath, sidebarSections } from "./navigation-data";

function Sidebar() {
  const pathname = usePathname();
  const sectionKey = getSectionFromPath(pathname);

  if (!sectionKey) return null;

  const section = sidebarSections[sectionKey];
  if (!section) return null;

  return (
    <aside className="hidden w-56 shrink-0 lg:block">
      <nav className="sticky top-20">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {section.title}
        </h3>
        <ul className="flex flex-col gap-0.5">
          {section.items.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "block rounded-md px-3 py-1.5 text-sm transition-colors",
                    isActive
                      ? "bg-accent/10 font-medium text-accent"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

export { Sidebar };
