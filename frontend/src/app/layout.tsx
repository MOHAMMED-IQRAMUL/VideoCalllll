import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CallKaro",
  description: "Warm editorial video communication workspace",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[var(--color-bg)] text-[var(--color-text-primary)]">
        {children}
      </body>
    </html>
  );
}
