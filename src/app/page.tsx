"use client";

import Section from "@/components/sections/Section";
import { useState } from "react";

export default function Home() {
  const [section, setSection] = useState("home");

  return (
    <main className="w-full h-full flex flex-col">
      <h1 className="text-4xl font-bold">Battleship</h1>

      <Section section={section} changeSection={setSection}></Section>
    </main>
  );
}