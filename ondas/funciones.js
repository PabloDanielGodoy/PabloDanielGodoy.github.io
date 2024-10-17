var canvas;   
var ctx;
var animationId;
var omega;   
var circleX;
var currentTime; // Current time variable
var isPaused;
var A; // Amplitude
var k; // Wave number
var wavelength; // Calculate wavelength
var wave_direction;
var kx;
var distanciaejexdesdetop;
var coor_y_tubo_top;
   
function start(){
    document.getElementById('posx').checked = true;
    wave_direction="posx";
    const radioButtons = document.querySelectorAll('input[name="direction"]');
    radioButtons.forEach((radio) => {
      radio.addEventListener('change', (event) => {
        if (event.target.value === 'posx') {
          wave_direction="posx"; 
        } else if (event.target.value === 'negx') {
          wave_direction="negx"; 
        }
      });
    });
    
    canvas = document.getElementById('waveCanvas');
    ctx = canvas.getContext('2d');
    
    omega = parseFloat(document.getElementById('frequencyInput').value); // Initial angular frequency
    circleX = 0; // Initial x-coordinate for the black circle
    currentTime = 0; // Current time variable
    isPaused=true;
    
    A = 100; // Amplitude
    distanciaejexdesdetop = A + 30;
    wavelength=canvas.width/2;
    k = 2 * Math.PI/wavelength; // Wave number

    document.getElementById('frequencyInput').addEventListener('input', changeFrequency);
    document.getElementById('wavelengthInput').addEventListener('input', changeWavelength);
    canvas.addEventListener('click', updateCirclePosition);
    
    coor_y_tubo_top = 280;
     
        drawWave(0); // Start animation
    }
    
function drawWave(time) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.beginPath();
      ctx.moveTo(0, distanciaejexdesdetop*2);
      ctx.lineTo(canvas.width, distanciaejexdesdetop*2-10);
      ctx.lineWidth = 1; 
      ctx.strokeStyle = "black";
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(10, distanciaejexdesdetop);

      //cambiamos el signo de omega según sentido de la onda
      if(wave_direction=="posx"){
        omega=Math.abs(omega);
      }
      else if(wave_direction=="negx"){
        omega=-Math.abs(omega);
      }
      //Draw the main waveform y (posición) in blue
      ctx.lineWidth = 2; // Set line width to 1 for the main waveform      
      for (let x = 0; x < canvas.width; x++) {
        const y = A * Math.cos(k * x - omega * time);
        ctx.lineTo(x+10, distanciaejexdesdetop - y);
      }
  
      ctx.strokeStyle = "blue";
      ctx.stroke();
      
      // Draw the waveform v in green with a dotted line
      ctx.beginPath();
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = "green";
      ctx.lineWidth = 2; // Set line width to 1 for the waveform
      
      for (let x = 0; x < canvas.width; x++) {
        var Av;
        if(wave_direction=="posx"){
          Av= (A*(Math.abs(omega)/0.025)/2);
        }
        else if(wave_direction=="negx"){
          Av= -(A*(Math.abs(omega)/0.025)/2);
        }
        const y1 = Av * Math.sin(k * x - omega * time);
        ctx.lineTo(x+10, distanciaejexdesdetop - y1);
      }     
      ctx.stroke();
      ctx.setLineDash([]); // Reset line dash
      
      // Draw the waveform a in red with a dotted line
      ctx.beginPath();
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      for (let x = 0; x < canvas.width; x++) {
        const y2 = -(A*(omega/0.025)*(omega/0.025)/2) * Math.cos(k * x - omega * time);
        ctx.lineTo(x+10, distanciaejexdesdetop - y2);
      }
      
      ctx.stroke();
      ctx.setLineDash([]); // Reset line dash      
      
      // Draw circle at the updated x-coordinate
      ctx.lineWidth = 1;
      const circleY = distanciaejexdesdetop - A * Math.cos(k * circleX - omega * time);
      ctx.beginPath();
      ctx.arc(circleX+10, circleY, 5, 0, Math.PI * 2);
      ctx.fillStyle = "black";
      ctx.fill();

      kx = k*(circleX / canvas.width) * (2 * wavelength);
      
      // Draw x and y axes, arrows, and labels
      ctx.font = '20px Arial';
      ctx.beginPath();
      ctx.moveTo(10, distanciaejexdesdetop);
      ctx.lineTo(canvas.width, distanciaejexdesdetop);
      ctx.moveTo(canvas.width - 10, distanciaejexdesdetop - 5);
      ctx.lineTo(canvas.width, distanciaejexdesdetop);
      ctx.lineTo(canvas.width - 10, distanciaejexdesdetop + 5);
      
      ctx.moveTo(10, 0);
      ctx.lineTo(10, distanciaejexdesdetop + A);
      ctx.moveTo(5, 10);
      ctx.lineTo(10, 0);
      ctx.lineTo(15, 10);
      
      ctx.strokeStyle = "brown";
      ctx.stroke();
      
      ctx.fillStyle = "brown";
      ctx.fillText("x", canvas.width - 10, distanciaejexdesdetop + 20);
      ctx.fillText("y", 20, 15);
      
      //Dibujamos la flecha de dirección de la onda
      ctx.beginPath();
      ctx.moveTo(canvas.width/2+100, 20);
      ctx.lineTo(canvas.width/2+150, 20);
      if(wave_direction=="posx"){
        ctx.moveTo(canvas.width/2+145, 15);
        ctx.lineTo(canvas.width/2+150, 20);
        ctx.lineTo(canvas.width/2+145, 25);
      }
      else if(wave_direction=="negx"){
        ctx.moveTo(canvas.width/2+105, 15);
        ctx.lineTo(canvas.width/2+100, 20);
        ctx.lineTo(canvas.width/2+105, 25);
      }      
      ctx.strokeStyle = "black";
      ctx.stroke();      
      ctx.fillStyle = "black";
      ctx.fillText("direction", canvas.width/2+160, 20);
      

      
      // Draw the green vector
      ctx.beginPath();
      ctx.moveTo(circleX+9, circleY);
      const vectorY = circleY - (0.9*Av) * Math.sin(k * circleX - omega * time);
      ctx.lineTo(circleX+9, vectorY);      
      if(circleY<vectorY){
        ctx.moveTo(circleX+4,vectorY-10);
        ctx.lineTo(circleX+9,vectorY);
        ctx.lineTo(circleX+14,vectorY-10);      
      }
      else{
        ctx.moveTo(circleX+4,vectorY+10);
        ctx.lineTo(circleX+9,vectorY);
        ctx.lineTo(circleX+14,vectorY+10); 
      }     
      ctx.lineWidth = 3;
      ctx.strokeStyle = "green";
      ctx.stroke();
      ctx.fillStyle = "green";
      ctx.font = '25px Arial';
      ctx.fillText("v", circleX-15, vectorY);
      ctx.font = '15px Arial';
      ctx.fillText("y", circleX-5, vectorY);
      ctx.font = '20px Arial';
      
      // Draw the red vector
      ctx.beginPath();
      ctx.moveTo(circleX+11, circleY);
      const vectorYRed = circleY + 0.7*A *(omega/0.025) *(omega/0.025) * Math.cos(k * circleX - omega * time);
      ctx.lineTo(circleX+11, vectorYRed);
      if(circleY<vectorYRed){
        ctx.moveTo(circleX+6,vectorYRed-10);
        ctx.lineTo(circleX+11,vectorYRed);
        ctx.lineTo(circleX+16,vectorYRed-10);      
      }
      else{
        ctx.moveTo(circleX+6,vectorYRed+10);
        ctx.lineTo(circleX+11,vectorYRed);
        ctx.lineTo(circleX+16,vectorYRed+10); 
      }  
      ctx.strokeStyle = "red";
      ctx.stroke();
      ctx.fillStyle = "red";
      ctx.font = '25px Arial';
      ctx.fillText("a", circleX+18, vectorYRed);
      ctx.font = '15px Arial';
      ctx.fillText("y", circleX+33, vectorYRed);
      ctx.font = '20px Arial';      
  
    var letraLambda = '\u03BB';
    var letrapi = '\u03C0';
    var kxmenosomegatime= kx - Math.abs(omega*time);
    var kxmasomegatime= kx + Math.abs(omega*time);
    var coseno=Math.cos(kxmenosomegatime);
    var menoscoseno=-coseno;
    var sine=Math.sin(kxmenosomegatime);
    var menossine=-sine;
    var coseno1=Math.cos(kxmasomegatime);
    var menoscoseno1=-coseno1;
    var sine1=Math.sin(kxmasomegatime);
    var menossine1=-sine1;
    document.getElementById('parametros_id').innerHTML = "x=" + 
      (circleX/wavelength).toFixed(3) + letraLambda + "=" + (2*circleX/wavelength).toFixed(3) + letrapi + "/k<br>kx=" + (kx/Math.PI).toFixed(3) +
      letrapi + "=" + kx.toFixed(3) + "<br>wt=" + (Math.abs(omega*time)/Math.PI).toFixed(3) + letrapi + "=" + (Math.abs(omega*time)).toFixed(3);
    if(wave_direction=="posx"){
      document.getElementById('parametros_id').innerHTML = 
        document.getElementById('parametros_id').innerHTML + "<br>direction: +x<br>" + "kx-wt=" + kxmenosomegatime.toFixed(3) + " rad=" + (kxmenosomegatime/Math.PI).toFixed(3) + letrapi + " rad<br>"; 
      document.getElementById('funcion_posicion_id').innerHTML = "y(x,t)=Acos(kx-wt)=<br>" + "Acos(" + kxmenosomegatime.toFixed(2) + ")=(" + coseno.toFixed(2) + ")A"; 
      document.getElementById('funcion_velocidad_id').innerHTML = "v<sub>y</sub>(x,t)=dy(x,t)/dt=<br>=Awsin(kx-wt)=<br>" + "=Awsin(" + kxmenosomegatime.toFixed(2) + ")=(" + sine.toFixed(2) + ")wA"; 
      document.getElementById('funcion_aceleracion_id').innerHTML = "a<sub>y</sub>(x,t)=d<sup>2</sup>y(x,t)/dt<sup>2</sup>=<br>-Aw<sup>2</sup>cos(kx-wt)=<br>" + "-Aw<sup>2</sup>cos("+ kxmenosomegatime.toFixed(2) +  ")=(" + menoscoseno.toFixed(2) + ")w<sup>2</sup>A";
    }
    else if(wave_direction=="negx"){
      document.getElementById('parametros_id').innerHTML =
        document.getElementById('parametros_id').innerHTML + "<br>direction: -x<br>" + "kx+wt=" + kxmasomegatime.toFixed(3) + " rad =" + (kxmasomegatime/Math.PI).toFixed(3) + letrapi + " rad<br>"; ;
      document.getElementById('funcion_posicion_id').innerHTML = "y(x,t)=Acos(kx+wt)=<br>" + "Acos(" + kxmasomegatime.toFixed(2) + ")=(" + coseno1.toFixed(2) + ")A"; 
      document.getElementById('funcion_velocidad_id').innerHTML = "v<sub>y</sub>(x,t)=dy(x,t)/dt=<br>=-Awsin(kx+wt)=<br>" + "-Awsin(" + kxmasomegatime.toFixed(2) + ")=(" + menossine1.toFixed(2) + ")wA"; 
      document.getElementById('funcion_aceleracion_id').innerHTML = "a<sub>y</sub>(x,t)=d<sup>2</sup>y(x,t)/dt<sup>2</sup>=<br>=-Aw<sup>2</sup>cos(kx+wt)=<br>" + "-Aw<sup>2</sup>cos("+ kxmasomegatime.toFixed(2) +  ")=(" + menoscoseno1.toFixed(2) + ")w<sup>2</sup>A";
    
    }
    

      if(isPaused == false){
          currentTime = time; // Update current time
          animationId = requestAnimationFrame(drawWave.bind(null, currentTime + 1)); // Increment  time

      }
      else{
          currentTime = time; // Update current time
          animationId = requestAnimationFrame(drawWave.bind(null, currentTime));
      }    
  
  dibujarMoleculas(time);
  
 
  }
  
  

// Función para dibujar moléculas según la función definida por el usuario
function dibujarMoleculas(time) {
      ctx.font = '18px Arial';
      ctx.fillStyle = "black";
      ctx.fillText("Example with longitudinal wave", 10, coor_y_tubo_top);

      ctx.fillStyle = "black";
      ctx.fillText("(", 300, coor_y_tubo_top);
      ctx.fillText(")", 760, coor_y_tubo_top);
      ctx.beginPath();
      ctx.strokeStyle = "blue";
      ctx.lineWidth = 1;
      ctx.setLineDash([1, 1]);
      ctx.arc(320 , coor_y_tubo_top - 5 , 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.font = '18px Arial';
      ctx.fillStyle = "blue";
      ctx.fillText("particles at rest, without wave", 330, coor_y_tubo_top);
      ctx.beginPath();
      ctx.fillStyle = 'blue';
      ctx.arc(600 , coor_y_tubo_top - 5 , 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fill();
      ctx.font = '18px Arial';
      ctx.fillStyle = "blue";
      ctx.fillText("particles with wave", 610, coor_y_tubo_top);


      ctx.beginPath();
      ctx.fillStyle = 'lightgray';
      ctx.fillRect(10, coor_y_tubo_top+30, 800, 50);      
      
      for (let x = 0; x < 800; x += 20) {
        let y;
        let x1;
        let y1;
  
        ctx.beginPath();
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 1;
        ctx.setLineDash([1, 1]);
        ctx.arc(10 + x , coor_y_tubo_top + 20 , 5, 0, Math.PI * 2);
        ctx.stroke();

        ctx.stroke();        
        ctx.beginPath();
        ctx.fillStyle = 'blue';
        y = 20 * Math.cos(k * x - omega * time);
        ctx.arc(10 + x + y, coor_y_tubo_top + 40 , 5, 0, Math.PI * 2);
        ctx.arc(10 + x + y, coor_y_tubo_top + 70 , 5, 0, Math.PI * 2);
        ctx.fill();        
        x1=x+10;
        y1 = 20 * Math.cos(k * x1 - omega * time);
        ctx.beginPath();
        ctx.fillStyle = 'blue';
        ctx.arc(10 + x1 + y1, coor_y_tubo_top + 55 , 5, 0, Math.PI * 2);
        ctx.fill();
      
        ctx.beginPath();
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 1;
        ctx.setLineDash([1, 1]);
        ctx.moveTo(10+x, coor_y_tubo_top + 20);
        ctx.lineTo(10+x+y, coor_y_tubo_top + 40);
        ctx.stroke();
      }
       
      //Línea vertical que indica la posición x 
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.moveTo(circleX+10, coor_y_tubo_top + 30);
      ctx.lineTo(circleX+10, coor_y_tubo_top + 80);
      ctx.strokeStyle = "black";
      ctx.stroke();
      ctx.setLineDash([]);

      //Dibujamos la onda de presión
      ctx.beginPath();
      ctx.strokeStyle = "orange";
      ctx.lineWidth = 2;       
      for (let x = 0; x < canvas.width; x++) {
        const presion = 20 * Math.sin(k * x - omega * time);
        ctx.lineTo(x+10, coor_y_tubo_top + 130 - presion);
      }     
      ctx.stroke();
    
      //Dibujamos los ejes de la onda de presión
      ctx.font = '20px Arial';
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.moveTo(10, coor_y_tubo_top + 130);
      ctx.lineTo(canvas.width, coor_y_tubo_top + 130);
      ctx.moveTo(10, coor_y_tubo_top + 90);
      ctx.lineTo(10, coor_y_tubo_top + 150);
      
      ctx.moveTo(5, coor_y_tubo_top + 100);
      ctx.lineTo(10, coor_y_tubo_top + 90);
      ctx.lineTo(15, coor_y_tubo_top + 100);
      ctx.moveTo(canvas.width - 10, coor_y_tubo_top + 125);
      ctx.lineTo(canvas.width, coor_y_tubo_top + 130);
      ctx.lineTo(canvas.width - 10, coor_y_tubo_top + 135);
      
      ctx.strokeStyle = "brown";
      ctx.stroke();
      
      ctx.fillStyle = "brown";
      ctx.fillText("x", canvas.width - 10, coor_y_tubo_top + 120);
      ctx.fillText("Pressure wave", 20, coor_y_tubo_top+105);

    
    }


function button_comenzar_pausar_click()
{
if(document.getElementById("button_comenzar_pausar_id").className=="activar_desactivar_activar")
  {
    isPaused = false;
document.getElementById("button_comenzar_pausar_id").className="activar_desactivar_desactivar";
    document.getElementById("button_comenzar_pausar_id").innerHTML="Stop";
  }
  else
  {
    isPaused = true;    document.getElementById("button_comenzar_pausar_id").className="activar_desactivar_activar";
    document.getElementById("button_comenzar_pausar_id").innerHTML="Start";
  }  
}


   
    
    
    function advanceAnimation() {
      drawWave(currentTime + 0.1*Math.PI/omega); // Increment time by one step
    }
    
    function restartAnimation() {
      circleX = 0;
      document.getElementById('frequencyInput').value=0.025;
      changeFrequency();
      document.getElementById('wavelengthInput').value=2;
      changeWavelength();
     isPaused = true;       
   document.getElementById("button_comenzar_pausar_id").className="activar_desactivar_activar";
    document.getElementById("button_comenzar_pausar_id").innerHTML="Start";
      drawWave(0);
    }
    
    function changeFrequency() {
      omega = parseFloat(document.getElementById('frequencyInput').value);
    }
    
    function changeWavelength() {
      wavelength = 800/parseFloat(document.getElementById('wavelengthInput').value);
      k = 2 * Math.PI/wavelength; // Wave number
      document.getElementById('updateCirclePosition_text_lambda_id').value="";
      document.getElementById('updateCirclePosition_text_pik_id').value="";
    }
    
    
    function updateCirclePosition(event) {
      const rect = canvas.getBoundingClientRect();
      circleX = event.clientX - rect.left - 10;
    }
    
    function updateCirclePosition_from_text_lambda() {
      let multiplier = parseFloat(document.getElementById('updateCirclePosition_text_lambda_id').value);
      document.getElementById('updateCirclePosition_text_pik_id').value="";
      circleX = wavelength*multiplier; 
    }    

    function updateCirclePosition_from_text_pik() {
      let multiplier = parseFloat(document.getElementById('updateCirclePosition_text_pik_id').value);
      document.getElementById('updateCirclePosition_text_lambda_id').value="";
      circleX = wavelength*multiplier/2; 
    }    
