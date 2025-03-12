"use client";

import { useEffect, useRef } from "react";
import { SceneManager } from "@/lib/SceneManager";

export default function SceneComponent() {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialisation de la scène
    SceneManager.init();

    // Ajouter le renderer à l'élément DOM
    if (canvasRef.current) {
      canvasRef.current.appendChild(SceneManager.renderer.domElement);
    }

    // Démarrer l'animation de la scène
    SceneManager.loop(canvasRef);

    return () => {
      SceneManager.cleanup();
    };
  }, []);

  return <div ref={canvasRef} className="absolute w-full h-full" />;
}