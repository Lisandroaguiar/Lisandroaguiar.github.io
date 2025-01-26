class Enemigo {

  constructor() {
    this.posX=width-200;
    this.posY=150;
    this.velocidad=1;
     this.velocidadY = 1;
    this.direccionY = 1;
    this.tam=200;
    this.tiempoRayo = 0; // Variable para controlar el tiempo de visibilidad del rayo
    this.duracionRayo = 900; // Duración en frames del rayo visible
  }

  dibujar() {
    image(imagenEnemigo, this.posX - this.tam / 2, this.posY - this.tam / 2, this.tam, this.tam);
  }

   moverse() {
    this.posX += this.velocidadY*this.direccionY;
    if (this.posX < width/2 + this.tam+50 || this.posX >width-this.tam/2) {
      this.direccionY *= -1;
    }
  }

  atacar(persona) {
    let distancia = dist(this.posX, this.posY, persona.posX, persona.posY);

    if (persona.posX < width / 2 && !persona.inmune && distancia < 600) {
      sonidoRayo.setVolume(0.2);
      sonidoRayo.play();
      persona.inmune = true;
      persona.seVacio = true;

      // Calculamos el ángulo y la distancia del rayo
      let angulo = atan2(persona.posY - this.posY, persona.posX - this.posX);
      this.tiempoRayo = frameCount; // Marcamos el tiempo en que el rayo comienza

      // Dibujar el rayo, solo si ha pasado menos tiempo que la duración especificada
      push();
      translate(this.posX, this.posY);
      rotate(angulo); // Rotar para que apunte hacia la persona
      if (frameCount - this.tiempoRayo < this.duracionRayo*2) {
        image(imagenRayo, 0, 0, distancia, 80); // Mostrar el rayo durante la duración
      }
      pop();
    }
  }

}
