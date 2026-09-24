"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

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
    controls.autoRotate = false;
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

  return (
    <div className={`w-full flex flex-col items-center select-none ${className}`}>
      <div className="relative w-full bg-[#F0ECE4] rounded-sm overflow-hidden border border-[#E2DDD5] shadow-sm flex flex-col">
        {/* --- ÁREA DO CANVAS 3D --- */}
        <div ref={containerRef} className="relative w-full aspect-[4/3] md:aspect-video">
          <canvas
            ref={canvasRef}
            className="w-full h-full block outline-none cursor-grab active:cursor-grabbing"
          />

          {/* Indicador de Carregamento */}
          {loading && (
            <div className="absolute inset-0 bg-[#F0ECE4] flex flex-col items-center justify-center gap-3 z-20 transition-opacity duration-500">
              <div className="w-8 h-8 border-2 border-black/15 border-t-black rounded-full animate-spin" />
              <p
                className="font-sans text-xs uppercase tracking-widest text-[#777]"
                style={{ fontFamily: "var(--font-fira), sans-serif" }}
              >
                Carregando modelo 3D {loadProgress > 0 ? `${loadProgress}%` : ""}
              </p>
            </div>
          )}
        </div>

        {/* --- MENU DE OPÇÕES (FUNDO #F0ECE4) --- */}
        <div className="w-full bg-[#F0ECE4] border-t border-[#E2DDD5] px-4 py-3.5 sm:px-6 flex flex-wrap items-center gap-y-3 gap-x-6 sm:gap-x-10">
          {/* Opções de Tecido */}
          <div className="flex items-center gap-3">
            <span
              className="font-sans text-sm text-[#333] tracking-wide select-none"
              style={{ fontFamily: "var(--font-fira), sans-serif" }}
            >
              Tecido
            </span>
            <div className="flex items-center gap-2">
              {FABRIC_OPTIONS.map((fabric) => {
                const isSelected = selectedFabric === fabric.id;
                return (
                  <button
                    key={fabric.id}
                    type="button"
                    onClick={() => setSelectedFabric(fabric.id)}
                    title={fabric.name}
                    aria-label={`Tecido ${fabric.name}`}
                    style={{ backgroundColor: fabric.preview }}
                    className={`w-6 h-6 rounded-none transition-all cursor-pointer ${
                      isSelected
                        ? "ring-2 ring-[#333] ring-offset-2 ring-offset-[#F0ECE4] scale-105"
                        : "border border-black/20 hover:border-black/60 opacity-85 hover:opacity-100"
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Opções de Madeira */}
          <div className="flex items-center gap-3">
            <span
              className="font-sans text-sm text-[#333] tracking-wide select-none"
              style={{ fontFamily: "var(--font-fira), sans-serif" }}
            >
              Madeira
            </span>
            <div className="flex items-center gap-2">
              {WOOD_OPTIONS.map((wood) => {
                const isSelected = selectedWood === wood.id;
                return (
                  <button
                    key={wood.id}
                    type="button"
                    onClick={() => setSelectedWood(wood.id)}
                    title={wood.name}
                    aria-label={`Madeira ${wood.name}`}
                    style={{ backgroundColor: wood.preview }}
                    className={`w-6 h-6 rounded-none transition-all cursor-pointer ${
                      isSelected
                        ? "ring-2 ring-[#333] ring-offset-2 ring-offset-[#F0ECE4] scale-105"
                        : "border border-black/20 hover:border-black/60 opacity-85 hover:opacity-100"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
