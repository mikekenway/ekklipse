import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { ConvexProviderWrapper } from "@/components/convex-provider";

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
            <div className="min-h-screen">
              <div className="absolute top-4 right-4">
                <ThemeToggle />
              </div>
              <main>{children}</main>
            </div>
          </ThemeProvider>
        </ConvexProviderWrapper>
      </body>
    </html>
  );
}
