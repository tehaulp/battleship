import * as THREE from "three";

export function createOcean(scene: THREE.Scene) {
  const ocean = new Ocean();
  ocean.mesh.position.set(0, 0, 0);
  scene.add(ocean.mesh);
  return ocean;
}

export class Ocean {
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
