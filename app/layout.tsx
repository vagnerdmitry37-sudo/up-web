import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PageContainer } from "@/components/PageContainer";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "UPWeb", template: "%s | UPWeb" },
  description: "Browse and search our products.",
};

const RootLayout = ({ children }: LayoutProps<"/">) => {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="flex h-dvh flex-col overflow-hidden bg-background text-foreground">
        <main className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">
          <PageContainer className="flex flex-1 flex-col py-4 sm:py-6 lg:py-8">
            {children}
          </PageContainer>
        </main>
        <SiteFooter />
      </body>
    </html>
  );
};

export default RootLayout;
