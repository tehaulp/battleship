"use client";

import * as THREE from "three";
import { Ocean, createOcean } from "@/lib/Ocean";
import { useEffect, useRef } from "react";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { createLights } from "@/lib/Lights";
import { Grid } from "@/lib/Grid";
import { createBoat, updateboats } from "@/lib/Boats";

export default function Scene() {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let controls: OrbitControls;
    let ocean: Ocean;
    const grids: {[side: string]: Grid} = {};
    let resizeObserver: ResizeObserver;
    let boats: THREE.Object3D[] = [];

    function createScene() {
      scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);

      const aspectRatio = getCanvasAspectRatio();
      camera = new THREE.PerspectiveCamera(60, aspectRatio, 1, 10000);
      camera.position.set(0, 210, 190);
      camera.lookAt(0, 0, 0);

      renderer = new THREE.WebGLRenderer({ alpha: true });
      updateRendererSize();

      if (canvasRef.current) {
        canvasRef.current.innerHTML = "";
        canvasRef.current.appendChild(renderer.domElement);
      }

      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.minDistance = 50;
      controls.maxDistance = 1000;
      controls.maxPolarAngle = Math.PI / 2;
    }

    function getCanvasSize() {
      if (!canvasRef.current)
        return { width: window.innerWidth, height: window.innerHeight };
      return {
        width: canvasRef.current.clientWidth,
        height: canvasRef.current.clientHeight,
      };
    }

    function getCanvasAspectRatio() {
      const { width, height } = getCanvasSize();
      return width / height;
    }

    function updateRendererSize() {
      const { width, height } = getCanvasSize();
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    function loop() {
      requestAnimationFrame(loop);
      ocean.moveWaves();
      updateboats(boats, ocean);
      controls.update();
      renderer.render(scene, camera);
    }

    function init() {
      createScene();
      createLights(scene);
      ocean = createOcean(scene);
      grids['ally'] = new Grid(scene, 20, 10, 10, false);
      grids['enemy'] = new Grid(scene, 20, 10, 10, true);
      boats = [];
      createBoat('A1', boats, scene, grids['ally']);
      loop();

      resizeObserver = new ResizeObserver(() => updateRendererSize());
      if (canvasRef.current) resizeObserver.observe(canvasRef.current);
    }

    init();

    return () => {
      resizeObserver?.disconnect();
      if (canvasRef.current) canvasRef.current.innerHTML = "";
    };
  }, []);

  return <div ref={canvasRef} className="absolute w-full h-full" />;
}
