"use client";

import Section from "@/components/sections/Section";
import { SceneManager } from "@/lib/SceneManager";
import { useState } from "react";
import AudioPlayer from "@/components/audio/AudioPlayer";

export default function Home() {
  const [section, setSection] = useState("home");

  function changeSection(section: string) {
    if (section == "home") {
      SceneManager.removeAllGrids();
    }
    setSection(section);
  }

  return (
    <main className="relative w-full h-full flex flex-col z-10 justify-center items-center space-y-20">
      <AudioPlayer></AudioPlayer>
      <Section section={section} changeSection={changeSection}></Section>
    </main>
  );
}
