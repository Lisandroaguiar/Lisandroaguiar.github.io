class Jugador {
  constructor() {
    this.posX = 100;
    this.posY = height / 2;
    this.proyectiles = [];
    this.tam = 50;
  }

  dibujar() {
    // Dibujar al jugador
    push();  // Guarda el estado actual de las transformaciones
    translate(this.posX, 0);  // Mueve el origen al centro de la imagen
    scale(-1, 1);  // Refleja la imagen horizontalmente
    image(imagenMegafono, -this.tam / 2, mouseY, this.tam*1.5, this.tam);  // Dibuja la imagen reflejada
    pop();  // Restaura el estado de las transformaciones

    // Dibujar proyectiles
    for (let proyectil of this.proyectiles) {
      proyectil.dibujar();
    }
  }

  actualizar(enemigo) {
    // Actualizar la posición de los proyectiles y verificar colisiones
    for (let i = this.proyectiles.length - 1; i >= 0; i--) {
      let proyectil = this.proyectiles[i];
      proyectil.mover();

      // Verificar colisión con el cerebro del enemigo
      if (enemigo.seVacio &&
        proyectil.colisiona(
        enemigo.posX+enemigo.tamCerebro,
        enemigo.posYcerebro-enemigo.tamCerebro,
        enemigo.tamCerebro*1.5
        )
        ) {
        console.log("¡Cerebro alcanzado!");
        if (enemigo.seVacio) {
          enemigo.recibirImpacto(); // Informar al enemigo del impacto
        }

        this.proyectiles.splice(i, 1); // Eliminar el proyectil tras la colisión
      } else if (proyectil.posX > width) {
        // Eliminar proyectiles fuera de la pantalla
        this.proyectiles.splice(i, 1);
      }
    }
  }

  disparar() {
    // Crear un nuevo proyectil en la posición del jugador
    let nuevoProyectil = new Proyectil(this.posX + this.tam / 2, mouseY);
    this.proyectiles.push(nuevoProyectil);
  }
}
