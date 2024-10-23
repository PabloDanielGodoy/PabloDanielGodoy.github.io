//Controles velocidad emisor
function range_velocidad_emisor_new_value()
{
  velocidad_emisor=document.getElementById("range_velocidad_emisor_id").value;
  document.getElementById("text_velocidad_emisor_id").value=velocidad_emisor;
}

function velocidad_emisor_clic_button()
{
  var aux=document.getElementById("text_velocidad_emisor_id").value;
  if(isNaN(aux)==false)
  {
    if(aux>=-3000 && aux<=3000)
    {
      velocidad_emisor=aux;
      document.getElementById("range_velocidad_emisor_id").value=velocidad_emisor;
    }
    else
    {
      alert("Debe ingresar un número entre -3000 y 3000");
    }
  }
  else
  {
    alert("Debe ingresar un número");  
  }
}

function velocidad_emisor_set_0_clic_button()
{
  velocidad_emisor=0;
  document.getElementById("text_velocidad_emisor_id").value=velocidad_emisor;
  document.getElementById("range_velocidad_emisor_id").value=velocidad_emisor;
}

//Controles velocidad receptor
function range_velocidad_receptor_new_value()
{
  velocidad_receptor=document.getElementById("range_velocidad_receptor_id").value;
  document.getElementById("text_velocidad_receptor_id").value=velocidad_receptor;
}

function velocidad_receptor_clic_button()
{
  var aux=document.getElementById("text_velocidad_receptor_id").value;
  if(isNaN(aux)==false)
  {
    if(aux>=-3000 && aux<=3000)
    {
      velocidad_receptor=aux;
      document.getElementById("range_velocidad_receptor_id").value=velocidad_receptor;
    }
    else
    {
      alert("Debe ingresar un número entre -3000 y 3000");
    }
  }
  else
  {
    alert("Debe ingresar un número");  
  }
}

function velocidad_receptor_set_0_clic_button()
{
  velocidad_receptor=0;
  document.getElementById("text_velocidad_receptor_id").value=velocidad_receptor;
  document.getElementById("range_velocidad_receptor_id").value=velocidad_receptor;
}

//Controles velocidad viento
function range_velocidad_viento_new_value()
{
  velocidad_viento=document.getElementById("range_velocidad_viento_id").value;
  document.getElementById("text_velocidad_viento_id").value=velocidad_viento;
}

function velocidad_viento_clic_button()
{
  var aux=document.getElementById("text_velocidad_viento_id").value;
  if(isNaN(aux)==false)
  {
    if(aux>=-600 && aux<=600)
    {
      velocidad_viento=aux;
      document.getElementById("range_velocidad_viento_id").value=velocidad_viento;
    }
    else
    {
      alert("Debe ingresar un número entre -600 y 600");
    }
  }
  else
  {
    alert("Debe ingresar un número");  
  }
}

function velocidad_viento_set_0_clic_button()
{
  velocidad_viento=0;
  document.getElementById("text_velocidad_viento_id").value=velocidad_viento;
  document.getElementById("range_velocidad_viento_id").value=velocidad_viento;
}

//Controles frecuencia emisor
function range_frecuencia_emisor_new_value()
{
  frecuencia_emisor=document.getElementById("range_frecuencia_emisor_id").value;
  document.getElementById("text_frecuencia_emisor_id").value=frecuencia_emisor;
}

function frecuencia_emisor_click_button()
{
  var aux=document.getElementById("text_frecuencia_emisor_id").value;
  if(isNaN(aux)==false)
  {
    if(aux>=0 && aux<=10000000)
    {
      frecuencia_emisor=aux;
      document.getElementById("range_frecuencia_emisor_id").value=frecuencia_emisor;
    }
    else
    {
      alert("Debe ingresar un número entre 0 y 10000000");
    }
  }
  else
  {
    alert("Debe ingresar un número");  
  }
}

function frecuencia_emisor_set_inicial_click_button()
{
  frecuencia_emisor=10000;
  document.getElementById("text_frecuencia_emisor_id").value=frecuencia_emisor;
  document.getElementById("range_frecuencia_emisor_id").value=frecuencia_emisor;
}

function button_comenzar_pausar_click()
{
  if(document.getElementById("button_comenzar_pausar_id").className=="activar_desactivar_activar")
  {
    comenzar();
    document.getElementById("button_comenzar_pausar_id").className="activar_desactivar_desactivar";
    document.getElementById("button_comenzar_pausar_id").innerHTML="Pausar";
  }
  else
  {
    pausar();
    document.getElementById("button_comenzar_pausar_id").className="activar_desactivar_activar";
    document.getElementById("button_comenzar_pausar_id").innerHTML="Comenzar";
    calculo_frecuencia_receptor();
  }  
}

function button_mostrar_onda_reflejada_click()
{
  if(document.getElementById("button_mostrar_onda_reflejada_id").className=="activar_desactivar_activar")
  {
    mostrar_onda_reflejada=true;
    document.getElementById("button_mostrar_onda_reflejada_id").className="activar_desactivar_desactivar";
    document.getElementById("button_mostrar_onda_reflejada_id").innerHTML="Ocultar Onda Reflejada";
  }
  else
  {
    mostrar_onda_reflejada=false;
    document.getElementById("button_mostrar_onda_reflejada_id").className="activar_desactivar_activar";
    document.getElementById("button_mostrar_onda_reflejada_id").innerHTML="Mostrar Onda Reflejada";
  } 
}
