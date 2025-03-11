import * as THREE from 'three';

export function createGrid(scene: THREE.Scene, gridSize = 20, gridWidth = 10, gridHeight = 10) {
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

  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));

  const material = new THREE.LineDashedMaterial({
    color: 0xcccccc,
    dashSize: 3,
    gapSize: 3,
  });

  const grid = new THREE.LineSegments(geometry, material);
  grid.computeLineDistances();
  grid.position.set(0, 5, 0); // Légèrement au-dessus de l'eau
  scene.add(grid);
}
