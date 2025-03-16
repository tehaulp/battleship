import type { Metadata } from "next";
import Scene from "@/components/scene/Scene";
import Stage from "@/components/stage/Stage";
import "./globals.css";
import { Quantico } from "next/font/google";

const quantico = Quantico({
  subsets: ["latin"],
  variable: "--font-quantico",
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
        <Scene/>
        <Stage/>
        {children}
      </body>
    </html>
  );
}