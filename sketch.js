// ===================================================================
// CONFIGURAÇÕES GLOBAIS E DADOS
// ===================================================================
const vibrantColors = ['#FF4E50', '#FC913A', '#F9D423', '#EDE574', '#E1F5C4', '#76B4BD', '#4E89AE', '#3D5A80'];
const menuItemsData = [
    { label: "* Sobre", url: "sobre.html" },
    { label: "* Design Gráfico", url: "grafico.html" },
    { label: "* Design Produto", url: "produto.html" }
];

let letters = [];
let dandelionCenter;
let animationState = 'initial';
let animationOrigin;
let mainFontSize, menuFontSize;
let desktopLayout;

// --- CONTROLO MESTRE DA ANIMAÇÃO ---
// Duração total da transição em frames (60 frames ≈ 1 segundo).
// Altere este único valor para controlar o ritmo de toda a animação.
const transitionDurationFrames = 180; // 3 segundos
let puffStartTime = 0;

// ===================================================================
// CLASSE LETTER: O CORAÇÃO DA ANIMAÇÃO
// ===================================================================
class Letter {
    constructor(char, originX, originY, isMenuItem = false, label = '', url = '') {
        this.char = char;
        this.center = createVector(originX, originY);
        this.isMenuItem = isMenuItem;
        this.label = label;
        this.url = url;
        this.targetPos = null;
        this.hasArrived = false;
        this.labelAlpha = 0;
        this.alpha = 255;
        this.color = color(random(vibrantColors));
        this.reset();
    }

    reset() {
        const angle = random(TWO_PI);
        const radius = random(1, 15) * (1 - pow(random(), 2));
        const offset = p5.Vector.fromAngle(angle).mult(radius);
        this.pos = p5.Vector.add(this.center, offset);
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.isReleased = false;
        this.angle = random(TWO_PI);
        this.angularVelocity = 0;
        this.size = mainFontSize;
        this.noiseOffset = random(1000);
    }

    applyForce(force) { this.acc.add(force); }

    // Método para guiar o asterisco até a posição do botão
    seek() {
        let desired = p5.Vector.sub(this.targetPos, this.pos);
        let d = desired.mag();
        // Aumenta o raio de "chegada" para uma transição mais suave
        if (d < 5) {
            this.hasArrived = true;
            // Reduz a velocidade para uma parada gradual
            this.vel.mult(0.1);
            // Garante que o item esteja na posição final exata
            this.pos.set(this.targetPos);
            return;
        }
        // Força de atração proporcional à distância
        desired.setMag(map(d, 0, 150, 0, 4, true)); // Limita a força
        let steer = p5.Vector.sub(desired, this.vel);
        steer.limit(0.2); // Limita a aceleração para suavidade
        this.applyForce(steer);
    }

    release() {
        if (this.isReleased) return;
        this.isReleased = true;
        let releaseAngle;
        if (this.isMenuItem && this.targetPos) {
            const angleToTarget = atan2(this.targetPos.y - this.center.y, this.targetPos.x - this.center.x);
            releaseAngle = angleToTarget + random(-0.4, 0.4);
        } else {
            releaseAngle = atan2(this.pos.y - this.center.y, this.pos.x - this.center.x);
        }
        const force = p5.Vector.fromAngle(releaseAngle);
        force.mult(random(1.5, 3.5));
        this.applyForce(force);
        // Remove rotation for menu items
        if (this.isMenuItem) {
            this.angularVelocity = 0;
        } else {
            this.angularVelocity = random(-0.05, 0.05);
        }
    }

    // --- LÓGICA DE ANIMAÇÃO CORRIGIDA ---
    update() {
        if (!this.isReleased) return;

        // Calcula o progresso normalizado da animação (de 0.0 a 1.0)
        let progress = (frameCount - puffStartTime) / transitionDurationFrames;
        let t = constrain(progress, 0, 1);

        // Aplica funções de Easing para suavidade e sensação orgânica
        // easeInCubic: Começa devagar, acelera. Perfeito para o fade-in do texto.
        let easeIn_t = t * t * t;
        // easeOutQuart: Começa rápido, desacelera suavemente. Perfeito para o fade-out dos asteriscos.
        let easeOut_t = 1 - pow(1 - t, 4);

        // Sincroniza a opacidade do ASTERISCO com o progresso de fade-out
        this.alpha = map(easeOut_t, 0, 1, 255, 0);

        // Se for um item de menu (botão)
        if (this.isMenuItem) {
            if (!this.hasArrived) {
                this.seek(); // Continua buscando o alvo até chegar
            } else {
                // Ao chegar, freia o movimento gradualmente
                this.vel.mult(0.9);
            }
            // O texto do botão aparece em sincronia com o progresso de fade-in
            this.labelAlpha = map(easeIn_t, 0, 1, 0, 255);
        }

        // Simulação física (válido para todos os asteriscos)
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.angle += this.angularVelocity;
        this.vel.mult(0.98); // Atrito geral no ar
        this.acc.mult(0);
    }

    display() {
        push();
        translate(this.pos.x, this.pos.y);
        // Rotação apenas se não for item de menu
        if (!this.isMenuItem) {
            rotate(this.angle);
        }
        noStroke();
        if (this.isMenuItem) {
            // Desenha o texto do botão (com o alpha sincronizado)
            let hoverColor = color('#FF4E50');
            let defaultColor = color(0);
            let chosenColor = this.isMouseOver() ? hoverColor : defaultColor;
            chosenColor.setAlpha(this.labelAlpha);
            fill(chosenColor);
            textAlign(CENTER, CENTER);
            textSize(menuFontSize);
            text(this.label, 0, 0);

            // Desenha o asterisco original por cima, enquanto ele desaparece (com o alpha sincronizado)
            if (this.alpha > 0) {
                this.color.setAlpha(this.alpha);
                fill(this.color);
                textSize(this.size);
                text(this.char, 0, 0);
            }
        } else {
            // Asteriscos normais apenas desaparecem
            this.color.setAlpha(this.alpha);
            fill(this.color);
            textSize(this.size);
            textAlign(CENTER, CENTER);
            text(this.char, 0, 0);
        }
        pop();
    }

    isDead() {
        // Um asterisco só "morre" quando a animação de desaparecimento termina (alpha = 0)
        // Menu items never die so they remain clickable
        if (this.isMenuItem) return false;
        return this.alpha <= 0;
    }

    isMouseOver() {
        // Clicável apenas quando o texto do botão está quase totalmente visível
        if (this.labelAlpha < 240) return false;
        const hitboxPadding = desktopLayout ? 0 : 10;
        const textWidthValue = textWidth(this.label);
        return (mouseX > this.pos.x - textWidthValue / 2 - hitboxPadding &&
            mouseX < this.pos.x + textWidthValue / 2 + hitboxPadding &&
            mouseY > this.pos.y - menuFontSize / 2 - hitboxPadding &&
            mouseY < this.pos.y + menuFontSize / 2 + hitboxPadding);
    }
}

// ===================================================================
// FUNÇÕES PRINCIPAIS DO P5.JS E LÓGICA DE CONTROLO
// ===================================================================

function setup() {
    createCanvas(windowWidth, windowHeight);
    dandelionCenter = createVector(width / 2, height / 2);
    animationOrigin = createVector(0, 0);
    textAlign(CENTER, CENTER);
    textFont('Noto Sans'); // Alterado para Noto Sans
    setResponsiveVariables();
}

let textBoundingBoxes = [];

function draw() {
    clear();
    background(255);
    drawStaticText();

    if (animationState === 'initial') {
        if (isMouseOverAnyText()) {
            cursor(HAND);
            startAnimation();
        } else {
            cursor(ARROW);
        }
    } else if (animationState === 'puffing') {
        letters.forEach(letter => {
            // Aplicar força de "vento" só se a partícula ainda não chegou ao destino e não é um botão parado
            if (!letter.hasArrived || !letter.isMenuItem) {
                const windX = map(noise(letter.noiseOffset + frameCount * 0.002), 0, 1, -0.03, 0.03);
                const liftY = -0.01;
                const wind = createVector(windX, liftY);
                letter.applyForce(wind);
            }
            letter.update();
            letter.display();
        });
        // Remove da memória os asteriscos que já sumiram
        letters = letters.filter(letter => !letter.isDead());

        let onMenuItem = letters.some(l => l.isMenuItem && l.isMouseOver());
        cursor(onMenuItem ? HAND : ARROW);
    }
}

function setResponsiveVariables() {
    if (width > 768) {
        desktopLayout = true;
        mainFontSize = 40;
        menuFontSize = 22;
    } else {
        desktopLayout = false;
        mainFontSize = (width / 320) * 28;
        menuFontSize = (width / 320) * 18;
    }
}

function drawStaticText() {
    push();
    textSize(mainFontSize);
    textBoundingBoxes = []; // Reset bounding boxes

    const part1 = 'infinita poesia /';
    const part2 = '*';
    const part1Width = textWidth(part1);
    const part2Width = textWidth(part2);

    // Altura aproximada para o hitbox
    const h = mainFontSize * 1.2;

    if (part1Width + part2Width > width * 0.9) {
        const line1 = 'infinita';
        const line2_part1 = 'poesia /';
        const line2_part2 = '*';
        const line2_part1_width = textWidth(line2_part1);
        const line2_total_width = line2_part1_width + textWidth(line2_part2);
        const lineSpacing = mainFontSize * 0.8;

        // Line 1 (Center aligned)
        fill(0); textAlign(CENTER, CENTER);
        text(line1, width / 2, height / 2 - lineSpacing);
        let w1 = textWidth(line1);
        textBoundingBoxes.push({
            x: width / 2 - w1 / 2,
            y: height / 2 - lineSpacing - h / 2,
            w: w1,
            h: h
        });

        // Line 2 Part 1 (Left aligned relative to block)
        fill(0); textAlign(LEFT, CENTER);
        let startX2 = (width / 2) - (line2_total_width / 2);
        text(line2_part1, startX2, height / 2 + lineSpacing);
        textBoundingBoxes.push({
            x: startX2,
            y: height / 2 + lineSpacing - h / 2,
            w: line2_part1_width,
            h: h
        });

        let asteriskX = startX2 + line2_part1_width;
        let asteriskY = height / 2 + lineSpacing;
        fill('#FF4E50'); text(line2_part2, asteriskX, asteriskY);
        animationOrigin.set(asteriskX, asteriskY);
        textBoundingBoxes.push({
            x: asteriskX,
            y: asteriskY - h / 2,
            w: textWidth(line2_part2),
            h: h
        });

    } else {
        const totalWidth = part1Width + part2Width;
        const startX = (width / 2) - (totalWidth / 2);

        fill(0); textAlign(LEFT, CENTER);
        text(part1, startX, height / 2);
        textBoundingBoxes.push({
            x: startX,
            y: height / 2 - h / 2,
            w: part1Width,
            h: h
        });

        let asteriskX = startX + part1Width;
        let asteriskY = height / 2;
        fill('#FF4E50'); text(part2, asteriskX, asteriskY);
        animationOrigin.set(asteriskX, asteriskY);
        textBoundingBoxes.push({
            x: asteriskX,
            y: asteriskY - h / 2,
            w: part2Width,
            h: h
        });
    }
    pop();
}

function isMouseOverAnyText() {
    for (let box of textBoundingBoxes) {
        if (mouseX >= box.x && mouseX <= box.x + box.w &&
            mouseY >= box.y && mouseY <= box.y + box.h) {
            return true;
        }
    }
    return false;
}

function isMouseOverText() {
    // Mantido por compatibilidade, mas a lógica principal mudou para isMouseOverAnyText
    return isMouseOverAnyText();
}

function startAnimation() {
    if (animationState !== 'initial') return;
    animationState = 'puffing';
    puffStartTime = frameCount;
    letters = [];
    for (let i = 0; i < 24; i++) {
        letters.push(new Letter('*', animationOrigin.x, animationOrigin.y));
    }
    if (desktopLayout) {
        const spacing = height * 0.2; const textOffset = width * 0.22; const horizontalOffset = width * 0.08;
        for (let i = 0; i < menuItemsData.length; i++) {
            const data = menuItemsData[i];
            const menuItem = new Letter('*', animationOrigin.x, animationOrigin.y, true, data.label, data.url);
            if (i === 0) { menuItem.targetPos = createVector(dandelionCenter.x - horizontalOffset, dandelionCenter.y - spacing); }
            else if (i === 1) { menuItem.targetPos = createVector(dandelionCenter.x + textOffset, dandelionCenter.y); }
            else { menuItem.targetPos = createVector(dandelionCenter.x + horizontalOffset, dandelionCenter.y + spacing); }
            letters.push(menuItem);
        }
    } else {
        const vOffset1 = height * 0.25; const hOffset1 = width * 0.2;
        const vOffset2 = height * 0.12; const hOffset2 = width * 0.25;
        const vOffset3 = height * 0.2; const hOffset3 = width * 0.15;
        const positions = [createVector(dandelionCenter.x - hOffset1, dandelionCenter.y - vOffset1), createVector(dandelionCenter.x + hOffset2, dandelionCenter.y - vOffset2), createVector(dandelionCenter.x - hOffset3, dandelionCenter.y + vOffset3)];
        for (let i = 0; i < menuItemsData.length; i++) {
            const data = menuItemsData[i];
            const menuItem = new Letter('*', animationOrigin.x, animationOrigin.y, true, data.label, data.url);
            menuItem.targetPos = positions[i];
            letters.push(menuItem);
        }
    }
    for (let letter of letters) {
        letter.release();
    }
}

function mousePressed() {
    if (animationState === 'puffing') {
        for (let letter of letters) {
            if (letter.isMenuItem && letter.isMouseOver()) {
                window.location.href = letter.url;
                break;
            }
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    dandelionCenter.set(width / 2, height / 2);
    setResponsiveVariables();
    animationState = 'initial';
    letters = [];
    cursor(ARROW);
}