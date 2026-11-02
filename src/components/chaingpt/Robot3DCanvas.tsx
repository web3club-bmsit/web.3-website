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

    let width = container.clientWidth || 320;
    let height = container.clientHeight || 320;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.5);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    // Key Light
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    keyLight.position.set(4, 6, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    // Red cyber rim light (matches branding)
    const rimLight = new THREE.DirectionalLight(0xff2200, 1.8);
    rimLight.position.set(-4, -2, -3);
    scene.add(rimLight);

    // Subtle front fill light
    const fillLight = new THREE.DirectionalLight(0xfff5ee, 1.2);
    fillLight.position.set(-3, 3, 4);
    scene.add(fillLight);

    // Pivot group for rotation
    const pivotGroup = new THREE.Group();
    scene.add(pivotGroup);

    let mixer: THREE.AnimationMixer | null = null;
    let isDisposed = false;

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

        // Enable shadows and enhance materials
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.roughness = Math.min(mat.roughness ?? 0.4, 0.5);
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
      width = container.clientWidth || 320;
      height = container.clientHeight || 320;
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
