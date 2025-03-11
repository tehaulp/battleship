import * as THREE from "three";

export class Grid {
  scene: THREE.Scene;
  gridSize: number;
  gridWidth: number;
  gridHeight: number;
  position: { x: number; y: number };
  lineSegment: THREE.LineSegments;
  enemy: boolean

  constructor(
    scene: THREE.Scene,
    gridSize: number,
    gridWidth: number,
    gridHeight: number,
    enemy: boolean
  ) {
    this.scene = scene;
    this.gridSize = gridSize;
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;
    this.enemy = enemy;

    if (enemy) {
      this.position = { x: 120, y: 0};
    } else {
      this.position = { x: -120, y: 0 };
    }

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

    this.lineSegment = new THREE.LineSegments(geometry, material);
    this.lineSegment.computeLineDistances(); // Nécessaire pour les pointillés
    this.lineSegment.position.set(this.position.x, 3, this.position.y); // Légèrement au-dessus de l'eau

    // Ajouter à la scène
    scene.add(this.lineSegment);
  }
}
