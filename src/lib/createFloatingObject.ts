import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export function createFloatingObject(
  scene: THREE.Scene,
  modelUrl: string = '/assets/models/marine-boat.glb',
  scale: number = 2,
  xPosition: number = 0,
  yPosition: number = 100,
  zPosition: number = 0,
  rotationY: number = 70
) {
  const loader = new GLTFLoader();

  loader.load(modelUrl, (glb) => {
    const boat = glb.scene;
    boat.scale.set(scale, scale, scale);
    boat.position.set(xPosition, yPosition, zPosition);
    boat.rotation.y = (Math.PI / 180) * (Math.random() * 40 + rotationY);

    boat.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    scene.add(boat);
  });
}
