import * as THREE from 'three';

export function createLights(scene: THREE.Scene) {
  const hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);
  const shadowLight = new THREE.DirectionalLight(0xffffff, 0.9);
  
  // Positionner la lumière directionnelle pour créer des ombres réalistes
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

  // Ajouter les lumières à la scène
  scene.add(hemisphereLight, shadowLight);
}
