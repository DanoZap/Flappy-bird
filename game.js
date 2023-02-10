const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext("2d");
const gameContainer = document.getElementById('game-container');

const flappyImg = new Image();
flappyImg.src = 'assets/flappy_dunk.png';

// Game Constants
const FLAP_SPEED = -3;
const BIRD_WIDTH = 40;
const BIRD_HEIGHT = 30;
const PIPE_WIDTH = 50;
const PIPE_GAP = 125;

// Bird Variables

let birdX = 50;
let birdY =  50;
let birdVelocity = 0; 
let birdAcceleration = 0.1; 

// Pipe Variables 

let pipeX = 400;
let pipeY = canvas.height - 200;

// Score and Highscore variables

let scoreDiv = document.getElementById('score-display');
let score = 0;
let highScore = 0;

let scored = false;

document.body.onkeyup = function(e) {
    if (e.code == 'Space') {
        birdVelocity = FLAP_SPEED;
    }
}

document.body.addEventListener("click", function(e){ 
    birdVelocity = FLAP_SPEED;
})

// Restart Game 
document.getElementById('restart-btn').addEventListener('click', function(e){
    hideEndMenu();
    resetGame();
    loop();
})

function increaseScore() {
    if(birdX > pipeX + PIPE_WIDTH &&
        (birdY < pipeY + PIPE_GAP || 
            birdY + BIRD_HEIGHT > pipeY + PIPE_GAP) &&
            !scored) {
                score++;
                scoreDiv.innerHTML = score;
                scored = true;
            }

    if (birdX < pipeX + PIPE_WIDTH) {
        scored = false;
    }

}

function increaseSpeed() {
    if (score >= 10) {
        birdVelocity += birdAcceleration;
        birdY += birdVelocity;
    }
}

function collisionCheck() {
    // Boxes for the bird and pipes

    const birdBox = {
        y: birdY,
        x: birdX,
        width: BIRD_WIDTH,
        height: BIRD_HEIGHT
    }

    const topPipeBox = {
        x: pipeX,
        y: pipeY - PIPE_GAP + BIRD_HEIGHT,
        width: PIPE_WIDTH,
        height: pipeY
    }

    const bottomPipeBox = {
        x: pipeX,
        y: pipeY + PIPE_GAP + BIRD_HEIGHT,
        width: PIPE_WIDTH,
        height: canvas.height - pipeY - PIPE_GAP
    }

    // Upper Pipe Box Collision Check
    if (birdBox.x + birdBox.width > topPipeBox.x &&
        birdBox.x < topPipeBox.x + topPipeBox.width &&
        birdBox.y < topPipeBox.y) {
            return true;
        }
    
    // Lower Pipe Box Collision Check
    if (birdBox.x + birdBox.width > bottomPipeBox.x &&
        birdBox.x < bottomPipeBox.x + bottomPipeBox.width &&
        birdBox.y + birdBox.height > bottomPipeBox.y) {
            return true;
        }
    
    // check if bird hits boundaries 
    if (birdY < 0 || birdY + BIRD_HEIGHT > canvas.height){
        return true;
    }

    return false;
}

function hideEndMenu() {
    document.getElementById('end-menu').style.display = 'none';
    gameContainer.classList.remove('backdrop-blur');
}

function showEndMenu() {
    document.getElementById('end-menu').style.display = 'block';
    gameContainer.classList.add('backdrop-blur');
    document.getElementById('end-score').innerHTML = score;    
    if (highScore < score) {
        highScore = score;
    }
    document.getElementById('best-score').innerHTML = highScore;
}

function resetGame() {
    birdX = 50;
    birdY =  50;
    birdVelocity = 0; 
    birdAcceleration = 0.1; 

    pipeX = 400;
    pipeY = canvas.height - 200;

    score = 0
}

function endGame() {
    showEndMenu();
}

function loop() {
    // Reset ctx
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Flappy Bird
    ctx.drawImage(flappyImg, birdX, birdY);

    // Draw Pipes
    ctx.fillStyle = '#333';
    ctx.fillRect(pipeX, -60, PIPE_WIDTH, pipeY)
    ctx.fillRect(pipeX, pipeY + PIPE_GAP, PIPE_WIDTH, canvas.height - pipeY);

    // Add Collision and check to display the end menu
    if (collisionCheck()){
        endGame();
        return;
    }

    pipeX -= 1.5;
    
    if (pipeX < -50) {
        pipeX = 400;
        pipeY = Math.random() * (canvas.height - PIPE_GAP) + PIPE_WIDTH
    }

    // Apply Gravity
    birdVelocity += birdAcceleration;
    birdY += birdVelocity;

    increaseScore();
    requestAnimationFrame(loop);
}

loop();