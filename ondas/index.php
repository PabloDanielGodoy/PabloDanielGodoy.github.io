<!DOCTYPE html>
<html>
<head>
  <script src="funciones.js"></script>
  <link rel="icon" type="image/x-icon" href="logo_uncuyo.jpg"/>
  <link rel="stylesheet" href="ondas.css"/>  
  <title>Wave Function Graph</title>

</head>
<body onload="start();">
<?php
  $usuario_agente = $_SERVER['HTTP_USER_AGENT'];
  $navegador = "Desconocido";
  $sistema_operativo = "Desconocido";
  // Detectar el navegador
  if (strpos($usuario_agente, 'MSIE') !== FALSE) {
    $navegador = 'Internet Explorer';
  } elseif (strpos($usuario_agente, 'Firefox') !== FALSE) {
    $navegador = 'Firefox';
  } elseif (strpos($usuario_agente, 'Chrome') !== FALSE) {
    $navegador = 'Google Chrome';
  } elseif (strpos($usuario_agente, 'Safari') !== FALSE) {
    $navegador = 'Safari';
  } elseif (strpos($usuario_agente, 'Opera') !== FALSE) {
    $navegador = 'Opera';
  }
  // Detectar el sistema operativo
  if (strpos($usuario_agente, 'Windows') !== FALSE) {
    $sistema_operativo = 'Windows';
  } elseif (strpos($usuario_agente, 'Mac') !== FALSE) {
    $sistema_operativo = 'Macintosh';
  } elseif (strpos($usuario_agente, 'Linux') !== FALSE) {
    $sistema_operativo = 'Linux';
  } elseif (strpos($usuario_agente, 'Android') !== FALSE) {
    $sistema_operativo = 'Android';
  } elseif (strpos($usuario_agente, 'iOS') !== FALSE) {
    $sistema_operativo = 'iOS';
  }
  $file = fopen("registro_visitas.txt","a");
  fwrite($file,date("Y/m/d")." - ".date("H:i:sa")." - IP: ".$_SERVER['REMOTE_ADDR']. " - ".$sistema_operativo." - ".$navegador."\n");
  fclose($file); 
?>

<p style="text-align:center;font-size:28px">Waves Simulador</p>
  <p style="text-align:center">
    <span style="padding-left:20px"><a href="sugerencias.html">Suggestions or comments</a></span>
  </p>

<div class="principal">   
<!--Primer bloque: controles. Arriba-->
<div class="controles_cuadro" style="top:0px;left:0px;height:100px;width:1071px;">  
  <div style="float:left;"> <!--div boton comenzar pausar-->
      <button id="button_comenzar_pausar_id" class="activar_desactivar_activar" style="margin-top:20px;margin-left:10px;padding:20px;width:80px;" onclick="button_comenzar_pausar_click();">Start</button>
  </div>

  <div style="float:left;"> <!--div boton Reiniciar-->
    <button class="set_button" style="margin-top:20px;margin-left:10px;height:60px;padding:10px;padding:20px;width:100px;"
        onclick="restartAnimation();">Restart</button>
  </div>


  <div style="float:left;"> <!--div boton Advance time One Step-->
    <button class="set_button" style="margin-top:20px;margin-left:10px;height:60px;padding:10px;width:130px;"
        onclick="advanceAnimation();">Advance time &#916(&#969t)=0.1*&#960</button>
  </div>

  <!-- div para sentido de la onda--> 
  <div style="float:left;margin-top:20px;margin-left:40px;margin-right:20px;height:60px;"> 
    <div style="font-size:18px;text-align:center;">
        Direction
    </div>
    <div>
      <input type="radio" id="posx" name="direction" value="posx">
      <label for="posx" style="font-size:20px;">+x</label><br>
      <input type="radio" id="negx" name="direction" value="negx">
      <label for="posx" style="font-size:20px;">-x</label><br>
    </div>
  </div>

  <!-- div para Angular Frequency--> 
  <div style="float:left;padding:10px;margin-left:20px;height:80px;width:120px;text-align:center;">
    <div style="font-size:18px;text-align:center;">
       Frequency
    </div>
    <div>
      <div style="text-align:left;width:58px;" class="etiquetas_sliders">0</div>
      <div style="text-align:right;width:58px;" class="etiquetas_sliders">MAX</div>
    </div>
    <div>
      <input id="frequencyInput" type="range" min="0" max="0.05" step="0.001" value="0.025" class="slider">
    </div>
  </div>

  <!-- div para wavelength--> 
  <div style="float:left;padding:10px;margin-left:20px;height:80px;width:120px;text-align:center;">
    <div style="font-size:18px;text-align:center;">
      Wavelength
    </div>
    <div>
      <div style="text-align:left;width:58px;" class="etiquetas_sliders">MAX</div>
      <div style="text-align:right;width:58px;" class="etiquetas_sliders">MIN</div>
    </div>
    <div>
      <input id="wavelengthInput" type="range" min="0.5" max="4" step="0.001" value="2" class="slider">
    </div>
  </div>

  <!-- div para x position--> 
  <div style="float:left;padding-left:10px;padding-top:5px;margin-left:20px;height:80px;text-align:center;">
    <div style="text-align:center;">
      Set x position      
    </div>
    <div style="height:31px;">
      <div style="float:left">
        <input type="text" id="updateCirclePosition_text_lambda_id" style="width:60px;font-size: 20px;"></input>
      </div>    
      <div style="float:left;width:60px;font-size:20px;text-align:left;">      
        *&#955  
      </div>
      <div style="float:left;">      
        <button class="buttonx" onclick="updateCirclePosition_from_text_lambda();">Update</button>
      </div>
    </div>  
    <div style="height:31px;">
      <div style="float:left;">
        <input type="text" id="updateCirclePosition_text_pik_id" style="width:60px;font-size: 20px;"></input>
      </div>
      <div style="float:left;width:60px;text-align:left;">      
        *&#960/k
      </div>
      <div style="float:left;background-color:cyan;">      
        <button class="buttonx"  onclick="updateCirclePosition_from_text_pik();">Update</button>    
      </div>
    </div>
  </div>
</div>



<!--Segundo bloque: canvas--> 
<div class="canvas_cuadro" style="top:100px;left:0px;height:470px;width:820px;">   
    <p>click on the area to set x (clic sobre el área para fijar x)</p>
    <canvas id="waveCanvas" style="margin-left:0px;margin-top:10px;" width="800" height="470"></canvas>
</div>    
<!--Tercer bloque: funciones--> 
<div class="funciones_cuadro" style="top:100px;left:820px;height:470px;width:250px;border:2px solid;line-height:25px;">   
    <p id="parametros_id" style="font-size: 18px;padding-left:5px;padding-top:5px;"></p>
    <p id="funcion_posicion_id" style="font-size: 18px;color:blue;padding-left:5px;padding-top:15px;"></p>
    <p id="funcion_velocidad_id" style="font-size: 18px;color:green;padding-left:5px;padding-top:15px;"></p>
    <p id="funcion_aceleracion_id" style="font-size: 18px;color:red;padding-left:5px;padding-top:15px;"></p>    
</div>      

<div class="creditos" style="top:580px;"> <!--Cuarto bloque: creditos-->
    <address>
      Desarrollado por Pablo Daniel Godoy<br>
      ITIC, Facultad de Ingeniería y FCEN<br>
      Universidad Nacional de Cuyo
    </address>
  </div> 
  
</body>
</html>
