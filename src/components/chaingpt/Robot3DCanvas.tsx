"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

interface Robot3DCanvasProps {
  className?: string;
  enableInteraction?: boolean;
}

export default function Robot3DCanvas({
  className = "",
  enableInteraction = true,
}: Robot3DCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || 340;
    let height = container.clientHeight || 340;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.5);
    camera.lookAt(0, 0, 0);

    // Renderer with ACES Filmic Tone Mapping for accurate, punchy color reproduction
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Balanced Lighting to prevent bleaching / washing out reds into pink
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    // Key Light
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyLight.position.set(4, 5, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    // Red cyber rim light (matches branding)
    const rimLight = new THREE.DirectionalLight(0xe50914, 1.2);
    rimLight.position.set(-4, -2, -3);
    scene.add(rimLight);

    // Soft front fill
    const fillLight = new THREE.DirectionalLight(0xfffaf0, 0.9);
    fillLight.position.set(-3, 3, 4);
    scene.add(fillLight);

    // Pivot group for rotation
    const pivotGroup = new THREE.Group();
    scene.add(pivotGroup);

    let mixer: THREE.AnimationMixer | null = null;
    let isDisposed = false;

    // Dedicated Eye Material (Pure Glowing White matching original reference)
    const eyeMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 1.5,
      roughness: 0.1,
      metalness: 0.0,
    });

    // Brand Red colors (#E50914)
    const BRAND_RED = new THREE.Color("#E50914");
    const BRAND_RED_EMISSIVE = new THREE.Color("#E50914");

    // Load robot.glb
    const loader = new GLTFLoader();
    loader.load(
      "/robot.glb",
      (gltf) => {
        if (isDisposed) return;
        const model = gltf.scene;

        // Calculate bounding box and center precisely
        const box = new THREE.Box3().setFromObject(model);
        const center = new THREE.Vector3();
        box.getCenter(center);

        // Center model inside pivot group
        model.position.set(-center.x, -center.y, -center.z);

        // Material color correction
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            // 1. The two robot face eyes (Cylinder & Cylinder001) -> Make them Crisp Glowing White!
            if (mesh.name === "Cylinder" || mesh.name === "Cylinder001") {
              mesh.material = eyeMaterial;
              return;
            }

            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;

              // 2. Head bezel & chest accents (Brand_Logo_Red) -> Fix from washed pink to bold Brand Red (#E50914)
              if (mat.name === "Brand_Logo_Red") {
                mat.color.copy(BRAND_RED);
                mat.emissive.setHex(0x220004);
                mat.roughness = 0.25;
              }

              // 3. Constellation Nodes (Heroic_Node_* with Brand_Neon_Red) -> Vibrant Brand Red
              if (mat.name === "Brand_Neon_Red") {
                mat.color.copy(BRAND_RED);
                mat.emissive.copy(BRAND_RED_EMISSIVE);
                mat.emissiveIntensity = 1.3;
              }

              // 4. Constellation Links (HeroicLinkObj_* with Brand_Heroic_Link.001) -> Sharp Brand Red lines
              if (mat.name.includes("Brand_Heroic_Link")) {
                mat.color.copy(BRAND_RED);
                mat.emissive.copy(BRAND_RED_EMISSIVE);
                mat.emissiveIntensity = 1.2;
                mat.transparent = true;
                mat.opacity = 0.9;
              }

              // 5. White body panels -> clean crisp white
              if (mat.name === "Brand_White") {
                mat.color.setHex(0xfafafa);
                mat.roughness = 0.28;
              }

              // 6. Face screen -> deep dark glass
              if (mat.name === "Brand_Screen") {
                mat.color.setHex(0x0f1412);
                mat.roughness = 0.08;
              }
            }
          }
        });

        pivotGroup.add(model);

        // Play all animation tracks
        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(model);
          gltf.animations.forEach((clip) => {
            const action = mixer?.clipAction(clip);
            if (action) {
              action.play();
            }
          });
        }

        setLoaded(true);
      },
      undefined,
      (err) => {
        console.error("Failed to load /robot.glb:", err);
      }
    );

    // Mouse / Touch Interaction State
    const rotState = {
      targetY: 0,
      targetX: 0,
      currentY: 0,
      currentX: 0,
      isDragging: false,
      lastMouseX: 0,
      lastMouseY: 0,
      idleTimer: 0,
    };

    const onPointerDown = (e: PointerEvent) => {
      if (!enableInteraction) return;
      rotState.isDragging = true;
      rotState.lastMouseX = e.clientX;
      rotState.lastMouseY = e.clientY;
      container.style.cursor = "grabbing";
    };

    const onPointerMove = (e: PointerEvent) => {
      rotState.idleTimer = 0;
      if (rotState.isDragging) {
        const deltaX = e.clientX - rotState.lastMouseX;
        const deltaY = e.clientY - rotState.lastMouseY;
        rotState.lastMouseX = e.clientX;
        rotState.lastMouseY = e.clientY;

        rotState.targetY += deltaX * 0.008;
        rotState.targetX += deltaY * 0.008;
        rotState.targetX = Math.max(-0.6, Math.min(0.6, rotState.targetX));
      } else {
        // Subtle hover tilt when not dragging
        const rect = container.getBoundingClientRect();
        const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        rotState.targetY = normX * 0.4;
        rotState.targetX = -normY * 0.3;
      }
    };

    const onPointerUp = () => {
      rotState.isDragging = false;
      container.style.cursor = "grab";
    };

    if (enableInteraction) {
      container.style.cursor = "grab";
      container.addEventListener("pointerdown", onPointerDown);
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
    }

    // Animation Loop
    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      if (mixer) {
        mixer.update(delta);
      }

      // Smooth lerp to target rotation
      rotState.currentY += (rotState.targetY - rotState.currentY) * 0.08;
      rotState.currentX += (rotState.targetX - rotState.currentX) * 0.08;

      // Gentle continuous rotation when idle
      if (!rotState.isDragging) {
        rotState.idleTimer += delta;
        if (rotState.idleTimer > 2.0) {
          pivotGroup.rotation.y += delta * 0.35;
        } else {
          pivotGroup.rotation.y = rotState.currentY;
        }
      } else {
        pivotGroup.rotation.y = rotState.currentY;
      }

      pivotGroup.rotation.x = rotState.currentX;

      // Subtle breathing float
      const elapsed = clock.getElapsedTime();
      pivotGroup.position.y = Math.sin(elapsed * 1.5) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // Resize observer
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || 340;
      height = container.clientHeight || 340;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      if (enableInteraction) {
        container.removeEventListener("pointerdown", onPointerDown);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
      }
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
      eyeMaterial.dispose();
    };
  }, [enableInteraction]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex items-center justify-center select-none touch-none ${className}`}
    >
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#E50914] border-t-transparent animate-spin" />
        </div>
      )}
    </div>
  );
}
