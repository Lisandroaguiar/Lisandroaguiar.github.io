class Proyectil {
  constructor(posX, posY) {
    this.posX = posX;
    this.posY = posY;
    this.velocidad = 4;
    this.tamY = 60;
this.tamX=20;  
}

  dibujar() {
    image(imagenProyectil,this.posX, this.posY,this.tamX,this.tamY);
  }

  mover() {
    this.posX += this.velocidad;
  }

colisiona(x, y, tam) {
  // Detectar si el proyectil colisiona con un área circular
  let distanciaX = abs(this.posX - x);
  let distanciaY = abs(this.posY - y);
  
  // Verificar si el proyectil se encuentra dentro del área del círculo
  if (distanciaX > (this.tamX / 2 + tam / 2) || distanciaY > (this.tamY / 2 + tam / 2)) {
    return false; // No hay colisión
  }

  if (distanciaX <= (this.tamX / 2) || distanciaY <= (this.tamY / 2)) {
    return true; // Colisión
  }

  let cornerDistance_sq = (distanciaX - this.tamX / 2) ** 2 +
                          (distanciaY - this.tamY / 2) ** 2;

  return cornerDistance_sq <= (tam / 2) ** 2;
}

}
