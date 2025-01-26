let juego;
let imagenEnemigo;
let imagenRayo;
let imagenCerebroContador=[];
let imagenCerebroPersona=[];
let imagenCaminata=[];
let imagenCaminataMalo=[];
let imagenInicio;
let imagenMegafono;
let imagenProyectil;
let imagenFondo;
let imagenFondoPerder;
let sonidoFondo;
let sonidoTransicion;
let sonidoExplosion;
function preload() {
  for (i=0; i<5; i++) {
    imagenCerebroContador[i]=loadImage("data/cerebro"+i+".png");
  }
  for (i=0; i<5; i++) {
    imagenCerebroPersona[i]=loadImage("data/cerebroPersona"+i+".png");
  }

  for (i=0; i<7; i++) {
    imagenCaminata[i]=loadImage("data/caminata"+i+".png");
    imagenCaminataMalo[i]=loadImage("data/caminataMalo"+i+".png");
  }
  imagenRayo= loadImage("data/rayo.png");
  imagenEnemigo=loadImage("data/enemigo.png");
  imagenFondo=loadImage("data/fondo.png");
  imagenInicio=loadImage("data/inicio.png");
  imagenMegafono=loadImage("data/megafono.png");
  imagenProyectil=loadImage("data/proyectil.png");
  imagenBurbuja=loadImage("data/burbuja.png");
  imagenFondoPerder=loadImage("data/Perder.png");
  imagenFondoGanar=loadImage("data/Ganar.png");

  sonidoFondo = loadSound('data/fondo.mp3');
  sonidoTransicion = loadSound('data/MuchasBurbujas.mp3');
  sonidoExplosion=loadSound('data/BurbujaExplota.mp3');
}


function setup() {
  createCanvas(1961/2, 1080/2);
  juego=new Juego();
}


function draw() {

  image(imagenFondo, 0, 0, 1961/2, 1080/2);

  push();
  fill(0, 100);
  rect(0, 0, 1961/2, 1080/2);

  pop();
  juego.dibujar();
  juego.actualizar();
}

function mouseClicked() {
  juego.disparar();
  juego.mousePressed();
}
function mousePressed() {
}
