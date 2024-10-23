function inicializar()
{
  mi_canvas = document.getElementById("rectangle_area");
  canvas_area= mi_canvas.getContext("2d");
  dibujar();
  for(i=0;i<25;i++)
  {
    ondas_emisor_list.push(new Onda_emisor());
  }
  for(i=0;i<25;i++)
  {
    ondas_receptor_list.push(new Onda_receptor());
  }
  velocidad_emisor_set_0_clic_button();
  velocidad_receptor_set_0_clic_button();
  velocidad_viento_set_0_clic_button();
  frecuencia_emisor_set_inicial_click_button();
  calculo_frecuencia_receptor_sin_onda();
}

function calculo_frecuencia_receptor()
{
  if(coordenada_x_receptor<coordenada_x_emisor)
  {
    var vr=Number(velocidad_receptor);
    var vs=Number(velocidad_emisor);
    var vv=Number(velocidad_viento); 
  }
  else if(coordenada_x_receptor>coordenada_x_emisor)
  {
    var vr=-Number(velocidad_receptor);
    var vs=-Number(velocidad_emisor);
    var vv=-Number(velocidad_viento); 
  }
  if(mostrar_onda_reflejada==true)
  {
    frecuencia_receptor=frecuencia_emisor*(velocidad_sonido-vv+vr)/(velocidad_sonido-vv+vs);
    frecuencia_emisor_luego_de_rebote=frecuencia_receptor*(velocidad_sonido+vv-vs)/(velocidad_sonido+vv-vr);
    fs=frecuencia_emisor;
    fs1=frecuencia_emisor_luego_de_rebote;
    v=velocidad_sonido;
    velocidad_receptor_ignorando_viento=v*( fs1*(v+vs)-fs*(v-vs) ) / ( fs1*(v+vs)+fs*(v-vs) );
    if(coordenada_x_receptor>coordenada_x_emisor)
    { 
      velocidad_receptor_ignorando_viento=(-1)*velocidad_receptor_ignorando_viento;
    }
    document.getElementById("frecuencia_receptor_label_id").innerHTML=
      "<p style=\"padding:0px;margin:2px;margin-top:10px;\">Frecuencia receptor = " + frecuencia_receptor.toFixed(1) + " Hz</p>" +
      "<p style=\"padding:0px;margin:2px;\">Frecuencia que retorna al emisor = " + frecuencia_emisor_luego_de_rebote.toFixed(1) +
         " Hz</p>" +
      "<p style=\"padding:0px;margin:2px;\">Velocidad receptor ignorando viento = " + velocidad_receptor_ignorando_viento.toFixed(1) 
        + " Km/h</p>"; 
  }
  else
  {
    frecuencia_receptor=frecuencia_emisor*(velocidad_sonido-vv+vr)/(velocidad_sonido-vv+vs);
    document.getElementById("frecuencia_receptor_label_id").innerHTML=
      "<p style=\"padding:0px;margin:2px;margin-top:30px;\">Frecuencia receptor = " + frecuencia_receptor.toFixed(1) + " Hz</p>";
  }      
}

function calculo_frecuencia_receptor_sin_onda()
{
  if(mostrar_onda_reflejada==true)
  {
    document.getElementById("frecuencia_receptor_label_id").innerHTML=
      "<p style=\"padding:0px;margin:2px;margin-top:10px;\">Frecuencia receptor = " + "Sin datos" + " </p>" +
      "<p style=\"padding:0px;margin:2px;\">Frecuencia que retorna al emisor = " + "Sin datos" + " </p>" +
      "<p style=\"padding:0px;margin:2px;\">Velocidad receptor ignorando viento = " + "Sin datos" + " </p>"; 
  }
  else
  {
    document.getElementById("frecuencia_receptor_label_id").innerHTML=
      "<p style=\"padding:0px;margin:2px;margin-top:30px;\">Frecuencia receptor = " + frecuencia_receptor.toFixed(1) + " Hz</p>";
  }      
}



function comenzar()
{
  timer_pantalla1=setInterval(ejecucion_periodica,50);
  timer_resetear_onda_emisor=setTimeout(resetear_onda_emisor,frecuencia_reset_ondas()); //400 - 
}

function reiniciar()
{
  mi_canvas.width=mi_canvas.width;
  frecuencia_emisor=10000;
  coordenada_x_emisor = 300;
  coordenada_x_receptor = 700;
  velocidad_viento_set_0_clic_button();
  velocidad_receptor_set_0_clic_button();
  velocidad_emisor_set_0_clic_button();
  for(var i=0;i<ondas_emisor_list.length;i++)
  {
    ondas_emisor_list[i].reiniciar();
    ondas_receptor_list[i].reiniciar();
  }  
  dibujar();
  pausar();
  document.getElementById("button_comenzar_pausar_id").className="activar_desactivar_activar";
  document.getElementById("button_comenzar_pausar_id").innerHTML="Comenzar";
  //calculo_frecuencia_receptor();
  velocidad_emisor_set_0_clic_button();
  velocidad_receptor_set_0_clic_button();
  velocidad_viento_set_0_clic_button();
  frecuencia_emisor_set_inicial_click_button();
  calculo_frecuencia_receptor_sin_onda();
}


function pausar()
{
  clearInterval(timer_pantalla1);
  clearInterval(timer_resetear_onda_emisor);
}

function ejecucion_periodica()
{
  coordenada_x_emisor=coordenada_x_emisor+velocidad_emisor*0.004;
  coordenada_x_receptor=coordenada_x_receptor+velocidad_receptor*0.004;
  dibujar();
  //calculo_frecuencia_receptor();  
}

function dibujar()
{
  mi_canvas.width=mi_canvas.width;
  dibujar_emisor();
  dibujar_receptor();
  for(var i=0;i<ondas_emisor_list.length;i++)
  {
    ondas_emisor_list[i].dibujar();
  }
  for(var i=0;i<ondas_receptor_list.length;i++)
  {
    ondas_receptor_list[i].dibujar();
  }
}

function dibujar_emisor()
{
  canvas_area.fillStyle = "blue";
  canvas_area.fillRect(coordenada_x_emisor, coordenada_y, ancho, alto);
}

function dibujar_receptor()
{
  canvas_area.fillStyle = "green";
  canvas_area.fillRect(coordenada_x_receptor, coordenada_y, ancho, alto);
}

var onda_emisor_a_resetear=0;
function resetear_onda_emisor()
{
  if(onda_emisor_a_resetear>=ondas_emisor_list.length)
  {
    onda_emisor_a_resetear=0;
  }  
  timer_resetear_onda_emisor=setTimeout(resetear_onda_emisor,frecuencia_reset_ondas()); 
  ondas_emisor_list[onda_emisor_a_resetear].resetear();
  onda_emisor_a_resetear=onda_emisor_a_resetear+1;
}

var onda_receptor_a_resetear=0;
function resetear_onda_receptor()
{
  if(onda_receptor_a_resetear>=ondas_receptor_list.length)
  {
    onda_receptor_a_resetear=0;
  }  
  ondas_receptor_list[onda_receptor_a_resetear].resetear();
  onda_receptor_a_resetear=onda_receptor_a_resetear+1;
}

function onda_emisor_choco_receptor()
{
  if(mostrar_onda_reflejada==true)
  {
    resetear_onda_receptor();
    calculo_frecuencia_receptor();
  }
}

function frecuencia_reset_ondas()
{
  return 1400-(1/20)*frecuencia_emisor;
}
