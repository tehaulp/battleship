"use client";

import { useEffect, useRef } from "react";
import { SceneManager } from "@/lib/SceneManager";

export default function SceneComponent() {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    SceneManager.init();

    if (canvasRef.current) {
      canvasRef.current.appendChild(SceneManager.renderer.domElement);
    }

    SceneManager.loop(canvasRef);

    return () => {
      SceneManager.cleanup();
    };
  }, []);

  return <div ref={canvasRef} className="absolute w-full h-full" />;
}