const canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d"); // actual tool to paint on canvas

const ballRadius = 10,
  paddleHeight = 10,
  paddleWidth = 75;

let x = canvas.width / 2,
  y = canvas.height - 30,
  dx = 2,
  dy = -2,
  paddleX = (canvas.width - paddleWidth) / 2;

let rightPressed = false,
  leftPressed = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

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

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();

  // collision detection
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx *= -1;
  }

  if (y + dy > canvas.height - ballRadius || y + dy < ballRadius) {
    dy *= -1;
  }

  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  x += dx;
  y += dy;
}

setInterval(draw, 10); // draw() will be executed every 10 miliseconds

// ctx.beginPath();
// ctx.rect(20, 40, 50, 50); // (x, y, width, height)
// ctx.fillStyle = "#FF0000"; // 'color | gradient | pattern'
// ctx.fill();
// ctx.closePath();

// ctx.beginPath();
// ctx.arc(240, 160, 20, 0, Math.PI * 2, false);
// ctx.fillStyle = "green";
// ctx.fill();
// ctx.closePath();

// ctx.beginPath();
// ctx.rect(160, 10, 100, 40);
// ctx.strokeStyle = "rgba(0,0,255,0.5)";
// ctx.stroke();
// ctx.closePath();
