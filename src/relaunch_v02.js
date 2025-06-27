import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const container = document.getElementById('three-container');
const width = container.clientWidth;
const height = container.clientHeight;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(width, height);
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

let fbxModel = null;

const loader = new FBXLoader();
loader.load('/models/face_static.fbx', (fbx) => {
  // Keep the original position and scale on the fbx root object
  fbx.scale.set(0.5, 0.5, 0.5);
  fbx.position.set(0, 0, 0);

  // Create a group to hold fill + wireframe meshes as children of fbx
  const group = new THREE.Group();

  fbx.traverse((child) => {
    if (child.isMesh) {
const fillMaterial = new THREE.MeshBasicMaterial({
  color: 0xeeff00,
  transparent: true,
  opacity: 0.3,
  depthWrite: false,
  side: THREE.DoubleSide,
});

const wireframeMaterial = new THREE.MeshBasicMaterial({
  color: 0xeeff00,
  wireframe: true,
  opacity: 1,
  transparent: true,
  depthTest: false,          // <-- disable depth test so lines always visible
  polygonOffset: true,
  polygonOffsetFactor: 1,
  polygonOffsetUnits: 1,
});


      // Create fill mesh and wireframe mesh with same geometry
      const fillMesh = new THREE.Mesh(child.geometry, fillMaterial);
      const wireframeMesh = new THREE.Mesh(child.geometry, wireframeMaterial);
      

      // Copy the original mesh's local transform to new meshes
      fillMesh.position.copy(child.position);
      fillMesh.rotation.copy(child.rotation);
      fillMesh.scale.copy(child.scale);

      wireframeMesh.position.copy(child.position);
      wireframeMesh.rotation.copy(child.rotation);
      wireframeMesh.scale.copy(child.scale);

      group.add(fillMesh);
      group.add(wireframeMesh);
      
            wireframeMesh.renderOrder = 999;
      
    }
  });

  // Add the group to the fbx root object which has the correct position & scale
  fbx.add(group);

  // Add the whole fbx object to the scene
  scene.add(fbx);

  // Compute bounding box and center for camera controls
  const box = new THREE.Box3().setFromObject(fbx);
  const center = new THREE.Vector3();
  box.getCenter(center);

  // Position camera and controls
  camera.position.set(center.x, center.y - 0.5, center.z + 4.5);
  camera.lookAt(center);
  controls.target.copy(center);
  controls.update();

  // Save reference for animation
  fbxModel = fbx;
});

function animate() {
  requestAnimationFrame(animate);

  if (fbxModel) {
    fbxModel.rotation.y += 0.01; // Rotate the whole model
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();
