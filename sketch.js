let pursuer1, pursuer2; 
let target;
let obstacles = [];
let vehicules = [];
let balles = [];
let mode = "";
let speedSlider, accelerationSlider;
let sliders = [];
let enemi;
let miniVehicules = []; // Tableau pour stocker les mini-véhicules
let impactCount = 0;
const flock = [];
let bgimage;
let enemiImage;
let obstacleImage;

let alignSlider, cohesionSlider, separationSlider;

function preload() {
  // on charge une image de fusée pour le vaisseau
  esclave = loadImage('./assets/vehicule.png');
  maitre = loadImage('./assets/vehicule.png');
  bgimage = loadImage('./assets/Space_image_buffa.jpg');
  enemiImage = loadImage('./assets/2eneufzc.png');
  obstacleImage = loadImage('./assets/image.png');
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  pursuer1 = new Vehicle(100, 100 , maitre);
  pursuer2 = new Vehicle(random(width), random(height));

  vehicules.push(pursuer1);

  obstacles.push(new Obstacle(width / 2, height / 2, 100, obstacleImage));

  // Ajouter les sliders
  speedSlider = createSlider(1, 20, 10, 1);
  speedSlider.position(1000, 10);
  let labelVitesseMax = createDiv('Vitesse Max :');
  labelVitesseMax.position(810, 10);
  labelVitesseMax.style('color', 'white');
  labelVitesseMax.style('font-size', '14px');

  accelerationSlider = createSlider(0.1, 5, 2, 0.01);
  accelerationSlider.position(1000, 40);
  let labelAccelerationMax = createDiv('Accélération Max :');
  labelAccelerationMax.position(810, 40);
  labelAccelerationMax.style('color', 'white');
  labelAccelerationMax.style('font-size', '14px');

  alignSlider = createSlider(0, 2, 1.5, 0.1);
  alignSlider.position(200, 10);
  let labelalign = createDiv('Align boids :');
  labelalign.position(80, 10);
  labelalign.style('color', 'white');
  labelalign.style('font-size', '14px');


  cohesionSlider = createSlider(0, 2, 1, 0.1);
  cohesionSlider.position(200, 40);
  let labcohesion = createDiv('Cohesion :');
  labcohesion.position(80, 40);
  labcohesion.style('color', 'white');
  labcohesion.style('font-size', '14px');

  separationSlider = createSlider(0, 2, 2, 0.1);
  separationSlider.position(200, 70);
  let separation = createDiv('Separation :');
  separation.position(80, 70);
  separation.style('color', 'white');
  separation.style('font-size', '14px');

  for (let i = 0; i < 200; i++) {
    flock.push(new Boids());
  }
}

function draw() {
  image(bgimage, 0, 0, width, height);

  for (let boid of flock) {
    boid.edges();
    boid.flock(flock);
    boid.update();
    boid.show();
  }  

  target = createVector(mouseX, mouseY);

  fill(255, 0, 0);
  noStroke();
  circle(target.x, target.y, 32);

  // Dessin des obstacles
  obstacles.forEach(o => {
    o.show();
  });

  // Mettre à jour la vitesse et l'accélération des véhicules
  let newMaxSpeed = speedSlider.value();
  let newMaxForce = accelerationSlider.value();

  if (mode == "enemi") {
    enemi.show(); // Afficher l'ennemi
  }

  vehicules.forEach((v, index) => {
    v.maxSpeed = newMaxSpeed;
    v.maxForce = newMaxForce;

    if (mode == "") {
      v.applyBehaviors(target, obstacles, vehicules);
      let arr = v.arrive(target, 70);
      v.applyForce(arr);
    } else if (mode == "snake") {
      if (index === 0) {
        v.applyBehaviors(target, obstacles, vehicules);
        let arriveForce = v.arrive(target, 70);
        v.applyForce(arriveForce);
      } else {
        let leader = vehicules[index - 1].pos.copy();
        v.applyBehaviors(leader, obstacles, vehicules, 70);
        let arriveF = v.arrive(leader, 70);
        v.applyForce(arriveF);
      }
    } else if (mode == "wander") {
      v.applyBehaviors(target, obstacles, vehicules);
      v.boundaries();
      v.wander();
    } else if (mode == "enemi") {
      // Création de mini-véhicules qui se dirigent vers l'ennemi
      v.maxSpeed = 0;
      if (miniVehicules.length === 0) {
          miniVehicules = vehicules.map(vehicle => {
          let miniVeh = new Vehicle(vehicle.pos.x, vehicle.pos.y);
          let arriveForce = miniVeh.arrive(enemi.pos, 0); // Les mini-véhicules utilisent "arrive" pour cibler l'ennemi
          miniVeh.applyForce(arriveForce);
          miniVeh.maxSpeed = 5; // Vitesse ajustée pour les mini-véhicules
          miniVeh.maxForce = 1; // Force ajustée
          miniVeh.color = "red";
          miniVeh.r_pourDessin = 4; // Taille plus petite
          return miniVeh;
        });
      }
    }

    v.update();
    v.show();
    v.edges();
  });

  
 // Mettre à jour et afficher les mini-véhicules
  miniVehicules.forEach((miniVeh, index) => {
  miniVeh.color="red";
  let arriveForce = miniVeh.arrive(enemi.pos, 0); // Les mini-véhicules utilisent "arrive" pour cibler l'ennemi
  miniVeh.applyForce(arriveForce);
  miniVeh.update();
  miniVeh.show();

  // Vérifier si le mini-véhicule atteint l'ennemi
  if (miniVeh.pos.dist(enemi.pos) < 10) {
    miniVehicules.splice(index, 1); // Supprimer le mini-véhicule
    impactCount++; // Augmenter le compteur d'impacts

    // Vérifier si l'ennemi a été touché 3 fois
    if (impactCount >= random(1,6)) {
      impactCount = 0;
      mode = "";
    }
  }
});

}

function keyPressed() {
  if (key == "v") {
    let a = random(width);
    let b = random(height);
    vehicules.push(new Vehicle(a, b, esclave));
  }
  if (key == "d") {
    Vehicle.debug = !Vehicle.debug;
  } else if (key == "f") {
    for (let i = 0; i < 10; i++) {
      let v = new Vehicle(20, 300);
      v.vel = new p5.Vector(random(1, 5), random(1, 5));
      vehicules.push(v);
    }
  }
  if (key == "s") {
    mode = "snake";
  }
  if (key == "n") {
    mode = "";
  }
  if (key == "w") {
    mode = "wander";
  }
  if (key == "o") {
    obstacles.push(new Obstacle(mouseX, mouseY, random(20, 100), obstacleImage));
  }
  if (key == "e") {
    mode = "enemi";
    enemi = new Enemi(random(width), random(height), random(20, 50), enemiImage);
  }
}