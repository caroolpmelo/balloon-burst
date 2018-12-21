const game = new Phaser.Game(480, 320, Phaser.CANVAS, null, {
  preload: preload, // takes care of preloading the assets
  create: create, // executed once when everything is loaded and ready
  update: update // executed on every frame
});

// main objs
let ball;
let paddle;

// bricks
let bricks;
let newBrick;
let brickInfo;

// score
let scoreText;
let score = 0;

// lives
let lives = 3;
let livesText;
let lifeLostText;

function preload() {
  // SHOW_ALL scales but keeps the aspect ratio
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

  // always centered on screen regardless of size:
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;

  // add custom background color to canvas
  game.stage.backgroundColor = "#eee";

  game.load.image("ball", "img/ball.png");
  game.load.image("paddle", "img/paddle.png");
  game.load.image("brick", "img/brick.png");
  game.load.spritesheet("ball", "img/wobble.png", 20, 20); // ("name", "path", width, height)
}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE); // initialize Physics engine
  game.physics.arcade.checkCollision.down = false; // disable floor wall

  // ball
  ball = game.add.sprite(
    game.world.width * 0.5,
    game.world.height - 25,
    "ball"
  );
  // (animationName, frameOrder, framerate):
  ball.animations.add("wobble", [0, 1, 0, 2, 0, 1, 0, 2, 0], 24);
  ball.anchor.set(0.5);
  /* object physics aren't enabled by default: */
  game.physics.enable(ball, Phaser.Physics.ARCADE);
  ball.body.velocity.set(150, -150); // set velocity on its body
  ball.body.collideWorldBounds = true; // set the walls
  ball.body.bounce.set(1); // make it bounce, jump

  // ball floor collision: game over
  ball.checkWorldBounds = true;
  ball.events.onOutOfBounds.add(ballLeaveScreen, this);

  // paddle
  paddle = game.add.sprite(
    game.world.width * 0.5,
    game.world.height - 5,
    "paddle"
  );
  paddle.anchor.set(0.5, 1); // put paddle at the middle correcting its anchor
  game.physics.enable(paddle, Phaser.Physics.ARCADE);
  paddle.body.immovable = true; // paddle won't fall after hit

  initBricks();

  textStyle = { font: "18px Arial", fill: "#0095DD" };

  scoreText = game.add.text(5, 5, "Points: 0", textStyle);

  // lives
  livesText = game.add.text(
    game.world.width - 5,
    5,
    `Lives: ${lives}`,
    textStyle
  );
  livesText.anchor.set(1, 0);

  lifeLostText = game.add.text(
    game.world.width * 0.5,
    game.world.height * 0.5,
    "Life lost, click to continue",
    textStyle
  );
  lifeLostText.anchor.set(0.5);
  lifeLostText.visible = false;
}

function update() {
  game.physics.arcade.collide(ball, paddle, ballHitPaddle);
  game.physics.arcade.collide(ball, bricks, ballHitBrick); // 3º parameter is func()
  paddle.x = game.input.x || game.world.width * 0.5;
}

function initBricks() {
  brickInfo = {
    width: 50,
    height: 20,
    count: { row: 3, col: 7 },
    offset: { top: 50, left: 60 },
    padding: 10
  };

  bricks = game.add.group();

  for (let col = 0; col < brickInfo.count.col; col++) {
    for (let row = 0; row < brickInfo.count.row; row++) {
      let brickX =
        col * (brickInfo.width + brickInfo.padding) + brickInfo.offset.left;
      let brickY =
        row * (brickInfo.height + brickInfo.padding) + brickInfo.offset.top;

      newBrick = game.add.sprite(brickX, brickY, "brick");
      game.physics.enable(newBrick, Phaser.Physics.ARCADE);
      newBrick.body.immovable = true;
      newBrick.anchor.set(0.5);
      bricks.add(newBrick);
    }
  }
}

function ballHitBrick(ball, brick) {
  // tweens (animation: width, opacity etc)
  let killTween = game.add.tween(brick.scale); // scale bricks properties to zero
  // to() defines the state of the object at the end of tween
  // (scale, milliseconds, typeOfEasing)
  killTween.to({ x: 0, y: 0 }, 200, Phaser.Easing.Linear.None);
  // onComplete (optional) -> executed when tween finishes
  killTween.onComplete.addOnce(function() {
    brick.kill();
  }, this);
  killTween.start(); // start tween right away

  score += 10;
  scoreText.setText(`Points: ${score}`);

  // winning
  let count_alive = 0;

  for (let i = 0; i < bricks.children.length; i++) {
    if (bricks.children[i].alive == true) {
      count_alive++;
    }
  }

  if (count_alive == 0) {
    alert("YOU WON, HURRAY <3");
    location.reload();
  }
}

function ballLeaveScreen() {
  lives--;

  if (lives) {
    livesText.setText(`Lives: ${lives}`);
    lifeLostText.visible = true;

    ball.reset(game.world.width * 0.5, game.world.height - 25);
    paddle.reset(game.world.width * 0.5, game.world.height - 5);

    game.input.onDown.addOnce(function() {
      lifeLostText.visible = false;
      ball.body.velocity.set(150, -150);
    }, this);
  } else {
    alert("GAME OVER");
    location.reload();
  }
}

function ballHitPaddle(ball, paddle) {
  ball.animations.play("wobble");
}
