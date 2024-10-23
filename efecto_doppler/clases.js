class Onda_emisor 
{
  constructor()
  {
    this.mi_canvas = document.getElementById("rectangle_area");
    this.canvas_area= this.mi_canvas.getContext("2d");
    this.radio=Number(10000);
    this.x=coordenada_x_emisor;
    this.y=coordenada_y; 
    this.canvas_area.strokeStyle = "blue";
    this.choca_al_receptor_state=false;
  }
  dibujar()
  {
    this.x=this.x+velocidad_viento*0.004;    
    this.radio=this.radio + 5;
    this.canvas_area.beginPath();
    this.canvas_area.strokeStyle = "blue";
    this.canvas_area.arc(this.x,this.y,this.radio,0,2*Math.PI); 
    this.canvas_area.stroke();        
    this.choca_al_receptor();
  }
  choca_al_receptor()
  {
    if(this.choca_al_receptor_state==false)
    {
      if( (this.x+this.radio)>(coordenada_x_receptor-3) && (this.x+this.radio)<(coordenada_x_receptor+3) )
      {
        //canvas_area.fillStyle = "red";
        //canvas_area.fillRect(coordenada_x_receptor, coordenada_y, ancho, alto);
        onda_emisor_choco_receptor();
        this.choca_al_receptor_state=true;
      }
      if( (this.x-this.radio)>(coordenada_x_receptor-3) && (this.x-this.radio)<(coordenada_x_receptor+3) )
      {
        //canvas_area.fillStyle = "yellow";
        //canvas_area.fillRect(coordenada_x_receptor, coordenada_y, ancho, alto);
        onda_emisor_choco_receptor();
        this.choca_al_receptor_state=true;
      }
    }  
  }
  resetear()
  {
    this.radio=0;
    this.x=coordenada_x_emisor;
    this.y=coordenada_y; 
    this.choca_al_receptor_state=false;
  }
  reiniciar()
  {
    this.radio=Number(10000);  
  }
}

class Onda_receptor 
{
  constructor()
  {
    this.mi_canvas = document.getElementById("rectangle_area");
    this.canvas_area= this.mi_canvas.getContext("2d");
    this.radio=Number(10000);
    this.x=coordenada_x_receptor;
    this.y=coordenada_y; 
  }
  dibujar()
  {
    this.x=this.x+velocidad_viento*0.004;    
    this.radio=this.radio + 5;
    this.canvas_area.beginPath();
    this.canvas_area.strokeStyle = "purple";
    this.canvas_area.arc(this.x,this.y,this.radio,0,2*Math.PI); 
    this.canvas_area.stroke();        
  }
  resetear()
  {
    this.radio=0;
    this.x=coordenada_x_receptor;
    this.y=coordenada_y; 
  }
  reiniciar()
  {
    this.radio=Number(10000);  
  }
}

  
