const fs = require('fs');
const path = 'src/app/components/Hero.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  'import { useEffect, useRef } from "react";',
  'import { useEffect, useRef } from "react";\nimport { useTheme } from "next-themes";'
);

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

content = content.replace('bg-[#08080c]', 'bg-background');

content = content.replace(
  '<div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(8,8,12,0.85)_100%)]" />',
  '<div className={`absolute inset-0 z-[1] transition-colors duration-500 ${isDark ? "bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(32,34,33,0.85)_100%)]" : "bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(217,217,217,0.85)_100%)]"}`} />'
);

content = content.replace('bg-green-400 z-30', 'bg-accent z-30');
content = content.replace('from-white via-white to-green-400', 'from-foreground via-foreground to-accent');
content = content.replace('text-white/30 text-center', 'text-foreground/30 text-center');
content = content.replace('bg-green-400 text-black', 'bg-accent text-background');
content = content.replace('ring-green-400/20', 'ring-accent/20');
content = content.replace('text-white/90 drop-shadow-sm', 'text-foreground/90 drop-shadow-sm');
content = content.replace('text-white/20 transition-opacity', 'text-foreground/20 transition-opacity');
content = content.replace('const ACCENT = 0x4ade80;', 'const ACCENT = 0xcdef33;');
content = content.replace('const BG = 0x08080c;', 'const BG = 0x202221;');

fs.writeFileSync(path, content);
console.log('Script done without errors');
