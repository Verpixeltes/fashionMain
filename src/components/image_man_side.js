"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import "./imageHoverEffekt.css"

export default function ImageEffect() {
    const containerRef = useRef(null);
    const imageRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const imageContainer = containerRef.current;

        let scene, camera, renderer, planeMesh;
        let mousePosition = { x: 0.5, y: 0.5 };
        let targetMousePosition = { x: 0.5, y: 0.5 };
        let prevPosition = { x: 0.5, y: 0.5 };
        let aberrationIntensity = 0.0;
        let easeFactor = 0.02;

        const vertexShader = `
precision highp float;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

        const fragmentShader = `
precision highp float;

varying vec2 vUv;
uniform sampler2D u_texture;
uniform vec2 u_mouse;
uniform vec2 u_prevMouse;
uniform float u_aberrationIntensity;

void main() {
    vec2 gridUV = floor(vUv * vec2(20.0, 20.0)) / vec2(20.0, 20.0);
    vec2 centerOfPixel = gridUV + vec2(1.0 / 20.0, 1.0 / 20.0);

    vec2 mouseDirection = u_mouse - u_prevMouse;
    vec2 pixelToMouseDirection = centerOfPixel - u_mouse;
    float pixelDistanceToMouse = length(pixelToMouseDirection);
    float strength = smoothstep(0.3, 0.0, pixelDistanceToMouse);

    vec2 uvOffset = strength * -mouseDirection * 0.2;
    vec2 uv = vUv - uvOffset;

    vec4 colorR = texture2D(u_texture, uv + vec2(strength * u_aberrationIntensity * 0.01, 0.0));
    vec4 colorG = texture2D(u_texture, uv);
    vec4 colorB = texture2D(u_texture, uv - vec2(strength * u_aberrationIntensity * 0.01, 0.0));

    gl_FragColor = vec4(colorR.r, colorG.g, colorB.b, 1.0);
}
`;


        const initializeScene = (texture) => {
            scene = new THREE.Scene();

            camera = new THREE.PerspectiveCamera(
                80,
                imageContainer.offsetWidth / imageContainer.offsetHeight,
                0.01,
                10
            );
            camera.position.z = 1;

            const shaderUniforms = {
                u_mouse: { type: "v2", value: new THREE.Vector2() },
                u_prevMouse: { type: "v2", value: new THREE.Vector2() },
                u_aberrationIntensity: { type: "f", value: 0.0 },
                u_texture: { type: "t", value: texture },
            };

            planeMesh = new THREE.Mesh(
                new THREE.PlaneGeometry(2, 2),
                new THREE.ShaderMaterial({
                    uniforms: shaderUniforms,
                    vertexShader,
                    fragmentShader,
                })
            );

            scene.add(planeMesh);

            renderer = new THREE.WebGLRenderer({ alpha: true });
            renderer.setSize(imageContainer.offsetWidth, imageContainer.offsetHeight);
            imageContainer.appendChild(renderer.domElement);
        };

        const animateScene = () => {
            requestAnimationFrame(animateScene);

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

            aberrationIntensity = Math.max(0.0, aberrationIntensity - 0.05);
            planeMesh.material.uniforms.u_aberrationIntensity.value =
                aberrationIntensity;

            renderer.render(scene, camera);
        };

        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(imageRef.current.src, (texture) => {
            initializeScene(texture);
            animateScene();
        });

        imageContainer.addEventListener("mousemove", (event) => {
            const rect = imageContainer.getBoundingClientRect();
            prevPosition = { ...targetMousePosition };

            targetMousePosition.x = (event.clientX - rect.left) / rect.width;
            targetMousePosition.y = (event.clientY - rect.top) / rect.height;

            aberrationIntensity = 1;
        });

        return () => renderer?.dispose();
    }, []);

    return (
        <div
            id="imageContainer"
            ref={containerRef}
            style={{
                position: "relative",
                width: "1500",
                height: "200px",
                overflow: "hidden",
                backgroundColor: "transparent",
            }}
        >
            <img
                id="myImage"
                ref={imageRef}
                src="/men_side.jpg"
                style={{ display: "none", width: "1320px" }}
                alt="Effect"
            />
        </div>
    );
}