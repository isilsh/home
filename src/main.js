import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


const container = document.getElementById('three-container');
const width = container.clientWidth;
const height = container.clientHeight;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(width, height);
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;  // optional, for smoother controls
controls.dampingFactor = 0.05;


const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

let fbxModel = null;

const loader = new FBXLoader();
loader.load('/models/face_static.fbx', (fbx) => {
  fbxModel = fbx; // assign to the variable so animate can access it

  fbx.scale.set(0.5, 0.5, 0.5);
  fbx.position.set(0, -1.5, 0);

  fbx.traverse((child) => {
    if (child.isMesh) {
      child.material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true,
      });
    }
  });

  scene.add(fbx);
});



function animate() {
  requestAnimationFrame(animate);
  cube.rotation.y += 0.01;
  
    if (fbxModel) {
    fbxModel.rotation.y += 0.01; // rotate around Y axis
  }
   controls.update();  // add this
  renderer.render(scene, camera);
}

animate();
