let bg;
let bg_stars;
let bg_dust;
let bg_nebula;
let bg_planets;
let title;
let start;
let ship;
let planetArray = [];
let starArray = [];
let nebulaArray = [];
let dustArray = [];
let wordList = ["fairy", "avenue", "complete", "bishop", "eagle", "other", "recover", "lamp", "sketch"];
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
let asteroidHitAni;
let asteroidBaseAni;

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

}

function setup() {
  angleMode('degrees');
  createCanvas(600, 600);
  bg = loadImage("./assets/background/space_background.png", 0, 0);
  bg_stars = loadImage("./assets/background/space_stars.png", 0, 0);
  bg_dust = loadImage("./assets/background/space_dust.png", 0, 0);
  bg_nebula = loadImage("./assets/background/space_nebula.png", 0, 0);
  bg_planets = loadImage("./assets/background/space_planets.png", 0, 0);
  start = loadImage("./assets/start.png");
  title = loadImage("./assets/typespace.png");

  dustArray.push(new BackgroundComponent(bg_dust, -400, 0.2));
  nebulaArray.push(new BackgroundComponent(bg_nebula, -400, 0.5));
  starArray.push(new BackgroundComponent(bg_stars, -400, 0.1));
  planetArray.push(new BackgroundComponent(bg_planets, -400, 1));
  
  let thrusterAni = loadAnimation(
    './assets/thrusters/vertical-thrust-01.png',
    './assets/thrusters/vertical-thrust-02.png',
    './assets/thrusters/vertical-thrust-03.png',
    './assets/thrusters/vertical-thrust-04.png'
  );

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

  thrusterAni.frameDelay = 5;
  thruster = new Sprite();
  thruster.addAni(thrusterAni);
  thruster.x = 300;
  thruster.y = 530;

  ship = new Sprite();
  ship.img = "./assets/ships/purple_03.png";
  ship.mass = 1000;
  ship.x = 300;
  ship.y = 500;
  ship.diameter = 32;

  projectiles = new Group();
  asteroids = new Group();
  asteroids.addAni('explode', asteroidExplosionAni)
  asteroids.addAni('base', asteroidBaseAni);
  asteroids.addAni('hit', asteroidHitAni);

  projectiles.overlaps(projectiles);
  projectiles.overlaps(ship);
  ship.overlaps(thruster);
}

document.addEventListener("keydown", (e) => {
  checkInput(e.key, asteroidArray);
})

function draw() {
  background(bg);
  animateBackground();
  generateAsteroids();

  //animateThrusters();
  //animation(thrusterAni,ship.x,ship.y+30)

  //Check asteroid input
  if (asteroidToPoint === -1) {
    ship.rotateTo(0, 100000);
    thruster.rotateTo(0, 100000);
    thruster.x = 300;
    thruster.y = 530;
  }
  key = '';

  //Display currently typed characters on screen
  displayText(stringStack);

  checkProjectileCollision();

  checkShipCollision();
  ship.debug = mouse.pressing();
  asteroids.debug = mouse.pressing();
  
  checkAsteroidToExplode();
  
}

function generateAsteroids() {
  if (frameCount === 10 || frameCount % 150 == 0 && wordList.length > 0) {
    let num = Math.floor(Math.random() * wordList.length);
    //let asteroid = new Asteroid(frameCount, wordList[num]);
    let asteroid = new asteroids.Sprite();
    asteroid.id = frameCount;
    asteroid.img = "./assets/asteroid/asteroid-base.png";
    asteroid.diameter = 25;
    asteroid.mass = 10000;
    asteroid.frameDelay = 10;
    asteroid.x = Math.floor(Math.random() * 600) + 20;
    asteroid.y = Math.floor(Math.random() * 200) + 0;
    asteroid.code = wordList[num];
    asteroid.text = wordList[num];
    asteroid.health = wordList[num].length;
    asteroid.pseudoHealth = wordList[num].length;
    asteroid.maxHealth = wordList[num].length;
    asteroid.textColor = "#009699";
    asteroid.textSize = 30;
    asteroid.moveTowards(ship, 0.001);
    wordList.splice(num, 1);
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

  starArray = animateComponent(starArray, bg_stars, 0.1);
  dustArray = animateComponent(dustArray, bg_dust, 0.2);
  nebulaArray = animateComponent(nebulaArray, bg_nebula, 0.5);
  planetArray = animateComponent(planetArray, bg_planets, 1);

}

function animateComponent(arr, component, speed) {
  if (arr[arr.length - 1].delta > 0) {
    arr.push(new BackgroundComponent(component, -1000, speed));
  }

  if (arr[0].delta > 1000) {
    arr.splice(0, 1);
    return arr;
  }
  return arr;
}

function animateThrusters() {
  if (frameCount % 5 == 0) {
    thrusterFrameCount += 1;
  }
  image(thrusterArray[thrusterFrameCount % 4], shipCoords[0] + 16.5, shipCoords[1] + 41)
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

function animateTitle() {
  let omega = 0.5 + Math.abs(Math.sin(frameCount * 0.01)) / 20;
  scale(omega);
  translate(-40, 100);
  image(title, (430 - (430 * omega)), (44 - (44 - omega)));
}

class Text {
  constructor(id, code, x, y) {
    this.id = id;
    this.code = code;
    this.x = x
    this.y = y
  }

  static image = "./assets/asteroid/asteroid-base.png";

  display() {
    textSize(32);
    fill(0, 150, 153);
    text(this.code, this.x + ((96 * 1.5) / 2 - 30), this.y + ((96 * 1.5) / 2 + 15));
  }

  animateAsteroidExplosion() {
    if (frameCount % 5 == 0) {
      asteroidFrameCount += 1;
    }
    if (asteroidFrameCount < 7) {
      image(asteroidExplosionArray[asteroidFrameCount], this.position.x, this.position.y, 96 * 1.5, 96 * 1.5);
    } else {
      asteroidArray = asteroidArray.filter((ast) => ast.id !== this.id);
      asteroidFrameCount = 0;
    }
  }
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
      if (ast.health <= 0){
        // ast.changeAni('explode');
        // console.log(ast.ani.name);
        // ast.ani.loop();
        //ast.remove();
      }
    })
  })
}

function checkAsteroidToExplode(){
  asteroids.forEach( ast => {
    if(ast.health <= 0){
      ast.text = ''
      ast.ani = 'explode';
      if(ast.ani.lastFrame === ast.ani.frame){
        ast.remove();
      }
      //ast.ani.onComplete = ast.remove();
      //console.log(ast.ani.onComplete);
    }
  })
}

function checkShipCollision() {
  asteroidArray.forEach(ast => {
    let minDistance = 100;
    let distanceVector = p5.Vector.sub(ast.position, ship.position);
    let distanceVectorMag = distanceVector.mag();
    if (distanceVectorMag < minDistance) {
    }
  })

}

