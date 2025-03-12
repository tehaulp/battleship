import * as THREE from "three";
import { Ocean, createOcean } from "@/lib/Ocean";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
  createBoat,
  clearBoat,
  clearBoats,
  clearGridBoats,
  hitBoat,
  updateboats,
} from "@/lib/Boats";
import { Grid } from "@/lib/Grid";
import { createLights } from "./Lights";
import { RefObject } from "react";

export class SceneManager {
  // Variables statiques pour stocker les éléments de la scène
  static scene: THREE.Scene;
  static camera: THREE.PerspectiveCamera;
  static renderer: THREE.WebGLRenderer;
  static controls: OrbitControls;
  static ocean: Ocean;
  static grids: { enemy: boolean; grid: Grid }[] = [];
  static boats: { position: string; enemy: boolean; boat: THREE.Object3D }[] =
    [];
  static resizeObserver: ResizeObserver;

  // Fonction d'initialisation
  static init() {
    SceneManager.scene = new THREE.Scene();
    SceneManager.scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);

    const aspectRatio = SceneManager.getCanvasAspectRatio();
    SceneManager.camera = new THREE.PerspectiveCamera(
      60,
      aspectRatio,
      1,
      10000
    );
    SceneManager.camera.position.set(0, 210, 190);
    SceneManager.camera.rotation.set(Math.PI / 180, 0, 0);

    SceneManager.renderer = new THREE.WebGLRenderer({ alpha: true });
    SceneManager.updateRendererSize();

    // Initialiser l'OrbitControls pour la navigation
    SceneManager.controls = new OrbitControls(
      SceneManager.camera,
      SceneManager.renderer.domElement
    );
    SceneManager.controls.enableDamping = true;
    SceneManager.controls.dampingFactor = 0.05;
    SceneManager.controls.minDistance = 50;
    SceneManager.controls.maxDistance = 1000;
    SceneManager.controls.maxPolarAngle = Math.PI / 2;

    // Créer l'océan
    SceneManager.ocean = createOcean(SceneManager.scene);

    // Créer les lumières
    createLights(SceneManager.scene);
  }

  // Fonction pour mettre à jour la taille du renderer
  static updateRendererSize() {
    const { width, height } = SceneManager.getCanvasSize();
    SceneManager.renderer.setSize(width, height);
    SceneManager.camera.aspect = width / height;
    SceneManager.camera.updateProjectionMatrix();
  }

  // Récupérer la taille du canvas
  static getCanvasSize() {
    return { width: window.innerWidth, height: window.innerHeight };
  }

  // Calculer le ratio d'aspect du canvas
  static getCanvasAspectRatio() {
    const { width, height } = SceneManager.getCanvasSize();
    return width / height;
  }

  // Ajouter un bateau à la scène
  static addBoat(position: string, enemy: boolean) {
    const grid = SceneManager.grids.find(
      (gridObject) => gridObject.enemy === enemy
    );
    const modelPath = enemy
      ? "/assets/models/pirate-ship.glb"
      : "/assets/models/marine-boat.glb";

    if (grid) {
      createBoat(
        position,
        SceneManager.boats,
        SceneManager.scene,
        grid.grid,
        modelPath
      );
    } else {
      console.error("Aucune grille trouvée pour l'ennemi spécifié.");
    }
    console.log(SceneManager.boats);
  }

  // Créer une grille (environnement)
  static createGrid(enemy: boolean) {
    const grid = new Grid(SceneManager.scene, 20, 10, 10, enemy);
    SceneManager.grids.push({ enemy, grid });
  }

  // Supprimer toutes les grilles de la scène
  static removeAllGrids() {
    SceneManager.grids.forEach((gridObject) => {
      SceneManager.scene.remove(gridObject.grid.lineSegment);
    });

    SceneManager.grids = [];
    SceneManager.removeAllBoats();
  }

  // Supprimer une grille de la scène
  static removeGrid(enemy: boolean) {
    const grid = SceneManager.grids.find(
      (gridObject) => gridObject.enemy === enemy
    );
    if (grid) {
      SceneManager.scene.remove(grid.grid.lineSegment);
      SceneManager.removeGridBoats(enemy);
      SceneManager.grids = SceneManager.grids.filter(
        (gridObject) => gridObject.enemy !== enemy
      );
    } else {
      console.error("Aucune grille trouvée pour l'ennemi spécifié.");
    }
  }

  // Supprimer les bateaux d'une grille
  static removeGridBoats(enemy: boolean) {
    clearGridBoats(SceneManager.scene, SceneManager.boats, enemy);
    SceneManager.boats = SceneManager.boats.filter(
      (boatObject) => boatObject.enemy !== enemy
    );
  }

  // Supprimer tous les bateaux de la scène
  static removeAllBoats() {
    clearBoats(SceneManager.scene, SceneManager.boats);
    SceneManager.boats = [];
  }

  // Supprimer un seul bateau
  static removeBoat(position: string, enemy: boolean) {
    clearBoat(position, SceneManager.scene, SceneManager.boats, enemy);
    console.log(SceneManager.boats);

    SceneManager.boats = SceneManager.boats.filter(
      (boatObject) =>
        boatObject.position !== position && boatObject.enemy !== enemy
    );
  }

  // Marquer un bateau comme touché
  static setBoatHit(position: string, enemy: boolean) {
    hitBoat(position, enemy, SceneManager.boats);
  }

  // Fonction pour animer la scène
  static loop(canvasRef: RefObject<HTMLDivElement | null>) {
    requestAnimationFrame(() => SceneManager.loop(canvasRef));
    SceneManager.ocean.moveWaves();
    updateboats(SceneManager.boats, SceneManager.ocean);
    SceneManager.controls.update();
    SceneManager.renderer.render(SceneManager.scene, SceneManager.camera);
    SceneManager.resizeObserver = new ResizeObserver(() =>
      SceneManager.updateRendererSize()
    );
    if (canvasRef.current)
      SceneManager.resizeObserver.observe(canvasRef.current);
  }

  // Fonction de nettoyage lors du démontage
  static cleanup() {
    if (SceneManager.resizeObserver) {
      SceneManager.resizeObserver.disconnect();
    }
    SceneManager.removeAllBoats();
    SceneManager.grids.forEach((gridObject) => {
      SceneManager.scene.remove(gridObject.grid.lineSegment);
    });
  }
}
