"use client";

import * as THREE from "three";
import { useEffect, useRef } from "react";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export default function Water() {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let controls: OrbitControls;
    let ocean: Ocean;
    let grid: THREE.LineSegments;
    let resizeObserver: ResizeObserver;
    let floatingObjects: THREE.Object3D[] = [];

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

    function createLights() {
      const hemisphereLight = new THREE.HemisphereLight(
        0xaaaaaa,
        0x000000,
        0.9
      );
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
          color: 0x689bc3,
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

          position.setXYZ(
            i,
            vprops.x + Math.cos(vprops.ang),
            vprops.y + Math.sin(vprops.ang) * 2,
            vprops.z
          );
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

    function createGrid() {
      const gridSize = 20; // Taille des cases
      const gridWidth = 10; // Nombre de cases sur l'axe X
      const gridHeight = 10; // Nombre de cases sur l'axe Z

      // Créer un BufferGeometry pour la grille
      const geometry = new THREE.BufferGeometry();
      const positions: number[] = [];

      // Création des lignes horizontales
      for (let i = 0; i <= gridHeight; i++) {
        const z = i * gridSize - (gridHeight * gridSize) / 2;
        positions.push((-gridWidth * gridSize) / 2, 0, z);
        positions.push((gridWidth * gridSize) / 2, 0, z);
      }

      // Création des lignes verticales
      for (let i = 0; i <= gridWidth; i++) {
        const x = i * gridSize - (gridWidth * gridSize) / 2;
        positions.push(x, 0, (-gridHeight * gridSize) / 2);
        positions.push(x, 0, (gridHeight * gridSize) / 2);
      }

      // Appliquer les positions au BufferGeometry
      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3)
      );

      // Créer un matériau pour les lignes en pointillés
      const material = new THREE.LineDashedMaterial({
        color: 0xcccccc,
        dashSize: 3,
        gapSize: 3,
      });

      // Créer la ligne de la grille
      grid = new THREE.LineSegments(geometry, material);
      grid.computeLineDistances(); // Nécessaire pour les pointillés
      grid.position.set(0, 5, 0); // Légèrement au-dessus de l'eau
      scene.add(grid);
    }

    function createFloatingObject(x: number) {
      const loader = new GLTFLoader();
      loader.load("/assets/models/marine-boat.glb", (glb) => {
        const boat = glb.scene;
        boat.scale.set(2, 2, 2);
        boat.position.set(0, 100, x * 40);
        boat.rotation.y = (Math.PI / 180) * (Math.random() * 40 + 70);
        boat.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        floatingObjects.push(boat);
        scene.add(boat);
      });
    }

    function updateFloatingObjects() {
      floatingObjects.forEach((floatingObject, index) => {
        if (!floatingObject) return;

        const position = ocean.mesh.geometry.attributes.position;
        let minDistance = Infinity;
        let waveHeight = 0;

        for (let i = 0; i < position.count; i++) {
          const x = position.getX(i);
          const z = position.getZ(i);
          const distance = Math.sqrt(
            (floatingObject.position.x - x) ** 2 +
              (floatingObject.position.z - z) ** 2
          );

          if (distance < minDistance) {
            minDistance = distance;
            waveHeight = position.getY(i);
          }
        }

        const time = performance.now() * 0.001;
        floatingObject.rotation.x = Math.sin(time + index) * 0.05;
        floatingObject.rotation.z = Math.cos(time + index) * 0.05;
        floatingObject.position.y +=
          (waveHeight - floatingObject.position.y) * 0.1;
      });
    }

    function loop() {
      requestAnimationFrame(loop);
      ocean.moveWaves();
      updateFloatingObjects();
      controls.update();
      renderer.render(scene, camera);
    }

    function init() {
      createScene();
      createLights();
      createOcean();
      createGrid(); // Ajout de la grille
      floatingObjects = [];
      for (let i = 0; i < 3; i++) {
        createFloatingObject(i);
      }
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
