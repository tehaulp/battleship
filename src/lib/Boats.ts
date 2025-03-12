import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as THREE from "three";
import { Ocean } from "./Ocean";
import { Grid } from "./Grid";

function calculatePosition(cell: string, grid: Grid) {
  // Vérifier que le format est valide (1 lettre + 1 ou 2 chiffres)
  const match = cell.match(/^([A-J])(10|[1-9])$/);
  if (!match) {
    throw new Error("Cellule invalide : doit être entre 'A1' et 'J10'");
  }

  // Extraire la colonne (lettre) et la ligne (chiffre)
  const columnLetter = match[1]; // 'A' à 'J'
  const rowNumber = parseInt(match[2], 10); // '1' à '10'

  // Convertir la lettre en indice numérique (A=0, B=1, ..., J=9)
  const columnIndex = columnLetter.charCodeAt(0) - "A".charCodeAt(0);
  const rowIndex = rowNumber - 1; // Convertir en index basé sur 0

  // Calculer l'origine de la grille (coin supérieur gauche)
  const originX = grid.position.x - (grid.gridSize * grid.gridWidth) / 2;
  const originY = grid.position.y - (grid.gridSize * grid.gridHeight) / 2;

  // Calculer la position de la cellule (centrée)
  const x = originX + columnIndex * grid.gridSize + grid.gridSize / 2;
  const y = originY + rowIndex * grid.gridSize + grid.gridSize / 2;

  return { x, y };
}

export function createBoat(
  position: string,
  boats: { position: string; enemy: boolean; boat: THREE.Object3D }[],
  scene: THREE.Scene,
  grid: Grid,
  model: string
) {
  const calculatedPosition = calculatePosition(position, grid);
  const loader = new GLTFLoader();
  loader.load(model, (glb) => {
    const boat = glb.scene;
    boat.scale.set(2, 2, 2);
    boat.position.set(calculatedPosition.x, 100, calculatedPosition.y);
    boat.rotation.y =
      (Math.PI / 180) * (Math.random() * 40 + 70) * (grid.enemy ? -1 : 1);
    boat.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    boats.push({ position: position, enemy: grid.enemy, boat: boat });
    scene.add(boat);
  });
}

export function updateboats(
  boats: { position: string; enemy: boolean; boat: THREE.Object3D }[],
  ocean: Ocean
) {
  boats.forEach((boatObject, index) => {
    const boat = boatObject.boat;
    if (!boat) return;

    const position = ocean.mesh.geometry.attributes.position;
    let minDistance = Infinity;
    let waveHeight = 0;

    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      const z = position.getZ(i);
      const distance = Math.sqrt(
        (boat.position.x - x) ** 2 + (boat.position.z - z) ** 2
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

export function clearBoats(
  scene: THREE.Scene,
  boats: { position: string; enemy: boolean; boat: THREE.Object3D }[]
) {
  boats.forEach((boatObject) => {
    scene.remove(boatObject.boat);
  });
  boats = [];
}

export function clearGridBoats(
  scene: THREE.Scene,
  boats: { position: string; enemy: boolean; boat: THREE.Object3D }[],
  enemy: boolean
) {
  boats.forEach((boatObject) => {
    if (boatObject.enemy === enemy) {
      scene.remove(boatObject.boat);
    }
  });

  boats = boats.filter((boatObject) => boatObject.enemy !== enemy);
}

export function clearBoat(
  position: string,
  scene: THREE.Scene,
  boats: { position: string; enemy: boolean; boat: THREE.Object3D }[],
  enemy: boolean
) {
  boats.forEach((boatObject) => {
    if (boatObject.position === position && boatObject.enemy === enemy) {
      scene.remove(boatObject.boat);
    }
  });

  boats = boats.filter(
    (boatObject) =>
      boatObject.position !== position && boatObject.enemy !== enemy
  );
}