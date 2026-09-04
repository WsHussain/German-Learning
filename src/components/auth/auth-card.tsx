import Link from "next/link";

export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-12">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <span className="flex size-6 items-center justify-center bg-primary text-xs font-semibold text-primary-foreground">
          S
        </span>
        <span className="font-display text-sm font-semibold tracking-tight">Studienbuch</span>
      </Link>

      <div className="w-full max-w-sm border border-border bg-card p-6 sm:p-8">
        <h1 className="font-display text-xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        <div className="mt-6">{children}</div>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">{footer}</p>
    </div>
  );
}
