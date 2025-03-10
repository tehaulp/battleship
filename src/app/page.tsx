"use client";

import Section from "@/components/sections/Section";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [section, setSection] = useState("home");

  return (
    <main className="relative w-full h-full flex flex-col z-10 justify-center items-center space-y-20">
      <Image src="/icon-title.png" alt="tet" width={800} height={800} className="drop-shadow-xl px-4 pointer-events-none"></Image>
      <Section section={section} changeSection={setSection}></Section>
    </main>
  );
}