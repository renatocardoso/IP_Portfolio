"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

// Import react-p5 dynamically to avoid SSR issues
const Sketch = dynamic(() => import("react-p5").then((mod) => mod.default), {
    ssr: false,
});

export default function DandelionAnimation({ onAnimationStart }) {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const p5Ref = useRef(null); // Guard reference to p5 instance for cleanup

    // Wait for client to render canvas
    useEffect(() => {
        setIsClient(true);
        return () => {
            // Cleanup p5 instance on unmount to prevent duplicated canvases or memory leaks
            if (p5Ref.current && typeof p5Ref.current.remove === "function") {
                p5Ref.current.remove();
            }
        };
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
        menuItemsData: [
            { label: "* Sobre", url: "/sobre" },
            { label: "* Design Gráfico", url: "/grafico" },
            { label: "* Design Produto", url: "/produto" },
        ],
        letters: [],
        dandelionCenter: null,
        animationState: "initial",
        animationOrigin: null,
        mainFontSize: 40,
        menuFontSize: 22,
        desktopLayout: true,
        transitionDurationFrames: 180,
        puffStartTime: 0,
        textBoundingBoxes: [],
        mouseIsOverMenuItem: false // Used for cursor targeting
    });

    if (!isClient) return null;

    // Define P5.js setup and draw functions
    const setup = (p5, canvasParentRef) => {
        p5Ref.current = p5;
        p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
        vars.current.dandelionCenter = p5.createVector(
            p5.width / 2,
            p5.height / 2
        );
        vars.current.animationOrigin = p5.createVector(0, 0);
        p5.textAlign(p5.CENTER, p5.CENTER);

        // Match Hero typography
        p5.textFont("Fira Sans, sans-serif");

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
            // Trigger animation if hovering the React component bounds
            let isHovering = false;
            if (typewriterEl) {
                const rect = typewriterEl.getBoundingClientRect();
                isHovering = p5.mouseX >= rect.left && p5.mouseX <= rect.right && p5.mouseY >= rect.top && p5.mouseY <= rect.bottom;
            }

            if (isHovering) {
                p5.cursor(p5.HAND);
                startAnimation(p5);
                if (onAnimationStart) onAnimationStart(true);
            } else {
                p5.cursor(p5.ARROW);
            }
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

            let isHoveringCenter = p5.mouseX > p5.width / 2 - 100 && p5.mouseX < p5.width / 2 + 100 && p5.mouseY > p5.height / 2 - 100 && p5.mouseY < p5.height / 2 + 100;

            p5.cursor(vars.current.mouseIsOverMenuItem || isHoveringCenter ? p5.HAND : p5.ARROW);
        }
    };

    const windowResized = (p5) => {
        p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
        vars.current.dandelionCenter.set(p5.width / 2, p5.height / 2);
        setResponsiveVariables(p5);
        vars.current.animationState = "initial";
        vars.current.letters = [];
        p5.cursor(p5.ARROW);
    };

    const mousePressed = (p5) => {
        if (vars.current.animationState === "puffing") {
            for (const letter of vars.current.letters) {
                if (letter.isMenuItem && letter.isMouseOver(p5)) {
                    router.push(letter.url);
                    break;
                }
            }

            // If we click anywhere else, or click the root asterisk, reset the animation
            if (p5.mouseX > p5.width / 2 - 100 && p5.mouseX < p5.width / 2 + 100 && p5.mouseY > p5.height / 2 - 100 && p5.mouseY < p5.height / 2 + 100) {
                windowResized(p5);
                if (onAnimationStart) onAnimationStart(false); // Signal parent to reset
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
            vars.current.mainFontSize = (p5.width / 320) * 36; // text-4xl (~36px)
            vars.current.menuFontSize = vars.current.mainFontSize * 0.5;
        }
    };

    // STATIC TEXT AND HITBOX FUNCTIONS REMOVED

    const startAnimation = (p5) => {
        if (vars.current.animationState !== "initial") return;
        vars.current.animationState = "puffing";
        vars.current.puffStartTime = p5.frameCount;
        vars.current.letters = [];

        for (let i = 0; i < 24; i++) {
            vars.current.letters.push(
                new Letter(p5, vars, "*", vars.current.animationOrigin.x, vars.current.animationOrigin.y)
            );
        }

        if (vars.current.desktopLayout) {
            const spacing = p5.height * 0.2;
            const textOffset = p5.width * 0.22;
            const horizontalOffset = p5.width * 0.08;
            for (let i = 0; i < vars.current.menuItemsData.length; i++) {
                const data = vars.current.menuItemsData[i];
                const menuItem = new Letter(p5, vars, "*", vars.current.animationOrigin.x, vars.current.animationOrigin.y, true, data.label, data.url);

                if (i === 0) {
                    menuItem.targetPos = p5.createVector(
                        vars.current.dandelionCenter.x - horizontalOffset,
                        vars.current.dandelionCenter.y - spacing
                    );
                } else if (i === 1) {
                    menuItem.targetPos = p5.createVector(
                        vars.current.dandelionCenter.x + textOffset,
                        vars.current.dandelionCenter.y
                    );
                } else {
                    menuItem.targetPos = p5.createVector(
                        vars.current.dandelionCenter.x + horizontalOffset,
                        vars.current.dandelionCenter.y + spacing
                    );
                }
                vars.current.letters.push(menuItem);
            }
        } else {
            const vOffset1 = p5.height * 0.25;
            const hOffset1 = p5.width * 0.2;
            const vOffset2 = p5.height * 0.12;
            const hOffset2 = p5.width * 0.25;
            const vOffset3 = p5.height * 0.2;
            const hOffset3 = p5.width * 0.15;

            const positions = [
                p5.createVector(
                    vars.current.dandelionCenter.x - hOffset1,
                    vars.current.dandelionCenter.y - vOffset1
                ),
                p5.createVector(
                    vars.current.dandelionCenter.x + hOffset2,
                    vars.current.dandelionCenter.y - vOffset2
                ),
                p5.createVector(
                    vars.current.dandelionCenter.x - hOffset3,
                    vars.current.dandelionCenter.y + vOffset3
                ),
            ];
            for (let i = 0; i < vars.current.menuItemsData.length; i++) {
                const data = vars.current.menuItemsData[i];
                const menuItem = new Letter(p5, vars, "*", vars.current.animationOrigin.x, vars.current.animationOrigin.y, true, data.label, data.url);
                menuItem.targetPos = positions[i];
                vars.current.letters.push(menuItem);
            }
        }

        for (const letter of vars.current.letters) {
            letter.release(p5);
        }
    };

    return (
        <div className="fixed inset-0 z-0">
            <Sketch
                setup={setup}
                draw={draw}
                windowResized={windowResized}
                mousePressed={mousePressed}
            />
        </div>
    );
}

// Rewritten class Letter adopting the p5 instance wrapper context
class Letter {
    constructor(p5, varsRef, char, originX, originY, isMenuItem = false, label = "", url = "") {
        this.char = char;
        this.center = p5.createVector(originX, originY);
        this.isMenuItem = isMenuItem;
        this.label = label;
        this.url = url;
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
        this.vel = p5.createVector(0, 0);
        this.acc = p5.createVector(0, 0);
        this.isReleased = false;
        this.angle = p5.random(p5.TWO_PI);
        this.angularVelocity = 0;
        this.size = this.vars.current.mainFontSize; // Asterisk keeps original size initially
        this.noiseOffset = p5.random(1000);
        this.typewriterIndex = 0; // State for individual submenu typing speed 
    }

    applyForce(p5, force) {
        this.acc.add(force);
    }

    seek(p5) {
        let desired = window.p5.Vector.sub(this.targetPos, this.pos);
        let d = desired.mag();
        if (d < 5) {
            this.hasArrived = true;
            this.vel.mult(0.1);
            this.pos.set(this.targetPos);
            return;
        }
        desired.setMag(p5.map(d, 0, 150, 0, 4, true));
        let steer = window.p5.Vector.sub(desired, this.vel);
        steer.limit(0.2);
        this.applyForce(p5, steer);
    }

    release(p5) {
        if (this.isReleased) return;
        this.isReleased = true;
        let releaseAngle;

        if (this.isMenuItem && this.targetPos) {
            const angleToTarget = p5.atan2(
                this.targetPos.y - this.center.y,
                this.targetPos.x - this.center.x
            );
            releaseAngle = angleToTarget + p5.random(-0.4, 0.4);
        } else {
            releaseAngle = p5.atan2(
                this.pos.y - this.center.y,
                this.pos.x - this.center.x
            );
        }

        const force = window.p5.Vector.fromAngle(releaseAngle);
        force.mult(p5.random(1.5, 3.5));
        this.applyForce(p5, force);

        if (this.isMenuItem) {
            this.angularVelocity = 0;
        } else {
            this.angularVelocity = p5.random(-0.05, 0.05);
        }
    }

    update(p5) {
        if (!this.isReleased) return;

        let progress =
            (p5.frameCount - this.vars.current.puffStartTime) /
            this.vars.current.transitionDurationFrames;
        let t = p5.constrain(progress, 0, 1);

        let easeIn_t = t * t * t;
        let easeOut_t = 1 - p5.pow(1 - t, 4);

        this.alpha = p5.map(easeOut_t, 0, 1, 255, 0);

        if (this.isMenuItem) {
            this.alpha = 255;
            this.labelAlpha = 255;

            // Wait to reach target before shrinking size
            if (!this.hasArrived) {
                this.size = this.vars.current.mainFontSize;
                this.seek(p5);
            } else {
                // Shrink to 50% quickly smoothly or immediately
                this.size = this.vars.current.menuFontSize;
                this.vel.mult(0.9);
                // When arrived, execute typewriter effect over frames (frame rate is 60fps)
                if (p5.frameCount % 5 === 0 && this.typewriterIndex < this.label.length - 2) {
                    this.typewriterIndex++;
                }
            }
        }

        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.angle += this.angularVelocity;
        this.vel.mult(0.98);
        this.acc.mult(0);
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
        if (this.labelAlpha < 240) return false;
        const hitboxPadding = this.vars.current.desktopLayout ? 0 : 10;
        const textWidthValue = p5.textWidth(this.label);
        return (
            p5.mouseX > this.pos.x - textWidthValue / 2 - hitboxPadding &&
            p5.mouseX < this.pos.x + textWidthValue / 2 + hitboxPadding &&
            p5.mouseY >
            this.pos.y - this.vars.current.menuFontSize / 2 - hitboxPadding &&
            p5.mouseY <
            this.pos.y + this.vars.current.menuFontSize / 2 + hitboxPadding
        );
    }
}
