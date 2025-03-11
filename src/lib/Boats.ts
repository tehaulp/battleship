import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as THREE from "three";
import { Ocean } from "./Ocean";
import { Grid } from "./Grid";

export function createBoat(
  position: string,
  boats: THREE.Object3D[],
  scene: THREE.Scene,
  grid: Grid
) {
  const loader = new GLTFLoader();
  loader.load("/assets/models/marine-boat.glb", (glb) => {
    const boat = glb.scene;
    boat.scale.set(2, 2, 2);
    boat.position.set(grid.position.x - (grid.gridSize * grid.gridWidth / 2), 100, grid.position.y - (grid.gridSize * grid.gridHeight / 2));
    boat.rotation.y = (Math.PI / 180) * (Math.random() * 40 + 70);
    boat.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    boats.push(boat);
    scene.add(boat);
  });
}

export function updateboats(boats: THREE.Object3D[], ocean: Ocean) {
  boats.forEach((boat, index) => {
    if (!boat) return;

    const position = ocean.mesh.geometry.attributes.position;
    let minDistance = Infinity;
    let waveHeight = 0;

    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      const z = position.getZ(i);
      const distance = Math.sqrt(
        (boat.position.x - x) ** 2 +
          (boat.position.z - z) ** 2
      );

      if (distance < minDistance) {
        minDistance = distance;
        waveHeight = position.getY(i);
      }
    }

    const time = performance.now() * 0.001;
    boat.rotation.x = Math.sin(time + index) * 0.05;
    boat.rotation.z = Math.cos(time + index) * 0.05;
    boat.position.y += (waveHeight - boat.position.y) * 0.1;
  });
}
