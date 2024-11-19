"use client";
import { useEffect } from "react";
import * as THREE from "three";
import "./textHoverStyle.css";

export default function LiquidEffect() {
    let easeFactor = 0.02;
    let scene, camera, renderer, planeMesh;
    let mousePosition = { x: 0.5, y: 0.5 };
    let targetMousePosition = { x: 0.5, y: 0.5 };
    let prevPosition = { x: 0.5, y: 0.5 };

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      varying vec2 vUv;
      uniform sampler2D u_texture;
      uniform vec2 u_mouse;
      uniform vec2 u_prevMouse;

      void main() {
        vec2 gridUV = floor(vUv * vec2(40.0, 40.0)) / vec2(40.0, 40.0);
        vec2 centerOfPixel = gridUV + vec2(1.0 / 40.0, 1.0 / 40.0);
        vec2 mouseDirection = u_mouse - u_prevMouse;
        vec2 pixelToMouseDirection = centerOfPixel - u_mouse;
        float pixelDistanceToMouse = length(pixelToMouseDirection);
        float strength = smoothstep(0.3, 0.0, pixelDistanceToMouse);
        vec2 uvOffset = strength * mouseDirection * 0.3;
        vec2 uv = vUv - uvOffset;
        vec4 color = texture2D(u_texture, uv);
        gl_FragColor = color;
      }
    `;

    function createTextTextures(text, font = "Audio Nugget", size = 100, color = "#000000", fontWeight = "100") {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const canvasWidth = 2000 // Fixed canvas width
        const canvasHeight = 1200; // Fixed canvas height

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        // Set transparent background
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        ctx.fillStyle = "black"; // Text color
        ctx.font = `${fontWeight} 70px ${font}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Draw the text in the center of the canvas with padding
        ctx.fillText(text, canvasWidth / 2, canvasHeight / 2);

        // Return as a THREE.js texture
        return new THREE.CanvasTexture(canvas);
    }
    function initializeScene(texture) {
        scene = new THREE.Scene();

        const aspectRatio = window.innerWidth / window.innerHeight;
        camera = new THREE.OrthographicCamera(
            -aspectRatio,
            aspectRatio,
            1,
            -1,
            0.1,
            10
        );
        camera.position.z = 1;

        let shaderUniforms = {
            u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
            u_prevMouse: { value: new THREE.Vector2(0.5, 0.5) },
            u_texture: { value: texture }
        };

        planeMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(2, 2),
            new THREE.ShaderMaterial({
                uniforms: shaderUniforms,
                vertexShader,
                fragmentShader
            })
        );
        scene.add(planeMesh);

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor(0x000000, 0); // Transparent background

        const container = document.getElementById("textContainer");
        container.appendChild(renderer.domElement);
    }

    function reloadTexture() {
        const newTexture = createTextTextures("Your Fashion brand", "Audio Nugget", 260, "#ffffff", "100");
        planeMesh.material.uniforms.u_texture.value = newTexture;
    }

    useEffect(() => {
        const textContainer = document.getElementById("textContainer");

        if (!textContainer) {
            console.error("No container found with id 'textContainer'.");
            return;
        }

        initializeScene(createTextTextures("A Fashion brand", "Outfit", 140, "#FFFFFF", "700"));
        animateScene();
        textContainer.addEventListener("mousemove", handleMousemove);
        textContainer.addEventListener("mouseenter", handleMouseEnter);
        textContainer.addEventListener("mouseleave", handleMouseleave);
        window.addEventListener("resize", onWindowResize, false);

        return () => {
            textContainer.removeEventListener("mousemove", handleMousemove);
            textContainer.removeEventListener("mouseenter", handleMouseEnter);
            textContainer.removeEventListener("mouseleave", handleMouseleave);
            window.removeEventListener("resize", onWindowResize, false);
        };
    }, []);

    function animateScene() {
        requestAnimationFrame(animateScene);

        // Smooth mouse position updates
        mousePosition.x += (targetMousePosition.x - mousePosition.x) * easeFactor;
        mousePosition.y += (targetMousePosition.y - mousePosition.y) * easeFactor;

        planeMesh.material.uniforms.u_mouse.value.set(
            mousePosition.x,
            1.0 - mousePosition.y
        );
        planeMesh.material.uniforms.u_prevMouse.value.set(
            prevPosition.x,
            1.0 - prevPosition.y
        );

        renderer.render(scene, camera);
    }

    function handleMousemove(event) {
        easeFactor = 0.04;
        let rect = document.getElementById("textContainer").getBoundingClientRect();
        prevPosition = { ...targetMousePosition };
        targetMousePosition.x = (event.clientX - rect.left) / rect.width;
        targetMousePosition.y = (event.clientY - rect.top) / rect.height;
    }

    function handleMouseEnter(event) {
        easeFactor = 0.02;
        let rect = document.getElementById("textContainer").getBoundingClientRect();
        mousePosition.x = targetMousePosition.x = (event.clientX - rect.left) / rect.width;
        mousePosition.y = targetMousePosition.y = (event.clientY - rect.top) / rect.height;
    }

    function handleMouseleave() {
        easeFactor = 0.02;
        targetMousePosition = { x: 0.5, y: 0.5 };
        prevPosition = { ...targetMousePosition };
    }

    function onWindowResize() {
        const aspectRatio = window.innerWidth / window.innerHeight;
        camera.left = -aspectRatio;
        camera.right = aspectRatio;
        camera.top = 1;
        camera.bottom = -1;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
        reloadTexture();

        // Debugging: Log the updated aspect ratio
        console.log(`Window Resized: Aspect Ratio = ${aspectRatio}`);
    }

    return null; // Ensures the component itself doesn't render anything
}
