var C_value;
var R_value;
var L_value;
var w_value;
var Z_value;
var fi_value_rad;
var fi_value_grados;
var amplitud_Vs;
var amplitud_corriente;
var amplitud_VR;
var amplitud_VL;
var amplitud_VC;
var amplitud_corriente_relativa=100;
var amplitud_VS_relativa;
var amplitud_VR_relativa;
var amplitud_VL_relativa;
var amplitud_VC_relativa;
var distanciaejexdesdetop = 225;
var distanciaejeydesdeleft = 465;
var centro_fasores_X=235;
var centro_fasores_Y=225;
var k=0.013; //Necesario para construir las senoides
var longitud_senoides;
var x;
let x_aux=0;
var y; //Variables para graficar
var canvas;
var animationId;
var time=0;
var isPaused;


function iniciar(){
  actualizar_valores();
  draw_sinusoidal_functions(); 
}


function actualizar_valores(){
    //Tomar valor capacitancia
    console.log("Entrando en actualizar_valores");    
    
    canvas = document.getElementById('fasoresysenoidesCanvas');
    ctx = canvas.getContext('2d');
     
    const value_aux_C = parseFloat(document.getElementById("text_C_id").value);
    const unit_C = document.getElementById("unit_C_id").value;
    if (isNaN(value_aux_C)) {
        alert("Capacitance value is not valid");
        return null;
    }
    const multipliers_C = {
        "F":  1,
        "mF": 1e-3,
        "uF": 1e-6,
        "nF": 1e-9,
        "pF": 1e-12
    };
    C_value=value_aux_C * multipliers_C[unit_C];    
    
    //Tomar valor resistencia        
    const value_aux_R = parseFloat(document.getElementById("text_R_id").value);
    const unit_R = document.getElementById("unit_R_id").value;
    if (isNaN(value_aux_R)) {
        alert("Resistance value is not valid");
        return null;
    }
    const multipliers_R = {
        "ohm":  1,
        "Kohm": 1e+3,
        "Mohm": 1e+6        
    };
    R_value=value_aux_R * multipliers_R[unit_R];    
       
    //Tomar valor inductancia        
    const value_aux_L = parseFloat(document.getElementById("text_L_id").value);
    const unit_L = document.getElementById("unit_L_id").value;
    if (isNaN(value_aux_L)) {
        alert("Inductance value is not valid");
        return null;
    }
    const multipliers_L = {
        "H":  1,
        "mH": 1e-3,
        "uH": 1e-6        
    };
    L_value=value_aux_L * multipliers_L[unit_L];    

//Tomar valor Vs        
    const value_aux_Vs = parseFloat(document.getElementById("text_Vs_id").value);
    if (isNaN(value_aux_Vs)) {
        alert("Source voltage value is not valid");
        return null;
    }
    amplitud_Vs=value_aux_Vs;    

//Tomar valor frecuencia angular w        
    const value_aux_w = parseFloat(document.getElementById("text_frequency_id").value);
    const unit_w = document.getElementById("unit_frequency_id").value;
    if (isNaN(value_aux_w)) {
        alert("Frecuency value is not valid");
        return null;
    }
    const multipliers_w = {
        "Hz":  3.141593,
        "KHz": 3141.593,
        "MHz": 3141593,
        "rad/seg": 1,
        "Krad/seg": 1e+3,
        "Mrad/seg": 1e+6
    };
    w_value=value_aux_w * multipliers_w[unit_w];
    let f_value=w_value/(2*3.141593);
  
    //Calculamos Z, I, VL, VC y VR
    Z_value=Math.sqrt(R_value**2+(w_value*L_value-1/(w_value*C_value))**2);
    fi_value_rad=Math.atan((w_value*L_value-1/(w_value*C_value))/R_value);
    fi_value_grados=fi_value_rad*360/(2*Math.PI);
    amplitud_corriente=amplitud_Vs/Z_value;
    amplitud_VR=amplitud_corriente*R_value;
    amplitud_VL=w_value*L_value*amplitud_corriente;
    amplitud_VC=amplitud_corriente/(w_value*C_value);     
    let XL=w_value*L_value;
    let XC=1/(w_value*C_value);
    if(L_value==0){
      w_resonancia="No";
    }
    else{
      w_resonancia=1/Math.sqrt(L_value*C_value);
    }
      
    document.getElementById('parametros_id').innerHTML = 
        "R = " + notacioningenieria(R_value) + " \u03A9<br>" +  
        "L = " + notacioningenieria(L_value) + " H<br>" +
        "C = " + notacioningenieria(C_value) + " F<br>" +
        "V<sub>S</sub> = " + notacioningenieria(amplitud_Vs) + " volt<br>" +
        "w = " + notacioningenieria(w_value) + " rad/seg<br>" +
        "f = " + notacioningenieria(f_value) + " Hz<br>" +        
        "<br>"+
        "X<sub>L</sub> = " + notacioningenieria(XL) + " \u03A9<br>" +
        "X<sub>C</sub> = " + notacioningenieria(XC) + " \u03A9<br>" +
        "Z = " + notacioningenieria(Z_value) + " \u03A9<br>" +        
        "I = " + notacioningenieria(amplitud_corriente) + " amperes<br>" +
        "V<sub>R</sub> = " + notacioningenieria(amplitud_VR) + " volt<br>" +
        "V<sub>L</sub> = " + notacioningenieria(amplitud_VL) + " volt<br>" +
        "V<sub>C</sub> = " + notacioningenieria(amplitud_VC) + " volt<br>" +
        "\u03D5 = " + fi_value_grados.toFixed(1) + "º \u2261 " + fi_value_rad.toFixed(2) + " rad <br>" ;
      if(L_value==0 || C_value==Infinity){
        document.getElementById('parametros_id').innerHTML=document.getElementById('parametros_id').innerHTML+
        "\u03C9 resonance = No resonance<br>" +
        "f resonance = No resonance";  
      }
      else{
        document.getElementById('parametros_id').innerHTML=document.getElementById('parametros_id').innerHTML+
        "\u03C9 resonance = " + notacioningenieria(w_resonancia) + " rad/s<br>" +
        "f resonance = " + notacioningenieria(w_resonancia/(2*Math.PI)) + " Hz<br>";
      } 
    console.log("Valor w: " + w_value);
    console.log("Valor amplitud_corriente: " + amplitud_corriente);
    console.log("Valor capacitancia: " + C_value);
    console.log("Valor resistencia: " + R_value);
    console.log("Valor Inductancia: " + L_value);
    console.log("Valor Vs: " + amplitud_Vs);
    console.log("Valor w: " + w_value);
    console.log("Valor Z: " + Z_value);
    console.log("Valor amplitud_corriente: " + amplitud_corriente);
    
    calcular_amplitudes_relativas();    
          
    return;
}

function notacioningenieria(n, dec = 3) {
  if (n === 0) return "0";
  if(n>0.0001 && n<999) return n.toFixed(dec);
  let exp = Math.floor(Math.log10(Math.abs(n)) / 3) * 3;
  let mant = n / 10 ** exp;
  return mant.toFixed(dec) + "e" + exp;
}



function calcular_amplitudes_relativas(){
  let mayor_V=Math.max(amplitud_Vs, amplitud_VR, amplitud_VL, amplitud_VC)
  amplitud_VS_relativa=170*amplitud_Vs/mayor_V;
  amplitud_VR_relativa=170*amplitud_VR/mayor_V;
  amplitud_VL_relativa=170*amplitud_VL/mayor_V;
  amplitud_VC_relativa=170*amplitud_VC/mayor_V;
  console.log("Mayor V = " + mayor_V);
  amplitud_corriente_relativa=180;
}

function start(){    
   time = 0; // Current time variable
    isPaused=true;
    
    }
    
function draw_sinusoidal_functions() {
      //Borrar rectángulo
      ctx.clearRect(0, 0, canvas.width, canvas.height);      
      
      longitud_senoides=canvas.width-distanciaejeydesdeleft-50;
      
      //Dibujar ejes
      //Dibujar el eje X con su flechita
      ctx.font = '20px Arial';
      ctx.beginPath();
      ctx.moveTo(distanciaejeydesdeleft, distanciaejexdesdetop);
      ctx.lineTo(distanciaejeydesdeleft+longitud_senoides+30, distanciaejexdesdetop);
      //Las siguientes tres líneas son para dibujar la flecha
      ctx.moveTo(distanciaejeydesdeleft+longitud_senoides+20, distanciaejexdesdetop - 5);
      ctx.lineTo(distanciaejeydesdeleft+longitud_senoides+30, distanciaejexdesdetop);
      ctx.lineTo(distanciaejeydesdeleft+longitud_senoides+20, distanciaejexdesdetop + 5);
      //Dibujar el eje Y con su flechita
      ctx.moveTo(distanciaejeydesdeleft, 0);
      ctx.lineTo(distanciaejeydesdeleft, 1.8*distanciaejexdesdetop);
      //Las siguientes tres líneas son para dibujar la flecha
      ctx.moveTo(distanciaejeydesdeleft-5, 10);
      ctx.lineTo(distanciaejeydesdeleft, 0);
      ctx.lineTo(distanciaejeydesdeleft+5, 10);
      //stroke de los ejes y flechas
      ctx.strokeStyle = "brown";
      ctx.stroke();
      ctx.fillStyle = "brown";
      ctx.fillText("t", distanciaejeydesdeleft+longitud_senoides+30, distanciaejexdesdetop + 20);
      ctx.fillText("Volts", distanciaejeydesdeleft+10, 15);
      ctx.fillText("Amperes", distanciaejeydesdeleft+10, 35);
                
      //Dibujamos la senoide de la corriente
      if(document.getElementById("checkbox_i_id").checked==true)
      {
        ctx.beginPath();      
        y = amplitud_corriente_relativa * Math.cos(0);
        ctx.lineWidth = 3;
        ctx.moveTo(distanciaejeydesdeleft, distanciaejexdesdetop - y);        
        for (x = 1; x < longitud_senoides; x++) {
          const y = amplitud_corriente_relativa* Math.cos(k*x);
          ctx.lineTo(distanciaejeydesdeleft+x, distanciaejexdesdetop - y);
        }      
        ctx.strokeStyle = "gray";
        ctx.setLineDash([3, 3]);
        ctx.stroke();      
        ctx.setLineDash([]);
      }
            
      //Dibujamos la senoide de VR
      if(document.getElementById("checkbox_VR_id").checked==true)
      {
        ctx.beginPath();      
        y = amplitud_VR_relativa * Math.cos(0);
        ctx.lineWidth = 2;
        ctx.moveTo(distanciaejeydesdeleft, distanciaejexdesdetop - y);        
        for (x = 1; x < longitud_senoides; x++) {
          const y = amplitud_VR_relativa * Math.cos(k*x);
          ctx.lineTo(distanciaejeydesdeleft+x, distanciaejexdesdetop - y);
        }  
        ctx.strokeStyle = "lime";
        ctx.stroke();
      }  
      
      //Dibujamos la senoide de VL
      if(document.getElementById("checkbox_VL_id").checked==true && L_value!=0)
      {
        ctx.beginPath();      
        y = -amplitud_VL_relativa * Math.sin(0);
        ctx.lineWidth = 2;
        ctx.moveTo(distanciaejeydesdeleft, distanciaejexdesdetop - y);        
        for (x = 1; x < longitud_senoides; x++) {
          const y = -amplitud_VL_relativa * Math.sin(k*x);
          ctx.lineTo(distanciaejeydesdeleft+x, distanciaejexdesdetop - y);
        }  
        ctx.strokeStyle = "blue";
        ctx.stroke();
      }  
      
      //Dibujamos la senoide de VC
      if(document.getElementById("checkbox_VC_id").checked==true && C_value!=Infinity)
      {
        ctx.beginPath();      
        y = amplitud_VC_relativa * Math.sin(0);
        ctx.lineWidth = 2;
        ctx.moveTo(distanciaejeydesdeleft, distanciaejexdesdetop - y);        
        for (x = 1; x < longitud_senoides; x++) {
          const y = amplitud_VC_relativa * Math.sin(k*x);
          ctx.lineTo(distanciaejeydesdeleft+x, distanciaejexdesdetop - y);
        }  
        ctx.strokeStyle = "red";
        ctx.stroke();
      }  

      //Dibujamos la senoide de VS
      if(document.getElementById("checkbox_VS_id").checked==true)
      {
        ctx.beginPath();      
        y = amplitud_VS_relativa * Math.cos(0+fi_value_rad);
        ctx.moveTo(distanciaejeydesdeleft, distanciaejexdesdetop - y);        
        for (x = 1; x < longitud_senoides; x++) {
          y = amplitud_VS_relativa * Math.cos(k*x+fi_value_rad);
          ctx.lineTo(distanciaejeydesdeleft+x, distanciaejexdesdetop - y);
        }  
        ctx.strokeStyle = "black";      
        if(Math.abs(fi_value_rad-Math.PI/2)<0.02 ||Math.abs(fi_value_rad+Math.PI/2)<0.02 || Math.abs(fi_value_rad)<0.04)
        {  
          ctx.setLineDash([6,6]);
          ctx.stroke();
          ctx.setLineDash([]);          
        }  
        else{
          ctx.stroke();
        }
      }

     
     // Draw the i vector
      if(document.getElementById("checkbox_i_id").checked==true)
      {
        ctx.beginPath();
        ctx.moveTo(centro_fasores_X,centro_fasores_Y);
        ctx.lineTo(centro_fasores_X+180*Math.cos(0.02*time),centro_fasores_Y-180*Math.sin(0.02*time));      
        ctx.lineWidth = 3;
        ctx.strokeStyle = "gray";
        ctx.setLineDash([3, 3]);
        ctx.stroke();      
        ctx.setLineDash([]);
        //Draw flecha
        ctx.beginPath();
        ctx.strokeStyle = "gray";
        ctx.lineWidth = 10;
        ctx.moveTo(centro_fasores_X+180*Math.cos(0.02*time),centro_fasores_Y-180*Math.sin(0.02*time));
        ctx.lineTo(centro_fasores_X+(180+4)*Math.cos(0.02*time),centro_fasores_Y-(180+4)*Math.sin(0.02*time));
        ctx.stroke();
        ctx.beginPath();
        ctx.lineWidth = 7;
        ctx.moveTo(centro_fasores_X+(180+4)*Math.cos(0.02*time),centro_fasores_Y-(180+4)*Math.sin(0.02*time));
        ctx.lineTo(centro_fasores_X+(180+8)*Math.cos(0.02*time),centro_fasores_Y-(180+8)*Math.sin(0.02*time));
        ctx.stroke();
        ctx.beginPath();
        ctx.lineWidth = 4;
        ctx.moveTo(centro_fasores_X+(180+8)*Math.cos(0.02*time),centro_fasores_Y-(180+8)*Math.sin(0.02*time));
        ctx.lineTo(centro_fasores_X+(180+12)*Math.cos(0.02*time),centro_fasores_Y-(180+12)*Math.sin(0.02*time));
        ctx.stroke();
        ctx.fillStyle = "gray";
        ctx.fillText("i",centro_fasores_X+(180+30)*Math.cos(0.02*time)-5,centro_fasores_Y-(180+30)*Math.sin(0.02*time)+5);
      }  
    
     // Draw the VR vector
      if(document.getElementById("checkbox_VR_id").checked==true)
      {
        ctx.beginPath();
        ctx.moveTo(centro_fasores_X,centro_fasores_Y);
        ctx.lineTo(centro_fasores_X+amplitud_VR_relativa*Math.cos(0.02*time),centro_fasores_Y-amplitud_VR_relativa*Math.sin(0.02*time));      
        ctx.lineWidth = 3;
        ctx.strokeStyle = "lime";
        ctx.stroke();      
        //Draw flecha
        ctx.beginPath();
        ctx.strokeStyle = "lime";  
        ctx.lineWidth = 8;
        ctx.moveTo(centro_fasores_X+amplitud_VR_relativa*Math.cos(0.02*time),centro_fasores_Y-amplitud_VR_relativa*Math.sin(0.02*time));
        ctx.lineTo(centro_fasores_X+(amplitud_VR_relativa+4)*Math.cos(0.02*time),centro_fasores_Y-(amplitud_VR_relativa+4)*Math.sin(0.02*time));
        ctx.stroke();
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.lineTo(centro_fasores_X+(amplitud_VR_relativa+4)*Math.cos(0.02*time),centro_fasores_Y-(amplitud_VR_relativa+4)*Math.sin(0.02*time));
        ctx.lineTo(centro_fasores_X+(amplitud_VR_relativa+8)*Math.cos(0.02*time),centro_fasores_Y-(amplitud_VR_relativa+8)*Math.sin(0.02*time));
        ctx.stroke();
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.lineTo(centro_fasores_X+(amplitud_VR_relativa+8)*Math.cos(0.02*time),centro_fasores_Y-(amplitud_VR_relativa+8)*Math.sin(0.02*time));
        ctx.lineTo(centro_fasores_X+(amplitud_VR_relativa+12)*Math.cos(0.02*time),centro_fasores_Y-(amplitud_VR_relativa+12)*Math.sin(0.02*time));
        ctx.stroke();
        ctx.fillStyle = "white";
        ctx.fillRect(centro_fasores_X+(amplitud_VR_relativa+25)*Math.cos(0.02*time)-10,centro_fasores_Y-(amplitud_VR_relativa+25)*Math.sin(0.02*time)-10,25,25);
        ctx.fillStyle = "lime";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("VR",  centro_fasores_X+(amplitud_VR_relativa+25)*Math.cos(0.02*time),centro_fasores_Y-(amplitud_VR_relativa+25)*Math.sin(0.02*time));

      }  


      // Draw the VL vector
      if(document.getElementById("checkbox_VL_id").checked==true && L_value!=0) 
      {
        ctx.beginPath();
        ctx.moveTo(centro_fasores_X,centro_fasores_Y);
        ctx.lineTo(centro_fasores_X+amplitud_VL_relativa*Math.cos(0.02*time+Math.PI/2),centro_fasores_Y-amplitud_VL_relativa*Math.sin(0.02*time+Math.PI/2));      
        ctx.lineWidth = 3;
        ctx.strokeStyle = "blue";
        ctx.stroke();      
        //Draw flecha
        ctx.beginPath();
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 8;
        ctx.moveTo(centro_fasores_X+amplitud_VL_relativa*Math.cos(0.02*time+Math.PI/2),centro_fasores_Y-amplitud_VL_relativa*Math.sin(0.02*time+Math.PI/2));
        ctx.lineTo(centro_fasores_X+(amplitud_VL_relativa+4)*Math.cos(0.02*time+Math.PI/2),centro_fasores_Y-(amplitud_VL_relativa+4)*Math.sin(0.02*time+Math.PI/2));
        ctx.stroke();
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.moveTo(centro_fasores_X+(amplitud_VL_relativa+4)*Math.cos(0.02*time+Math.PI/2),centro_fasores_Y-(amplitud_VL_relativa+4)*Math.sin(0.02*time+Math.PI/2));
        ctx.lineTo(centro_fasores_X+(amplitud_VL_relativa+8)*Math.cos(0.02*time+Math.PI/2),centro_fasores_Y-(amplitud_VL_relativa+8)*Math.sin(0.02*time+Math.PI/2));
        ctx.stroke();
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.moveTo(centro_fasores_X+(amplitud_VL_relativa+8)*Math.cos(0.02*time+Math.PI/2),centro_fasores_Y-(amplitud_VL_relativa+8)*Math.sin(0.02*time+Math.PI/2));
        ctx.lineTo(centro_fasores_X+(amplitud_VL_relativa+12)*Math.cos(0.02*time+Math.PI/2),centro_fasores_Y-(amplitud_VL_relativa+12)*Math.sin(0.02*time+Math.PI/2));
        ctx.stroke();
        ctx.fillStyle = "blue";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("VL",centro_fasores_X+(amplitud_VL_relativa+25)*Math.cos(0.02*time+Math.PI/2),centro_fasores_Y-(amplitud_VL_relativa+25)*Math.sin(0.02*time+Math.PI/2));
      }  

      // Draw the VC vector
      if(document.getElementById("checkbox_VC_id").checked==true && C_value!=Infinity)
      {
        ctx.beginPath();
        ctx.moveTo(centro_fasores_X,centro_fasores_Y);
        ctx.lineTo(centro_fasores_X+amplitud_VC_relativa*Math.cos(0.02*time-Math.PI/2),centro_fasores_Y-amplitud_VC_relativa*Math.sin(0.02*time-Math.PI/2));      
        ctx.lineWidth = 3;
        ctx.strokeStyle = "red";
        ctx.stroke();      
        //Draw flecha
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.lineWidth = 8;
        ctx.moveTo(centro_fasores_X+amplitud_VC_relativa*Math.cos(0.02*time-Math.PI/2),centro_fasores_Y-amplitud_VC_relativa*Math.sin(0.02*time-Math.PI/2));
        ctx.lineTo(centro_fasores_X+(amplitud_VC_relativa+4)*Math.cos(0.02*time-Math.PI/2),centro_fasores_Y-(amplitud_VC_relativa+4)*Math.sin(0.02*time-Math.PI/2));
        ctx.stroke();
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.moveTo(centro_fasores_X+(amplitud_VC_relativa+4)*Math.cos(0.02*time-Math.PI/2),centro_fasores_Y-(amplitud_VC_relativa+4)*Math.sin(0.02*time-Math.PI/2));
        ctx.lineTo(centro_fasores_X+(amplitud_VC_relativa+8)*Math.cos(0.02*time-Math.PI/2),centro_fasores_Y-(amplitud_VC_relativa+8)*Math.sin(0.02*time-Math.PI/2));
        ctx.stroke();
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.moveTo(centro_fasores_X+(amplitud_VC_relativa+8)*Math.cos(0.02*time-Math.PI/2),centro_fasores_Y-(amplitud_VC_relativa+8)*Math.sin(0.02*time-Math.PI/2));
        ctx.lineTo(centro_fasores_X+(amplitud_VC_relativa+12)*Math.cos(0.02*time-Math.PI/2),centro_fasores_Y-(amplitud_VC_relativa+12)*Math.sin(0.02*time-Math.PI/2));
        ctx.stroke();
        ctx.fillStyle = "red";        
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Vc",centro_fasores_X+(amplitud_VC_relativa+25)*Math.cos(0.02*time-Math.PI/2),centro_fasores_Y-(amplitud_VC_relativa+25)*Math.sin(0.02*time-Math.PI/2));
      }  

// Draw the Vs vector. Primero si está en resonancia se dibuja desplazado hacia arriba. Si no está en resonancia, se dibuja en la posición normal.      
      if(document.getElementById("checkbox_VS_id").checked==true)
      {     
        ctx.beginPath();
        ctx.moveTo(centro_fasores_X,centro_fasores_Y);
        ctx.lineTo(centro_fasores_X+amplitud_VS_relativa*Math.cos(0.02*time+fi_value_rad),centro_fasores_Y-amplitud_VS_relativa*Math.sin(0.02*time+fi_value_rad));      
        ctx.lineWidth = 3;
        ctx.strokeStyle = "black";        
        if(Math.abs(fi_value_rad-Math.PI/2)<0.02 ||Math.abs(fi_value_rad+Math.PI/2)<0.02 || Math.abs(fi_value_rad)<0.04){  
          ctx.setLineDash([3,3]);
          ctx.stroke();
          ctx.setLineDash([]);          
        }  
        else{
          ctx.stroke();
        }       
        //Draw flecha
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 8;
        ctx.moveTo(centro_fasores_X+amplitud_VS_relativa*Math.cos(0.02*time+fi_value_rad),centro_fasores_Y-amplitud_VS_relativa*Math.sin(0.02*time+fi_value_rad));
        ctx.lineTo(centro_fasores_X+(amplitud_VS_relativa+4)*Math.cos(0.02*time+fi_value_rad),centro_fasores_Y-(amplitud_VS_relativa+4)*Math.sin(0.02*time+fi_value_rad));
        ctx.stroke();
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.moveTo(centro_fasores_X+(amplitud_VS_relativa+4)*Math.cos(0.02*time+fi_value_rad),centro_fasores_Y-(amplitud_VS_relativa+4)*Math.sin(0.02*time+fi_value_rad));
        ctx.lineTo(centro_fasores_X+(amplitud_VS_relativa+8)*Math.cos(0.02*time+fi_value_rad),centro_fasores_Y-(amplitud_VS_relativa+8)*Math.sin(0.02*time+fi_value_rad));
        ctx.stroke();
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.moveTo(centro_fasores_X+(amplitud_VS_relativa+8)*Math.cos(0.02*time+fi_value_rad),centro_fasores_Y-(amplitud_VS_relativa+8)*Math.sin(0.02*time+fi_value_rad));
        ctx.lineTo(centro_fasores_X+(amplitud_VS_relativa+12)*Math.cos(0.02*time+fi_value_rad),centro_fasores_Y-(amplitud_VS_relativa+12)*Math.sin(0.02*time+fi_value_rad));
        ctx.stroke();
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Vs",centro_fasores_X+(amplitud_VS_relativa+48)*Math.cos(0.02*time+fi_value_rad),centro_fasores_Y-(amplitud_VS_relativa+48)*Math.sin(0.02*time+fi_value_rad));        
      }  



      
      if(time*k>=6.28){
        console.log("Paso");
        //draw_sinusoidal_functions(0);
      }  
      
      //Dibujar línea vertical      
      ctx.beginPath();      
      ctx.moveTo(distanciaejeydesdeleft+time*0.02/k, distanciaejexdesdetop - 180);
      ctx.lineTo(distanciaejeydesdeleft+time*0.02/k, distanciaejexdesdetop + 180);      
      ctx.lineWidth = 2;
      ctx.strokeStyle = "brown";
      ctx.setLineDash([5, 5]);
      ctx.stroke();      
      ctx.setLineDash([]); // Reset line dash
      
      //Escribimos leyendas
      ctx.textAlign = "start";     // izquierda
      ctx.textBaseline = "alphabetic"; // línea base
      //Leyenda VC
      ctx.beginPath();      
      ctx.moveTo(595, 10);
      ctx.lineTo(618, 10);
      ctx.strokeStyle = "red";      
      ctx.lineWidth = 2;
      ctx.stroke();      
      ctx.fillStyle = "red";
      ctx.font = "20px cursive";
      ctx.fillText("Vc(t)", 620, 15);      
            
      //Leyenda VL
      ctx.beginPath();      
      ctx.moveTo(685, 10);
      ctx.lineTo(708, 10);
      ctx.strokeStyle = "blue";      
      ctx.lineWidth = 2;
      ctx.stroke();      
      ctx.fillStyle = "blue";
      ctx.font = "20px cursive";
      ctx.fillText("V", 710, 15);
      ctx.font = "12px cursive";
      ctx.fillText("L", 723, 15);
      ctx.font = "20px cursive";
      ctx.fillText("(t)", 730, 15);
      
      //Leyenda VR
      ctx.beginPath();      
      ctx.moveTo(770, 10);
      ctx.lineTo(793, 10);
      ctx.strokeStyle = "lime";      
      ctx.lineWidth = 2;
      ctx.stroke();      
      ctx.fillStyle = "lime";
      ctx.fillText("V", 795, 15);
      ctx.font = "12px cursive";
      ctx.fillText("R", 807, 15);
      ctx.font = "20px cursive";
      ctx.fillText("(t)", 815, 15);

      
      //Leyenda VS
      ctx.beginPath();      
      ctx.moveTo(855, 10);
      ctx.lineTo(878, 10);
      ctx.strokeStyle = "black";      
      ctx.lineWidth = 2;
      ctx.stroke();      
      ctx.fillStyle = "black";
      ctx.fillText("Vs(t)", 880, 15);
      
      //Leyenda i
      ctx.beginPath();      
      ctx.moveTo(940, 10);
      ctx.lineTo(963, 10);
      ctx.strokeStyle = "gray";      
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "gray";
      ctx.font = "20px cursive";
      ctx.fillText("i", 965, 15);
      ctx.font = "20px cursive";
      ctx.fillText("(t)", 973, 15);
      
      //Dibujamos  fi 
      if(document.getElementById("checkbox_fi_id").checked==true && (L_value!=0 || C_value!=Infinity))
      {   
        let x_vs_es_cero=(Math.PI/2-fi_value_rad)/k;
        ctx.beginPath();      
        ctx.moveTo(distanciaejeydesdeleft+x_vs_es_cero, distanciaejexdesdetop);
        ctx.lineTo(distanciaejeydesdeleft+x_vs_es_cero, distanciaejexdesdetop+190);
        ctx.strokeStyle = "orange";      
        ctx.lineWidth = 2;      
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath();      
        let x_i_es_cero=(Math.PI/2)/k;
        ctx.moveTo(distanciaejeydesdeleft+x_i_es_cero, distanciaejexdesdetop);
        ctx.lineTo(distanciaejeydesdeleft+x_i_es_cero, distanciaejexdesdetop+190);
        ctx.strokeStyle = "orange";      
        ctx.lineWidth = 2;      
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(distanciaejeydesdeleft+x_vs_es_cero, distanciaejexdesdetop+190);
        ctx.lineTo(distanciaejeydesdeleft+x_i_es_cero, distanciaejexdesdetop+190);
        ctx.strokeStyle = "orange";      
        ctx.lineWidth = 2;   
        ctx.stroke();
        ctx.fillStyle = "orange";
        ctx.fillText("\u03D5", distanciaejeydesdeleft+(x_vs_es_cero+x_i_es_cero)/2, distanciaejexdesdetop+210);
      }  
      
      
      
      //Funciones que incrementan un contador si la animación no está pausada.
      if(0.02*time>=6.2832){
              time=0;  
       }
      console.log("time= " + time);
      if(isPaused == false){
          time = time+1; // Update current time          
          animationId = requestAnimationFrame(draw_sinusoidal_functions.bind(null)); // Increment  time      
      }
      else{
          time = time; // Update current time
          animationId = requestAnimationFrame(draw_sinusoidal_functions.bind(null));
      }      
  }
  
  
  function drawArrow(fromX, fromY, toX, toY) {
  
}


function button_comenzar_pausar_click()
{
if(document.getElementById("button_comenzar_pausar_id").className=="activar_desactivar_activar")
  {
    isPaused = false;
    document.getElementById("button_comenzar_pausar_id").className="activar_desactivar_desactivar";
    document.getElementById("button_comenzar_pausar_id").innerHTML="Pause";
  }
  else
  {
    isPaused = true;    document.getElementById("button_comenzar_pausar_id").className="activar_desactivar_activar";
    document.getElementById("button_comenzar_pausar_id").innerHTML="Start";
  }  
}

   
    
    function advanceAnimation() {
      time=time+1;
      //draw_sinusoidal_functions(time +1); // Increment time by one step
    }
    
    function restartAnimation() {
      time=0;
      time=0;
    }
    
    function button_RLC_inductive_click(){
      document.getElementById("text_R_id").value="100";
      document.getElementById("unit_R_id").value = "ohm"
      document.getElementById("text_L_id").value="400";
      document.getElementById("unit_L_id").value = "mH"
      document.getElementById("text_C_id").value="4.7";
      document.getElementById("unit_C_id").value = "uF";
      document.getElementById("text_Vs_id").value = "100";
      document.getElementById("text_frequency_id").value = "1000";
      document.getElementById("unit_frequency_id").value = "rad/seg";
      actualizar_valores();
    }
    
    function button_RLC_capacitive_click(){
      document.getElementById("text_R_id").value="100";
      document.getElementById("unit_R_id").value = "ohm"
      document.getElementById("text_L_id").value="100";
      document.getElementById("unit_L_id").value = "mH"
      document.getElementById("text_C_id").value="4.7";
      document.getElementById("unit_C_id").value = "uF"
      document.getElementById("text_Vs_id").value = "100";
      document.getElementById("text_frequency_id").value = "1000";
      document.getElementById("unit_frequency_id").value = "rad/seg";
      actualizar_valores();
    }

  function button_resonacia_click(){
      document.getElementById("text_R_id").value="100";
      document.getElementById("unit_R_id").value = "ohm"
      document.getElementById("text_L_id").value="400";
      document.getElementById("unit_L_id").value = "mH"
      document.getElementById("text_C_id").value="10";
      document.getElementById("unit_C_id").value = "uF"
      document.getElementById("text_Vs_id").value = "100";
      document.getElementById("text_frequency_id").value = "500";
      document.getElementById("unit_frequency_id").value = "rad/seg";
      actualizar_valores();
}

  function button_resonacia_click(){
      document.getElementById("text_R_id").value="100";
      document.getElementById("unit_R_id").value = "ohm"
      document.getElementById("text_L_id").value="400";
      document.getElementById("unit_L_id").value = "mH"
      document.getElementById("text_C_id").value="10";
      document.getElementById("unit_C_id").value = "uF"
      document.getElementById("text_Vs_id").value = "100";
      document.getElementById("text_frequency_id").value = "500";
      document.getElementById("unit_frequency_id").value = "rad/seg";
      actualizar_valores();
}

function button_RL_click(){
      document.getElementById("text_R_id").value="100";
      document.getElementById("unit_R_id").value = "ohm"
      document.getElementById("text_L_id").value="400";
      document.getElementById("unit_L_id").value = "mH"
      document.getElementById("text_C_id").value="Infinity";
      document.getElementById("unit_C_id").value = "F"
      document.getElementById("text_Vs_id").value = "100";
      document.getElementById("text_frequency_id").value = "500";
      document.getElementById("unit_frequency_id").value = "rad/seg";
      actualizar_valores();
}

function button_RC_click(){
      document.getElementById("text_R_id").value="100";
      document.getElementById("unit_R_id").value = "ohm"
      document.getElementById("text_L_id").value="0";
      document.getElementById("unit_L_id").value = "uH"
      document.getElementById("text_C_id").value="10";
      document.getElementById("unit_C_id").value = "uF"
      document.getElementById("text_Vs_id").value = "100";
      document.getElementById("text_frequency_id").value = "500";
      document.getElementById("unit_frequency_id").value = "rad/seg";
      actualizar_valores();
}







