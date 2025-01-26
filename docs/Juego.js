class Juego {
  constructor() {
    this.personas = [new Persona()];
    this.enemigo = new Enemigo();
    this.jugador = new Jugador();
    this.estadoContador = 0;
    this.tiempoMaximo = 600;
    this.tiempoMaximoRonda = 200;
    this.burbujas = [];
    for (let i = 0; i < 40; i++) { // Crea 20 burbujas
      this.burbujas.push(new Burbuja());
    }
    this.ronda = 1;
    this.tiempoRonda = frameCount;
    this.estadoJuego = 'inicio'; // Estado inicial
    this.tiempoTransicion = 0; // Temporizador de transición
    this.tiempoCambioPantalla = 0; // Temporizador para controlar cambios de pantalla
    this.retrasoPantalla = 3000;  // Tiempo mínimo entre pantallas (en milisegundos)
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
    } else if (this.estadoJuego === 'transicion') {
      this.dibujarPantallaTransicion();
    }
  }

dibujarPantallaInicio() {
  cursor();
  image(imagenInicio, 0, 0, 1961 / 2, 1080 / 2);
  push();
  noFill();
  noStroke();
  ellipse(width / 2, height / 2 + 70, 170, 160);
  pop();
  let distancia = dist(mouseX, mouseY, width / 2, height / 2 + 70);

  // Verifica si se puede cambiar de pantalla
  if (mouseIsPressed && distancia < 160 && millis() - this.tiempoCambioPantalla > this.retrasoPantalla) {
    this.estadoJuego = "transicion";
    this.tiempoCambioPantalla = millis(); // Reinicia el temporizador
    this.ronda = 1;
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
    image(imagenFondoPerder, 0, 0, 1961/2, 1080/2)
      pop();
  }

  dibujarPantallaGanar() {
    push();
    image(imagenFondoGanar, 0, 0, 1961/2, 1080/2)

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

  dibujarPantallaTransicion() {
    background(0, 150, 255, 10); // Fondo celeste

    // Dibuja y mueve las burbujas
    let todasFuera = true; // Bandera para verificar si todas están fuera de la pantalla
    for (let burbuja of this.burbujas) {
      burbuja.dibujar();
      burbuja.mover();

      // Si alguna burbuja aún está en la pantalla, cambia la bandera
      if (burbuja.x > -burbuja.radio && burbuja.x < width + burbuja.radio &&
        burbuja.y > -burbuja.radio && burbuja.y < height + burbuja.radio) {
        todasFuera = false;
      }
    }

    // Si todas las burbujas están fuera de la pantalla, cambia el estado
    if (todasFuera) {
      this.estadoJuego = 'jugando'; // Cambia el estado a 'jugando'
    }
  }

  actualizarContador() {
    // Verificar si todas las burbujas están fuera de la pantalla
    let todasFuera = true;
    for (let burbuja of this.burbujas) {
      if (burbuja.x > -burbuja.radio && burbuja.x < width + burbuja.radio &&
        burbuja.y > -burbuja.radio && burbuja.y < height + burbuja.radio) {
        todasFuera = false;
      }
    }

    // Si todas las burbujas están fuera, aumenta el contador
    if (todasFuera) {
      this.estadoContador++;
      if (this.estadoContador > 4) this.estadoContador = 4;

      // Reinicia las burbujas para una nueva ronda (opcional)
      this.burbujas = [];
      for (let i = 0; i < 40; i++) {
        this.burbujas.push(new Burbuja());
      }
    }
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

      if (frameCount - this.tiempoRonda > this.tiempoMaximoRonda) {
        this.nuevaRonda();
      }

      // Verificar condiciones de victoria o derrota
      if (this.estadoContador >= 4) {
        this.estadoJuego = 'perder';
      }

      if (this.ronda >= 12) { // Cambio ejemplo para que gane al alcanzar la ronda 5
        this.estadoJuego = 'ganar';
      }
    }
  }

mousePressed() {
  if (millis() - this.tiempoCambioPantalla > this.retrasoPantalla) {
    if (this.estadoJuego === 'perder' || this.estadoJuego === 'ganar') {
      this.reiniciarJuego();
    }
    
    if (this.estadoJuego === 'creditos') {
      this.estadoJuego = 'inicio';
    }

    this.tiempoCambioPantalla = millis(); // Reinicia el temporizador
  }
}

  reiniciarJuego() {
    this.estadoJuego = 'inicio';
    this.ronda = 1;
    this.estadoContador = 0;
    this.personas = [new Persona()];
    this.burbujas = []; // Limpia el array de burbujas

    // Crea nuevas burbujas
    for (let i = 0; i < 40; i++) {
      this.burbujas.push(new Burbuja());
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
      image(imagenCerebroContador[this.estadoContador], width / 2 - 50, 25, 70 * 1.3, 60 * 1.3);
    } else {
      image(imagenCerebroContador[this.estadoContador], width / 2 - 80, 0, 100 * 1.3, 100 * 1.3);
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
