const game = new Phaser.Game(480, 320, Phaser.CANVAS, null, {
  preload: preload, // takes care of preloading the assets
  create: create, // executed once when everything is loaded and ready
  update: update // executed on every frame
});

let ball;
let paddle;

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
  ball.anchor.set(0.5);
  /* object physics aren't enabled by default: */
  game.physics.enable(ball, Phaser.Physics.ARCADE);
  ball.body.velocity.set(150, -150); // set velocity on its body
  ball.body.collideWorldBounds = true; // set the walls
  ball.body.bounce.set(1); // make it bounce, jump

  // ball floor collision: game over
  ball.checkWorldBounds = true;
  ball.events.onOutOfBounds.add(function() {
    alert("GAME OVER");
    location.reload();
  }, this);

  // paddle
  paddle = game.add.sprite(
    game.world.width * 0.5,
    game.world.height - 5,
    "paddle"
  );
  paddle.anchor.set(0.5, 1); // put paddle at the middle correcting its anchor
  game.physics.enable(paddle, Phaser.Physics.ARCADE);
  paddle.body.immovable = true; // paddle won't fall after hit
}

function update() {
  game.physics.arcade.collide(ball, paddle);
  paddle.x = game.input.x || game.world.width * 0.5;
}
