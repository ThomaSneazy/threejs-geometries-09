import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { VerticalBlurShader } from 'three/examples/jsm/shaders/VerticalBlurShader.js'
import { HorizontalBlurShader } from 'three/examples/jsm/shaders/HorizontalBlurShader.js'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xffffff) // Fond blanc
scene.alpha = true

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({
  color: 'black', // Couleur noire
  opacity: 0.5, // Opacité à 50%
  transparent: true,
  wireframe: false
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

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

  // Update composer
  composer.setSize(sizes.width, sizes.height)
})

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enableZoom = false // Désactiver le zoom
// controls.enablePan = false // Désactiver le déplacement

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Post-processing
const composer = new EffectComposer(renderer)
const renderPass = new RenderPass(scene, camera)
composer.addPass(renderPass)

const verticalBlurPass = new ShaderPass(VerticalBlurShader)
verticalBlurPass.uniforms.v.value = 20 / sizes.height
composer.addPass(verticalBlurPass)

const horizontalBlurPass = new ShaderPass(HorizontalBlurShader)
horizontalBlurPass.uniforms.h.value = 20 / sizes.width
composer.addPass(horizontalBlurPass)

// Animation variables
let time = 0
let targetPosition = new THREE.Vector3()
let targetRotation = new THREE.Vector3()

// Adjust cube size
mesh.scale.set(0.5, 0.5, 0.5)

// Animate
const animate = () => {
  // Update time
  time += 0.01

  // Move the cube randomly
  const range = 2
  const speed = 0.1
  targetPosition.x = Math.sin(time * speed) * range
  targetPosition.y = Math.cos(time * speed) * range

  // Rotate the cube
  targetRotation.x = time * speed
  targetRotation.y = time * speed

  // Smoothly move and rotate the cube
  mesh.position.lerp(targetPosition, 0.05)
  mesh.rotation.x = targetRotation.x
  mesh.rotation.y = targetRotation.y

  // Render using the EffectComposer
  composer.render()

  // Call animate again on the next frame
  requestAnimationFrame(animate)
}

// Start the animation
animate()
