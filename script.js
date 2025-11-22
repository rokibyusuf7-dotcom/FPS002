import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { PointerLockControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/PointerLockControls.js';

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Light
const light = new THREE.HemisphereLight(0xffffff, 0x222222, 1);
scene.add(light);

// Floor
const floorGeometry = new THREE.PlaneGeometry(200, 200);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x3366ff });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// Controls
const controls = new PointerLockControls(camera, document.body);

// ✅ Click anywhere to start
document.body.addEventListener('click', () => {
  controls.lock();
});

// Movement
const speed = 0.1;
const keys = {};
let velocityY = 0;
const gravity = -0.01;
let canJump = false;

document.addEventListener('keydown', (e) => {
  keys[e.code] = true;
  if (e.code === 'Space' && canJump) {
    velocityY = 0.2;
    canJump = false;
  }
});

document.addEventListener('keyup', (e) => keys[e.code] = false);

function updateMovement() {
  if (!controls.isLocked) return;

  if (keys['KeyW']) controls.moveForward(speed);
  if (keys['KeyS']) controls.moveForward(-speed);
  if (keys['KeyA']) controls.moveRight(-speed);
  if (keys['KeyD']) controls.moveRight(speed);

  velocityY += gravity;
  camera.position.y += velocityY;

  if (camera.position.y < 1.7) {
    camera.position.y = 1.7;
    velocityY = 0;
    canJump = true;
  }
}

// Walls
function createWall(x, z, w, h) {
  const wall = new THREE.Mesh(
    new THREE.BoxGeometry(w, 3, h),
    new THREE.MeshStandardMaterial({ color: 0x222266 })
  );
  wall.position.set(x, 1.5, z);
  scene.add(wall);
  walls.push(wall);
}

const walls = [];
createWall(0, -10, 20, 1);
createWall(10, 0, 1, 20);
createWall(-10, 0, 1, 20);
createWall(0, 10, 20, 1);

function checkCollisions() {
  const player = new THREE.Vector3();
  player.copy(camera.position);

  for (let wall of walls) {
    const dist = wall.position.distanceTo(player);
    if (dist < 2) return true;
  }
  return false;
}

// Loop
function animate() {
  requestAnimationFrame(animate);

  const prevPos = camera.position.clone();
  updateMovement();

  if (checkCollisions()) {
    camera.position.copy(prevPos);
  }

  renderer.render(scene, camera);
}

camera.position.set(0, 1.7, 5);
animate();
