import { SearchMenu } from "@/components/SearchMenu";

export const SiteFooter = () => {
  return (
    <footer className="shrink-0 border-t bg-background pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-4 px-4 text-sm text-muted-foreground md:px-6">
        UPWeb
        <SearchMenu />
      </div>
    </footer>
  );
};
