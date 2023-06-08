let bg;
let bg_stars;
let bg_dust;
let bg_nebula;
let bg_planets;
let bg_stars_2;
let bg_dust_2;
let bg_nebula_2;
let bg_planets_2;
let title;
let start;
let ship;
let planetArray = [];
let starArray = [];
let nebulaArray = [];
let dustArray = [];
let shipCoords = [260, 450];
let thrusterArray = [];
let thrusterFrameCount = 0;
let asteroidToPoint = -1;
let asteroidToPointIndex = 0;
let asteroidExplosionArray = [];
let asteroidFrameCount = 0;
let projectileArray = [];
let playExplodeAsteroid = false;
let stringStack = [];
let projectiles;
let asteroids;
let thruster;
let texts;
let asteroidHitAni;
let asteroidBaseAni;
let gameStart = false;
let tutorial = false;
let startButton;
let settingsButton;
let score = 0;
let textDict = {};
let defaultFont;
let TwoPFont;

//Array containing live asteroids
let asteroidArray = [];

function preload() {
  //thrusters = createImg("./assets/thrusters/thruster.gif");
  for (let i = 0; i < 4; i++) {
    thrusterArray.push(loadImage(`./assets/thrusters/vertical-thrust-0${i + 1}.png`))
  }

  for (let i = 0; i < 7; i++) {
    asteroidExplosionArray.push(loadImage(`./assets/asteroid/asteroid-explode-0${i + 1}.png`));
  }

  TwoPFont = loadFont("./assets/font/PressStart2P-Regular.ttf");
}

function setup() {
  angleMode('degrees');
  createCanvas(1000, 600);
  bg = loadImage("./assets/background/space_background.png", 0, 0);
  bg_stars = loadImage("./assets/background/space_stars.png", 0, 0);
  bg_dust = loadImage("./assets/background/space_dust.png", 0, 0);
  bg_nebula = loadImage("./assets/background/space_nebula.png", 0, 0);
  bg_planets = loadImage("./assets/background/space_planets.png", 0, 0);

  bg_2 = loadImage("./assets/background/space_background_2.png", 0, 0);
  bg_stars_2 = loadImage("./assets/background/space_stars_2.png", 0, 0);
  bg_dust_2 = loadImage("./assets/background/space_dust_2.png", 0, 0);
  bg_nebula_2 = loadImage("./assets/background/space_nebula_2.png", 0, 0);
  bg_planets_2 = loadImage("./assets/background/space_planets_2.png", 0, 0);

  start = loadImage("./assets/start.png");
  title = loadImage("./assets/typespace.png");

  dustArray.push(new BackgroundComponent(bg_dust, -400, 0.1));
  nebulaArray.push(new BackgroundComponent(bg_nebula, -400, 0.4));
  starArray.push(new BackgroundComponent(bg_stars, -400, 0.05));
  planetArray.push(new BackgroundComponent(bg_planets, -400, 0.3));

  asteroidBaseAni = loadAnimation(
    './assets/asteroid/asteroid-base.png'
  )

  asteroidHitAni = loadAnimation(
    './assets/asteroid/asteroid-base-hit-01.png',
    './assets/asteroid/asteroid-base-hit-02.png',
    './assets/asteroid/asteroid-base.png'    
  );

  asteroidExplosionAni = loadAnimation(
    './assets/asteroid/asteroid-explode-01.png',
    './assets/asteroid/asteroid-explode-02.png',
    './assets/asteroid/asteroid-explode-03.png',
    './assets/asteroid/asteroid-explode-04.png',
    './assets/asteroid/asteroid-explode-05.png',
    './assets/asteroid/asteroid-explode-06.png',
    './assets/asteroid/asteroid-explode-07.png',
  )

  projectiles = new Group();
  texts = new Group();
  asteroids = new Group();
  asteroids.addAni('explode', asteroidExplosionAni)
  asteroids.addAni('base', asteroidBaseAni);
  asteroids.addAni('hit', asteroidHitAni);

  projectiles.overlaps(projectiles);
  texts.overlaps(asteroids);
  texts.overlaps(projectiles);

  let thrusterAni = loadAnimation(
    './assets/thrusters/vertical-thrust-01.png',
    './assets/thrusters/vertical-thrust-02.png',
    './assets/thrusters/vertical-thrust-03.png',
    './assets/thrusters/vertical-thrust-04.png'
  );

  thrusterAni.frameDelay = 5;
  thruster = new Sprite();
  thruster.addAni(thrusterAni);
  thruster.x = 500;
  thruster.y = 530;
  thruster.visible = false;

  ship = new Sprite();
  ship.img = "./assets/ships/purple_03.png";
  ship.mass = 1000;
  ship.x = 500;
  ship.y = 500;
  ship.diameter = 32;
  ship.visible = false;
  
  projectiles.overlaps(ship);
  texts.overlaps(ship);
  ship.overlaps(thruster);
  thruster.overlaps(projectiles);

  // document.getElementById('defaultCanvas0').style.height = "1080px";
  // document.getElementById('defaultCanvas0').style.width = "1920px";
  defaultFont = textFont();
}

function showShip(){
  ship.visible = true;
  thruster.visible = true;
  ship.x = 500;
  ship.y = 500;
  ship.velocity = createVector(0,0);
  console.log(ship.velocity);
  console.log(ship);
}

let keyboardKeys = document.getElementsByClassName("key nes-btn");
//const mouseoverEvent = new Event('mouseover');

document.addEventListener("keydown", (e) => {
  checkInput(e.key, asteroids);
  try{
    document.getElementById(`${e.key}-key`).style.animation = "press 0.1s 1";
  } catch(e) {
  }
  
})

keyboardKeys.forEach( key => {
  key.addEventListener("animationend", () => {
    key.style.animation = ""
  })
})

let output = document.getElementById("output");
let scoreDiv = document.getElementById("score");

function startGame(){
  score = 0;
  tutorial = true;
  showShip();
}

let titleScreen = document.getElementById('title-screen');
let gameOver = document.getElementById('game-over');

function draw() {
  background(bg);
  animateBackground();

  if(tutorial){
    background('black');
    gameOver.style.display = 'none';
    gameOver.style.pointerEvents = 'none';
    titleScreen.style.opacity = 0
    titleScreen.style.pointerEvents = 'none';
    ship.visible = true;
    thruster.visible = true;

    fill(255,255,255)
    textSize(18);
    textFont(TwoPFont);
    text("type to destroy the asteroid", 260, 290);
    textFont(defaultFont);
    
    createAsteroid();

  }

  if(gameStart){
    gameOver.style.display = 'none';
    gameOver.style.pointerEvents = 'none';
    titleScreen.style.opacity = 0
    titleScreen.style.pointerEvents = 'none';
    ship.visible = true;
    thruster.visible = true;
    //asteroids.forEach( ast => textDict[ast.id].display(ast.position));
    asteroids.forEach( ast => {
      texts.forEach( text => {
        if(text.id === ast.id){
          text.position = ast.position;
        }
      })
    })
    generateAsteroids();
    
    //Check asteroid input
    if (asteroidToPoint === -1) {
      ship.rotateTo(0, 100000);
      thruster.rotateTo(0, 100000);
      thruster.x = 500;
      thruster.y = 530;
    }
    key = '';
  }

  output.textContent = stringStack.join("");

  checkProjectileCollision();

  checkShipCollision();
  
  checkAsteroidToExplode();
  
}

function createAsteroid(){
  if(asteroids.length <= 0){
    let asteroid = new asteroids.Sprite();
    asteroid.id = frameCount;
    asteroid.img = "./assets/asteroid/asteroid-base.png";
    asteroid.diameter = 25;
    asteroid.mass = 10000;
    asteroid.scale = 1 + "typespace".length/10
    asteroid.frameDelay = 10;
    asteroid.x = 510;
    asteroid.y = 100;
    //asteroid.rotate(200, 0.1);
    asteroid.code = "typespace";
    generateText(asteroid.id, "typespace", asteroid.position);
    asteroid.stroke = 'red';
    asteroid.strokeWeight  = 10;
    asteroid.health = "typespace".length;
    asteroid.pseudoHealth = "typespace".length;
    asteroid.maxHealth = "typespace".length;
    asteroid.textColor = "#009699";
    asteroid.textSize = 30;
    
    //asteroid.p5Image = loadImage(Asteroid.image, 200, 50);
    asteroidArray.push(asteroid);
    console.log(asteroid)
  }
}

function chooseWord(){
  let num = Math.floor(Math.random() * wordList.length);
  let firstLetterList = []
  asteroids.forEach( ast => firstLetterList.push(ast.code[0]))

  while(firstLetterList.includes(wordList[num][0])){
    num = Math.floor(Math.random() * wordList.length);
  }

  wordList.splice(num, 1);
  return wordList[num]

}

function generateAsteroids() {
  if (frameCount === 10 || frameCount % 150 == 0 && wordList.length > 0) {
    let randNum = Math.floor(Math.random() * (100 - 0 + 1) + 0)
    let word = chooseWord();
    if(score > 10 && randNum === 100){
        word = `function ${word}(int){};`
    } else if(score > 5){
      if(randNum % 4 === 0){
        word += "();";
      }
      else if(randNum % 7 === 0){
        word += ('_' + chooseWord());
      }
      
    }
    //let asteroid = new Asteroid(frameCount, wordList[num]);
    let asteroid = new asteroids.Sprite();
    asteroid.id = frameCount;
    asteroid.img = "./assets/asteroid/asteroid-base.png";
    asteroid.diameter = 25;
    asteroid.mass = 10000;
    asteroid.scale = 1 + word.length/10
    asteroid.frameDelay = 10;
    asteroid.x = Math.floor(Math.random() * 1000) + 20;
    asteroid.y = Math.floor(Math.random() * 200) + 0;
    asteroid.rotate(200, 0.1);
    asteroid.code = word;
    generateText(asteroid.id, word, asteroid.position);
    asteroid.stroke = 'red';
    asteroid.strokeWeight  = 10;
    asteroid.health = word.length;
    asteroid.pseudoHealth = word.length;
    asteroid.maxHealth = word.length;
    asteroid.textColor = "#009699";
    asteroid.textSize = 30;
    asteroid.moveTowards(ship, 0.001);
    
    //asteroid.p5Image = loadImage(Asteroid.image, 200, 50);
    asteroidArray.push(asteroid);
  }
}

function displayText(stringStack) {
  textSize(60);
  fill(0, 102, 153)
  text(stringStack.join(""), 200, 550);
}

function rotateThrusters(a){
  let x = ship.x+30*sin(-a);
  let y = ship.y+30*cos(-a);
  thruster.rotateTo(-shipRotationCalc(), 10000);
  thruster.x = x;
  thruster.y = y;
}

function animateBackground() {
  dustArray.forEach(dust => dust.display());
  nebulaArray.forEach(nebula => nebula.display());
  starArray.forEach(star => star.display());
  planetArray.forEach(planet => planet.display());

  starArray = animateComponent(starArray, bg_stars, 0.05);
  dustArray = animateComponent(dustArray, bg_dust, 0.1);
  nebulaArray = animateComponent(nebulaArray, bg_nebula, 0.4);
  planetArray = animateComponent(planetArray, bg_planets, 0.3);

}

function animateComponent(arr, component, speed) {
  if (arr[arr.length - 1].delta > 0) {
    arr.push(new BackgroundComponent(component, -1000, speed));
  }

  if (arr[0].delta >= 1000) {
    arr.splice(0, 1);
    return arr;
  }
  return arr;
}

function shipRotationCalc() {
  //find the position of asteroid based on letter typed, do math to to rotate to it
  if (asteroidToPoint === -1) {
    return 0
  } else {
    let asteroidPointedAt = asteroidArray.filter((ast) => ast.id === asteroidToPoint);
    if (asteroidPointedAt !== undefined) {
      return atan((asteroidPointedAt[0].x - ship.x) / (asteroidPointedAt[0].y - ship.y));
    }
  }
}

class BackgroundComponent {
  constructor(component, delta, speed) {
    this.component = component;
    this.delta = delta;
    this.speed = speed;
  }

  display() {
    this.delta += this.speed;
    image(this.component, 0, this.delta);
  }
}

function generateText(id, code, pos){
  let text = new texts.Sprite();
  text.id = id;
  text.position = pos;
  text.text = code;
  text.color = '#a1a1a1';
  text.textSize = 30;
  text.height = 32;
  textSize(30);
  text.width = textWidth(code)+10;
}

class Text {
  constructor(id, code, x, y) {
    this.id = id;
    this.code = code;
    this.x = x
    this.y = y
    this.w = textWidth(code);
  }

  display(pos) {
    textSize(12);
    noStroke();
    fill(0);
    rect(10, 10, this.w, 12);
    fill(255);
    text(this.code, pos.x, pos.y);
  }

  // animateAsteroidExplosion() {
  //   if (frameCount % 5 == 0) {
  //     asteroidFrameCount += 1;
  //   }
  //   if (asteroidFrameCount < 7) {
  //     image(asteroidExplosionArray[asteroidFrameCount], this.position.x, this.position.y, 96 * 1.5, 96 * 1.5);
  //   } else {
  //     asteroidArray = asteroidArray.filter((ast) => ast.id !== this.id);
  //     asteroidFrameCount = 0;
  //   }
  // }
}

function fireProjectile(astCoords, astId) {
  let a = -shipRotationCalc()
  let projectile = new projectiles.Sprite();
  projectile.img = "./assets/projectiles/projectile02-1.png";
  //Projectile position relative to nose of ship
  let x = ship.x-16*sin(-a);
  let y = ship.y-16*cos(-a);
  projectile.position = { x: x, y: y };
  projectile.mass = 0.0001;
  projectile.astTargetId = astId;
  projectile.rotateTo(a, 1000);
  projectile.moveTo({ x: astCoords[0], y: astCoords[1] }, 7);
  projectileArray.push(projectile);
}

function checkProjectileCollision() {
  projectiles.forEach(proj => {
    asteroids.forEach(ast => {
      if (ast.id !== proj.astTargetId) {
        ast.overlaps(proj)
      } else {
        ast.collides(proj)
      }
    })
  })

  projectiles.forEach(proj => {
    asteroids.forEach(ast => {
      if (ast.collides(proj)) {
        ast.health -= 1; 
        proj.remove();
        ast.ani = ['hit', 'base'];
      }
    })
  })
}

function checkAsteroidToExplode(){
  asteroids.forEach( ast => {
    if(ast.health <= 0){
      ast.text = ''
      ast.ani = 'explode';
      texts.forEach( text => {
        if(text.id === ast.id){
          text.remove();
        }
      })
      if(ast.ani.lastFrame === ast.ani.frame){
        ast.remove();
        score += 1;
        scoreDiv.textContent = `Score: ${score}`
        tutorial = false;
        gameStart = true;
      }
      //ast.ani.onComplete = ast.remove();
      //console.log(ast.ani.onComplete);
    }
  })
}

function checkShipCollision(){
  if(asteroids.collides(ship)){
    console.log("game over");
    gameStart = false;
    console.log(asteroids.length)
    let asteroidsLen = asteroids.length
    let textsLen = texts.length
    for(let i = 0; i < asteroidsLen; i++){
      asteroids[0].remove();
    }
    for(let i = 0; i < textsLen; i++){
      texts[0].remove();
    }
    asteroidArray = []
    ship.visible = false;
    thruster.visible = false;
    gameOver.style.display = 'inline';
    gameOver.style.pointerEvents = 'auto';
  }

}

