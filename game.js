// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Clase Ball (Pelota)
class Ball {
    constructor(x, y, radius, speedX, speedY, color = 'white') {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speedX = speedX;
        this.speedY = speedY;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    move() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Colisión con la parte superior e inferior
        if (this.y - this.radius <= 0 || this.y + this.radius >= canvas.height) {
            this.speedY = -this.speedY;
        }
    }

    reset() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.speedX = -this.speedX; // Cambia dirección al resetear
    }
}

// Clase Paddle (Paleta)
class Paddle {
    constructor(x, y, width, height, isPlayerControlled = false) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isPlayerControlled = isPlayerControlled;
        this.speed = 5;
    }

    draw() {
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move(direction) {
        if (direction === 'up' && this.y > 0) {
            this.y -= this.speed;
        } else if (direction === 'down' && this.y + this.height < canvas.height) {
            this.y += this.speed;
        }
    }

    // Movimiento de la paleta automática (IA)
    autoMove(ball) {
        if (ball.y < this.y + this.height / 2) {
            this.y -= this.speed;
        } else if (ball.y > this.y + this.height / 2) {
            this.y += this.speed;
        }
    }
}

// Clase Game (Controla el juego)
class Game {
    constructor() {
        // Crear 5 pelotas con colores, tamaños y velocidades personalizadas
        this.balls = [
            new Ball(canvas.width / 2, canvas.height / 2, 10, 6, 6, 'red'),
            new Ball(canvas.width / 2, canvas.height / 2, 12, -5, 5, 'blue'),
            new Ball(canvas.width / 2, canvas.height / 2, 8, 7, -7, 'green'),
            new Ball(canvas.width / 2, canvas.height / 2, 15, -6, -6, 'yellow'),
            new Ball(canvas.width / 2, canvas.height / 2, 10, 5, -5, 'purple')
        ];

        // Aumentar el tamaño de las barras
        this.paddle1 = new Paddle(0, canvas.height / 2 - 75, 10, 150, true); // Barra del jugador
        this.paddle2 = new Paddle(canvas.width - 10, canvas.height / 2 - 75, 10, 150); // Barra de la computadora
        this.keys = {}; // Para capturar las teclas
    }

    draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dibujar todas las pelotas
        this.balls.forEach(ball => ball.draw());

        this.paddle1.draw();
        this.paddle2.draw();
    }

    update() {
        // Mover todas las pelotas
        this.balls.forEach(ball => ball.move());

        // Movimiento de la paleta 1 (Jugador) controlado por teclas
        if (this.keys['ArrowUp']) {
            this.paddle1.move('up');
        }
        if (this.keys['ArrowDown']) {
            this.paddle1.move('down');
        }

        // Movimiento de la paleta 2 (Controlada por IA)
        this.paddle2.autoMove(this.balls[0]); // La paleta sigue a la primera pelota como referencia

        // Colisiones con las paletas para cada pelota
        this.balls.forEach(ball => {
            // Colisión con la paleta 1
            if (ball.x - ball.radius <= this.paddle1.x + this.paddle1.width &&
                ball.y >= this.paddle1.y && ball.y <= this.paddle1.y + this.paddle1.height) {
                ball.speedX = -ball.speedX;
            }

            // Colisión con la paleta 2
            if (ball.x + ball.radius >= this.paddle2.x &&
                ball.y >= this.paddle2.y && ball.y <= this.paddle2.y + this.paddle2.height) {
                ball.speedX = -ball.speedX;
            }

            // Detectar cuando la pelota sale de los bordes (punto marcado)
            if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= canvas.width) {
                ball.reset();
            }
        });
    }

    // Captura de teclas para el control de la paleta
    handleInput() {
        window.addEventListener('keydown', (event) => {
            this.keys[event.key] = true;
        });
        window.addEventListener('keyup', (event) => {
            this.keys[event.key] = false;
        });
    }

    run() {
        this.handleInput();
        const gameLoop = () => {
            this.update();
            this.draw();
            requestAnimationFrame(gameLoop);
        };
        gameLoop();
    }
}

// Crear instancia del juego y ejecutarlo
const game = new Game();
game.run();
