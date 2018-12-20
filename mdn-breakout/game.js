// canvas
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d"); // actual tool to paint on canvas

// ball + movement
const ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;

// paddle + movement
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

// keys
let rightPressed = false;
let leftPressed = false;

// bricks
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

// status info
let score = 0;
let lives = 3;

// bricks array
let bricks = [];
for (let columns = 0; columns < brickColumnCount; columns++) {
  bricks[columns] = []; // two-dimensional array
  // brick columns contain brick rows
  for (let rows = 0; rows < brickRowCount; rows++) {
    bricks[columns][rows] = {
      // object that contains x and y position
      x: 0,
      Y: 0,
      status: 1
    };
  }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = true;
  } else if (e.keyCode == 37) {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = false;
  } else if (e.keyCode == 37) {
    leftPressed = false;
  }
}

function mouseMoveHandler(e) {
  // clientX returns the horizontal coordinate of the mouse pointer
  /* offsetLeft returns the distance between left edge of canvas
  and left edge of viewport */
  let relativeX = e.clientX - canvas.offsetLeft;

  if (relativeX > 0 && relativeX < canvas.width) {
    // paddle won't 'disappear'
    paddleX = relativeX - paddleWidth / 2; // relative to middle of paddle
  }
}

function collisionDetection() {
  for (let columns = 0; columns < brickColumnCount; columns++) {
    for (let rows = 0; rows < brickRowCount; rows++) {
      let brickObj = bricks[columns][rows];

      if (brickObj.status == 1) {
        if (
          x > brickObj.x &&
          x < brickObj.x + brickWidth &&
          y > brickObj.y &&
          y < brickObj.y + brickHeight
        ) {
          dy *= -1; // collision on brick
          brickObj.status = 0; // 'delete' brick
          score++;

          if (score == brickRowCount * brickColumnCount) {
            alert("YOU WIN, CHEERS");
            document.location.reload();
          }
        }
      }
    }
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let columns = 0; columns < brickColumnCount; columns++) {
    for (let rows = 0; rows < brickRowCount; rows++) {
      // if status '0', brick has been deleted
      if (bricks[columns][rows].status == 1) {
        // if 1, draw it
        var brickX = columns * (brickWidth + brickPadding) + brickOffsetLeft;
        var brickY = rows * (brickHeight + brickPadding) + brickOffsetTop;

        bricks[columns][rows].x = brickX;
        bricks[columns][rows].y = brickY;

        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText(`Score: ${score}`, 8, 20); // (text, x, y, maxWidth)
}

function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();

  // collision detection
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx *= -1;
  }

  // allows just 3 walls
  if (y + dy < ballRadius) {
    dy *= -1;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy *= -1;
    } else {
      // alert("GAME OVER");
      // document.location.reload();
      lives--;

      if (!lives) {
        alert("GAME OVER");
        document.location.reload();
      } else {
        // 'reset' position and movement variables
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  x += dx;
  y += dy;

  /* requestAnimationFrame helps the browser render the game better than
  the fixed framerate on setInterval */
  // produces a more efficient, smoother animation loop
  requestAnimationFrame(draw); // function calls itself over and over again
}

// setInterval(draw, 10); // draw() will be executed every 10 miliseconds
draw(); // inserted requestAnimationFrame() at the end of the method
