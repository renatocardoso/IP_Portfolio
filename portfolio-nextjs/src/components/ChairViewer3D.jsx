"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// --- Ícones SVG Inline Autônomos (Sem dependências externas) ---
function IconRotateCcw({ className = "w-3.5 h-3.5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

function IconPlay({ className = "w-3.5 h-3.5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  );
}

function IconPause({ className = "w-3.5 h-3.5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </svg>
  );
}

function IconSparkles({ className = "w-3.5 h-3.5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}

// --- Paletas e Definições de Materiais ---
export const FABRIC_OPTIONS = [
  {
    id: "natural_beige",
    name: "Bege Cru",
    nameEn: "Raw Beige",
    color: "#E5DFD4",
    sheenColor: "#FAF7F2",
    roughness: 0.88,
    sheen: 0.35,
    preview: "#E0D9CD",
    // Configuração de Mapas de Textura:
    // - null: utiliza os mapas de alta resolução originais incorporados no próprio arquivo GLB.
    // - string (ex: "/textures/meu_tecido.jpg" ou URL do UploadThing): carrega o mapa personalizado.
    mapUrl: null,
    normalMapUrl: null,
    bumpMapUrl: null,
    description: "Tecido bouclé encorpado com textura tátil e fibra natural suave."
  },
  {
    id: "green_boucle",
    name: "Verde Bouclé",
    nameEn: "Sage Bouclé",
    color: "#52624D",
    sheenColor: "#75876F",
    roughness: 0.88,
    sheen: 0.30,
    preview: "#52624D",
    mapUrl: null,
    normalMapUrl: null,
    bumpMapUrl: null,
    description: "Bouclé oliva suave inspirado na luz filtrada por vegetação."
  },
  {
    id: "terracotta",
    name: "Terracota",
    nameEn: "Terracotta",
    color: "#9E5638",
    sheenColor: "#B86B4B",
    roughness: 0.88,
    sheen: 0.30,
    preview: "#9E5638",
    mapUrl: null,
    normalMapUrl: null,
    bumpMapUrl: null,
    description: "Tonalidade terrosa acolhedora com acabamento mate aveludado."
  },
  {
    id: "graphite",
    name: "Grafite",
    nameEn: "Graphite",
    color: "#343436",
    sheenColor: "#545456",
    roughness: 0.88,
    sheen: 0.25,
    preview: "#343436",
    mapUrl: null,
    normalMapUrl: null,
    bumpMapUrl: null,
    description: "Trama mesclada escura elegante de alta profundidade visual."
  }
];

export const WOOD_OPTIONS = [
  {
    id: "light_oak",
    name: "Carvalho Claro",
    nameEn: "Light Oak",
    color: "#C49B6E",
    roughness: 0.42,
    clearcoat: 0.08,
    clearcoatRoughness: 0.25,
    preview: "#C49B6E",
    // Configuração de Mapas de Textura para Madeira:
    mapUrl: null,
    bumpMapUrl: null,
    description: "Madeira nobre natural clara com veios discretos e toque acetinado."
  },
  {
    id: "walnut",
    name: "Nogueira",
    nameEn: "Walnut",
    color: "#543825",
    roughness: 0.38,
    clearcoat: 0.12,
    clearcoatRoughness: 0.20,
    preview: "#543825",
    mapUrl: null,
    bumpMapUrl: null,
    description: "Madeira escura e rica com transições quentes de castanho profundo."
  },
  {
    id: "ebonized",
    name: "Ebanizado",
    nameEn: "Ebonized",
    color: "#222224",
    roughness: 0.35,
    clearcoat: 0.15,
    clearcoatRoughness: 0.18,
    preview: "#222224",
    mapUrl: null,
    bumpMapUrl: null,
    description: "Acabamento preto profundo com brilho acetinado arquitetural."
  }
];

// Gerador procedural de textura de relevo para Bouclé
function createProceduralBoucleTexture() {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, 512, 512);

  // Criar loops e nós bouclé
  const imgData = ctx.getImageData(0, 0, 512, 512);
  const data = imgData.data;
  for (let y = 0; y < 512; y++) {
    for (let x = 0; x < 512; x++) {
      const idx = (y * 512 + x) * 4;
      const n1 = Math.sin(x * 0.15) * Math.cos(y * 0.15);
      const n2 = Math.sin(x * 0.4 + y * 0.2) * 0.5;
      const noise = (Math.random() - 0.5) * 45;
      const val = Math.max(30, Math.min(220, 128 + n1 * 50 + n2 * 30 + noise));
      data[idx] = val;
      data[idx + 1] = val;
      data[idx + 2] = val;
    }
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(16, 16);
  return texture;
}

// Gerador procedural de veios sutis de madeira
function createProceduralWoodTexture() {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, 512, 512);

  const imgData = ctx.getImageData(0, 0, 512, 512);
  const data = imgData.data;
  for (let y = 0; y < 512; y++) {
    const grain = Math.sin(y * 0.08 + Math.sin(y * 0.02) * 4) * 35;
    for (let x = 0; x < 512; x++) {
      const idx = (y * 512 + x) * 4;
      const micro = (Math.random() - 0.5) * 15;
      const val = Math.max(40, Math.min(210, 128 + grain + micro));
      data[idx] = val;
      data[idx + 1] = val;
      data[idx + 2] = val;
    }
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 8);
  return texture;
}

export default function ChairViewer3D({
  modelUrl = "/models/movie10.glb",
  initialFabric = "natural_beige",
  initialWood = "light_oak",
  className = ""
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  const [selectedFabric, setSelectedFabric] = useState(initialFabric);
  const [selectedWood, setSelectedWood] = useState(initialWood);
  const [autoRotate, setAutoRotate] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);

  // Referências para controle interno Three.js
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const chairModelRef = useRef(null);
  const woodMeshesRef = useRef([]);
  const fabricMeshesRef = useRef([]);
  const animationFrameIdRef = useRef(null);
  const texturesRef = useRef({ boucle: null, wood: null });
  const textureCacheRef = useRef({});

  // Armazena os mapas originais incorporados no arquivo GLB
  const originalTexturesRef = useRef({
    woodMap: null,
    woodNormalMap: null,
    woodBumpMap: null,
    fabricMap: null,
    fabricNormalMap: null,
    fabricBumpMap: null
  });

  // Helper para carregar texturas externas (locais /textures/ ou CDN UploadThing)
  const getTexture = useCallback((url, isColor = true) => {
    if (!url) return null;
    if (!textureCacheRef.current[url]) {
      const loader = new THREE.TextureLoader();
      const tex = loader.load(url, () => {
        if (rendererRef.current && sceneRef.current && cameraRef.current) {
          rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
      });
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      if (isColor) {
        tex.colorSpace = THREE.SRGBColorSpace;
      }
      textureCacheRef.current[url] = tex;
    }
    return textureCacheRef.current[url];
  }, []);

  // Atualizar materiais nos meshes da cadeira
  const applyMaterials = useCallback((fabricId, woodId) => {
    const fabricConfig = FABRIC_OPTIONS.find((f) => f.id === fabricId) || FABRIC_OPTIONS[0];
    const woodConfig = WOOD_OPTIONS.find((w) => w.id === woodId) || WOOD_OPTIONS[0];

    // Resolver mapas de textura para o tecido
    const fabricMap = fabricConfig.mapUrl
      ? getTexture(fabricConfig.mapUrl, true)
      : originalTexturesRef.current.fabricMap;

    const fabricNormal = fabricConfig.normalMapUrl
      ? getTexture(fabricConfig.normalMapUrl, false)
      : originalTexturesRef.current.fabricNormalMap;

    const fabricBump = fabricConfig.bumpMapUrl
      ? getTexture(fabricConfig.bumpMapUrl, false)
      : (fabricNormal ? null : texturesRef.current.boucle);

    // Resolver mapas de textura para a madeira
    const woodMap = woodConfig.mapUrl
      ? getTexture(woodConfig.mapUrl, true)
      : originalTexturesRef.current.woodMap;

    const woodBump = woodConfig.bumpMapUrl
      ? getTexture(woodConfig.bumpMapUrl, false)
      : texturesRef.current.wood;

    // Criar material PBR de Tecido Bouclé com mapas reais
    const fabricMaterial = new THREE.MeshPhysicalMaterial({
      map: fabricMap || null,
      color: fabricMap
        ? new THREE.Color(fabricConfig.color).multiplyScalar(1.1)
        : new THREE.Color(fabricConfig.color),
      normalMap: fabricNormal || null,
      normalScale: fabricNormal ? new THREE.Vector2(1.5, 1.5) : undefined,
      bumpMap: fabricBump || null,
      bumpScale: 0.003,
      roughness: fabricConfig.roughness,
      metalness: 0.0,
      sheen: fabricConfig.sheen,
      sheenColor: new THREE.Color(fabricConfig.sheenColor),
      sheenRoughness: 0.5,
      side: THREE.DoubleSide
    });

    // Criar material PBR de Madeira com mapas reais
    const woodMaterial = new THREE.MeshPhysicalMaterial({
      map: woodMap || null,
      color: woodMap
        ? new THREE.Color(woodConfig.color).multiplyScalar(1.15)
        : new THREE.Color(woodConfig.color),
      bumpMap: woodBump || null,
      bumpScale: 0.0015,
      roughness: woodConfig.roughness,
      metalness: 0.0,
      clearcoat: woodConfig.clearcoat,
      clearcoatRoughness: woodConfig.clearcoatRoughness,
      side: THREE.FrontSide
    });

    fabricMeshesRef.current.forEach((mesh) => {
      mesh.material = fabricMaterial;
      mesh.material.needsUpdate = true;
    });

    woodMeshesRef.current.forEach((mesh) => {
      mesh.material = woodMaterial;
      mesh.material.needsUpdate = true;
    });
  }, [getTexture]);

  // Efeito para troca dinâmica de materiais
  useEffect(() => {
    applyMaterials(selectedFabric, selectedWood);
  }, [selectedFabric, selectedWood, applyMaterials]);

  // Efeito principal de setup da cena Three.js
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Inicializar texturas procedurais
    texturesRef.current.boucle = createProceduralBoucleTexture();
    texturesRef.current.wood = createProceduralWoodTexture();

    // 1. CENA
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#F0ECE4");
    sceneRef.current = scene;

    // 2. RENDERIZADOR
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: "high-performance",
      alpha: false
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // 3. CÂMERA
    const camera = new THREE.PerspectiveCamera(36, 16 / 9, 0.1, 50);
    camera.position.set(2.4, 1.4, 2.8);
    cameraRef.current = camera;

    // 4. CONTROLES DE ÓRBITA
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // Não atravessar o chão
    controls.minDistance = 1.2;
    controls.maxDistance = 5.0;
    controls.target.set(0, 0.38, 0);
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 0.8;
    controlsRef.current = controls;

    // 5. ILUMINAÇÃO ESTÚDIO EDITORIAL (Inspirada em reference.png)
    // Luz solar direta angular quente
    const sunLight = new THREE.DirectionalLight("#FFF8EE", 2.2);
    sunLight.position.set(3.8, 6.5, 3.2);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 18;
    sunLight.shadow.camera.left = -1.6;
    sunLight.shadow.camera.right = 1.6;
    sunLight.shadow.camera.top = 1.6;
    sunLight.shadow.camera.bottom = -1.6;
    sunLight.shadow.bias = -0.00015;
    sunLight.shadow.radius = 3.5;
    scene.add(sunLight);

    // Luz de preenchimento ambiente (Hemisphere)
    const hemiLight = new THREE.HemisphereLight("#FFFDF7", "#E4DCD0", 0.9);
    hemiLight.position.set(0, 10, 0);
    scene.add(hemiLight);

    // Luz de preenchimento suave traseira
    const bounceLight = new THREE.DirectionalLight("#F3EADA", 0.6);
    bounceLight.position.set(-3.5, 2.5, -2.5);
    scene.add(bounceLight);

    // 6. PLANO DE CHÃO COM SOMBRA DE CONTATO
    const floorGeo = new THREE.PlaneGeometry(24, 24);
    const floorMat = new THREE.ShadowMaterial({
      opacity: 0.28
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);

    // 7. CARREGAMENTO DO MODELO GLB DA CADEIRA
    const loader = new GLTFLoader();
    loader.load(
      modelUrl,
      (gltf) => {
        const chair = gltf.scene;
        chairModelRef.current = chair;

        // Calcular BoundingBox para centralizar e apoiar perfeitamente no chão
        const box = new THREE.Box3().setFromObject(chair);
        const size = new THREE.Vector3();
        box.getSize(size);
        const center = new THREE.Vector3();
        box.getCenter(center);

        // Escala normalizada para altura elegante de ~78cm (0.78m)
        const targetHeight = 0.78;
        const scaleFactor = targetHeight / (size.y || 1);
        chair.scale.set(scaleFactor, scaleFactor, scaleFactor);

        // Centralizar x/z e assentar o ponto mais baixo no y = 0
        chair.position.x = -center.x * scaleFactor;
        chair.position.z = -center.z * scaleFactor;
        chair.position.y = -box.min.y * scaleFactor;

        // Categorizar meshes entre madeira e tecido
        const woodMeshes = [];
        const fabricMeshes = [];

        chair.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;

            const name = (child.name || "").toLowerCase();
            const matName = (child.material?.name || "").toLowerCase();

            // Identificação baseada na hierarquia inspecionada do GLB
            // Mesh 11 (030) e ChamferBox3537-3540 são o sling de tecido
            const isFabric =
              name.includes("030") ||
              name.includes("chamferbox3537") ||
              name.includes("chamferbox3538") ||
              name.includes("chamferbox3539") ||
              name.includes("chamferbox3540") ||
              matName.includes("1152") ||
              name.includes("fabric") ||
              name.includes("seat") ||
              name.includes("backrest");

            if (isFabric) {
              fabricMeshes.push(child);
              if (!originalTexturesRef.current.fabricMap && child.material?.map) {
                originalTexturesRef.current.fabricMap = child.material.map;
              }
              if (!originalTexturesRef.current.fabricNormalMap && child.material?.normalMap) {
                originalTexturesRef.current.fabricNormalMap = child.material.normalMap;
              }
            } else {
              woodMeshes.push(child);
              if (!originalTexturesRef.current.woodMap && child.material?.map) {
                originalTexturesRef.current.woodMap = child.material.map;
              }
              if (!originalTexturesRef.current.woodNormalMap && child.material?.normalMap) {
                originalTexturesRef.current.woodNormalMap = child.material.normalMap;
              }
            }
          }
        });

        woodMeshesRef.current = woodMeshes;
        fabricMeshesRef.current = fabricMeshes;

        // Aplicar materiais selecionados
        applyMaterials(selectedFabric, selectedWood);

        scene.add(chair);
        setLoading(false);
      },
      (xhr) => {
        if (xhr.total > 0) {
          setLoadProgress(Math.round((xhr.loaded / xhr.total) * 100));
        }
      },
      (error) => {
        console.error("Erro ao carregar modelo 3D:", error);
        setLoading(false);
      }
    );

    // 8. RESIZE OBSERVER (Garante 16:9 em Desktop e 9:16 em Mobile sem corte)
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width === 0 || height === 0) return;

      const aspect = width / height;
      camera.aspect = aspect;

      // Se for vertical (Mobile 9:16), recuar suavemente a câmera para não cortar a cadeira nas laterais
      if (aspect < 1) {
        // Enquadramento Mobile
        const distanceMultiplier = Math.max(1.15, 0.65 / aspect);
        camera.position.set(2.4 * distanceMultiplier, 1.35 * distanceMultiplier, 2.8 * distanceMultiplier);
        controls.target.set(0, 0.38, 0);
      } else {
        // Enquadramento Desktop
        camera.position.set(2.4, 1.4, 2.8);
        controls.target.set(0, 0.38, 0);
      }

      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    handleResize();

    // 9. LOOP DE RENDERIZAÇÃO
    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, [modelUrl, applyMaterials]);

  // Atualizar autoRotate nos controles
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  // Resetar visualização da câmera
  const handleResetCamera = () => {
    if (!cameraRef.current || !controlsRef.current || !containerRef.current) return;
    const aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
    if (aspect < 1) {
      const distanceMultiplier = Math.max(1.15, 0.65 / aspect);
      cameraRef.current.position.set(2.4 * distanceMultiplier, 1.35 * distanceMultiplier, 2.8 * distanceMultiplier);
    } else {
      cameraRef.current.position.set(2.4, 1.4, 2.8);
    }
    controlsRef.current.target.set(0, 0.38, 0);
    controlsRef.current.update();
  };

  const currentFabricObj = FABRIC_OPTIONS.find((f) => f.id === selectedFabric);
  const currentWoodObj = WOOD_OPTIONS.find((w) => w.id === selectedWood);

  return (
    <div className={`w-full flex flex-col items-center select-none ${className}`}>
      {/* 
        CONTAINER RESPONSIVO PRINCIPAL:
        - Mobile: Vertical 9:16 (aspect-[9/16]), max-w-sm
        - Desktop: Horizontal 16:9 (aspect-video / md:aspect-video), max-w-5xl
      */}
      <div className="relative w-full aspect-[9/16] md:aspect-video bg-[#F0ECE4] rounded-sm overflow-hidden border border-[#E2DDD5] shadow-sm flex flex-col md:flex-row">
        
        {/* --- MENU MOBILE (TOP BAR / HEADER) --- */}
        <div className="md:hidden flex flex-col p-4 bg-[#F0ECE4]/90 backdrop-blur-md border-b border-[#E2DDD5] z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-[0.7rem] uppercase tracking-widest font-bold text-[#666]">
                Movie 3D Studio
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className="p-1.5 text-xs text-[#555] hover:text-black rounded bg-white/70"
                title="Girar"
              >
                {autoRotate ? <IconPause className="w-3.5 h-3.5" /> : <IconPlay className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={handleResetCamera}
                className="p-1.5 text-xs text-[#555] hover:text-black rounded bg-white/70"
                title="Resetar"
              >
                <IconRotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Seletores rápidos Mobile */}
          <div className="flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              <span className="text-[0.65rem] text-[#888] uppercase font-bold mr-1">Tecido:</span>
              {FABRIC_OPTIONS.map((fab) => (
                <button
                  key={fab.id}
                  onClick={() => setSelectedFabric(fab.id)}
                  style={{ backgroundColor: fab.preview }}
                  className={`w-6 h-6 rounded-full border transition-transform ${
                    selectedFabric === fab.id
                      ? "ring-2 ring-black scale-110 border-white"
                      : "border-black/20 opacity-80 hover:opacity-100"
                  }`}
                  aria-label={fab.name}
                />
              ))}
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              <span className="text-[0.65rem] text-[#888] uppercase font-bold mr-1">Madeira:</span>
              {WOOD_OPTIONS.map((wood) => (
                <button
                  key={wood.id}
                  onClick={() => setSelectedWood(wood.id)}
                  style={{ backgroundColor: wood.preview }}
                  className={`w-6 h-6 rounded-full border transition-transform ${
                    selectedWood === wood.id
                      ? "ring-2 ring-black scale-110 border-white"
                      : "border-black/20 opacity-80 hover:opacity-100"
                  }`}
                  aria-label={wood.name}
                />
              ))}
            </div>
          </div>
        </div>

        {/* --- ÁREA DO CANVAS 3D --- */}
        <div ref={containerRef} className="relative flex-1 w-full h-full min-h-0">
          <canvas ref={canvasRef} className="w-full h-full block outline-none cursor-grab active:cursor-grabbing" />

          {/* Indicador de Carregamento */}
          {loading && (
            <div className="absolute inset-0 bg-[#F0ECE4] flex flex-col items-center justify-center gap-3 z-20 transition-opacity duration-500">
              <div className="w-8 h-8 border-2 border-black/15 border-t-black rounded-full animate-spin" />
              <p className="text-xs uppercase tracking-widest text-[#777]">
                Carregando modelo 3D {loadProgress > 0 ? `${loadProgress}%` : ""}
              </p>
            </div>
          )}

          {/* Dica de Interação Floating (Desktop) */}
          <div className="hidden md:flex absolute bottom-4 left-4 items-center gap-2 px-3 py-1.5 bg-white/70 backdrop-blur-sm rounded text-[0.7rem] text-[#666] border border-[#E2DDD5]">
            <IconSparkles className="w-3.5 h-3.5 text-[#333]" />
            <span>Arraste para girar em 360° • Scroll para zoom</span>
          </div>

          {/* Botões de Ação Flutuantes (Desktop) */}
          <div className="hidden md:flex absolute top-4 left-4 items-center gap-1.5 z-10">
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs backdrop-blur-md transition-colors ${
                autoRotate
                  ? "bg-black text-white"
                  : "bg-white/80 text-[#333] hover:bg-white border border-[#E2DDD5]"
              }`}
            >
              {autoRotate ? <IconPause className="w-3 h-3" /> : <IconPlay className="w-3 h-3" />}
              <span>{autoRotate ? "Pausar Giro" : "Giro Automático"}</span>
            </button>
            <button
              onClick={handleResetCamera}
              className="p-1.5 rounded text-xs bg-white/80 hover:bg-white text-[#333] border border-[#E2DDD5] backdrop-blur-md"
              title="Restaurar Enquadramento Editorial"
            >
              <IconRotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* --- MENU DESKTOP (SIDEBAR DIREITA) --- */}
        <aside className="hidden md:flex flex-col justify-between w-80 p-6 bg-[#F0ECE4]/95 border-l border-[#E2DDD5] z-10 overflow-y-auto">
          <div>
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E2DDD5]">
              <div>
                <span className="text-[0.65rem] tracking-widest uppercase font-bold text-[#888] block">
                  Customizador 3D
                </span>
                <h3 className="text-base font-medium text-[#222]">Poltrona Movie</h3>
              </div>
              <span className="px-2 py-0.5 text-[0.6rem] bg-black text-white uppercase tracking-wider rounded">
                Editorial
              </span>
            </div>

            {/* SELEÇÃO DE TECIDO (BOUCLÉ) */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs uppercase tracking-wider font-bold text-[#444]">
                  Assento & Encosto
                </label>
                <span className="text-[0.7rem] text-[#666] font-medium">{currentFabricObj?.name}</span>
              </div>
              <p className="text-[0.7rem] text-[#777] mb-3 leading-relaxed">
                Tecido bouclé tridimensional de toque suave.
              </p>
              <div className="grid grid-cols-4 gap-2">
                {FABRIC_OPTIONS.map((fabric) => (
                  <button
                    key={fabric.id}
                    onClick={() => setSelectedFabric(fabric.id)}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded border transition-all ${
                      selectedFabric === fabric.id
                        ? "bg-white border-black shadow-sm ring-1 ring-black"
                        : "bg-white/50 border-[#DDD7CD] hover:bg-white hover:border-[#BBB]"
                    }`}
                  >
                    <span
                      className="w-5 h-5 rounded-full border border-black/10 shadow-inner"
                      style={{ backgroundColor: fabric.preview }}
                    />
                    <span className="text-[0.65rem] text-[#444] text-center leading-tight truncate w-full">
                      {fabric.name.replace(" Bouclé", "")}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* SELEÇÃO DE MADEIRA */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs uppercase tracking-wider font-bold text-[#444]">
                  Estrutura & Braços
                </label>
                <span className="text-[0.7rem] text-[#666] font-medium">{currentWoodObj?.name}</span>
              </div>
              <p className="text-[0.7rem] text-[#777] mb-3 leading-relaxed">
                Madeira maciça natural com usinagem suave nos cantos.
              </p>
              <div className="grid grid-cols-3 gap-2">
                {WOOD_OPTIONS.map((wood) => (
                  <button
                    key={wood.id}
                    onClick={() => setSelectedWood(wood.id)}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded border transition-all ${
                      selectedWood === wood.id
                        ? "bg-white border-black shadow-sm ring-1 ring-black"
                        : "bg-white/50 border-[#DDD7CD] hover:bg-white hover:border-[#BBB]"
                    }`}
                  >
                    <span
                      className="w-5 h-5 rounded-full border border-black/10 shadow-inner"
                      style={{ backgroundColor: wood.preview }}
                    />
                    <span className="text-[0.65rem] text-[#444] text-center leading-tight truncate w-full">
                      {wood.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Rodapé do Menu Lateral */}
          <div className="pt-4 border-t border-[#E2DDD5] text-[0.65rem] text-[#888] flex items-center justify-between">
            <span>Render: ACES Filmic</span>
            <span>Three.js PBR</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
