class Obstacle {
  constructor(x, y, r, image) {
    this.pos = createVector(x, y);
    this.r = r;
    this.image = image;
  }

  show() {
    push();
    imageMode(CENTER);
    if (this.image) {
      image(this.image, this.pos.x, this.pos.y, this.r * 2, this.r * 2); // Ajuste la taille selon ton besoin
    } else {
      fill(255, 0, 0); // Couleur par défaut si pas d'image
      ellipse(this.pos.x, this.pos.y, this.r * 2);
    }
    pop();
  }
}
