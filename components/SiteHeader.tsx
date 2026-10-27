import Link from "next/link";

export const SiteHeader = () => {
  return (
    <header className="shrink-0 border-b bg-background pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center px-4 md:px-6">
        <Link
          href="/"
          className="flex min-h-11 items-center text-lg font-semibold tracking-tight"
        >
          Products
        </Link>
      </div>
    </header>
  );
};
