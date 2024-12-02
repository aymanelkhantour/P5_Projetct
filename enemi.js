class Enemi {
    constructor(x, y, r, image) {
      this.pos = createVector(x, y);
      this.r = r;

      this.image = image;
    }
  
    show() {

        fill(255, 0, 0);        // Set fill color to red
        noStroke();             // Remove the border
    
        image(this.image, this.pos.x, this.pos.y, this.r * 5, this.r * 5); // Taille ajustée
    }
  }