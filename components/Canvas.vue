<template>
    <div class="canvas-wrapper">
        <canvas ref="webgl" id="atom" class="webgl"></canvas>
    </div>
</template>

<script setup>
    import * as THREE from 'three'
    const webgl = ref(null)

    onMounted(() => {
        // Canvas
        const canvas = webgl.value
    });

    onActivated(() => {
        // Canvas
        const canvas = document.querySelector('canvas.webgl')
        // Sizes
        const sizes = {
            width: 300,
            height: 300
        }
        const pixelRatio = window.devicePixelRatio

        /* Base */
        // Scene
        const scene = new THREE.Scene()

        /* Props */
        // Plane Background
        const backgroundPlane = new THREE.PlaneGeometry(50, 50, 4, 4)
        const backgroundMaterial = new THREE.MeshStandardMaterial({ emissive: "#000505", roughness:0.1, metalness: 1 })
        const background = new THREE.Mesh(backgroundPlane, backgroundMaterial)
        background.position.z = -5
        scene.add(background)

        // Atom Group
        const atom = new THREE.Group()
        scene.add(atom)
        atom.position.z = -2

        const protonSphere = new THREE.SphereGeometry(.3, 16, 16)
        const protonMaterial = new THREE.MeshStandardMaterial({ emissive: "#080E54", roughness:0.4, metalness: 0.9 })
        const proton = new THREE.Mesh(protonSphere, protonMaterial)
        atom.add(proton)

        const electronCloudSphere = new THREE.SphereGeometry(2, 32, 32)
        const electronCloudMaterial = new THREE.MeshPhysicalMaterial({ opacity: .2, transparent: true, reflectivity:0, side:THREE.DoubleSide, roughness:0.5, metalness: 0, ior: 2, thickness: 2, transmission: 1 })
        const electronCloud = new THREE.Mesh(electronCloudSphere, electronCloudMaterial)
        atom.add(electronCloud)

        const electronSphere = new THREE.SphereGeometry(.1, 16, 16)
        const electronMaterial = new THREE.MeshStandardMaterial({ emissive: "#2FFFFF", roughness:0, metalness: 0.9 })
        const electron = new THREE.Mesh(electronSphere, electronMaterial)
        const radius = 1.5
        let theta = Math.random() * Math.PI * 2
        let phi = Math.random() * Math.PI
        const x = radius * Math.sin(theta)
        const z = radius * Math.cos(theta)
        const y = radius * Math.cos(phi)
        electron.position.set(x, y, z)
        atom.add(electron)

        const pointLight = new THREE.PointLight("#B7DBFF", 1, 5)
        pointLight.position.z = 1
        scene.add(pointLight)

        /* Camera & Controls */
        // Base camera
        const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
        camera.position.z = 3
        scene.add(camera)

        /* Renderer */
        const renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
        })
        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(pixelRatio, 2))
        
        /* Animate */
        const clock = new THREE.Clock()
        let time = 0

        const tick = () =>
        {
            const elapsedTime = clock.getElapsedTime()
            const deltaTime = elapsedTime - time
            time = elapsedTime

            // Animations
            let shake = (Math.random() * 0.015)
            proton.rotateX(.5)
            proton.position.set(shake, shake, 0)
            atom.rotateX(.01 * Math.random())
            atom.rotateY(.02 * Math.random())
            atom.rotateZ(.04 * Math.random())

            // Render
            renderer.render(scene, camera);

            // Call tick again on the next frame
            window.requestAnimationFrame(tick)
        }
        tick()
    })

</script>
<style></style>
