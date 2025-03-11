import type { Metadata } from "next";
import Water from "@/components/poly/Water";
import "./globals.css";
import { Quantico } from "next/font/google";

const quantico = Quantico({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "700"],
});

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
      <body className={`w-screen h-screen ${quantico.className}`}>
        <Water></Water>
        {children}
      </body>
    </html>
  );
}