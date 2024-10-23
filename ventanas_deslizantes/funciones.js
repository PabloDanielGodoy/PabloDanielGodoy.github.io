function inicializar(){
  var mi_canvas = document.getElementById("rectangle_area");
  var canvas_area= mi_canvas.getContext("2d");
  mi_canvas.width=canvas_width;
  buffer_receiver_y=mi_canvas.height-2*margen_ventanas-2*margen_buffers;
  buffer_sender_width=mi_canvas.width;
  buffer_receiver_width=mi_canvas.width;
  canvas_area.fillStyle = buffers_color;
  ventana_emisor=new Ventana(0,ventanas_tamano_maximo-1,packet_coordenada_y_inicial_buffer_emisor);
  ventana_receptor=new Ventana(0,ventanas_tamano_maximo-1,packet_coordenada_y_final_buffer_receptor);
  buffer_receptor_limite_superior=ventanas_tamano_maximo-1;
  buffer_emisor_limite_superior=6;
  step_delay_paquetes=document.getElementById("velocidad_enviar_paquetes_periodicamente_range").value;
  for(let i=0;i<=buffers_numero_maximo;i++)
  {
    if(i<=buffer_emisor_limite_superior && i<=buffer_receptor_limite_superior)
    {
      paquetes_list[i]=new Paquete(i,"en_buffer_emisor","esperando_paquete");      
    }
    else if(i<=buffer_emisor_limite_superior && i>buffer_receptor_limite_superior)
    {
      paquetes_list[i]=new Paquete(i,"en_buffer_emisor","fuera_de_buffer_receptor");
    }
    else if(i>buffer_emisor_limite_superior && i<=buffer_receptor_limite_superior)
    {
      paquetes_list[i]=new Paquete(i,"fuera_de_buffer_emisor","esperando_paquete");
    }
    else if(i>buffer_emisor_limite_superior && i>buffer_receptor_limite_superior)
    {
      paquetes_list[i]=new Paquete(i,"fuera_de_buffer_emisor","fuera_de_buffer_receptor");
    }
    paquetes_list[i].dibujar();
  }
  ventana_emisor.dibujar();
  ventana_receptor.dibujar();
//  dibujar_emisor();  
//  dibujar_receptor();  
  reconocimientosTimer=setInterval(enviar_reconocimiento,tiempo_entre_reconocimientos);
  clockTimer=setInterval(clock_Timer_Callback,5000);
  inicializacion_finalizada=true;
  agregar_paquetes_periodicamente_delay=document.getElementById("agregar_paquetes_periodicamente_range").value;
  quitar_paquetes_periodicamente_delay=document.getElementById("quitar_paquetes_periodicamente_range").value;
  tasa_perdida_paquetes=document.getElementById("tasa_perdida_paquetes_range").value;
  if(tasa_perdida_paquetes==31)
  {
    tasa_perdida_paquetes=10000000;  
  }
  paquetes_que_no_deben_perderse=tasa_perdida_paquetes; 
}

var paquetes_totales_recibidos_anterior=0;
var data_rate_anterior=0;
function clock_Timer_Callback()
{
  data_rate=(paquetes_totales_recibidos - paquetes_totales_recibidos_anterior)/5;
  data_rate=data_rate*0.4+data_rate_anterior*0.6;
  data_rate_anterior=data_rate;
  paquetes_totales_recibidos_anterior=paquetes_totales_recibidos;
  document.getElementById("label_data_rate").innerHTML=((data_rate)*60).toFixed(2) + " paquetes/minuto";
  for(let i=0;i<paquetes_list.length;i++)
  {
    if(i<10)
    {
      console.log("0" + i + "-" + paquetes_list[i].get_estado() + " " + paquetes_list[i].get_estado_buffer_receptor() + " " + 
        paquetes_list[i].get_coordenada_y() + " " + paquetes_list[i].stepTimer_en_marcha + " " + paquetes_list[i].reenvioTimer_en_marcha);
    }
    else
    {
      console.log(i + "-" + paquetes_list[i].get_estado() + " " + paquetes_list[i].get_estado_buffer_receptor() + " " + 
        paquetes_list[i].get_coordenada_y() + " " + paquetes_list[i].stepTimer_en_marcha + " " + paquetes_list[i].reenvioTimer_en_marcha);
    }   
  }
}


function get_buffer_receptor_list()
{
  let buffer_receptor_list=[]; 
  if(buffer_receptor_limite_inferior+(ventanas_tamano_maximo-1)<=buffers_numero_maximo)
  {
    if(buffer_receptor_limite_superior!=buffers_numero_maximo || buffer_receptor_limite_inferior!=0)
    {
      for(let i=buffer_receptor_limite_inferior;i<=(buffer_receptor_limite_inferior+ventanas_tamano_maximo-1);i++)
      {
        if(paquetes_list[i].get_estado_buffer_receptor()=="en_buffer_receptor")
        {
          buffer_receptor_list.push(i);   
        }   
      }
    }  
  }
  else if((buffer_receptor_limite_superior-buffer_receptor_limite_inferior)!=-1)
  {    
    if(buffer_receptor_limite_superior!=buffers_numero_maximo || buffer_receptor_limite_inferior!=0)
    {
      buffer_receptor_limite_superior=0+[ventanas_tamano_maximo - (buffers_numero_maximo - buffer_receptor_limite_inferior +1) -1 ]; 
      for(i=buffer_receptor_limite_inferior;i<=buffers_numero_maximo;i++)
      {
        buffer_receptor_list.push(i);
      }
      for(i=0;i<=buffer_receptor_limite_superior;i++)
      {
        buffer_receptor_list.push(i);     
      }
    }  
  }
  return buffer_receptor_list;
}

function get_buffer_emisor_list()
{
  let buffer_emisor_list=[]; 
  if(buffer_emisor_limite_inferior<=buffer_emisor_limite_superior)
  {
    if(buffer_emisor_limite_superior!=buffers_numero_maximo || buffer_emisor_limite_inferior!=0)
      { 
      for(let i=buffer_emisor_limite_inferior;i<=buffer_emisor_limite_superior;i++)
      {
        buffer_emisor_list.push(i);      
      }
    }  
  }
  else if((buffer_emisor_limite_superior-buffer_emisor_limite_inferior)!=-1)
  {
    if(buffer_emisor_limite_superior!=buffers_numero_maximo || buffer_emisor_limite_inferior!=0)
      { 
      for(i=buffer_emisor_limite_inferior;i<=buffers_numero_maximo;i++)
      {
        buffer_emisor_list.push(i);
      }
      for(i=0;i<=buffer_emisor_limite_superior;i++)
      {
        buffer_emisor_list.push(i);     
      }
    }  
  }
  return buffer_emisor_list;
}



function buffer_receptor_limite_inferior_desplazar_un_paquete()
{
  if(buffer_receptor_limite_inferior<buffers_numero_maximo)
  { 
    buffer_receptor_limite_inferior=buffer_receptor_limite_inferior+1;
  }
  else
  {
    buffer_receptor_limite_inferior=0;
  }
}

function buffer_emisor_limite_inferior_desplazar_un_paquete()
{
  if(buffer_emisor_limite_inferior<buffers_numero_maximo)
  { 
    buffer_emisor_limite_inferior=buffer_emisor_limite_inferior+1;
  }
  else
  {
    buffer_emisor_limite_inferior=0;
  }
}

function buffer_emisor_limite_superior_desplazar_un_paquete()
{
  if(buffer_emisor_limite_superior<buffers_numero_maximo)
  { 
    buffer_emisor_limite_superior=buffer_emisor_limite_superior+1;
  }
  else
  {
    buffer_emisor_limite_superior=0;
  }
}

var se_presiono_agregar_paquete_buffer_emisor_buffer=false;
function agregar_paquete_buffer_emisor_buffer()
{
  se_presiono_agregar_paquete_buffer_emisor_buffer=true;
  agregar_paquete_buffer_emisor();
}


var agregar_paquetes_periodicamente_activado=false;
var enviar_paquetes_periodicamente_activado=false;
var quitar_paquetes_periodicamente_activado=false;
var comenzar_envio_activado=false;
var agregar_Timer;
var envios_Timer;
var quitar_Timer;
function comenzar_envio()
{
  if(comenzar_envio_activado==false)
  {
    comenzar_envio_activado=true;
    agregar_Timer = setInterval(agregar_paquete_buffer_emisor,agregar_paquetes_periodicamente_delay); 
    envios_Timer = setInterval(enviar_un_paquete,enviar_paquetes_periodicamente_delay);
    quitar_Timer = setInterval(quitar_un_paquete_buffer_receptor,quitar_paquetes_periodicamente_delay); 
    document.getElementById("comenzar_envio_button").innerHTML = "Detener envío";
    document.getElementById("comenzar_envio_button").className = "activar_desactivar_desactivar";
    document.getElementById("pausar_button").className = "activar_desactivar_activar";
  }
  else
  {
    comenzar_envio_activado=false;
    clearInterval(agregar_Timer);
    clearInterval(envios_Timer);
    clearInterval(quitar_Timer);
    document.getElementById("comenzar_envio_button").innerHTML = "Comenzar envío";
    document.getElementById("comenzar_envio_button").className = "activar_desactivar_activar";
    document.getElementById("pausar_button").className = "activar_desactivar_inabilitado";
  }
}

var pausar_activado=false;
function pausar_envio()
{ 
  if(comenzar_envio_activado==true && pausar_activado==false)
  {
    pausar_activado=true;
    for(i=0;i<paquetes_list.length;i++)
    {
      paquetes_list[i].pausar();
    }
    for(let i=0;i<reconocimientos_list.length;i++)
    {
      reconocimientos_list[i].pausar();
    }
    clearInterval(reconocimientosTimer);   
    clearInterval(quitar_Timer);
    clearInterval(agregar_Timer);
    clearInterval(envios_Timer);  
    clearInterval(clockTimer);  
    document.getElementById("pausar_button").innerHTML = "Reanudar";
    document.getElementById("pausar_button").className = "activar_desactivar_activar";
    }
  else if(comenzar_envio_activado==true && pausar_activado==true)
    {
    pausar_activado=false;
    for(i=0;i<paquetes_list.length;i++)
    {
      paquetes_list[i].reanudar_luego_de_pausar();
    }
    for(let i=0;i<reconocimientos_list.length;i++)
    {
    reconocimientos_list[i].reanudar_luego_de_pausar();
    }
    reconocimientosTimer=setInterval(enviar_reconocimiento,tiempo_entre_reconocimientos);
    quitar_Timer = setInterval(quitar_un_paquete_buffer_receptor,quitar_paquetes_periodicamente_delay);
    agregar_Timer = setInterval(agregar_paquete_buffer_emisor,agregar_paquetes_periodicamente_delay);
    envios_Timer = setInterval(enviar_un_paquete,enviar_paquetes_periodicamente_delay);
    clockTimer=setInterval(clock_Timer_Callback,5000);
    document.getElementById("pausar_button").innerHTML = "Pausar";
    document.getElementById("pausar_button").className = "activar_desactivar_desactivar";
  }   
  else if(comenzar_envio_activado==false && pausar_activado==false)
  {
//    pausar_activado=true;
//    clearInterval(reconocimientosTimer);      
  }
  else if(comenzar_envio_activado==false && pausar_activado==true)
  {
//    pausar_activado=false;
//    reconocimientosTimer=setInterval(enviar_reconocimiento,tiempo_entre_reconocimientos);
  }
}

var pausar_envio_button_activado=false;
function pausar_envio_button()
{
  if(comenzar_envio_activado==true)
  {
    pausar_envio();
    if(pausar_activado==true)
    {    
      pausar_envio_button_activado=true;    
    }
    else
    {
      pausar_envio_button_activado=false;   
    }  
  }
  else
  {
    document.getElementById("pausar_button").innerHTML = "No se ha presionado enviar";
    document.getElementById("pausar_button").className = "boton_comun_error";
    setTimeout(function()
    {
      document.getElementById("pausar_button").innerHTML = "Pausar";
      document.getElementById("pausar_button").className = "activar_desactivar_inabilitado";
    },2000);  

  }  
}

function agregar_paquete_buffer_emisor()
{
  let buffer_emisor_list = get_buffer_emisor_list();
  if(buffer_emisor_list.length<buffers_tamano_maximo)
  {
    buffer_emisor_limite_superior_desplazar_un_paquete();
    paquetes_list[buffer_emisor_limite_superior].reiniciar();
    paquetes_list[buffer_emisor_limite_superior].agregar_paquete();
    paquetes_list[buffer_emisor_limite_superior].dibujar();  
    verificar_si_desplazar();   
  }
  else
  {
    if(se_presiono_agregar_paquete_buffer_emisor_buffer==true)
    {
      document.getElementById("agregar_un_paquete_buffer_emisor_button").innerHTML = "El buffer emisor está lleno";
      document.getElementById("agregar_un_paquete_buffer_emisor_button").className = "boton_comun_error";
      setTimeout(function()
      {
        document.getElementById("agregar_un_paquete_buffer_emisor_button").innerHTML = "Agregar un paquete al buffer";
        document.getElementById("agregar_un_paquete_buffer_emisor_button").className = "boton_comun";
      },2000);
      se_presiono_agregar_paquete_buffer_emisor_buffer=false;
    }
  }
}



function enviar_un_paquete()
{
  let buffer_emisor_list = get_buffer_emisor_list(); 
  i=0;
  j=-1;
  for(let i=0;i<buffer_emisor_list.length;i++)
  {
    if(paquetes_list[buffer_emisor_list[i]].get_estado()=="en_buffer_emisor" && j==-1)
    {
      j=i;      
    }
  }
  if(j!=-1)
  {
    if(ventana_emisor.verificar_si_esta_en_ventana(buffer_emisor_list[j])==true)
    {
      paquetes_list[buffer_emisor_list[j]].enviar_paquete();
      paquetes_que_no_deben_perderse = paquetes_que_no_deben_perderse-1;
      if(paquetes_que_no_deben_perderse<=0)
      {
        paquetes_que_no_deben_perderse = tasa_perdida_paquetes;
        paquetes_list[buffer_emisor_list[j]].set_perdido();
      }
    } 
    else
    {
      if(se_presiono_enviar_un_paquete==true)
      {
        document.getElementById("enviar_un_paquete_button").innerHTML = "No hay más paquetes en la ventana emisora";
        document.getElementById("enviar_un_paquete_button").className = "boton_comun_error";
        setTimeout(function()
        {
          document.getElementById("enviar_un_paquete_button").innerHTML = "Enviar un paquete";
          document.getElementById("enviar_un_paquete_button").className = "boton_comun";
        },2000);
      }    
    }
  } 
  else
  {
    if(se_presiono_enviar_un_paquete==true)
    {
      document.getElementById("enviar_un_paquete_button").innerHTML = "No hay más paquetes en el buffer emisor";
      document.getElementById("enviar_un_paquete_button").className = "boton_comun_error";
      setTimeout(function()
      {
        document.getElementById("enviar_un_paquete_button").innerHTML = "Enviar un paquete";
        document.getElementById("enviar_un_paquete_button").className = "boton_comun";
      },2000);
    }    
  }  
}

var se_presiono_enviar_un_paquete=false;
function enviar_un_paquete_button()
{
  se_presiono_enviar_un_paquete=true;
  enviar_un_paquete();
  se_presiono_enviar_un_paquete=false;
}


function enviar_paquetes_en_buffer_emisor(){
  for(let i=0;i<=buffers_numero_maximo;i++)
  {
    if(paquetes_list[i].get_estado()=="en_buffer_emisor")
    {
      paquetes_list[i].enviar_paquete();
    }
    else
    {
      document.getElementById("label_aux0").innerHTML="No hay más paquetes en el buffer emisor";
    }          
  }  
}


function enviar_paquete_con_retraso(numero)
{
  paquetes_list[numero].enviar_paquete("en_buffer_emisor");  
}


function paquete_llego_al_receptor(numero){
  let listo=false;
  let desplazamientos=0;
  let ventana_receptor_list = ventana_receptor.get_paquetes_en_ventana_list();
  let ventana_emisor_list = ventana_emisor.get_paquetes_en_ventana_list();
  let j=0;  
  for(j=0; j<ventana_receptor_list.length;j++)
  {
    if
      (listo==false && 
        (
        paquetes_list[ventana_receptor_list[j]].get_estado()=="en_destino" ||
        paquetes_list[ventana_receptor_list[j]].get_estado()=="en_destino_y_reenviado" ||
        paquetes_list[ventana_receptor_list[j]].get_estado()=="reenviado_y_en_destino" ||
        paquetes_list[ventana_receptor_list[j]].get_estado()=="reconocido" || 
        paquetes_list[ventana_receptor_list[j]].get_estado()=="reconocido_y_reenviado" ||
        paquetes_list[ventana_receptor_list[j]].get_estado()=="reenviado_y_reconocido"
        )
      )    
    {
      desplazamientos++;        
    }
    else
    {
      listo=true;  
    }
  }
  for(let i=0;i<desplazamientos;i++)
  {
    ventana_receptor.desplazar_un_paquete_lim_inferior();
  }
  paquetes_list[numero].dibujar();
//  
  
}
  
function enviar_reconocimiento()
{
  /*El reconocimiento solo se enviará si hay solo 0 o 1 reconocimiento en marcha*/
  if(reconocimientos_list.length<=1)
  {
    let ventana_receptor_list = ventana_receptor.get_paquetes_en_ventana_list();
    let ventana_emisor_list = ventana_emisor.get_paquetes_en_ventana_list();
    let paquete_a_reconocer;
    if(ventana_receptor.get_limite_inferior()!=0)
    {
      paquete_a_reconocer=ventana_receptor.get_limite_inferior()-1;
    }
    else
    {
      paquete_a_reconocer=buffers_numero_maximo;
    }
    if(reconocimientos_list.length==1)
    {
      reconocimientos_list.push(new Reconocimiento(paquete_a_reconocer));
      reconocimientos_list[reconocimientos_list.length-1].enviar_paquete(ventana_receptor_list.length);   
      clearInterval(reconocimientosTimer);
      reconocimientosTimer=setInterval(enviar_reconocimiento,tiempo_entre_reconocimientos);  
    }
    else if(reconocimientos_list.length==0)
    {
      reconocimientos_list.push(new Reconocimiento(paquete_a_reconocer));
      reconocimientos_list[reconocimientos_list.length-1].enviar_paquete(ventana_receptor_list.length);   
      clearInterval(reconocimientosTimer);
      reconocimientosTimer=setInterval(enviar_reconocimiento,tiempo_entre_reconocimientos);  
    }
  }
  else
  {
  }
}

function verificar_paquetes_reconocidos(paquete_a_reconocer,notificacion_tamano_ventana){
  let buffer_emisor_list = get_buffer_emisor_list();
  let desplazamientos=0;
  /*Si paquete a reconocer está en la ventana emisora*/
  if(ventana_emisor.verificar_si_esta_en_ventana(paquete_a_reconocer)==true)
  {  
    while(buffer_emisor_list[desplazamientos]!=paquete_a_reconocer)
    {
      paquetes_list[buffer_emisor_list[desplazamientos]].set_reconocido();
      desplazamientos=desplazamientos+1;    
    }
    desplazamientos=desplazamientos+1;
    paquetes_list[paquete_a_reconocer].set_reconocido();    
    for(let i=0;i<desplazamientos;i++)
    {
      buffer_emisor_limite_inferior_desplazar_un_paquete();
      ventana_emisor.desplazar_un_paquete_lim_inferior();
    }
    let desplazamientos_ventana_lim_superior=paquete_a_reconocer+notificacion_tamano_ventana-ventana_emisor.get_limite_superior();
    for(let i=0;i<desplazamientos_ventana_lim_superior;i++)
    {
//    buffer_emisor_limite_superior_desplazar_un_paquete();
      ventana_emisor.desplazar_un_paquete_lim_superior();    
    }
  }
  /*Si paquete a reconocer NO está en la ventana emisora*/
  else if(ventana_emisor.verificar_si_esta_en_ventana(paquete_a_reconocer)==false)
  {
    for(let i=ventana_emisor.get_limite_superior();i<paquete_a_reconocer+notificacion_tamano_ventana;i++)
    {
      ventana_emisor.desplazar_un_paquete_lim_superior();    
    }  
  }
  else
  {
    for(let i=0;i<notificacion_tamano_ventana-(buffers_numero_maximo-paquete_a_reconocer)-ventana_emisor.get_limite_superior();i++)
    {
      ventana_emisor.desplazar_un_paquete_lim_superior();    
    }  
  }
  /*Verificar si desplazar*/
  verificar_si_desplazar();

  for(i=ventana_emisor.get_limite_inferior();i<ventana_emisor.get_limite_superior()+1;i++){
    paquetes_list[i].dibujar();        
  }  
  for(let i=0;i<=buffers_numero_maximo;i++)
  {
      paquetes_list[i].dibujar();
  }
  
  

}

var aux = 1;

function redibujar(){
  let canvas_area = document.getElementById("rectangle_area");
  let dibujo = canvas_area.getContext("2d");
  dibujo.clearRect(0, 0, canvas_area.width, canvas_area.height);
  let i_inicial=0;
  if(buffer_emisor_limite_inferior>=10)
  {
    i_inicial=buffer_emisor_limite_inferior-10;
  }
  else
  {
    i_inicial=0;
  }
  for(i=i_inicial;i<paquetes_list.length;i++)
  {
    paquetes_list[i].dibujar();
 //   console.log(paquetes_list[i].numero_paquete + " " + paquetes_list[i].estado_buffer_receptor);
  }
  
  
}

function verificar_si_desplazar()
{
  if(
      paquetes_list[ventana_receptor.get_limite_superior()].get_coordenada_x()>=buffer_receiver_width*0.9 ||
      paquetes_list[buffer_emisor_limite_superior].get_coordenada_x()>=buffer_receiver_width*0.9      
    )
  {
    desplazar_todo(); 
  }  
}

function desplazar_todo()
{
  let canvas_area = document.getElementById("rectangle_area");
  let dibujo = canvas_area.getContext("2d");
  dibujo.clearRect(0, 0, canvas_area.width, canvas_area.height);
  for(i=0;i<paquetes_list.length;i++)
  {
    paquetes_list[i].desplazar1();
    paquetes_list[i].dibujar();
  }
  for(i=0;i<reconocimientos_list.length;i++)
  {
    reconocimientos_list[i].desplazar1();
  }
  
  if(
      paquetes_list[ventana_emisor.get_limite_inferior()].get_coordenada_x()>(ancho_paquetes+margen_buffers) &&
      paquetes_list[buffer_receptor_limite_inferior].get_coordenada_x()>(ancho_paquetes+margen_buffers)
    )
  {
   setTimeout(function()
      {
        desplazar_todo();
      },10);
  }

}

function desplazar_limite_superior_ventana_emisor()
{
  if(ventana_emisor.get_limite_superior()<paquetes_list.length)
  {  
    ventana_emisor.set_limite_superior(ventana_emisor.get_limite_superior()+1);   
    let i_inicial=0;
    if(buffer_emisor_limite_inferior>=10)
    {
      i_inicial=buffer_emisor_limite_inferior-10;
    }
    else
    {
      i_inicial=0;
    }
    for(i=i_inicial;i<paquetes_list.length;i++)
    {
      paquetes_list[i].dibujar();
    }
    verificar_si_desplazar();  
  }
  else
  {
    document.getElementById("label_aux0").innerHTML="No hay más paquetes en el buffer";
  }  
}





var se_presiono_quitar_un_paquete_buffer_receptor_button=false;
function quitar_un_paquete_buffer_receptor_button()
{
  se_presiono_quitar_un_paquete_buffer_receptor_button=true;
  quitar_un_paquete_buffer_receptor();
  se_presiono_quitar_un_paquete_buffer_receptor_button=false;
}


function quitar_un_paquete_buffer_receptor()
{
  let saco_paquetes_del_buffer=false;
  if(ventana_receptor.verificar_si_esta_en_ventana(buffer_receptor_limite_inferior)==false)
  {
    paquetes_list[buffer_receptor_limite_inferior].quitar_paquete();
    buffer_receptor_limite_inferior_desplazar_un_paquete();
    ventana_receptor.desplazar_un_paquete_lim_superior();
    saco_paquetes_del_buffer=true;
    if(buffer_receptor_limite_inferior<((buffers_numero_maximo+1)/2))
    {
      paquetes_list[buffer_receptor_limite_inferior + (buffers_numero_maximo+1)/2].reiniciar();
    }
    else
    {
      paquetes_list[buffer_receptor_limite_inferior - (buffers_numero_maximo+1)/2].reiniciar();
    }
  } 
  else
  {
    if(se_presiono_quitar_un_paquete_buffer_receptor_button==true)
    {
      document.getElementById("quitar_un_paquete_buffer_receptor_button").innerHTML = "No hay más paquetes en el buffer receptor";
      document.getElementById("quitar_un_paquete_buffer_receptor_button").className = "boton_comun_error";
      setTimeout(function()
      {
        document.getElementById("quitar_un_paquete_buffer_receptor_button").innerHTML = "Quitar un paquete";
        document.getElementById("quitar_un_paquete_buffer_receptor_button").className = "boton_comun";
      },2000);
    }    
  }  
  verificar_si_desplazar();
  for(let i=0;i<=buffers_numero_maximo;i++)
  {
    paquetes_list[i].dibujar();
  }
  if(
      ((ventana_receptor.get_paquetes_en_ventana_list()).length>3) &&
      (saco_paquetes_del_buffer==true)
    )
  {
    enviar_reconocimiento();
  }
}

function agregar_paquetes_periodicamente_new_range()
{
  agregar_paquetes_periodicamente_delay=document.getElementById("agregar_paquetes_periodicamente_range").value;
  if(comenzar_envio_activado==true && pausar_activado==false)
  {
    clearInterval(agregar_Timer);
    agregar_Timer = setInterval(agregar_paquete_buffer_emisor,agregar_paquetes_periodicamente_delay);
  } 
}

function quitar_paquetes_periodicamente_new_range()
{
  quitar_paquetes_periodicamente_delay=document.getElementById("quitar_paquetes_periodicamente_range").value;
  if(comenzar_envio_activado==true && pausar_activado==false)
  {
    clearInterval(quitar_Timer);
    quitar_Timer = setInterval(quitar_un_paquete_buffer_receptor,quitar_paquetes_periodicamente_delay);
  } 
}

function tasa_perdida_paquetes_new_range()
{
  tasa_perdida_paquetes=document.getElementById("tasa_perdida_paquetes_range").value;
  if(tasa_perdida_paquetes==31)
  {
    tasa_perdida_paquetes=10000000;  
  }
  paquetes_que_no_deben_perderse=tasa_perdida_paquetes;
}


function velocidad_enviar_paquetes_periodicamente_new_range()
{
  step_delay_paquetes=document.getElementById("velocidad_enviar_paquetes_periodicamente_range").value;
  for(let i=0;i<=buffers_numero_maximo;i++)
  {
    paquetes_list[i].set_velocidad();
  }
  for(let i=0;i<reconocimientos_list.length;i++)
  {
    reconocimientos_list[i].set_velocidad();
  }
}

function cambiar_estado_buffer_receptor(numero_paquete,estado)
{
  if(paquetes_list[numero_paquete].get_estado_buffer_receptor()=="paquete_invalido")
    {
    paquetes_list[numero_paquete].set_estado_buffer_receptor(estado);
    }
}


