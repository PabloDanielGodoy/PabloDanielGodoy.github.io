var velocidad_emisor=0;
var velocidad_receptor=0;
var velocidad_viento=0;
var frecuencia_emisor=10000;
var frecuencia_receptor=0;
var frecuencia_emisor_luego_de_rebote=0;
var velocidad_receptor_ignorando_viento=0;
var coordenada_x_emisor = 200;
var coordenada_x_receptor=800;
var velocidad_sonido=344*3.6;

//Variables auxiliares para dibujos
var coordenada_y=200;
var ancho=10;
var alto=20;
var mi_canvas;
var canvas_area;
const ondas_emisor_list=[];
const ondas_receptor_list=[];

var timer_resetear_onda;
var timer_pantalla1;

var mostrar_onda_reflejada=false;
