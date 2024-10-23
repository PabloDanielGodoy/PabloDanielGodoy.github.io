var buffer_sender_x=0;
var buffer_sender_y=0;
var buffer_sender_width;
var buffer_sender_height=60;
var buffer_receiver_x=0;
var buffer_receiver_y;
var buffer_receiver_width;
var buffer_receiver_height=60;
var margen_ventanas=7;
var margen_buffers=10; //10
var ancho_paquetes=30;
var alto_paquetes=40;
var buffers_color="silver";
var canvas_heigth = 350;   //debe cambiarse manualmente en la definicion del canvas
var canvas_width = 800;  //debe cambiarse manualmente en la definicion del canvas
var paquetes_fuente = "18px Arial";
var packet_coordenada_y_inicial_buffer_emisor=margen_buffers+30;
var packet_coordenada_y_final_buffer_receptor=canvas_heigth-margen_buffers-alto_paquetes-30;

const paquetes_list = [];
const reconocimientos_list = [];
var paquetes_eliminados_list = [];

/*Valores constantes*/
var timers_delay_paquetes=200;
var enviar_paquetes_periodicamente_delay = 100;
var step_paso_paquetes=2;
var reenvioContador_inicial=80;

/*Valores modificables por el usuario*/
var step_delay_paquetes;  //20 - 100
var agregar_paquetes_periodicamente_delay; //500 - 10000
var quitar_paquetes_periodicamente_delay; //500 - 10000
var tasa_perdida_paquetes;  //Un paquete cada x. 

var buffer_receptor_limite_inferior=0;
var buffer_emisor_limite_superior=6; //indica el último paquete agregado al buffer 
var buffer_emisor_limite_inferior=0;
var buffers_numero_maximo=31; //solo valores impares
var ventanas_tamano_maximo=5;
var buffers_tamano_maximo=7;
var reconocimientosTimer;
var tiempo_entre_reconocimientos=10000;
var paquetes_totales_recibidos=0;
var data_rate=0;

var inicializacion_finalizada=false;
var reconocido_hasta=0;
var desplazamiento=0;
var ventana_emisor;
var ventana_receptor;
var paquetes_que_no_deben_perderse;
