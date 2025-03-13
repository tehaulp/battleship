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

/**
 * SceneManager class handles the creation, management, and rendering of the 3D scene.
 */
export class SceneManager {
  // Scene components
  static scene: THREE.Scene;
  static camera: THREE.PerspectiveCamera;
  static renderer: THREE.WebGLRenderer;
  static controls: OrbitControls;
  static ocean: Ocean;

  // Scene objects
  static grids: { enemy: boolean; grid: Grid }[] = [];
  static boats: { position: string; enemy: boolean; boat: THREE.Object3D }[] = [];

  // Utility
  static resizeObserver: ResizeObserver;

  /**
   * Initializes the scene, camera, renderer, and controls.
   */
  static init() {
    SceneManager.scene = new THREE.Scene();
    SceneManager.scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);

    const aspectRatio = SceneManager.getCanvasAspectRatio();
    SceneManager.camera = new THREE.PerspectiveCamera(60, aspectRatio, 1, 10000);
    SceneManager.camera.position.set(0, 210, 190);
    SceneManager.camera.rotation.set(Math.PI / 180, 0, 0);

    SceneManager.renderer = new THREE.WebGLRenderer({ alpha: true });
    SceneManager.updateRendererSize();

    SceneManager.controls = new OrbitControls(SceneManager.camera, SceneManager.renderer.domElement);
    SceneManager.controls.enableDamping = true;
    SceneManager.controls.dampingFactor = 0.05;
    SceneManager.controls.minDistance = 50;
    SceneManager.controls.maxDistance = 1000;
    SceneManager.controls.maxPolarAngle = Math.PI / 2;

    SceneManager.ocean = createOcean(SceneManager.scene);
    createLights(SceneManager.scene);
  }

  /**
   * Retrieves the canvas size.
   */
  static getCanvasSize() {
    return { width: window.innerWidth, height: window.innerHeight };
  }

  /**
   * Computes the aspect ratio of the canvas.
   */
  static getCanvasAspectRatio() {
    const { width, height } = SceneManager.getCanvasSize();
    return width / height;
  }

  /**
   * Updates the renderer size and adjusts the camera aspect ratio.
   */
  static updateRendererSize() {
    const { width, height } = SceneManager.getCanvasSize();
    SceneManager.renderer.setSize(width, height);
    SceneManager.camera.aspect = width / height;
    SceneManager.camera.updateProjectionMatrix();
  }

  /**
   * Creates a grid for player or enemy.
   * @param enemy - Determines whether the grid belongs to an enemy.
   */
  static createGrid(enemy: boolean) {
    const grid = new Grid(SceneManager.scene, 20, 10, 10, enemy);
    SceneManager.grids.push({ enemy, grid });
  }

  /**
   * Removes all grids from the scene.
   */
  static removeAllGrids() {
    SceneManager.grids.forEach(gridObject => SceneManager.scene.remove(gridObject.grid.lineSegment));
    SceneManager.grids = [];
    SceneManager.removeAllBoats();
  }

  /**
   * Removes a specific grid from the scene.
   * @param enemy - Determines which grid to remove.
   */
  static removeGrid(enemy: boolean) {
    const grid = SceneManager.grids.find(gridObject => gridObject.enemy === enemy);
    if (grid) {
      SceneManager.scene.remove(grid.grid.lineSegment);
      SceneManager.removeGridBoats(enemy);
      SceneManager.grids = SceneManager.grids.filter(gridObject => gridObject.enemy !== enemy);
    } else {
      console.error("No grid found for the specified enemy.");
    }
  }

  /**
   * Adds a boat to the scene.
   * @param position - The position identifier of the boat.
   * @param enemy - Determines if the boat belongs to the enemy.
   */
  static addBoat(position: string, enemy: boolean) {
    const grid = SceneManager.grids.find(gridObject => gridObject.enemy === enemy);
    const modelPath = enemy ? "/assets/models/pirate-ship.glb" : "/assets/models/marine-boat.glb";

    if (grid) {
      createBoat(position, SceneManager.boats, SceneManager.scene, grid.grid, modelPath);
    } else {
      console.error("No grid found for the specified enemy.");
    }
  }

  /**
   * Removes all boats from the scene.
   */
  static removeAllBoats() {
    clearBoats(SceneManager.scene, SceneManager.boats);
    SceneManager.boats = [];
  }

  /**
   * Removes all boats belonging to a specific grid.
   * @param enemy - Determines which boats to remove.
   */
  static removeGridBoats(enemy: boolean) {
    clearGridBoats(SceneManager.scene, SceneManager.boats, enemy);
    SceneManager.boats = SceneManager.boats.filter(boatObject => boatObject.enemy !== enemy);
  }

  /**
   * Removes a single boat from the scene.
   * @param position - The position identifier of the boat.
   * @param enemy - Determines if the boat belongs to the enemy.
   */
  static removeBoat(position: string, enemy: boolean) {
    clearBoat(position, SceneManager.scene, SceneManager.boats, enemy);
    SceneManager.boats = SceneManager.boats.filter(boatObject => !(boatObject.position === position && boatObject.enemy === enemy));
  }

  /**
   * Marks a boat as hit.
   * @param position - The position identifier of the boat.
   * @param enemy - Determines if the boat belongs to the enemy.
   */
  static setBoatHit(position: string, enemy: boolean) {
    hitBoat(position, enemy, SceneManager.boats);
  }

  /**
   * Animation loop for updating and rendering the scene.
   */
  static loop(canvasRef: RefObject<HTMLDivElement | null>) {
    requestAnimationFrame(() => SceneManager.loop(canvasRef));
    SceneManager.ocean.moveWaves();
    updateboats(SceneManager.boats, SceneManager.ocean);
    SceneManager.controls.update();
    SceneManager.renderer.render(SceneManager.scene, SceneManager.camera);
    SceneManager.resizeObserver = new ResizeObserver(() => SceneManager.updateRendererSize());
    if (canvasRef.current) SceneManager.resizeObserver.observe(canvasRef.current);
  }

  /**
   * Cleanup function to remove objects and event listeners when unmounting.
   */
  static cleanup() {
    if (SceneManager.resizeObserver) SceneManager.resizeObserver.disconnect();
    SceneManager.removeAllBoats();
    SceneManager.grids.forEach(gridObject => SceneManager.scene.remove(gridObject.grid.lineSegment));
  }
}
