class Persona {
  constructor() {
    this.posX = random(width,width-200);
    this.posY = random(300, 400);
    this.posYcerebro = this.posY;
    this.tam = 200; // Tamaño fijo
    this.tamCerebro = 60;
    this.impactos = 0;
    this.inmune = false;
    this.seVacio = false;
    this.velocidad = 2;
    this.frameCaminata = 0;
    this.direccion = 1; // 1 para derecha, -1 para izquierda
  }

  dibujar() {
    this.frameCaminata = (this.frameCaminata + 0.1) % imagenCaminata.length; // Animación de caminata
    push();
    translate(this.posX, this.posY);
    scale(this.direccion, 1); // Solo refleja la imagen sin cambiar su tamaño


    if (this.seVacio) {
      image(
        imagenCaminataMalo[floor(this.frameCaminata)],
        -this.tam / 2,
        -this.tam / 2, imagenCaminata[floor(this.frameCaminata)].width/2, imagenCaminata[floor(this.frameCaminata)].height/1.5
        );
    } else {
      image(
        imagenCaminata[floor(this.frameCaminata)],
        -this.tam / 2,
        -this.tam / 2, imagenCaminata[floor(this.frameCaminata)].width/2, imagenCaminata[floor(this.frameCaminata)].height/1.5
        );
    }
    pop();

    if (this.seVacio) {
      if (this.posYcerebro > this.posY - this.tamCerebro) {
        this.posYcerebro--; // El cerebro sigue subiendo hasta alcanzar su posición superior
      }
    } else {
      if (this.posYcerebro < this.posY) {
        this.posYcerebro++; // El cerebro desciende lentamente hacia su posición original
      }
    }

    let indiceCerebro = constrain(4 - this.impactos, 0, 4);
    if (this.seVacio) {
      image(
        imagenCerebroPersona[indiceCerebro],
        this.posX+this.tamCerebro,
        this.posYcerebro - this.tamCerebro*2,
        this.tamCerebro,
        this.tamCerebro
        );
    }
  }

  recibirImpacto() {
    this.impactos++;
    if (this.impactos >= 5) {
      this.seVacio = false;
    }
  }

  moverse() {
    this.posX -= this.velocidad * this.direccion;
    if (this.seVacio) {
      this.direccion = -1;
    } else {
      this.direccion = 1;
    }
  }

  atacar() {
  }

  vaciarse() {
  }
}
