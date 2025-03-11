"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as THREE from 'three';

interface SceneContextType {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera | null;
  renderer: THREE.WebGLRenderer | null;
  controls: OrbitControls | null; // OrbitControls peut être null jusqu'à son initialisation
}

interface SceneProviderProps {
  children: ReactNode; // Ajout de children avec le type ReactNode
}

const SceneContext = createContext<SceneContextType | null>(null);

export const SceneProvider: React.FC<SceneProviderProps> = ({ children }) => {
  const [scene] = useState<THREE.Scene>(new THREE.Scene());
  const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null);
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null); // Utilisation de useRef pour garder l'instance

  useEffect(() => {
    // Initialisation de la scène, caméra, etc.
    const newCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
    newCamera.position.set(0, 210, 190);
    newCamera.lookAt(0, 0, 0);

    const newRenderer = new THREE.WebGLRenderer({ alpha: true });
    newRenderer.setSize(window.innerWidth, window.innerHeight);

    // Mise à jour de l'état de la caméra et du renderer
    setCamera(newCamera);
    setRenderer(newRenderer);

    // Initialisation de OrbitControls après la création de la caméra et du renderer
    controlsRef.current = new OrbitControls(newCamera, newRenderer.domElement);
    controlsRef.current.enableDamping = true;
    controlsRef.current.dampingFactor = 0.05;
    controlsRef.current.minDistance = 50;
    controlsRef.current.maxDistance = 1000;
    controlsRef.current.maxPolarAngle = Math.PI / 2;

    // Cleanup
    return () => {
      newRenderer.dispose();
      controlsRef.current?.dispose(); // On nettoie les contrôles lors du démontage
    };
  }, []); // Ne s'exécute qu'une seule fois lors du montage du composant

  return (
    <SceneContext.Provider value={{ scene, camera, renderer, controls: controlsRef.current }}>
      {children}
    </SceneContext.Provider>
  );
};

export const useScene = () => {
  const context = useContext(SceneContext);
  if (!context) throw new Error('useScene must be used within a SceneProvider');
  
  // Ajout d'une vérification pour nous assurer que `camera` et `renderer` ne sont pas `null`
  if (!context.camera || !context.renderer) {
    throw new Error('Camera or renderer is not initialized yet');
  }

  return context;
};