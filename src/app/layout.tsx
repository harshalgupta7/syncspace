import type { Metadata } from "next";
import { AppHeroUIProvider } from "@/components/providers/heroui-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "SyncSpace",
  description: "Local-first collaborative knowledge workspace"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppHeroUIProvider>{children}</AppHeroUIProvider>
      </body>
    </html>
  );
}
