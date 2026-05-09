import type { Metadata } from "next";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { TitleBar } from "@/components/layout/title-bar";
import { QueryProvider } from "@/components/providers/query-provider";
import { FocusRestorer } from "@/components/providers/focus-restorer";
import "./globals.css";

export const metadata: Metadata = {
  title: "GameTrack — Premium Gaming Tracker",
  description:
    "Acompanhe sua jornada gamer: biblioteca, estatísticas, tier list e muito mais.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden">
        <QueryProvider>
          <FocusRestorer />
          <TitleBar />
          <div className="hidden md:block">
            <Sidebar />
          </div>
          <main className="md:ml-64 min-h-screen p-4 md:p-8 pb-24 md:pb-8">
            <div className="max-w-[1600px] mx-auto">{children}</div>
          </main>
          <MobileNav />
        </QueryProvider>
      </body>
    </html>
  );
}
