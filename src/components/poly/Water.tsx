"use client";

import * as THREE from "three";
import { useEffect, useRef } from "react";

export default function Water() {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let ocean: Ocean;
    let resizeObserver: ResizeObserver;

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
    }

    function getCanvasSize() {
      if (!canvasRef.current) return { width: window.innerWidth, height: window.innerHeight };
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

    function createLights() {
      const hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);
      const shadowLight = new THREE.DirectionalLight(0xffffff, 0.9);
      shadowLight.position.set(-150, 350, 350);
      shadowLight.castShadow = true;
      shadowLight.shadow.camera.left = -400;
      shadowLight.shadow.camera.right = 400;
      shadowLight.shadow.camera.top = 400;
      shadowLight.shadow.camera.bottom = -400;
      shadowLight.shadow.camera.near = 1;
      shadowLight.shadow.camera.far = 1000;
      shadowLight.shadow.mapSize.width = 2048;
      shadowLight.shadow.mapSize.height = 2048;

      scene.add(hemisphereLight, shadowLight);
    }

    class Ocean {
      mesh: THREE.Mesh;
      waves: { x: number; y: number; z: number; ang: number; speed: number }[];

      constructor() {
        const geom = new THREE.PlaneGeometry(1500, 1500, 50, 50);
        geom.rotateX(-Math.PI / 2);

        this.waves = [];
        const position = geom.attributes.position;
        const usedVertices = new Set();

        for (let i = 0; i < position.count; i++) {
          const x = position.getX(i);
          const y = position.getY(i);
          const z = position.getZ(i);

          const key = `${x},${y},${z}`;
          if (!usedVertices.has(key)) {
            this.waves.push({
              x,
              y,
              z,
              ang: Math.random() * Math.PI * 2,
              speed: 0.016 + Math.random() * 0.032,
            });
            usedVertices.add(key);
          }
        }

        const mat = new THREE.MeshPhongMaterial({
          color: 0x689BC3,
          transparent: true,
          flatShading: true,
        });

        this.mesh = new THREE.Mesh(geom, mat);
        this.mesh.receiveShadow = true;
      }

      moveWaves() {
        const position = this.mesh.geometry.attributes.position;
        for (let i = 0; i < this.waves.length; i++) {
          const vprops = this.waves[i];

          position.setXYZ(i, vprops.x + Math.cos(vprops.ang), vprops.y + Math.sin(vprops.ang) * 2, vprops.z);
          vprops.ang += vprops.speed;
        }
        position.needsUpdate = true;
      }
    }

    function createOcean() {
      ocean = new Ocean();
      ocean.mesh.position.set(0, 0, 0);
      scene.add(ocean.mesh);
    }

    function loop() {
      requestAnimationFrame(loop);
      ocean.moveWaves();
      renderer.render(scene, camera);
    }

    function init() {
      createScene();
      createLights();
      createOcean();
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