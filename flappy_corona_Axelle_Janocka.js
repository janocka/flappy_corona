//Janocka Axelle's work in ECV Bordeaux, special thanks to William Pezet

var GRAVITY = 0.3;
var FLAP = -7;
var GROUND_Y = 450;
var MIN_OPENING = 300;
var bird, ground; girl; start;
var pipes;
var gameOver;
var boyImg, pipeImg, groundImg, bgImg;
var girlImg;
var startImg;

function preload() {
  pipes = loadFont('data/FengardoNeue_Black.otf');
}

function setup() {
 
  createCanvas(windowWidth, windowHeight);

  boyImg = loadImage('assets/matthieupng1.png');
  girlImg = loadImage('assets/axellepng1.png');
  pipeImg = loadImage('assets/pipe-transpa.png');
  groundImg = loadImage('assets/ground.png');
  bgImg = loadImage('assets/background-night-copie.png');
  startImg = loadImage('assets/start-texte.png');
  
 textFont(pipes);
 fill(255,255,255);

  bird = createSprite(width/2, height/2, 40, 40);
  bird.rotateToDirection = true;
  bird.velocity.x = 4;
  bird.setCollider('circle', 0, 0, 20);
  bird.addImage(boyImg);

  ground = createSprite(800/2, GROUND_Y+100)
  ground.addImage(groundImg);
  
  girl = createSprite(width+200,mouseY);
  girl.velocity.x = 4;
  girl.addImage(girlImg);
  
  start = createSprite(600,200);
  start.velocity.x = 0;
  start.addImage(startImg);

  pipes = new Group();
  gameOver = true;
  updateSprites(false);

  camera.position.y = height/2;
  
}

function draw() {

  if(gameOver && keyWentDown('x'))
    newGame();

  if(!gameOver) {

    if(keyWentDown('x'))
      bird.velocity.y = FLAP;

    bird.velocity.y += GRAVITY;

    if(bird.position.y<0)
      bird.position.y = 0;

    if(bird.position.y+bird.height/2 > GROUND_Y)
      die();

    if(bird.overlap(pipes))
      die();

    //spawn pipes
    if(frameCount%60 == 0) {
      var pipeH = random(50, 300);
      var pipe = createSprite(bird.position.x + width, GROUND_Y-pipeH/2+1+100, 80, pipeH);
      pipe.addImage(pipeImg);
      pipes.add(pipe);

      //top pipe
      if(pipeH<200) {
        pipeH = height - (height-GROUND_Y)-(pipeH+MIN_OPENING);
        pipe = createSprite(bird.position.x + width, pipeH/2-100, 80, pipeH);
        pipe.mirrorY(-1);
        pipe.addImage(pipeImg);
        pipes.add(pipe);
      }
    }

    //get rid of passed pipes
    for(var i = 0; i<pipes.length; i++)
      if(pipes[i].position.x < bird.position.x-width/2)
        pipes[i].remove();
  }

  camera.position.x = bird.position.x + width/4;

  //wrap ground
  if(camera.position.x > ground.position.x-ground.width+width/2)
    ground.position.x+=ground.width;

  background(19,42,107);
  background(bgImg);
  camera.off();
  image(bgImg);
  camera.on();
  girl.position.y = mouseY;
  
  if(gameOver) {
  fill(255,55,55);
  }

  drawSprites(pipes);
  for(var i = 0; i<pipes.length; i++){
      textSize(100);
      push();
      translate(pipes[i].position.x,pipes[i].position.y);
      rotate(PI/2);
      text('CORONA!',-205,35)
      pop();
  }
  
  drawSprite(ground);
  drawSprite(bird);
  drawSprite(girl);
  drawSprite(start);
}

function die() {
  updateSprites(false);
  gameOver = true;
}

function newGame() {
  pipes.removeSprites();
  gameOver = false;
  updateSprites(true);
  bird.position.x = width/2;
  bird.position.y = height/2;
  bird.velocity.y = 0;
  ground.position.x = 600;
  ground.position.y = GROUND_Y+200;
  girl.position.x = width+200;
  girl.position.y = mouseY;
  girl.velocity.y = 0;
  start.position.x = width;
  start.position.y = 200;
  start.velocity.y = 0;

}

function mousePressed() {
  if(gameOver)
    newGame();
  bird.velocity.y = FLAP;
}
