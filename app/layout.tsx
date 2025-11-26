import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nutrition Tracker",
  description: "Created by Radike",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-vanilla text-gray-900 min-h-screen">{children}</body>
    </html>
  );
}
