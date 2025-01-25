class Juego {
  constructor() {
    this.personas = [new Persona()];
    this.enemigo = new Enemigo();
    this.jugador = new Jugador();
    this.estadoContador = 0;
    this.tiempoMaximo = 300;
    this.ronda = 1;
    this.tiempoRonda = frameCount;
    this.estadoJuego = 'inicio'; // Estado inicial
  }

  dibujar() {
    if (this.estadoJuego === 'inicio') {
      this.dibujarPantallaInicio();
    } else if (this.estadoJuego === 'jugando') {
      this.dibujarPantallaJuego();
    } else if (this.estadoJuego === 'perder') {
      this.dibujarPantallaPerder();
    } else if (this.estadoJuego === 'ganar') {
      this.dibujarPantallaGanar();
    } else if (this.estadoJuego === 'creditos') {
      this.dibujarPantallaCreditos();
    }
  }

  dibujarPantallaInicio() {
    cursor();
    image(imagenInicio, 0, 0, 1961/2, 1080/2);
    push();
    noFill();
    noStroke();
    ellipse(width/2, height/2+70, 170, 160);
    pop();
    let distancia= dist(mouseX, mouseY, width/2, height/2+70);
    if (mouseIsPressed && distancia<160) {
      this.estadoJuego="jugando"

        this.tiempoRonda = frameCount;
      this.ronda=0;
      this.estadoContador = 0;
    }
  }

  dibujarPantallaJuego() {
    for (let persona of this.personas) {
      persona.dibujar();
    }
    noCursor();

    this.enemigo.dibujar();
    this.jugador.dibujar();
    this.dibujarContadorCircular();
    text(this.ronda, 50, 50);
  }

  dibujarPantallaPerder() {
    push();
    background(0); // Fondo negro
    fill(255, 0, 0);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("¡Has perdido!", width / 2, height / 2 - 50);
    textSize(24);
    text("Toque la pantalla para reiniciar", width / 2, height / 2 + 50);
    pop();
  }

  dibujarPantallaGanar() {
    push();
    background(0); // Fondo negro
    fill(0, 255, 0);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("¡Has ganado!", width / 2, height / 2 - 50);
    textSize(24);
    text("Toque la pantalla para reiniciar", width / 2, height / 2 + 50);
    pop();
  }

  dibujarPantallaCreditos() {
    background(0); // Fondo negro
    fill(255);
    textSize(24);
    textAlign(CENTER, CENTER);
    text("Creditos:", width / 2, height / 2 - 50);
    text("Juego creado por [Tu Nombre]", width / 2, height / 2);
    textSize(18);
    text("Haga click para volver al inicio", width / 2, height / 2 + 50);
  }

  actualizar() {
    if (this.estadoJuego === 'jugando') {
      this.enemigo.moverse();

      for (let persona of this.personas) {
        this.enemigo.atacar(persona);
        persona.moverse();
        this.jugador.actualizar(persona);
      }

      if (this.personas.some(p => p.seVacio)) {
        this.actualizarContador();
      } else {
        this.reiniciarContador();
      }

      if (frameCount - this.tiempoRonda > this.tiempoMaximo) {
        this.nuevaRonda();
      }
      let contador=0;

      // Verificar condiciones de victoria o derrota
      if (this.estadoContador >=4) {
        this.estadoJuego = 'perder';
      }
      console.log(this.estadoContador);
      if (this.ronda >= 10) { // Cambio ejemplo para que gane al alcanzar la ronda 5
        this.estadoJuego = 'ganar';
      }
    }
  }

  // Manejo de teclas para cambiar entre estados
  mousePressed() {


    if (this.estadoJuego === 'perder' ) { // R para reiniciar
      this.estadoJuego = 'inicio';
      this.ronda = 1;
      this.personas = [new Persona()];
    }

    if (this.estadoJuego === 'ganar') { // R para reiniciar
      this.estadoJuego = 'inicio';
      this.ronda = 1;
      this.personas = [new Persona()];
    }

    if (this.estadoJuego === 'creditos') {
      this.estadoJuego = 'inicio';
    }
  }

  nuevaRonda() {
    this.ronda++;
    this.tiempoRonda = frameCount;
    for (let i = 0; i < round(this.ronda / 3); i++) {
      this.personas.push(new Persona());
    }
  }

  disparar() {
    this.jugador.disparar();
  }

  dibujarContadorCircular() {
    if (this.estadoContador == 0) {
      image(imagenCerebroContador[this.estadoContador], width / 2 - 50, 100, 70*1.3, 60*1.3);
    } else {
      image(imagenCerebroContador[this.estadoContador], width / 2 - 80, 85, 100*1.3, 100*1.3);
    }
  }

  actualizarContador() {
    if (frameCount % (this.tiempoMaximo / 5) === 0) {
      this.estadoContador++;
      if (this.estadoContador > 4) this.estadoContador = 4;
    }
  }

  reiniciarContador() {
    this.estadoContador = 0;
  }
}
