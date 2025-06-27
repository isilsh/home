import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const container = document.getElementById('three-container');
const width = container.clientWidth;
const height = container.clientHeight;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(width, height);
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

let fbxModel = null;

const loader = new FBXLoader();
loader.load('/models/face_static.fbx', (fbx) => {
  fbxModel = fbx;

  fbx.scale.set(0.5, 0.5, 0.5);
  fbx.position.set(0, -1.5, 0);

  fbx.traverse((child) => {
    if (child.isMesh) {
      child.material = new THREE.MeshBasicMaterial({
        color: 0xeeff00,
        wireframe: true,
      });
    }
  });

  scene.add(fbx);

  // Center of the model
  const box = new THREE.Box3().setFromObject(fbx);
  const center = new THREE.Vector3();
  box.getCenter(center);

  // Position the camera slightly below the model's center and in front
  camera.position.set(center.x, center.y - 0.5, center.z + 4);
  camera.lookAt(center);

  controls.target.copy(center);
  controls.update();
});

function animate() {
  requestAnimationFrame(animate);

  if (fbxModel) {
    fbxModel.rotation.y += 0.01; // Keep rotating
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();
