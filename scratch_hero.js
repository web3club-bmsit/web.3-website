const fs = require('fs');
const path = 'src/app/components/Hero.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Import useTheme
if (!content.includes('import { useTheme }')) {
  content = content.replace(
    'import { useEffect, useRef } from "react";',
    'import { useEffect, useRef } from "react";\nimport { useTheme } from "next-themes";'
  );
}

// 2. Add refs and useTheme to Hero
if (!content.includes('const { resolvedTheme }')) {
  content = content.replace(
    'export default function Hero() {',
    `export default function Hero() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";

  const sceneRef = useRef<THREE.Scene | null>(null);
  const keyLightRef = useRef<THREE.PointLight | null>(null);
  const hoverLightRef = useRef<THREE.PointLight | null>(null);
  const btcMatRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const pMatRef = useRef<THREE.PointsMaterial | null>(null);
  const lineMatRef = useRef<THREE.LineBasicMaterial | null>(null);
  const gridRef = useRef<THREE.GridHelper | null>(null);

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
`
  );
}

// 3. Store references in the refs
content = content.replace(
  'const scene = new THREE.Scene();',
  'const scene = new THREE.Scene();\n    sceneRef.current = scene;'
);
content = content.replace(
  'const keyLight = new THREE.PointLight(ACCENT, 4, 30);',
  'const keyLight = new THREE.PointLight(ACCENT, 4, 30);\n    keyLightRef.current = keyLight;'
);
content = content.replace(
  'const hoverLight = new THREE.PointLight(ACCENT, 0, 12);',
  'const hoverLight = new THREE.PointLight(ACCENT, 0, 12);\n    hoverLightRef.current = hoverLight;'
);
content = content.replace(
  'const btcMat = new THREE.MeshPhysicalMaterial({',
  'const btcMat = new THREE.MeshPhysicalMaterial({\n      emissive: ACCENT,'
);
// wait, btcMat already has emissive: ACCENT. Let's just append the ref assignment after creation
content = content.replace(
  'const btcMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(0.9, 0), btcMat);',
  'const btcMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(0.9, 0), btcMat);\n    btcMatRef.current = btcMat;'
);
content = content.replace(
  'const particles = new THREE.Points(pGeo, pMat);',
  'const particles = new THREE.Points(pGeo, pMat);\n    pMatRef.current = pMat;'
);
content = content.replace(
  'const lineSegments = new THREE.LineSegments(lineGeo, lineMat);',
  'const lineSegments = new THREE.LineSegments(lineGeo, lineMat);\n    lineMatRef.current = lineMat;'
);
content = content.replace(
  'const grid = new THREE.GridHelper(60, 60, ACCENT, ACCENT);',
  'const grid = new THREE.GridHelper(60, 60, ACCENT, ACCENT);\n    gridRef.current = grid;'
);


// 4. Modify DOM nodes
// Remove bg-[#08080c]
content = content.replace(/bg-\[\#08080c\]/g, 'bg-background');

// Replace vignette gradient
const darkVignette = "bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(32,34,33,0.85)_100%)]";
const lightVignette = "bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(217,217,217,0.85)_100%)]";
content = content.replace(
  '<div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(8,8,12,0.85)_100%)]" />',
  \`<div className={\\\`absolute inset-0 z-[1] \\\${isDark ? "\${darkVignette}" : "\${lightVignette}"}\\\`} />\`
);

// Progress bar
content = content.replace(
  'bg-green-400 z-30',
  'bg-accent z-30'
);

// Act 3 Text gradient
content = content.replace(
  'from-white via-white to-green-400',
  'from-foreground via-foreground to-accent'
);

// Act 3 subtitle
content = content.replace(
  'text-white/30 text-center',
  'text-foreground/30 text-center'
);

// Act 3 button
content = content.replace(
  'bg-green-400 text-black',
  'bg-accent text-background'
);
content = content.replace(
  'ring-green-400/20',
  'ring-accent/20'
);
content = content.replace(
  'shadow-[0_0_20px_rgba(74,222,128,0.25)]',
  'shadow-none' // or dynamically change
);

// Act text (non-3)
content = content.replace(
  'text-white/90 drop-shadow-sm',
  'text-foreground/90 drop-shadow-sm'
);

// Scroll hint
content = content.replace(
  'text-white/20',
  'text-foreground/20'
);

// Change constants to avoid conflict, although we're using dynamic anyway.
// But we still need ACCENT to default to 0xcdef33
content = content.replace('const ACCENT = 0x4ade80;', 'const ACCENT = 0xcdef33;');

fs.writeFileSync(path, content);
console.log('Script done.');
