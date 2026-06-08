import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RESQR V2",
  description: "SaaS terrain pour jumeaux numeriques, verifications et audit.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
