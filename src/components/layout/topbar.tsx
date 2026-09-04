"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Mic, CalendarDays, Settings, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";

import { GlobalSearchTrigger } from "@/components/layout/global-search-trigger";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const MORE_ITEMS = [
  { label: "Speaking practice", href: "/speaking", icon: Mic },
  { label: "Calendar", href: "/calendar", icon: CalendarDays },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Topbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const title = pathname.split("/")[1] || "dashboard";

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur lg:px-8">
      <span className="font-display text-sm font-medium capitalize text-foreground lg:hidden">
        {title}
      </span>
      <span className="hidden font-display text-sm font-medium capitalize text-muted-foreground lg:inline">
        {title}
      </span>

      <div className="flex items-center gap-2">
        <GlobalSearchTrigger />

        <div className="lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" aria-label="More">
                  <Menu className="size-4" />
                </Button>
              }
            />
            <SheetContent side="right" className="w-64">
              <SheetHeader>
                <SheetTitle>Studienbuch</SheetTitle>
              </SheetHeader>
              <nav className="mt-4 flex flex-col gap-1 px-4">
                {MORE_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted"
                  >
                    <item.icon className="size-4" />
                    {item.label}
                  </Link>
                ))}
                <div className="mt-2 flex items-center justify-between border-t border-border px-3 pt-3">
                  <span className="text-sm text-muted-foreground">Theme</span>
                  <ThemeToggle />
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="mt-1 flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="size-4" />
                  Sign out
                </button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
