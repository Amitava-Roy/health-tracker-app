import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Health Monitoring App",

  description: "A simple health monitoring app",
  generator: "Next.js",
  applicationName: "Health Monitoring App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
