import { PageContainer } from "@/components/PageContainer";
import { SearchMenu } from "@/components/SearchMenu";

export const SiteFooter = () => {
  return (
    <footer className="shrink-0 border-t bg-background pb-[env(safe-area-inset-bottom)]">
      <PageContainer className="flex h-16 items-center justify-between gap-4 text-sm text-muted-foreground">
        UPWeb
        <SearchMenu />
      </PageContainer>
    </footer>
  );
};
