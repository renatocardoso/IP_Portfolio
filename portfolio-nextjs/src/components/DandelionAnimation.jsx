"use client";

import { useEffect, useState, useRef } from "react";

export default function DandelionAnimation({ onAnimationStart, onAnimationComplete }) {
    const [isClient, setIsClient] = useState(false);
    const p5Ref = useRef(null);
    const containerRef = useRef(null);
    const callbacksRef = useRef({ onAnimationStart, onAnimationComplete });

    useEffect(() => {
        callbacksRef.current = { onAnimationStart, onAnimationComplete };
    }, [onAnimationStart, onAnimationComplete]);

    useEffect(() => {
        setIsClient(true);
        let p5Instance = null;

        const initP5 = async () => {
            const p5Module = await import("p5");
            const p5 = p5Module.default;
            window.p5 = p5;

            const sketch = (p) => {
                p.setup = () => setup(p, containerRef.current);
                p.draw = () => draw(p);
                p.windowResized = () => windowResized(p);
                p.mousePressed = () => mousePressed(p);
                p.touchStarted = () => {
                    mousePressed(p);
                    return false;
                };
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
        letters: [],
        dandelionCenter: null,
        animationState: "initial", // "initial" | "puffing" | "completed"
        animationOrigin: null,
        mainFontSize: 60,
        desktopLayout: true,
    });

    const setup = (p5, canvasParentRef) => {
        p5Ref.current = p5;
        p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
        vars.current.dandelionCenter = p5.createVector(
            p5.width / 2,
            p5.height / 2
        );
        vars.current.animationOrigin = vars.current.dandelionCenter.copy();
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.textFont("Fira Sans, sans-serif");
        p5.textStyle(p5.NORMAL);

        setResponsiveVariables(p5);
    };

    const draw = (p5) => {
        p5.clear();
        p5.background(255);

        const asteriskEl = document.getElementById("hero-asterisk");
        const triggerEl = document.getElementById("hero-trigger");

        if (asteriskEl) {
            const rect = asteriskEl.getBoundingClientRect();
            vars.current.animationOrigin.set(
                rect.left + rect.width / 2,
                rect.top + rect.height / 2
            );
        } else if (triggerEl) {
            const rect = triggerEl.getBoundingClientRect();
            vars.current.animationOrigin.set(
                rect.left + rect.width / 2,
                rect.top + rect.height / 2
            );
        } else if (vars.current.dandelionCenter) {
            vars.current.animationOrigin.set(
                vars.current.dandelionCenter.x,
                vars.current.dandelionCenter.y
            );
        }

        if (vars.current.animationState === "initial") {
            let isHovering = false;
            if (triggerEl) {
                const rect = triggerEl.getBoundingClientRect();
                isHovering =
                    p5.mouseX >= rect.left &&
                    p5.mouseX <= rect.right &&
                    p5.mouseY >= rect.top &&
                    p5.mouseY <= rect.bottom;
            }
            p5.cursor(isHovering ? p5.HAND : p5.ARROW);
        } else if (vars.current.animationState === "puffing") {
            p5.cursor(p5.ARROW);

            vars.current.letters.forEach((letter) => {
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
                letter.update();
                letter.display(p5);
            });

            vars.current.letters = vars.current.letters.filter(
                (letter) => !letter.isDead()
            );

            if (vars.current.letters.length === 0) {
                vars.current.animationState = "completed";
                if (callbacksRef.current.onAnimationComplete) {
                    callbacksRef.current.onAnimationComplete();
                }
            }
        }
    };

    const windowResized = (p5) => {
        p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
        vars.current.dandelionCenter.set(p5.width / 2, p5.height / 2);
        setResponsiveVariables(p5);
    };

    const mousePressed = (p5) => {
        if (vars.current.animationState === "initial") {
            const triggerEl = document.getElementById("hero-trigger");
            if (triggerEl) {
                const rect = triggerEl.getBoundingClientRect();
                const isHovering =
                    p5.mouseX >= rect.left &&
                    p5.mouseX <= rect.right &&
                    p5.mouseY >= rect.top &&
                    p5.mouseY <= rect.bottom;
                if (isHovering) {
                    startAnimation(p5);
                    if (callbacksRef.current.onAnimationStart) {
                        callbacksRef.current.onAnimationStart(true);
                    }
                }
            }
        }
    };

    const setResponsiveVariables = (p5) => {
        if (p5.width > 768) {
            vars.current.desktopLayout = true;
            vars.current.mainFontSize = 60;
        } else {
            vars.current.desktopLayout = false;
            vars.current.mainFontSize = p5.constrain((p5.width / 320) * 36, 24, 40);
        }
    };

    const startAnimation = (p5) => {
        if (vars.current.animationState !== "initial") return;
        vars.current.animationState = "puffing";
        vars.current.letters = [];

        for (let i = 0; i < 28; i++) {
            const letter = new Letter(
                p5,
                vars,
                "*",
                vars.current.animationOrigin.x,
                vars.current.animationOrigin.y
            );
            letter.release(p5);
            vars.current.letters.push(letter);
        }
    };

    if (!isClient) return null;

    return <div ref={containerRef} className="fixed inset-0 z-0" />;
}

class Letter {
    constructor(p5, varsRef, char, originX, originY) {
        this.char = char;
        this.center = p5.createVector(originX, originY);
        this.alpha = 255;
        this.color = p5.color(p5.random(varsRef.current.vibrantColors));
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
        this.size = this.vars.current.mainFontSize;
        this.noiseOffset = p5.random(1000);
    }

    applyForce(p5, force) {
        const f = force || p5;
        this.acc.add(f);
    }

    release(p5) {
        if (this.isReleased) return;
        this.isReleased = true;
        const releaseAngle = p5.atan2(
            this.pos.y - this.center.y,
            this.pos.x - this.center.x
        );
        const force = window.p5.Vector.fromAngle(releaseAngle);
        force.mult(p5.random(1, 3));
        this.applyForce(p5, force);
        this.angularVelocity = p5.random(-0.05, 0.05);
    }

    update() {
        if (!this.isReleased) return;

        // Desvanecimento linear conforme física do dente-de-leão
        this.alpha -= 0.75;

        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.angle += this.angularVelocity;
        this.vel.mult(0.98);
        this.acc.mult(0);
    }

    display(p5) {
        p5.push();
        p5.translate(this.pos.x, this.pos.y);
        p5.rotate(this.angle);
        p5.noStroke();

        this.color.setAlpha(p5.constrain(this.alpha, 0, 255));
        p5.fill(this.color);
        p5.textSize(this.size);
        p5.drawingContext.font = `400 ${this.size}px "Fira Sans", sans-serif`;
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.text(this.char, 0, 0);
        p5.pop();
    }

    isDead() {
        return this.alpha <= 0;
    }
}
