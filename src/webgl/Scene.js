import * as THREE from 'three'

export default class Scene {
    constructor(canvas) {
        this.canvas = canvas
        this.width = window.innerWidth
        this.height = window.innerHeight

        this.init()
        this.addObjects()
        this.resize()
        this.animate()

        window.addEventListener('resize', this.resize.bind(this))
        window.addEventListener('mousemove', this.onMouseMove.bind(this))
    }

    init() {
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000)
        this.camera.position.z = 2

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true
        })
        this.renderer.setSize(this.width, this.height)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

        this.mouse = new THREE.Vector2()
        this.targetMouse = new THREE.Vector2()
    }

    addObjects() {
        // Cyberpunk/Tech Grid Particles
        const geometry = new THREE.BufferGeometry()
        const count = 5000

        const positions = new Float32Array(count * 3)
        const randoms = new Float32Array(count)

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 10
            positions[i * 3 + 1] = (Math.random() - 0.5) * 10
            positions[i * 3 + 2] = (Math.random() - 0.5) * 5

            randoms[i] = Math.random()
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))

        this.material = new THREE.ShaderMaterial({
            vertexShader: `
        uniform float uTime;
        uniform vec2 uMouse;
        attribute float aRandom;
        varying float vAlpha;
        
        void main() {
          vec3 pos = position;
          
          // Wave effect
          pos.z += sin(pos.x * 2.0 + uTime) * 0.5;
          pos.y += cos(pos.z * 1.5 + uTime * 0.5) * 0.2;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          gl_PointSize = (10.0 * aRandom + 2.0) * (1.0 / -mvPosition.z);
          
          vAlpha = 0.5 + 0.5 * sin(uTime + aRandom * 10.0);
        }
      `,
            fragmentShader: `
        varying float vAlpha;
        
        void main() {
          float strength = distance(gl_PointCoord, vec2(0.5));
          strength = 1.0 - strength;
          strength = pow(strength, 3.0);
          
          vec3 color = vec3(1.0, 1.0, 1.0); // White particles
          
          gl_FragColor = vec4(color, strength * vAlpha);
        }
      `,
            uniforms: {
                uTime: { value: 0 },
                uMouse: { value: new THREE.Vector2() }
            },
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        })

        this.points = new THREE.Points(geometry, this.material)
        this.scene.add(this.points)
    }

    onMouseMove(e) {
        this.targetMouse.x = (e.clientX / this.width) * 2 - 1
        this.targetMouse.y = -(e.clientY / this.height) * 2 + 1
    }

    resize() {
        this.width = window.innerWidth
        this.height = window.innerHeight

        this.camera.aspect = this.width / this.height
        this.camera.updateProjectionMatrix()

        this.renderer.setSize(this.width, this.height)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this))

        // Smooth mouse damping
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05

        // Rotation based on scroll/mouse
        if (this.points) {
            this.points.rotation.y = this.mouse.x * 0.2
            this.points.rotation.x = -this.mouse.y * 0.2
        }

        if (this.material) {
            this.material.uniforms.uTime.value += 0.01
            this.material.uniforms.uMouse.value = this.mouse
        }

        this.renderer.render(this.scene, this.camera)
    }
}
