import type { Metadata } from "next";
import { Lato, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

const lato = Lato({
  weight: ["100", "300", "400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-lato",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Announcement App",
  description:
    "A simple announcement app built with Next.js 13 and TypeScript.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${lato.variable}`}>
      <body
        className={`${lato.className} ${geistMono.variable} antialiased`}
      >
        <SidebarProvider>
          <AppSidebar />
          <main className="flex-1 flex flex-col min-h-svh overflow-hidden">
            <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background px-4">
              <SidebarTrigger className="-ml-1" />
            </header>
            <div className="flex-1 flex flex-col overflow-auto">
              {children}
            </div>
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
