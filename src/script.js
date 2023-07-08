import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = null // Pas de couleur de fond

// Object
const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5)
const material = new THREE.MeshPhysicalMaterial({
  roughness: 0,
  transmission: 1,
  thickness: 0.5, // Add refraction!
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// const bgTexture = new THREE.TextureLoader().load("texture.webp");
// const bgGeometry = new THREE.PlaneGeometry(5, 5);
// const bgMaterial = new THREE.MeshBasicMaterial({ map: bgTexture });
// const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
// bgMesh.position.set(0, 0, -1);
// scene.add(bgMesh);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enableZoom = false // Désactiver le zoom
controls.enablePan = false // Désactiver le déplacement

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true // Rendre le fond transparent
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Animate
const animate = () => {
  // Render
  renderer.render(scene, camera)

  // Call animate again on the next frame
  requestAnimationFrame(animate)
}

// Start the animation
animate()
