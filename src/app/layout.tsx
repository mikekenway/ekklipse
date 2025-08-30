import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { ConvexProviderWrapper } from "@/components/convex-provider";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ekklipse",
  description: "Simple code bin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ConvexProviderWrapper>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            <div className="min-h-screen flex flex-col">
              <header className="flex items-center justify-between p-4">
                <Link href="/" className="font-bold">
                  ek(klip)se
                </Link>
                <ThemeToggle />
              </header>
              <main className="flex-1">{children}</main>
            </div>
          </ThemeProvider>
        </ConvexProviderWrapper>
      </body>
    </html>
  );
}
