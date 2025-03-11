"use client";

import { useEffect, useRef } from "react";
import { useScene } from "./SceneContext"; // Utilisation du contexte
import { Ocean } from "@/lib/createOcean"; // Module séparé pour l’océan
import { createGrid } from "@/lib/createGrid"; // Module séparé pour la grille
import { createLights } from "@/lib/createLights"; // Module séparé pour les lumières
import { createFloatingObject } from "@/lib/createFloatingObject"; // Module pour les objets flottants

export default function Water() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { scene, camera, renderer, controls } = useScene();

  useEffect(() => {
    if (!scene || !camera || !renderer || !controls) {
      return; // Si une des valeurs est manquante, on ne continue pas
    }

    const ocean = new Ocean();
    scene.add(ocean.mesh);

    createLights(scene); // Initialisation des lumières
    createGrid(scene); // Création de la grille
    createFloatingObject(scene); // Ajout d’objets flottants

    function loop() {
      requestAnimationFrame(loop);
      ocean.moveWaves();
      if (controls) controls.update(); // Ajout de la vérification ici
      if (renderer && camera) renderer.render(scene, camera);
    }

    loop();

    return () => {
      if (canvasRef.current) {
        canvasRef.current.innerHTML = "";
      }
    };
  }, [scene, camera, renderer, controls]); // Les dépendances incluent tout le nécessaire

  return <div ref={canvasRef} className="absolute w-full h-full" />;
}
