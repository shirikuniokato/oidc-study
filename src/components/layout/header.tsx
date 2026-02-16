"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { mainNavItems } from "./navigation-data";

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = useCallback(
    () => setMobileMenuOpen((prev) => !prev),
    [],
  );
  const closeMenu = useCallback(() => setMobileMenuOpen(false), []);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold tracking-tight"
          onClick={closeMenu}
        >
          <Shield size={20} className="text-accent" />
          <span className="hidden sm:inline">OIDC / OAuth 2.0 学習サイト</span>
          <span className="sm:hidden">OIDC / OAuth 2.0</span>
        </Link>

        <DesktopNav pathname={pathname} />

        <button
          type="button"
          onClick={toggleMenu}
          className="text-muted-foreground hover:text-foreground md:hidden"
          aria-label={mobileMenuOpen ? "メニューを閉じる" : "メニューを開く"}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <MobileNav pathname={pathname} onNavigate={closeMenu} />
      )}
    </header>
  );
}

function DesktopNav({ pathname }: { readonly pathname: string }) {
  return (
    <nav className="hidden items-center gap-1 md:flex">
      {mainNavItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm transition-colors",
            pathname.startsWith(item.href)
              ? "bg-accent/10 text-accent"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

function MobileNav({
  pathname,
  onNavigate,
}: {
  readonly pathname: string;
  readonly onNavigate: () => void;
}) {
  return (
    <nav className="border-t border-border bg-background p-4 md:hidden">
      <div className="flex flex-col gap-1">
        {mainNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "rounded-md px-3 py-2 text-sm transition-colors",
              pathname.startsWith(item.href)
                ? "bg-accent/10 text-accent"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export { Header };
