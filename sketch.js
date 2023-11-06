let skyColorsFrom = [];
let skyColorsTo = [];
let skyColorsLerpA = [];
let skyColorsLerpB = [];
let skyColorsLerpC = [];
let skyColorsLerpD = [];
let skyEllipse = [];
let skyLerpEllipseA = [];
let skyLerpEllipseB = [];
let skyLerpEllipseC = [];
let skyLerpEllipseD = [];
let brushWidth;
let brushAmount;

let inc = 0.1;
let scl; //segmet size
let cols, rows;
let inc_2 = 0.01;
let scl_2;

let zoff = 0;
let particles = [];

let waterColorsFrom = [];
let waterColorsTo = [];
let waterColorsLerpA = [];
let waterColorsLerpB = [];
let waterColorsLerpC = [];
let waterColorsLerpD = [];

let unitX;
let unitY;
let w;
let h;

let polyShadow;
let polyBlurry1; //the transition part between building and distant building
let polyBlurry2; //the distant building

let isNighttime = false;

function setup() {
  createCanvas(windowWidth, windowHeight);

  //Define the color arrays for lerpColor().

  //The colors are: [0]navy blue, [1]sea green, [2]bright yellow, [3]orange red, [4]dark red
  skyColorsFrom.push(
    color(62, 84, 143),
    color(125, 155, 147),
    color(255, 214, 101),
    color(193, 113, 67),
    color(205, 74, 74)
  );

  //The colors are: [0]sea green, [1]bright yellow, [2]orange red
  skyColorsTo.push(
    color(125, 155, 147),
    color(255, 214, 101),
    color(193, 113, 67),
    color(205, 74, 74)
  );

  //The brushWidth of the ellipse is 1/64 of the height of canvas.
  brushWidth = height / 64;

  //The amount of brush is the window's width divides the brush's width.
  brushAmount = width / brushWidth;

  scl = windowHeight / 140; //size of segment
  scl_2 = windowHeight / 150;
  // cols = floor(windowWidth / scl);
  // rows = floor(windowHeight / scl);
  cols = windowWidth / scl;
  rows = windowHeight / scl;
  //Define the color arrays for lerpColor().

  //The colors are: [0]navy blue, [1]sea green, [2]bright yellow, [3]orange red, [4]dark red
  waterColorsFrom.push(
    //color(205, 74, 74),
    color(193, 113, 67),
    color(255, 214, 101),
    color(125, 155, 147),
    color(62, 84, 143)
  );

  //The colors are: [0]sea green, [1]bright yellow, [2]orange red
  waterColorsTo.push(
    color(205, 74, 74),
    color(193, 113, 67),
    color(255, 214, 101),
    color(125, 155, 147)
  );

  //Build four arrays: skyColorLerp A/B/C/D to contain the lerpColor() results between the
  //skyColorsFrom[] and skyColorsTo[]
  //Build four arrays: waterColorLerp A/B/C/D to contain the lerpColor() results between the
  //waterColorsFrom[] and waterColorsTo[]
  generateColor(1, skyColorsLerpA, 0, 8);
  generateColor(1, skyColorsLerpB, 1, 8);
  generateColor(1, skyColorsLerpC, 2, 8);
  generateColor(1, skyColorsLerpD, 3, 8);

  generateColor(2, waterColorsLerpA, 0, 9);
  generateColor(2, waterColorsLerpB, 1, 9);
  generateColor(2, waterColorsLerpC, 2, 9);
  generateColor(2, waterColorsLerpD, 3, 9);

  updateDimensions();

  w = windowWidth;
  h = windowHeight;
  unitX = w / 32; //unit coordinate for x
  unitY = h / 32; //unit coordinate for y

  shadow();
  blurryBg1(); //transition
  blurryBg2(); //distant building

  for (let i = 0; i < 500; i++) {
    particles.push(new Particle());
  }
  
  const buildingColor = color(random(255), random(255), random(255));
  fill(buildingColor);//random color

  let currentHour = hour(); // Get the current hour
  isNighttime = currentHour >= 20 || currentHour < 15;//star appear link the reallife time with control appear time

}

function draw() {
  background(0, 45);
  drawSkyEllipse();
  waterSurface();
  drawBuilding();
  skyAnimation();
  if (isNighttime) {
    drawStars();
  }
  //waterColor(poly,color(71,41,50));
  // Move the building to the middle of the canvas.

  //color of building
}

function waterSurface() {
  
  translate(0, windowHeight / 2);
  let yoff = 0;
  for (let y = 0; y < rows / 2; y++) {
    let xoff = 0;
    for (let x = 0; x < cols; x++) {
      //  let index = (x+y*windowWidth)*4;
      let angle = noise(xoff, yoff, zoff) * TWO_PI; //test add zoff make angle change;
      let v = p5.Vector.fromAngle(angle * 1.5); //angle change
      xoff += inc;
      //rect(x*scl,y*scl,scl,scl);
      noStroke();

      push();
      translate(x * scl, y * scl);
      rotate(v.heading());
      rect(0, 0, 13, 15); //rectangle change
      pop();
    }

    if (y < 8) {
      fill(waterColorsLerpA[y]);
    } else if (y >= 8 && y < 27) {
      fill(waterColorsLerpB[y % 8]);
    } else if (y >= 27 && y <= 45) {
      fill(waterColorsLerpC[y % 8]);
    } else {
      fill(waterColorsLerpD[y % 8]);
    }
    yoff += inc;
    zoff += 0.003;
  }
  //change the code here(my pre code ->animation)
  //reference web:https://www.youtube.com/watch?v=BjoM9oKOAKY&t=3s.
  //https://www.youtube.com/watch?v=Qf4dIN99e2w
}

// function building(){
//   const v=[];
//   v.push(createVector(0,16*y));
//   v.push(createVector(0,13.8*y));
//   v.push(createVector(x,13.8*y));
//   v.push(createVector(2*x,11*y));
//   v.push(createVector(3*x,11*y));
//   v.push(createVector(3.4*x,9*y));
//   v.push(createVector(4*x,11*y));
//   v.push(createVector(4.7*x,10.5*y));
//   v.push(createVector(4.7*x,4*y));
//   v.push(createVector(4.9*x,4*y));
//   v.push(createVector(5.15*x,0.5*y));
//   v.push(createVector(5.35*x,0.5*y));
//   v.push(createVector(5.75*x,3*y));
//   v.push(createVector(6*x,4*y));
//   v.push(createVector(6*x,11*y));
//   v.push(createVector(6.25*x,9*y));
//   v.push(createVector(7*x,8*y));
//   v.push(createVector(7.5*x,7*y));
//   v.push(createVector(8*x,8*y));
//   v.push(createVector(8.7*x,9*y));
//   v.push(createVector(8.7*x,10*y));
//   v.push(createVector(10*x,10*y));
//   v.push(createVector(10.5*x,11*y));
//   v.push(createVector(11.2*x,10*y));
//   v.push(createVector(11.5*x,11*y));
//   v.push(createVector(12*x,12*y));
//   v.push(createVector(13*x,13.8*y));
//   v.push(createVector(15*x,13.8*y));
//   v.push(createVector(16*x,16*y));
//   polyBuilding=new Poly(v);
// }

function drawBuilding() {
  const xOffset = -(width - 32 * unitX);
  const yOffset = -(height - 16 * unitY);
  translate(xOffset, yOffset);
  fill(71, 41, 50);
  strokeWeight(2);
  stroke(43, 49, 45);

  //the building
  beginShape();
  vertex(0, 16 * unitY);
  vertex(0, 13.8 * unitY);
  vertex(unitX, 13.8 * unitY);
  vertex(2 * unitX, 11 * unitY);
  vertex(3 * unitX, 11 * unitY);
  vertex(3.4 * unitX, 9 * unitY);
  vertex(4 * unitX, 11 * unitY);
  vertex(4.7 * unitX, 10.5 * unitY);
  vertex(4.7 * unitX, 4 * unitY);
  vertex(4.9 * unitX, 4 * unitY);
  vertex(5.15 * unitX, 0.5 * unitY);
  vertex(5.35 * unitX, 0.5 * unitY);
  vertex(5.75 * unitX, 3 * unitY);
  vertex(6 * unitX, 4 * unitY);
  vertex(6 * unitX, 11 * unitY);
  vertex(6.25 * unitX, 9 * unitY);
  vertex(7 * unitX, 8 * unitY);
  vertex(7.5 * unitX, 7 * unitY);
  vertex(8 * unitX, 8 * unitY);
  vertex(8.7 * unitX, 9 * unitY);
  vertex(8.7 * unitX, 10 * unitY);
  vertex(10 * unitX, 10 * unitY);
  vertex(10.5 * unitX, 11 * unitY);
  vertex(11.2 * unitX, 10 * unitY);
  vertex(11.5 * unitX, 11 * unitY);
  vertex(12 * unitX, 12 * unitY);
  vertex(13 * unitX, 13.8 * unitY);
  vertex(15 * unitX, 13.8 * unitY);
  vertex(16 * unitX, 16 * unitY);
  endShape(CLOSE);

  waterColor(polyShadow, 71, 41, 50, 20);
  waterColor(polyBlurry1, 20, 70, 10, 10); //transition
  waterColor(polyBlurry2, 40, 90, 30, 5); //distant building
}

function shadow() {
  noLoop();
  const v = [];
  v.push(createVector(0, 15.5 * unitY));
  v.push(createVector(unitX, 15.5 * unitY));
  v.push(createVector(3 * unitX, 15 * unitY));
  v.push(createVector(4.9 * unitX, 15 * unitY));
  v.push(createVector(4.9 * unitX, h));
  v.push(createVector(6.5 * unitX, h));
  v.push(createVector(6.5 * unitX, 14.5 * unitY));
  v.push(createVector(8 * unitX, 15 * unitY));
  v.push(createVector(10 * unitX, 14.8 * unitY));
  v.push(createVector(11.2 * unitX, 15.2 * unitY));
  v.push(createVector(12 * unitX, 15.3 * unitY));
  v.push(createVector(15 * unitX, 14.3 * unitY));
  v.push(createVector(15.5 * unitX, 15.5 * unitY));
  polyShadow = new Poly(v);
}

function blurryBg1() {
  const v = [];
  // v.push(createVector(16*x,16*y));
  // v.push(createVector(18*x,14.5*y));
  // v.push(createVector(19*x,14.8*y));
  // v.push(createVector(21*x,15*y));
  // v.push(createVector(22*x,13.8*y));
  // v.push(createVector(24.5*x,14.3*y));
  // v.push(createVector(25*x,13.5*y));
  // v.push(createVector(25.8*x,10.3*y));
  // v.push(createVector(26.5*x,11*y));
  // v.push(createVector(27*x,12.9*y));
  // v.push(createVector(27.5*x,10.5*y));
  // v.push(createVector(28*x,10.3*y));
  // v.push(createVector(28.6*x,9.2*y));
  // v.push(createVector(29*x,10.5*y));
  // v.push(createVector(29.4*x,10.7*y));
  // v.push(createVector(30*x,12*y));
  // v.push(createVector(32*x,16*y));
  v.push(createVector(16 * unitX, 16 * unitY));
  for (let i = 0; i < random(5); i++) {
    let xScale = random(16, 24);
    let yScale = random(15, 16);
    v.push(createVector(xScale * unitX, yScale * unitY));
  }
  v.push(createVector(24 * unitX, 16 * unitY));
  polyBlurry1 = new Poly(v);
}

function blurryBg2() {
  const v = [];
  v.push(createVector(24 * unitX, 16 * unitY));
  for (let i = 0; i < random(10); i++) {
    let xScale = constrain((random(24, 32) * i) / 2, 24, 32);
    //let xScale=random(24,32)*i/2;
    let yScale = random(5, 16);
    v.push(createVector(xScale * unitX, yScale * unitY));
  }
  v.push(createVector(32 * unitX, 16 * unitY));
  polyBlurry2 = new Poly(v);
}

class Poly {
  constructor(vertices, modifiers) {
    this.vertices = vertices;
    if (!modifiers) {
      modifiers = [];
      for (let i = 0; i < vertices.length; i++) {
        modifiers.push(random(0.01, 0.5));
      }
    }
    this.modifiers = modifiers;
  }

  grow() {
    const grownVerts = [];
    const grownMods = [];
    for (let i = 0; i < this.vertices.length; i++) {
      const j = (i + 1) % this.vertices.length;
      const v1 = this.vertices[i];
      const v2 = this.vertices[j];

      const mod = this.modifiers[i];
      const chmod = (m) => {
        return m + (rand() - 0.5) * 0.1;
      };

      grownVerts.push(v1);
      grownMods.push(chmod(mod));

      const segment = p5.Vector.sub(v2, v1);
      const len = segment.mag();
      segment.mult(rand());

      const v = p5.Vector.add(segment, v1);

      segment.rotate(-PI / 2 + ((rand() - 0.5) * PI) / 4);
      segment.setMag(((rand() * len) / 2) * mod);
      v.add(segment);

      grownVerts.push(v);
      grownMods.push(chmod(mod));
    }
    return new Poly(grownVerts, grownMods);
  }

  dup() {
    return new Poly(Array.from(this.vertices), Array.from(this.modifiers));
  }

  draw() {
    beginShape();
    for (let v of this.vertices) {
      vertex(v.x, v.y);
    }
    endShape(CLOSE);
  }
}

function waterColor(poly, r, g, b, numLayers) {
  //const numLayers=20;
  fill(r, g, b, 255 / (2 * numLayers));
  //fill(red(color),green(color),blue(color),255/(2*numLayers));
  noStroke();

  poly = poly.grow().grow();

  for (let i = 0; i < numLayers; i++) {
    if (i == int(numLayers / 3) || i == int((2 * numLayers) / 3)) {
      poly = poly.grow().grow();
    }
    poly.grow().draw();
  }
}

function rand() {
  return distribute(random(1));
}

function distribute(x) {
  return pow((x - 0.5) * 1.58740105, 3) + 0.5;
}

// 更新尺寸相关的变量
function updateDimensions() {
  w = windowWidth;
  h = windowHeight;
  unitX = w / 32;
  unitY = h / 32;

  shadow();
  blurryBg1();
  blurryBg2();
}

function updateWater() {
  scl = windowHeight / 140;
  cols = windowWidth / scl;
  rows = windowHeight / scl;
  yoff = 0;
}
function updateskyanimation() {
  scl_2 = windowHeight / 140;
  cols = windowWidth / scl;
  rows = windowHeight / scl;
  yoff = 0;
}

// 响应窗口大小变化
function windowResized() {
  clear();
  brushWidth = height / 64;
  brushAmount = width / brushWidth;
  drawSkyEllipse();
  updateDimensions();
  updateWater();
  updateskyanimation();
  resizeCanvas(windowWidth, windowHeight);
}

//type: 1=sky;2=water
//colorLerp: array for colors
//num: number of each array
//r: row
function generateColor(type, colorLerp, num, r) {
  if (type == 1) {
    for (let i = 1; i < r; i++) {
      colorLerp.push(
        lerpColor(skyColorsFrom[num], skyColorsTo[num], i * 0.125)
      );
    }
  } else if (type == 2) {
    for (let i = 1; i < r; i++) {
      colorLerp.push(
        lerpColor(waterColorsFrom[num], waterColorsTo[num], i * 0.125)
      );
    }
  }
}

//Draw the first line of ellipses using lerpColor() and color arrays.
function drawSkyEllipse() {
  let x = random(brushWidth);
  for (let i = 0; i < skyColorsFrom.length; i++) {
    for (let j = 0; j < brushAmount; j++) {
      noStroke();
      fill(skyColorsFrom[i]);
      skyEllipse.push(
        ellipse(
          x / 2 + x * j,
          x / 2 + (height / 8) * i,
          brushWidth
        )
      );
    }
  }
  drawEllipse(skyLerpEllipseA, skyColorsLerpA, 1);
  drawEllipse(skyLerpEllipseB, skyColorsLerpB, 9);
  drawEllipse(skyLerpEllipseC, skyColorsLerpC, 17);
  drawEllipse(skyLerpEllipseD, skyColorsLerpD, 25);
}

//draw ellipses between each two basic color lines
//r: rows
//colorArray: each array for sky
function drawEllipse(lerpEllipse, colorArray, r) {
  background(0,25);
  let x = random(brushWidth);
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < brushAmount; j++) {
      fill(colorArray[i]);
      lerpEllipse.push(
        ellipse(
          x / 4 + x * j,
          brushWidth / 4 + brushWidth * (i + r),
          brushWidth
        )
      );
    }
  }
  }


function skyAnimation() {
  loop();
  
  for (let particle of particles) {
    particle.update();
    particle.display();
  }
}
class Particle {
  constructor() {
    this.x = random(windowWidth);
    this.y = random(windowHeight);
    this.speed = random(0, 2);
    this.radius = random(1, 8);

    this.color = color(255,74);
  }

  update() {
    // Simulate vertical movement using Perlin noise
    this.y += this.speed;
    this.x += noise(this.x, this.y) * 2 + 1; // Use Perlin noise on the x-axis to make particles move left and right
    if (this.y > windowHeight) {
      this.y = random(-23, -110);
      this.x = random(-23, windowWidth);
    }
  }

  display() {
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.radius * 1.5);
  }
}

//reference web:https://www.youtube.com/watch?v=BjoM9oKOAKY&t=3s.
//https://www.youtube.com/watch?v=Qf4dIN99e2w

function drawStars() {
  for (let i = 0; i < 76; i++) {
    let x = random(width);
    let y = random(height/2);
    let size = random(1, 8);
    fill("yellow"); // White or yellow color for stars
    noStroke();
    ellipse(x, y, size, size);
  }
}
