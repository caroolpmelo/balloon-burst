const game = new Phaser.Game(480, 320, Phaser.CANVAS, null, {
  preload: preload, // takes care of preloading the assets
  create: create, // executed once when everything is loaded and ready
  update: update // executed on every frame
});
let ball;

function preload() {
  // SHOW_ALL scales but keeps the aspect ratio
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

  // always centered on screen regardless of size:
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;

  // add custom background color to canvas
  game.stage.backgroundColor = "#eee";

  game.load.image("ball", "img/ball.png");
}

function create() {
  ball = game.add.sprite(50, 50, "ball");
}

function update() {
  ball.x += 1;
  ball.y += 1;
}
