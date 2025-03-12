"use client";

import Section from "@/components/sections/Section";
import { useState } from "react";

export default function Home() {
  const [section, setSection] = useState("home");

  return (
    <main className="relative w-full h-full flex flex-col z-10 justify-center items-center space-y-20">
      <Section section={section} changeSection={setSection}></Section>
    </main>
  );
}