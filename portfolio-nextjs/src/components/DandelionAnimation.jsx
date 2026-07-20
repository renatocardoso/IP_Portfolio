"use client";

// ── TUNING CONSTANTS — ajuste aqui para regular as velocidades ────────────────
const DANDELION_DURATION_FRAMES = 300;   // duração da explosão em frames (300 frames = 5 segundos a 60fps)
const DANDELION_FORCE_MIN       = 1.25; // força mínima de lançamento   (↑ = mais rápido)
const DANDELION_FORCE_MAX       = 2.9;  // força máxima de lançamento   (↑ = mais rápido)
const MENU_SEEK_SPEED           = 5.5;  // velocidade máx. dos asteriscos-menu (↑ = mais rápido)
const MENU_SEEK_STEER           = 0.28; // responsividade de curva dos asteriscos-menu
const MENU_TYPE_INTERVAL        = 5;    // frames por caractere digitado no menu (↑ = mais lento)
const MENU_DELETE_INTERVAL      = 2;    // frames por caractere apagado no menu  (↑ = mais lento)
const REVEAL_MS                 = 5000; // ms após o clique para revelar /* e iniciar a digitação
const REVEAL_FADE_MS            = 500;  // duração do fade-in do /* central (ms)
// ─────────────────────────────────────────────────────────────────────────────

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export default function DandelionAnimation({ onAnimationStart, menuItems }) {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const p5Ref = useRef(null); // Guard reference to p5 instance for cleanup
    const containerRef = useRef(null);

    // Wait for client to render canvas
    useEffect(() => {
        setIsClient(true);
        let p5Instance = null;

        const initP5 = async () => {
            const p5Module = await import("p5");
            const p5 = p5Module.default;
            // Expose p5 class globally so Letter class can access static Vector methods
            window.p5 = p5;

            const sketch = (p) => {
                p.setup = () => setup(p, containerRef.current);
                p.draw = () => draw(p);
                p.windowResized = () => windowResized(p);
                p.mousePressed = () => mousePressed(p);
                p.touchStarted = () => { mousePressed(p); return false; };
            };

            if (containerRef.current) {
                p5Instance = new p5(sketch, containerRef.current);
            }
        };

        initP5();

        return () => {
            if (p5Instance) {
                p5Instance.remove();
            }
            if (p5Ref.current && typeof p5Ref.current.remove === "function") {
                p5Ref.current.remove();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Use refs in place of global variables to prevent scope collisions
    const vars = useRef({
        vibrantColors: [
            "#FF4E50",
            "#FC913A",
            "#F9D423",
            "#EDE574",
            "#E1F5C4",
            "#76B4BD",
            "#4E89AE",
            "#3D5A80",
        ],
        menuItemsData: menuItems || [
            { label: "* Sobre", url: "/sobre" },
            { label: "* Projetos", url: "/projetos" },
        ],
        letters: [],
        dandelionCenter: null,
        animationState: "initial",
        animationOrigin: null,
        mainFontSize: 40,
        menuFontSize: 22,
        desktopLayout: true,
        transitionDurationFrames: DANDELION_DURATION_FRAMES,
        puffStartTime: 0,
        textBoundingBoxes: [],
        mouseIsOverMenuItem: false, // Used for cursor targeting
        puffStartMs: 0,            // Timestamp (millis) when animation was triggered
    });

    // Define P5.js setup and draw functions
    // IMPORTANT: these must be declared before the early return to avoid TDZ errors in useEffect
    const setup = (p5, canvasParentRef) => {
        p5Ref.current = p5;
        p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
        vars.current.dandelionCenter = p5.createVector(
            p5.width / 2,
            p5.height / 2
        );
        vars.current.animationOrigin = p5.createVector(0, 0);
        p5.textAlign(p5.CENTER, p5.CENTER);

        // Match Hero typography — weight 400 explicit to match HTML font-normal
        p5.textFont("Fira Sans, sans-serif");
        p5.textStyle(p5.NORMAL);

        setResponsiveVariables(p5);
    };

    const draw = (p5) => {
        p5.clear();
        p5.background(255);
        // STATIC TEXT DRAWING REMOVED - We rely on TypewriterHero React Component

        // Dynamically track the asterisk position from the DOM
        const asteriskEl = document.getElementById("hero-asterisk");
        const typewriterEl = document.getElementById("hero-typewriter");

        if (asteriskEl) {
            const rect = asteriskEl.getBoundingClientRect();
            // Origin is the center of the asterisk
            vars.current.animationOrigin.set(rect.left + rect.width / 2, rect.top + rect.height / 2);
        }

        if (vars.current.animationState === "initial") {
            // Only handle cursor styling here, clicking is handled in mousePressed
            let isHovering = false;
            if (typewriterEl) {
                const rect = typewriterEl.getBoundingClientRect();
                isHovering = p5.mouseX >= rect.left && p5.mouseX <= rect.right && p5.mouseY >= rect.top && p5.mouseY <= rect.bottom;
            }

            p5.cursor(isHovering ? p5.HAND : p5.ARROW);

        } else if (vars.current.animationState === "puffing") {
            vars.current.mouseIsOverMenuItem = false;

            vars.current.letters.forEach((letter) => {
                if (!letter.hasArrived || !letter.isMenuItem) {
                    const windX = p5.map(
                        p5.noise(letter.noiseOffset + p5.frameCount * 0.002),
                        0,
                        1,
                        -0.03,
                        0.03
                    );
                    const liftY = -0.01;
                    const wind = p5.createVector(windX, liftY);
                    letter.applyForce(p5, wind);
                }
                letter.update(p5);
                letter.display(p5);

                if (letter.isMenuItem && letter.isMouseOver(p5)) {
                    vars.current.mouseIsOverMenuItem = true;
                }
            });

            vars.current.letters = vars.current.letters.filter(
                (letter) => !letter.isDead()
            );

            // Draw central reset button '/*' after REVEAL_MS — time-based, independent of FPS
            const msElapsed = p5.millis() - vars.current.puffStartMs;
            let centerHovered = false;

            if (msElapsed >= REVEAL_MS) {
                p5.push();
                p5.textAlign(p5.CENTER, p5.CENTER);
                p5.textSize(vars.current.mainFontSize);
                p5.textFont("Fira Sans, sans-serif");
                p5.drawingContext.font = `400 ${vars.current.mainFontSize}px "Fira Sans", sans-serif`;

                const spaceWidth = p5.textWidth("* ");

                // Hitbox for central reset button
                const hitPadding = 20;
                centerHovered = (
                    p5.mouseX > p5.width / 2 - spaceWidth - hitPadding &&
                    p5.mouseX < p5.width / 2 + spaceWidth + hitPadding &&
                    p5.mouseY > p5.height / 2 - vars.current.mainFontSize / 2 - hitPadding &&
                    p5.mouseY < p5.height / 2 + vars.current.mainFontSize / 2 + hitPadding
                );

                // Ease-in fade over REVEAL_FADE_MS
                const centerAlpha = p5.constrain(p5.map(msElapsed, REVEAL_MS, REVEAL_MS + REVEAL_FADE_MS, 0, 255), 0, 255);

                const slashColor = p5.color("#333");
                slashColor.setAlpha(centerAlpha);

                const asteriskColor = p5.color("#FF4E50");
                asteriskColor.setAlpha(centerAlpha);

                p5.fill(slashColor);
                p5.textAlign(p5.RIGHT, p5.CENTER);
                p5.text("/", p5.width / 2 - spaceWidth / 2, p5.height / 2);

                p5.fill(asteriskColor);
                p5.textAlign(p5.LEFT, p5.CENTER);
                p5.text("*", p5.width / 2 - spaceWidth / 2, p5.height / 2);
                p5.pop();
            }

            p5.cursor(vars.current.mouseIsOverMenuItem || centerHovered ? p5.HAND : p5.ARROW);
        }
    };

    const windowResized = (p5) => {
        p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
        vars.current.dandelionCenter.set(p5.width / 2, p5.height / 2);
        setResponsiveVariables(p5);

        // If it's already running, don't reset. Just dynamically transition positions!
        if (vars.current.animationState === "puffing") {
            const newPositions = getResponsivePositions(p5, vars);
            let menuIdx = 0;
            for (let letter of vars.current.letters) {
                if (letter.isMenuItem) {
                    letter.targetPos = newPositions[menuIdx];
                    if (letter.hasArrived) {
                        letter.pos.set(letter.targetPos);
                    }
                    menuIdx++;
                }
            }
        }
    };

    const getResponsivePositions = (p5, vars) => {
        const center = vars.current.dandelionCenter;

        // 0.0 (Mobile 320px) to 1.0 (Desktop 1200px)
        const layoutFactor = p5.constrain(p5.map(p5.width, 320, 1200, 0, 1), 0, 1);

        // === DESKTOP POSITIONS ===
        // "Sobre" upper-left, "Projetos" lower-right — diagonal offset
        const deskPos = [
            p5.createVector(center.x - p5.width * 0.11, center.y - p5.height * 0.14),
            p5.createVector(center.x + p5.width * 0.05, center.y + p5.height * 0.14),
        ];

        // === MOBILE POSITIONS ===
        const mobPos = [
            p5.createVector(center.x - p5.width * 0.08, center.y - p5.height * 0.11),
            p5.createVector(center.x + p5.width * 0.03, center.y + p5.height * 0.11),
        ];

        return [0, 1].map((i) => p5.createVector(
            p5.lerp(mobPos[i].x, deskPos[i].x, layoutFactor),
            p5.lerp(mobPos[i].y, deskPos[i].y, layoutFactor)
        ));
    };

    const mousePressed = (p5) => {
        if (vars.current.animationState === "initial") {
            const typewriterEl = document.getElementById("hero-typewriter");
            if (typewriterEl) {
                const rect = typewriterEl.getBoundingClientRect();
                const isHovering = p5.mouseX >= rect.left && p5.mouseX <= rect.right && p5.mouseY >= rect.top && p5.mouseY <= rect.bottom;
                if (isHovering) {
                    startAnimation(p5);
                    if (onAnimationStart) onAnimationStart(true);
                }
            }
        } else if (vars.current.animationState === "puffing") {
            let clickedMenuItem = false;
            for (const letter of vars.current.letters) {
                if (letter.isMenuItem && letter.isMouseOver(p5)) {
                    router.push(letter.url);
                    clickedMenuItem = true;
                    break;
                }
            }

            // Central Hitbox Reset — only available after REVEAL_MS
            const msElapsed = p5.millis() - vars.current.puffStartMs;

            if (!clickedMenuItem && msElapsed >= REVEAL_MS) {
                p5.push();
                p5.textSize(vars.current.mainFontSize);
                p5.textFont("Fira Sans, sans-serif");
                p5.drawingContext.font = `400 ${vars.current.mainFontSize}px "Fira Sans", sans-serif`;
                const spaceWidth = p5.textWidth("* ");
                p5.pop();

                const hitPadding = 20;
                let isHoveringCenter = (
                    p5.mouseX > p5.width / 2 - spaceWidth - hitPadding &&
                    p5.mouseX < p5.width / 2 + spaceWidth + hitPadding &&
                    p5.mouseY > p5.height / 2 - vars.current.mainFontSize / 2 - hitPadding &&
                    p5.mouseY < p5.height / 2 + vars.current.mainFontSize / 2 + hitPadding
                );

                if (isHoveringCenter) {
                    vars.current.animationState = "initial";
                    vars.current.letters = [];
                    p5.cursor(p5.ARROW);
                    if (onAnimationStart) onAnimationStart(false); // Signal parent to reset Typewriter
                }
            }
        }
    };

    // Helper functions scoped with p5 instance
    const setResponsiveVariables = (p5) => {
        // Match the 50% footprint of the hero
        if (p5.width > 768) {
            vars.current.desktopLayout = true;
            vars.current.mainFontSize = 60; // Base asterisk from text-6xl (60px)
            vars.current.menuFontSize = vars.current.mainFontSize * 0.5; // 50% of main
        } else {
            vars.current.desktopLayout = false;
            // Provide a better dynamic clamp for mobile, ensuring it doesn't get infinitely small on tiny phones or too big on landscape
            vars.current.mainFontSize = p5.constrain((p5.width / 320) * 36, 24, 40);
            vars.current.menuFontSize = vars.current.mainFontSize * 0.5;
        }
    };

    // STATIC TEXT AND HITBOX FUNCTIONS REMOVED

    const startAnimation = (p5) => {
        if (vars.current.animationState !== "initial") return;
        vars.current.animationState = "puffing";
        vars.current.puffStartTime = p5.frameCount;
        vars.current.puffStartMs = p5.millis();
        vars.current.letters = [];

        for (let i = 0; i < 24; i++) {
            vars.current.letters.push(
                new Letter(p5, vars, "*", vars.current.animationOrigin.x, vars.current.animationOrigin.y)
            );
        }

        const menuPositions = getResponsivePositions(p5, vars);

        for (let i = 0; i < vars.current.menuItemsData.length; i++) {
            const data = vars.current.menuItemsData[i];
            // Pass `i` to create synchronized staggering among menu items
            const menuItem = new Letter(p5, vars, "*", vars.current.animationOrigin.x, vars.current.animationOrigin.y, true, data.label, data.url, i);

            menuItem.targetPos = menuPositions[i];
            vars.current.letters.push(menuItem);
        }

        for (const letter of vars.current.letters) {
            letter.release(p5);
        }
    };

    if (!isClient) return null;

    return (
        <div ref={containerRef} className="fixed inset-0 z-0">
        </div>
    );
}

// Rewritten class Letter adopting the p5 instance wrapper context
class Letter {
    constructor(p5, varsRef, char, originX, originY, isMenuItem = false, label = "", url = "", menuIndex = 0) {
        this.char = char;
        this.center = p5.createVector(originX, originY);
        this.isMenuItem = isMenuItem;
        this.label = label;
        this.url = url;
        this.menuIndex = menuIndex;
        this.targetPos = null;
        this.hasArrived = false;
        this.labelAlpha = 255;
        this.alpha = 255;
        this.color = isMenuItem ? p5.color("#FF4E50") : p5.color(p5.random(varsRef.current.vibrantColors));
        this.vars = varsRef;
        this.reset(p5);
    }

    reset(p5) {
        const angle = p5.random(p5.TWO_PI);
        const radius = p5.random(1, 15) * (1 - p5.pow(p5.random(), 2));
        const offset = window.p5.Vector.fromAngle(angle).mult(radius);
        this.pos = window.p5.Vector.add(this.center, offset);
        this.initialPos = this.pos.copy();
        this.vel = p5.createVector(0, 0);
        this.acc = p5.createVector(0, 0);
        this.isReleased = false;
        this.angle = p5.random(p5.TWO_PI);
        this.initialAngle = this.angle;
        this.angularVelocity = 0;
        this.size = this.vars.current.mainFontSize; // Asterisk keeps original size initially
        this.noiseOffset = p5.random(1000);

        // Typewriter state machine variables
        this.typewriterIndex = 0;
        this.typeState = 'typing';
        this.isFirstWait = true;

        if (this.isMenuItem) {
            // Start typing immediately together initially
            this.pauseTimer = 0;
        } else {
            this.pauseTimer = p5.random(60, 180);
        }
    }

    applyForce(p5, force) {
        this.acc.add(force);
    }

    release(p5) {
        if (this.isReleased) return;
        this.isReleased = true;
        let releaseAngle;

        if (this.isMenuItem) {
            // Movement is handled mathematically by lerp in update() to perfectly match physics
        } else {
            releaseAngle = p5.atan2(
                this.pos.y - this.center.y,
                this.pos.x - this.center.x
            );
            const force = window.p5.Vector.fromAngle(releaseAngle);
            force.mult(p5.random(DANDELION_FORCE_MIN, DANDELION_FORCE_MAX));
            this.applyForce(p5, force);
            this.angularVelocity = p5.random(-0.05, 0.05);
        }
    }

    update(p5) {
        if (!this.isReleased) return;

        let progressFrames = p5.frameCount - this.vars.current.puffStartTime;
        let progress =
            progressFrames /
            this.vars.current.transitionDurationFrames;
        let t = p5.constrain(progress, 0, 1);

        let easeIn_t = t * t * t;
        let easeOut_t = 1 - p5.pow(1 - t, 4);

        this.alpha = p5.map(easeIn_t, 0, 1, 255, 0);

        if (this.isMenuItem) {
            this.alpha = 255;
            this.labelAlpha = 255;

            // Wait to reach target before starting typing effects
            if (!this.hasArrived) {
                let frameConstrained = p5.constrain(progressFrames, 0, this.vars.current.transitionDurationFrames);
                let curve = (1 - p5.pow(0.98, frameConstrained)) / (1 - p5.pow(0.98, this.vars.current.transitionDurationFrames));
                
                this.pos.x = p5.lerp(this.initialPos.x, this.targetPos.x, curve);
                this.pos.y = p5.lerp(this.initialPos.y, this.targetPos.y, curve);
                this.size = p5.lerp(this.vars.current.mainFontSize, this.vars.current.menuFontSize, curve);
                this.angle = p5.lerp(this.initialAngle, 0, curve);

                if (progressFrames >= this.vars.current.transitionDurationFrames) {
                    this.hasArrived = true;
                    this.pos.set(this.targetPos);
                    this.angle = 0;
                    this.size = this.vars.current.menuFontSize;
                }
            } else {
                // Ensure it's exactly 50% size
                this.size = this.vars.current.menuFontSize;
                this.vel.mult(0.9);

                // Gate: don't start typing until REVEAL_MS has elapsed
                if ((p5.millis() - this.vars.current.puffStartMs) < REVEAL_MS) return;

                // Typewriter loop — typing/waiting at normal speed, deletion 2x faster
                if (p5.frameCount % MENU_TYPE_INTERVAL === 0) {
                    if (this.typeState === 'typing') {
                        if (this.pauseTimer > 0) {
                            this.pauseTimer -= MENU_TYPE_INTERVAL;
                        } else if (this.typewriterIndex < this.label.length - 2) {
                            this.typewriterIndex++;
                        } else {
                            this.typeState = 'waiting';
                            // Stagger always maintained: index 0 waits less than index 1
                            // so they never delete at the same time across loops
                            this.pauseTimer = 480 + (this.menuIndex * 120);
                        }
                    } else if (this.typeState === 'waiting') {
                        this.pauseTimer -= 4;
                        if (this.pauseTimer <= 0) {
                            this.typeState = 'deleting';
                        }
                    } else if (this.typeState === 'waiting_to_type') {
                        this.pauseTimer -= 4;
                        if (this.pauseTimer <= 0) {
                            this.typeState = 'typing';
                        }
                    }
                }
                // Deletion runs at MENU_DELETE_INTERVAL — faster than typing
                if (this.typeState === 'deleting' && p5.frameCount % MENU_DELETE_INTERVAL === 0) {
                    if (this.typewriterIndex > 0) {
                        this.typewriterIndex--;
                    } else {
                        this.typeState = 'waiting_to_type';
                        this.pauseTimer = 30;
                    }
                }
            }
        } else {
            this.vel.add(this.acc);
            this.pos.add(this.vel);
            this.angle += this.angularVelocity;
            this.vel.mult(0.98);
            this.acc.mult(0);
        }
    }

    display(p5) {
        p5.push();
        p5.translate(this.pos.x, this.pos.y);
        if (!this.isMenuItem) {
            p5.rotate(this.angle);
        }
        p5.noStroke();

        if (this.isMenuItem) {
            // Reconstruct the text progressively
            let typedSlice = this.label.substring(2, 2 + this.typewriterIndex);

            p5.textAlign(p5.CENTER, p5.CENTER);
            p5.textSize(this.size);
            p5.drawingContext.font = `400 ${this.size}px "Fira Sans", sans-serif`;

            // Interaction colors state
            let hoverColor = p5.color("#FF4E50");
            let defaultColor = p5.color(0);
            let chosenColor = this.isMouseOver(p5) ? hoverColor : defaultColor;

            if (!this.hasArrived) {
                this.color.setAlpha(this.alpha);
                p5.fill(this.color);
                p5.text(this.char, 0, 0);
            } else {
                chosenColor.setAlpha(this.labelAlpha);

                const spaceWidth = p5.textWidth("* ");

                const asteriskColor = p5.color("#FF4E50");
                asteriskColor.setAlpha(this.labelAlpha);

                p5.fill(asteriskColor);
                p5.textAlign(p5.RIGHT, p5.CENTER);
                p5.text("*", -spaceWidth / 2, 0);

                p5.fill(chosenColor);
                p5.textAlign(p5.LEFT, p5.CENTER);
                p5.text(" " + typedSlice, -spaceWidth / 2, 0);
            }
        } else {
            this.color.setAlpha(this.alpha);
            p5.fill(this.color);
            p5.textSize(this.size);
            p5.drawingContext.font = `400 ${this.size}px "Fira Sans", sans-serif`;
            p5.textAlign(p5.CENTER, p5.CENTER);
            p5.text(this.char, 0, 0);
        }
        p5.pop();
    }

    isDead() {
        if (this.isMenuItem) return false;
        return this.alpha <= 0;
    }

    isMouseOver(p5) {
        if (!this.hasArrived) return false;

        // Push styles to accurately measure text width regardless of current sketch state
        p5.push();
        p5.textSize(this.vars.current.menuFontSize);
        p5.textFont("Fira Sans, sans-serif");
        p5.drawingContext.font = `400 ${this.vars.current.menuFontSize}px "Fira Sans", sans-serif`;

        const hitboxPadding = this.vars.current.desktopLayout ? 15 : 25;
        // Measure the FULL label so the hitbox covers the whole word, even if it's currently only halfway typed
        const textWidthValue = p5.textWidth(this.label);
        const spaceWidth = p5.textWidth("* ");
        p5.pop();

        let minX, maxX;
        // The display() function renders menu items with p5.textAlign(p5.LEFT) starting slightly left of center
        if (this.isMenuItem) {
            const startX = this.pos.x - spaceWidth / 2;
            minX = startX - hitboxPadding;
            // The asterisk is drawn to the right of startX, so the full width extends right
            maxX = startX + textWidthValue + hitboxPadding;
        } else {
            minX = this.pos.x - textWidthValue / 2 - hitboxPadding;
            maxX = this.pos.x + textWidthValue / 2 + hitboxPadding;
        }

        return (
            p5.mouseX > minX &&
            p5.mouseX < maxX &&
            p5.mouseY >
            this.pos.y - this.vars.current.menuFontSize / 2 - hitboxPadding &&
            p5.mouseY <
            this.pos.y + this.vars.current.menuFontSize / 2 + hitboxPadding
        );
    }
}
