class Juego {
  constructor() {
    this.personas = [new Persona()];
    this.enemigo = new Enemigo();
    this.jugador = new Jugador();
    this.estadoContador = 0;
    this.tiempoMaximo = 300;
    this.tiempoMaximoRonda = 200;
    this.burbujas = [];
    for (let i = 0; i < 40; i++) { // Crea 40 burbujas
      this.burbujas.push(new Burbuja());
    }
    this.ronda = 1;
    this.tiempoRonda = frameCount;
    this.estadoJuego = 'inicio'; // Estado inicial
    this.tiempoTransicion = 0; // Temporizador de transición
    this.tiempoCambioPantalla = 0; // Temporizador para controlar cambios de pantalla
    this.retrasoPantalla = 3000;  // Tiempo mínimo entre pantallas (en milisegundos)
    this.retrasoPantallaGanar = 5000;  // Tiempo mínimo entre pantallas (en milisegundos)
    this.tiempoInicioJuego = 0;  // Tiempo al comenzar la ronda
this.contadorTransicion=0;
    if (!sonidoFondo.isPlaying()) {
      sonidoFondo.loop();
      sonidoFondo.setVolume(0.2); // Ajusta el volumen
    }
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

    if (mouseIsPressed && distancia < 160 && millis() - this.tiempoCambioPantalla > this.retrasoPantalla) {
      this.estadoJuego = "transicion";
      this.tiempoCambioPantalla = millis();
      this.ronda = 1;
      this.estadoContador = 0;

      // Reinicia el tiempo de inicio solo cuando comience el juego
      if (this.tiempoInicioJuego === 0) {
        this.tiempoInicioJuego = millis(); // Inicia el temporizador solo cuando empieza el juego
      }

      if (sonidoFondo.isPlaying()) {
        sonidoFondo.stop();
      }
    }
    if (this.estadoJuego === 'jugando' && !sonidoFondo.isPlaying()) {
      sonidoFondo.loop();
    }
    if (this.estadoJuego == 'jugando') {
      sonidoTransicion.pause();
    }
  }

  dibujarPantallaJuego() {
    for (let persona of this.personas) {
      persona.dibujar();
    }
    noCursor();
    this.dibujarContadorTiempo();

    this.enemigo.dibujar();
    this.jugador.dibujar();
    this.dibujarContadorCircular();
    sonidoTransicion.pause();
  }

  dibujarPantallaPerder() {
    push();
    image(imagenFondoPerder, 0, 0, 1961/2, 1080/2)
      pop();
    sonidoFondo.pause();
  }

  dibujarPantallaGanar() {
    push();
    image(imagenFondoGanar, 0, 0, 1961/2, 1080/2)
      pop();
    sonidoFondo.pause();
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
    image(imagenTransicion,0, 0, 1961/2, 1080/2); // Fondo celeste
    if (!sonidoTransicion.isPlaying()) {
      sonidoTransicion.play();
      sonidoTransicion.setVolume(0.5); // Ajusta el volumen
    }
    // Dibuja y mueve las burbujas
this.contadorTransicion++;
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
    if (todasFuera && this.contadorTransicion>=800) {
      this.estadoJuego = 'jugando'; // Cambia el estado a 'jugando'
      sonidoFondo.loop();
      this.contadorTransicion=0;
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
      if (this.estadoContador > 5) this.estadoContador = 5;

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

      // Si el tiempo de inicio está en cero, inicialízalo
      if (this.tiempoInicioJuego === 0) {
        this.tiempoInicioJuego = millis(); // Reinicia el tiempo si está en cero
      }

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

      // Verificar si ya pasaron 20 segundos
      if (millis() - this.tiempoInicioJuego >= 44000) { // 20 segundos
        this.estadoJuego = 'ganar';
      }



      if (this.estadoContador >= 5) {
        this.estadoJuego = 'perder';
      }
    }
  }

  mousePressed() {
    if (millis() - this.tiempoCambioPantalla > this.retrasoPantallaGanar) {
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
    this.burbujas = [];
    if (sonidoFondo.isPlaying()) {
      sonidoFondo.pause();
    }

    // Crea nuevas burbujas
    for (let i = 0; i < 40; i++) {
      this.burbujas.push(new Burbuja());
    }

    // Reinicia el tiempo de inicio solo si el juego comienza
    this.tiempoInicioJuego = 0; // Se resetea para iniciar de nuevo
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
      if (this.estadoContador > 5) this.estadoContador = 5;
    }
  }

  reiniciarContador() {
    this.estadoContador = 0;
  }

  dibujarContadorTiempo() {
  image(imagenBurbujaCronometro, 40, 30, 150, 75);

  if (this.estadoJuego === 'jugando') {
    // Tiempo transcurrido
    let tiempoTranscurrido = millis() - this.tiempoInicioJuego;
    let tiempoRestante = 44000 - tiempoTranscurrido;

    // Formatear el tiempo restante para que tenga siempre dos dígitos
    let segundosRestantes = nf(round(tiempoRestante / 1000), 2, 0); // El 2 es el número de dígitos, y 0 es la cantidad de decimales

    // Mostrar el tiempo restante en texto
    textSize(24);
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(36);
    text("0:" + segundosRestantes, 110, 60);
    if (tiempoRestante <= 0) {
      this.estadoJuego = 'ganar';
    }
  }
  }
}
