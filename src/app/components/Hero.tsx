"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

// Register ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ════════════════════════════════════════════════════════════
//  CONSTANTS
// ════════════════════════════════════════════════════════════
const ACCENT = 0xcdef33;
const BG = 0x202221;
const P_COUNT = 2500;
const NODE_CT = 55;
const SCRAMBLE_CHARS = "#◆Ξ0x▲9f$&";

const TEXTS = [
  { id: "txt0", text: "The decentralized revolution starts here" },
  { id: "txt1", text: "Smart contracts. DeFi. NFTs. Web3." },
  { id: "txt2", text: "Built by students. Powered by Ethereum." },
  { id: "txt3", text: "Web3 BMSIT" },
];

export default function Hero() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";

  const sceneRef = useRef<THREE.Scene | null>(null);
  const keyLightRef = useRef<THREE.PointLight | null>(null);
  const hoverLightRef = useRef<THREE.PointLight | null>(null);
  const btcMatRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const pMatRef = useRef<THREE.PointsMaterial | null>(null);
  const lineMatRef = useRef<THREE.LineBasicMaterial | null>(null);

  // Sync theme changes
  useEffect(() => {
    const bgColor = isDark ? 0x202221 : 0xd9d9d9;
    const accentColor = 0xcdef33;

    if (sceneRef.current) {
      sceneRef.current.background = new THREE.Color(bgColor);
      if (sceneRef.current.fog) {
        sceneRef.current.fog.color.setHex(bgColor);
      }
    }
    if (keyLightRef.current) keyLightRef.current.color.setHex(accentColor);
    if (hoverLightRef.current) hoverLightRef.current.color.setHex(accentColor);
    if (btcMatRef.current) btcMatRef.current.emissive.setHex(accentColor);
    if (pMatRef.current) pMatRef.current.color.setHex(accentColor);
    if (lineMatRef.current) lineMatRef.current.color.setHex(accentColor);
  }, [isDark]);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollSpacerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const fixedLayerRef = useRef<HTMLDivElement>(null);

  // Scramble utility
  const scramble = (id: string, finalText: string, duration = 850) => {
    const el = document.getElementById(id);
    if (!el) return;
    const len = finalText.length;
    const t0 = performance.now();

    const tick = () => {
      const p = Math.min((performance.now() - t0) / duration, 1);
      const revealedCount = Math.floor(p * len);
      let str = "";
      for (let i = 0; i < len; i++) {
        if (i < revealedCount) str += finalText[i];
        else if (finalText[i] === " ") str += " ";
        else str += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }
      el.textContent = str;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current || !scrollSpacerRef.current) return;

    // ── INITIALIZE LENIS ──
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // ── THREE.JS SETUP ──
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(BG);
    scene.fog = new THREE.FogExp2(BG, 0.038);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      powerPreference: "high-performance",
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    // Lights
    scene.add(new THREE.AmbientLight(0x111122, 0.6));
    const keyLight = new THREE.PointLight(ACCENT, 4, 30);
    keyLightRef.current = keyLight;
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);
    const fillLight = new THREE.PointLight(0x7c3aed, 1.5, 25);
    fillLight.position.set(-4, -2, 3);
    scene.add(fillLight);
    const hoverLight = new THREE.PointLight(ACCENT, 0, 12);
    hoverLightRef.current = hoverLight;
    scene.add(hoverLight);

    // ── SHADERS & OBJECTS ──

    // ETH — Iridescent Morphing Octahedron
    const ethGeo = new THREE.IcosahedronGeometry(1.4, 4);
    const ethMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMorph: { value: 0 },
        uScale: { value: 1 },
      },
      vertexShader: `
        uniform float uTime, uMorph, uScale;
        varying vec3 vWorldPos, vViewDir, vNorm;
        void main() {
          vec3 p = position;
          float l1 = abs(p.x) + abs(p.y) + abs(p.z);
          vec3 octP = p * (1.4 / max(l1, 0.001));
          p = mix(p, octP, uMorph);
          p *= uScale * (1.0 + sin(uTime * 0.8) * 0.012);
          vNorm = normalize(normalMatrix * normal);
          vec4 wPos = modelMatrix * vec4(p, 1.0);
          vWorldPos = wPos.xyz;
          vec4 mv = viewMatrix * wPos;
          vViewDir = normalize(-mv.xyz);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        varying vec3 vWorldPos, vViewDir, vNorm;
        uniform float uTime;
        vec3 pal(float t) {
          return 0.5 + 0.5 * cos(6.28318 * (t + vec3(0.0, 0.33, 0.67)));
        }
        void main() {
          vec3 dx = dFdx(vWorldPos);
          vec3 dy = dFdy(vWorldPos);
          vec3 n = normalize(cross(dx, dy));
          float NdV = dot(n, vViewDir);
          float fresnel = pow(1.0 - abs(NdV), 2.5);
          vec3 iri = pal(NdV * 1.8 + uTime * 0.12);
          vec3 lDir = normalize(vec3(3.0, 4.0, 5.0));
          float diff = max(dot(n, lDir), 0.0) * 0.55 + 0.45;
          vec3 h = normalize(lDir + vViewDir);
          float spec = pow(max(dot(n, h), 0.0), 80.0);
          vec3 col = iri * diff;
          col += vec3(0.29, 0.87, 0.5) * fresnel * 0.55;
          col += vec3(1.0) * spec * 0.25;
          col += vec3(0.29, 0.87, 0.5) * 0.04;
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
    const ethMesh = new THREE.Mesh(ethGeo, ethMat);
    scene.add(ethMesh);

    // BTC — Bronze Icosahedron
    const btcMat = new THREE.MeshPhysicalMaterial({
      color: 0x8b6c3c,
      metalness: 0.88,
      roughness: 0.42,
      emissive: ACCENT,
      emissiveIntensity: 0.06,
      iridescence: 0.35,
      iridescenceIOR: 1.4,
      transparent: true,
      opacity: 0,
    });
    const btcMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(0.9, 0), btcMat);
    btcMatRef.current = btcMat;
    btcMesh.visible = false;
    scene.add(btcMesh);

    // SOL — Torus Knot
    const solMat = new THREE.MeshPhysicalMaterial({
      color: 0x9945ff,
      metalness: 0.72,
      roughness: 0.15,
      iridescence: 1.0,
      iridescenceIOR: 1.5,
      transparent: true,
      opacity: 0,
    });
    const solMesh = new THREE.Mesh(new THREE.TorusKnotGeometry(0.65, 0.22, 100, 16), solMat);
    solMesh.visible = false;
    scene.add(solMesh);

    // Particles
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(P_COUNT * 3);
    for (let i = 0; i < P_COUNT * 3; i += 3) {
      pPos[i] = (Math.random() - 0.5) * 22;
      pPos[i + 1] = (Math.random() - 0.5) * 16;
      pPos[i + 2] = (Math.random() - 0.5) * 16;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: ACCENT,
      size: 0.028,
      transparent: true,
      opacity: 0.35,
      sizeAttenuation: true,
      depthWrite: false,
    });
    const particles = new THREE.Points(pGeo, pMat);
    pMatRef.current = pMat;
    scene.add(particles);

    // Nodes
    const nodes: THREE.Vector3[] = [];
    for (let i = 0; i < NODE_CT; i++) {
      nodes.push(new THREE.Vector3((Math.random() - 0.5) * 12, (Math.random() - 0.5) * 7, (Math.random() - 0.5) * 7));
    }
    const pNodeMap = new Uint8Array(P_COUNT);
    for (let i = 0; i < P_COUNT; i++) pNodeMap[i] = Math.floor(Math.random() * NODE_CT);

    const edges: [number, number][] = [];
    for (let i = 0; i < NODE_CT; i++) {
      for (let j = i + 1; j < NODE_CT; j++) {
        if (nodes[i].distanceTo(nodes[j]) < 3.2) edges.push([i, j]);
      }
    }
    const lineArr = new Float32Array(edges.length * 6);
    edges.forEach(([a, b], i) => {
      lineArr[i * 6] = nodes[a].x; lineArr[i * 6 + 1] = nodes[a].y; lineArr[i * 6 + 2] = nodes[a].z;
      lineArr[i * 6 + 3] = nodes[b].x; lineArr[i * 6 + 4] = nodes[b].y; lineArr[i * 6 + 5] = nodes[b].z;
    });
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(lineArr, 3));
    const lineMat = new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0, depthWrite: false });
    const lineSegments = new THREE.LineSegments(lineGeo, lineMat);
    lineMatRef.current = lineMat;
    scene.add(lineSegments);

    // Grid
    const grid = new THREE.GridHelper(60, 60, ACCENT, ACCENT);
    grid.position.y = -3.5;
    (grid.material as THREE.Material).opacity = 0.045;
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).depthWrite = false;
    scene.add(grid);

    // ── ANIMATION & SCROLL ──
    const clock = new THREE.Clock();
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);

    let scrollProgress = 0;
    let currentAct = -1;

    const setAct = (i: number) => {
      if (i === currentAct) return;
      currentAct = i;

      const acts = document.querySelectorAll(".hero-act");
      acts.forEach((el, idx) => {
        el.classList.toggle("opacity-100", idx === i);
        el.classList.toggle("opacity-0", idx !== i);
      });

      if (i >= 0 && i < TEXTS.length) {
        scramble(TEXTS[i].id, TEXTS[i].text);
      }
      if (i === 3) scramble("txt3sub", "BMSIT College's Blockchain Club", 650);
      if (i > 0 && scrollHintRef.current) scrollHintRef.current.style.opacity = "0";
    };

    ScrollTrigger.create({
      trigger: scrollSpacerRef.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        scrollProgress = self.progress;
        if (progressRef.current) progressRef.current.style.width = `${scrollProgress * 100}%`;

        // FADE OUT & HIDE LOGIC:
        // Ensures the hero section ceases to exist once passed.
        if (fixedLayerRef.current) {
          const fadeOut = Math.max(0, 1 - (scrollProgress - 0.9) * 10);
          fixedLayerRef.current.style.opacity = scrollProgress > 0.9 ? fadeOut.toString() : "1";
          fixedLayerRef.current.style.visibility = scrollProgress >= 1.0 ? "hidden" : "visible";
          fixedLayerRef.current.style.pointerEvents = scrollProgress >= 1.0 ? "none" : "auto";
        }

        if (scrollProgress < 0.25) setAct(0);
        else if (scrollProgress < 0.50) setAct(1);
        else if (scrollProgress < 0.75) setAct(2);
        else if (scrollProgress < 1.0) setAct(3);
        else setAct(-1); // Hide act text fully at the end
      },
    });

    const animate = () => {
      const dt = clock.getDelta();
      const t = clock.getElapsedTime();

      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;

      camera.position.x = mouse.x * 0.45;
      camera.position.y = mouse.y * 0.30 + 0.2;
      camera.lookAt(0, 0, 0);

      hoverLight.position.set(mouse.x * 3, mouse.y * 3, 4);
      hoverLight.intensity = 0.6 + Math.sin(t * 3) * 0.35;

      ethMesh.rotation.y += dt * 0.18;
      ethMesh.rotation.x += dt * 0.08;
      ethMat.uniforms.uTime.value = t;
      ethMat.uniforms.uMorph.value = Math.sin(t * 0.4) * 0.5 + 0.5;

      btcMesh.rotation.y += dt * 0.25;
      btcMesh.rotation.z += dt * 0.08;
      solMesh.rotation.y += dt * 0.55;
      solMesh.rotation.x += dt * 0.2;

      // Act Logic
      if (scrollProgress < 0.25) {
        ethMat.uniforms.uScale.value += (1.0 - ethMat.uniforms.uScale.value) * 0.05;
        btcMesh.visible = false; solMesh.visible = false;
        btcMat.opacity = 0; solMat.opacity = 0;
        lineMat.opacity = 0;
      } else if (scrollProgress < 0.50) {
        const ap = (scrollProgress - 0.25) / 0.25;
        btcMesh.visible = true; solMesh.visible = true;
        const fadeIn = Math.min(ap * 3, 1);
        btcMat.opacity = fadeIn; solMat.opacity = fadeIn;
        btcMesh.scale.setScalar(fadeIn); solMesh.scale.setScalar(fadeIn);
        const orb = t * 0.35;
        btcMesh.position.set(Math.cos(orb) * 3.2, Math.sin(orb * 0.6) * 1.2, Math.sin(orb) * 3.2);
        solMesh.position.set(Math.cos(orb + Math.PI) * 3.2, Math.sin(orb * 0.6 + Math.PI) * 1.2, Math.sin(orb + Math.PI) * 3.2);
        ethMat.uniforms.uScale.value += (1.0 - ethMat.uniforms.uScale.value) * 0.05;
        lineMat.opacity = 0;
      } else if (scrollProgress < 0.75) {
        const ap = (scrollProgress - 0.50) / 0.25;
        const dissolve = Math.min(ap * 2.5, 1);
        ethMat.uniforms.uScale.value += ((1 - dissolve) - ethMat.uniforms.uScale.value) * 0.08;
        btcMesh.scale.setScalar(Math.max(1 - dissolve, 0));
        solMesh.scale.setScalar(Math.max(1 - dissolve, 0));
        btcMat.opacity = 1 - dissolve; solMat.opacity = 1 - dissolve;
        lineMat.opacity += (dissolve * 0.25 - lineMat.opacity) * 0.06;
      } else {
        const ap = (scrollProgress - 0.75) / 0.25;
        ethMat.uniforms.uScale.value += (ap * 0.55 - ethMat.uniforms.uScale.value) * 0.05;
        ethMesh.position.lerp(new THREE.Vector3(0, 0, 0), 0.03);
        btcMesh.visible = true; solMesh.visible = true;
        btcMesh.scale.setScalar(ap * 0.45); solMesh.scale.setScalar(ap * 0.45);
        btcMat.opacity = ap; solMat.opacity = ap;
        btcMesh.position.lerp(new THREE.Vector3(-2.5, 1.2, -1), 0.03);
        solMesh.position.lerp(new THREE.Vector3(2.5, -1, -1), 0.03);
        lineMat.opacity += (0.18 - lineMat.opacity) * 0.04;
      }

      // Particles
      const pa = pGeo.attributes.position.array as Float32Array;
      if (scrollProgress < 0.50) {
        pMat.opacity += (0.30 - pMat.opacity) * 0.05;
        pMat.size = 0.028;
        for (let i = 0; i < P_COUNT; i++) {
          const i3 = i * 3;
          pa[i3] += Math.sin(t * 0.08 + i * 0.11) * 0.0015;
          pa[i3 + 1] += Math.cos(t * 0.07 + i * 0.07) * 0.0015;
          pa[i3 + 2] += Math.sin(t * 0.09 + i * 0.04) * 0.0015;
        }
      } else if (scrollProgress < 0.75) {
        pMat.opacity += (0.55 - pMat.opacity) * 0.04;
        pMat.size = 0.038;
        const ap = (scrollProgress - 0.50) / 0.25;
        const spd = 0.015 + ap * 0.04;
        for (let i = 0; i < P_COUNT; i++) {
          const nd = nodes[pNodeMap[i]];
          const i3 = i * 3;
          const jit = 0.22;
          const tx = nd.x + Math.sin(i * 0.1 + t * 0.4) * jit;
          const ty = nd.y + Math.cos(i * 0.13 + t * 0.4) * jit;
          const tz = nd.z + Math.sin(i * 0.07 + t * 0.4) * jit;
          pa[i3] += (tx - pa[i3]) * spd;
          pa[i3 + 1] += (ty - pa[i3 + 1]) * spd;
          pa[i3 + 2] += (tz - pa[i3 + 2]) * spd;
        }
      } else {
        pMat.opacity += (0.45 - pMat.opacity) * 0.04;
        for (let i = 0; i < P_COUNT; i++) {
          const nd = nodes[pNodeMap[i]];
          const i3 = i * 3;
          const jit = 0.15;
          const tx = nd.x + Math.sin(i * 0.1 + t * 0.25) * jit;
          const ty = nd.y + Math.cos(i * 0.13 + t * 0.25) * jit;
          const tz = nd.z + Math.sin(i * 0.07 + t * 0.25) * jit;
          pa[i3] += (tx - pa[i3]) * 0.015;
          pa[i3 + 1] += (ty - pa[i3 + 1]) * 0.015;
          pa[i3 + 2] += (tz - pa[i3 + 2]) * 0.015;
        }
      }
      pGeo.attributes.position.needsUpdate = true;
      grid.material.opacity = 0.04 + Math.sin(t * 0.3) * 0.01;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    setAct(0);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      ScrollTrigger.getAll().forEach(t => t.kill());
      lenis.destroy();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative z-0 bg-background">
      {/* 
          WRAPPER FOR FIXED ELEMENTS 
          This layer manages the definitive "stop" for the hero visuals.
      */}
      <div ref={fixedLayerRef} className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-300">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-[1] transition-colors duration-500 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(217,217,217,0.85)_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(32,34,33,0.85)_100%)]" />

        {/* Progress Bar */}
        <div ref={progressRef} className="absolute top-0 left-0 h-[2px] bg-accent z-30 transition-[width] duration-75" style={{ width: "0%" }} />

        {/* Hero Logo — top-left, large */}
        <div className="absolute top-0 left-0 z-20 pointer-events-none">
          <Image
            src={isDark ? "/logos/club-dark.svg" : "/logos/club-light.svg"}
            alt="WEB.3 BMSIT"
            width={220}
            height={150}
            className="object-contain"
            priority
          />
        </div>

        {/* Canvas */}
        <canvas ref={canvasRef} className="absolute top-0 left-0 z-[1] transition-opacity duration-300" />

        {/* Hero Content Overlay */}
        <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center px-4">
          {TEXTS.map((t, i) => (
            <div
              key={t.id}
              className={`hero-act absolute inset-0 flex flex-col items-center justify-center p-6 sm:p-8 transition-opacity duration-500 opacity-0 w-full max-w-[calc(100vw-2rem)] mx-auto`}
            >
              {i === 3 ? (
                <div className="flex flex-col items-center">
                  <h1 id={t.id} className="text-[clamp(2.4rem,10vw,8rem)] font-logo text-center uppercase tracking-tighter leading-[0.9] text-[#202221] dark:text-[#D9D9D9]" />
                  <p id="txt3sub" className="mt-4 text-[clamp(0.55rem,1.4vw,0.9rem)] font-semibold uppercase tracking-[0.25em] text-foreground/30 text-center" />
                  <button className="pointer-events-auto mt-12 px-10 py-4 bg-accent text-background font-bold uppercase tracking-widest text-[10px] sm:text-xs hover:scale-105 transition-transform shadow-[0_0_20px_rgba(74,222,128,0.25)] ring-1 ring-accent/20 active:scale-95">
                    Join the Chain →
                  </button>
                </div>
              ) : (
                <p id={t.id} className="text-[clamp(1.1rem,4vw,2.4rem)] font-bold text-center max-w-2xl leading-[1.2] text-foreground/90 drop-shadow-sm" />
              )}
            </div>
          ))}
        </div>

        {/* Scroll Hint */}
        <div ref={scrollHintRef} className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-[9px] font-bold uppercase tracking-[0.35em] text-foreground/20 transition-opacity duration-500">
          <span className="inline-block animate-bounce">↓ scroll to explore</span>
        </div>
      </div>

      {/* Scroll Spacer */}
      <div ref={scrollSpacerRef} className="h-[500vh] pointer-events-none" />
    </div>
  );
}
