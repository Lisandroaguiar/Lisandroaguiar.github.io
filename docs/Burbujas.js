class Burbuja {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.radio = random(20, 50);
    this.velX = random(-2, 4);
    this.velY = random(-2, -4);
  }

  dibujar() {
    fill(255, 200);
    noStroke();
    image(imagenBurbuja,this.x, this.y,this.radio*2,this.radio*2);
  }

  mover() {
    this.x += this.velX;
    this.y += this.velY;
  }
}
