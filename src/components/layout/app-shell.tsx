import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NotificationScheduler } from "@/components/notification-scheduler";

export function AppShell({
  children,
  userName,
}: {
  children: React.ReactNode;
  userName: string | null | undefined;
}) {
  return (
    <div className="min-h-dvh bg-background">
      <Sidebar userName={userName} />
      <div className="lg:pl-56">
        <Topbar />
        <main className="mx-auto max-w-5xl px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-10">
          {children}
        </main>
      </div>
      <MobileNav />
      <NotificationScheduler />
    </div>
  );
}
