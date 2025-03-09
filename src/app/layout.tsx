import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Battleship",
  description: "Play with your friends online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="w-screen h-screen">{children}</body>
    </html>
  );
}
