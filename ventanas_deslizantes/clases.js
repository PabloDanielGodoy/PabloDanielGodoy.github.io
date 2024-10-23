class Paquete {
  constructor(numero_paquete,estado_inicial,estado_buffer_receptor_inicial)
  {
    this.numero_paquete=numero_paquete;
    this.estado=estado_inicial;
    /*Posibles estados:
    agregando_al_buffer
    fuera_de_buffer_emisor
    en_buffer_emisor
    en_viaje
    en_destino
    en_destino_y_reenviado  //primero llego a destino y luego se reenvio
    reenviado_y_en_destino  //primero se reenvio y luego llego a destino
    reconocido
    reconocido_y_reenviado  (El paquete fue reenviado y estaba en viaje cuando llegó un reconocimiento)
    reenviado_y_reconocido
    reenviado
    perdido
    */
    this.estado_buffer_receptor=estado_buffer_receptor_inicial;
    /*
    fuera_de_buffer_receptor
    quitando_del_buffer_receptor
    en_buffer_receptor
    esperando_paquete (en ventana receptor)
    paquete_invalido
    */
    this.mi_canvas = document.getElementById("rectangle_area");
    this.canvas_area= this.mi_canvas.getContext("2d");
    this.reenvioContador_inicial=reenvioContador_inicial;
    this.reenvioContador=this.reenvioContador_inicial;         
    this.color = "blue";
    this.ancho_paquetes_contenedor = ancho_paquetes + 2*margen_buffers;
    this.step_delay = step_delay_paquetes;
    this.timers_delay = timers_delay_paquetes;
    this.step_paso = step_paso_paquetes;
    this.packet_coordenada_x_inicial = (this.numero_paquete-desplazamiento)*(this.ancho_paquetes_contenedor) + margen_buffers;
    this.packet_coordenada_x = this.packet_coordenada_x_inicial;
    this.packet_coordenada_y_inicial= packet_coordenada_y_inicial_buffer_emisor;
    this.packet_coordenada_y_final=packet_coordenada_y_final_buffer_receptor;
    this.packet_coordenada_y=this.packet_coordenada_y_inicial;
    this.packet2_coordenada_y=-1; //si vale -1, el paquete 2 no existe
    this.stepTimer_en_marcha=false;
    this.reenvioTimer_en_marcha=false;
    this.en_pausa_activada=false;
    this.estado_buffer_receptor_antes_de_invalido;
  }
  
  agregar_paquete()
  {
    this.packet_coordenada_y=0;
    this.estado="agregando_al_buffer";
    this.stepTimer_agregar = setInterval(this.stepTimer_agregar_Callback,20,this);      
  }
  
  stepTimer_agregar_Callback(paquete)
  {
    this.paquete = paquete;
    this.paquete.packet_coordenada_y=this.paquete.packet_coordenada_y+this.paquete.step_paso;
    if(this.paquete.packet_coordenada_y>=this.paquete.packet_coordenada_y_inicial)
    {
      clearInterval(this.paquete.stepTimer_agregar);
      this.paquete.packet_coordenada_y=this.paquete.packet_coordenada_y_inicial;
      this.paquete.packet2_coordenada_y=-1; //si vale -1, el paquete 2 no existe
      this.paquete.estado="en_buffer_emisor";
      this.paquete.estado_buffer_receptor="fuera_de_buffer_receptor";
     }
    this.paquete.dibujar();
  }  

  quitar_paquete()
  {
    this.packet_coordenada_y_quitando=this.packet_coordenada_y_final;
    this.estado_buffer_receptor="quitando_del_buffer_receptor";
    this.stepTimer_quitar = setInterval(this.stepTimer_quitar_Callback,20,this);      
  }
  
  stepTimer_quitar_Callback(paquete)
  {
    this.paquete = paquete;
    this.paquete.packet_coordenada_y_quitando=this.paquete.packet_coordenada_y_quitando+this.paquete.step_paso;
    if(this.paquete.packet_coordenada_y_quitando>(canvas_heigth+this.paquete.step_paso))
    {
      this.paquete.estado_buffer_receptor="fuera_de_buffer_receptor";
      this.paquete.dibujar();
      clearInterval(this.paquete.stepTimer_quitar); 
      paquetes_totales_recibidos=paquetes_totales_recibidos+1;
    }
    this.paquete.dibujar();
  }  

  enviar_paquete()
  {
//    console.log("enviando .Estado: "+this.estado);
    this.reenvioContador = this.reenvioContador_inicial;    
    if(this.estado=="en_destino_y_reenviado")  /*YA REVISADA*/
    {
      this.stepTimer = setInterval(this.stepTimer_Callback,this.step_delay,this);
      this.stepTimer_en_marcha=true;
      this.reenvioTimer = setInterval(this.reenvioTimer_Callback,this.timers_delay,this);
      this.reenvioTimer_en_marcha=true;
    }
    else if(this.estado=="en_buffer_emisor")  /*YA REVISADA*/
    {
      this.estado="en_viaje";
      this.stepTimer = setInterval(this.stepTimer_Callback,this.step_delay,this);
      this.stepTimer_en_marcha=true;
      this.reenvioTimer = setInterval(this.reenvioTimer_Callback,this.timers_delay,this);
      this.reenvioTimer_en_marcha=true;
    }  
    else if(this.estado=="reenviado_y_en_destino")
    {
      this.reenvioTimer = setInterval(this.reenvioTimer_Callback,this.timers_delay,this);
      this.reenvioTimer_en_marcha=true;      
    }
    else if(this.estado=="reconocido")
    {
    }
    else if(this.estado=="reconocido_y_reenviado")
    {
    }
    else if(this.estado=="reenviado") /*YA REVISADA*/
    {
      this.reenvioTimer = setInterval(this.reenvioTimer_Callback,this.timers_delay,this);
      this.reenvioTimer_en_marcha=true;
    }    
    else if(this.estado=="perdido_reenviado")  /*YA REVISADA*/
    {
      this.stepTimer = setInterval(this.stepTimer_Callback,this.step_delay,this);
      this.stepTimer_en_marcha=true;
      this.reenvioTimer = setInterval(this.reenvioTimer_Callback,this.timers_delay,this);
      this.reenvioTimer_en_marcha=true;
    }  

  }
  
  stepTimer_Callback(paquete)
  {
    this.paquete = paquete;
    this.paquete.packet_coordenada_y=this.paquete.packet_coordenada_y+this.paquete.step_paso;
    if(this.paquete.packet2_coordenada_y!=-1)
    {
      this.paquete.packet2_coordenada_y=this.paquete.packet2_coordenada_y+this.paquete.step_paso;
    }
    /*Verificamos si el paquete se perdio*/
    if(this.paquete.estado=="perdido")
    {
      if(this.paquete.packet_coordenada_y>=this.paquete.packet_coordenada_y_final/2)
      {
      clearInterval(this.paquete.stepTimer);
      this.paquete.stepTimer_en_marcha=false;
      }
    }      
    /*Verificamos si el paquete llego a destino*/
    if(this.paquete.packet_coordenada_y>=this.paquete.packet_coordenada_y_final + this.paquete.step_paso)
    {
      if(ventana_receptor.verificar_si_esta_en_ventana(this.paquete.numero_paquete)==false)
      {
        //clearInterval(this.paquete.stepTimer);
        //this.paquete.stepTimer_en_marcha=false;
        //this.paquete.packet_coordenada_y=this.paquete.packet_coordenada_y_inicial;
        //this.paquete.packet2_coordenada_y=-1; 
        this.paquete.setear_paquete_invalido();
      }

      if(this.paquete.estado=="en_viaje" || this.paquete.estado=="perdido_reenviado" &&
        ventana_receptor.verificar_si_esta_en_ventana(this.paquete.numero_paquete)==true)   
      {
        this.paquete.estado="en_destino";
        this.paquete.estado_buffer_receptor="en_buffer_receptor";
        clearInterval(this.paquete.stepTimer);
        this.paquete.stepTimer_en_marcha=false;
        this.paquete.packet_coordenada_y=this.paquete.packet_coordenada_y_inicial;        
        paquete_llego_al_receptor(this.paquete.numero_paquete);        
      }  //Despues de esta condicion, no puede haber una en_destino     
      else if(this.paquete.estado=="reconocido_y_reenviado") 
      {
        clearInterval(this.paquete.stepTimer);
        this.paquete.stepTimer_en_marcha=false;
        this.paquete.estado="reconocido";
        if(this.paquete.estado_buffer_receptor!="fuera_de_buffer_receptor" && this.paquete.estado_buffer_receptor!="paquete_invalido")
        {
          this.paquete.estado_buffer_receptor="en_buffer_receptor";
        }
        this.paquete.packet_coordenada_y=this.paquete.packet_coordenada_y_inicial;
      }
      else if(this.paquete.estado=="reenviado")
      {
        this.paquete.estado="reenviado_y_en_destino";
        if(this.paquete.estado_buffer_receptor!="paquete_invalido")
        {
          this.paquete.estado_buffer_receptor="en_buffer_receptor";
        }
        paquete_llego_al_receptor(this.paquete.numero_paquete);    
        this.paquete.packet_coordenada_y=this.paquete.packet2_coordenada_y+this.paquete.step_paso; 
        this.paquete.packet2_coordenada_y=-1; 
      }
      else if(this.paquete.estado=="en_destino_y_reenviado")
      {
        clearInterval(this.paquete.stepTimer);
        this.paquete.stepTimer_en_marcha=false;
        paquete_llego_al_receptor(this.paquete.numero_paquete); 
        this.paquete.packet_coordenada_y=this.paquete.packet_coordenada_y_inicial;
        this.paquete.packet2_coordenada_y=-1;      
        this.paquete.estado="en_destino";
        if(this.paquete.estado_buffer_receptor!="fuera_de_buffer_receptor" && this.paquete.estado_buffer_receptor!="paquete_invalido" &&
          ventana_receptor.verificar_si_esta_en_ventana(this.paquete.numero_paquete)==true)
        {
          this.paquete.estado_buffer_receptor="en_buffer_receptor";
        }
      }    
      else if(this.paquete.estado=="reenviado_y_en_destino")
      {
        this.paquete.estado="reenviado_y_en_destino";
        if(this.paquete.estado_buffer_receptor!="fuera_de_buffer_receptor" && this.paquete.estado_buffer_receptor!="paquete_invalido")
        {
          this.paquete.estado_buffer_receptor="en_buffer_receptor";
        }
        paquete_llego_al_receptor(this.paquete.numero_paquete);    
        this.paquete.packet_coordenada_y=this.paquete.packet2_coordenada_y+this.paquete.step_paso; 
        this.paquete.packet2_coordenada_y=-1; 
      }  
      else if(this.paquete.estado=="reenviado_y_reconocido")  
      {
        if(this.paquete.estado_buffer_receptor!="fuera_de_buffer_receptor" && this.paquete.estado_buffer_receptor!="paquete_invalido")
        {
          this.paquete.estado_buffer_receptor="en_buffer_receptor";
        }
        if(this.paquete.packet2_coordenada_y!=-1)
        {
          paquete_llego_al_receptor(this.paquete.numero_paquete);    
          this.paquete.packet_coordenada_y=this.paquete.packet2_coordenada_y+this.paquete.step_paso; 
          this.paquete.packet2_coordenada_y=-1; 
          this.paquete.estado="reenviado_y_reconocido";
        }
        else
        {
          paquete_llego_al_receptor(this.paquete.numero_paquete);    
          clearInterval(this.paquete.stepTimer);
          this.paquete.stepTimer_en_marcha=false;
          this.paquete.estado="reconocido";        
        }
      }
      else if(this.paquete.estado=="reconocido")   /*YA REVISADA*/
      {
        this.paquete.estado="reconocido";
        this.paquete.estado_buffer_receptor="en_buffer_receptor";
        if(this.paquete.estado_buffer_receptor!="fuera_de_buffer_receptor" && this.paquete.estado_buffer_receptor!="paquete_invalido")
        {
          this.paquete.estado_buffer_receptor="en_buffer_receptor";
        }
        clearInterval(this.paquete.stepTimer);
        this.paquete.stepTimer_en_marcha=false;
        this.paquete.packet_coordenada_y=this.paquete.packet_coordenada_y_inicial;        
        paquete_llego_al_receptor(this.paquete.numero_paquete);        
      }  //Despues de esta condicion, no puede haber una en_destino     
      
    }
    this.paquete.dibujar();
  }
  
  reenvioTimer_Callback(paquete){
    this.paquete=paquete;
    this.paquete.reenvioContador=this.paquete.reenvioContador-1;
    if(this.paquete.reenvioContador<1)
    {
      clearInterval(this.paquete.reenvioTimer);
      this.paquete.reenvioTimer_en_marcha=false;
      if(this.paquete.estado=="reconocido")  /*YA REVISADA*/
      {
      }  
      else if(this.paquete.estado=="en_destino")  /*YA REVISADA*/
      {
        this.paquete.estado="en_destino_y_reenviado";
        this.paquete.packet_coordenada_y=this.paquete.packet_coordenada_y_inicial;
        paquetes_list[this.paquete.numero_paquete].enviar_paquete();
        this.paquete.packet2_coordenada_y=-1;      
      }
      else if(this.paquete.estado=="en_viaje")   /*YA REVISADA*/
      {
        this.paquete.estado="reenviado";
        this.paquete.packet2_coordenada_y=this.paquete.packet_coordenada_y_inicial;
        paquetes_list[this.paquete.numero_paquete].enviar_paquete();
      }  
      else if(this.paquete.estado=="en_destino_y_reenviado")  /*YA REVISADA*/
      {
        this.paquete.estado="reenviado_y_en_destino";
        this.paquete.packet2_coordenada_y=this.paquete.packet_coordenada_y_inicial;
        paquetes_list[this.paquete.numero_paquete].enviar_paquete();
      }

      else if(this.paquete.estado=="perdido")  
      {
        this.paquete.estado="perdido_reenviado";
        this.paquete.packet_coordenada_y=this.paquete.packet_coordenada_y_inicial;
        paquetes_list[this.paquete.numero_paquete].enviar_paquete();
      }  

      else if(this.paquete.estado=="perdido_reenviado")  
      {
        this.paquete.estado="reenviado";
        this.paquete.packet2_coordenada_y=this.paquete.packet_coordenada_y_inicial;
        paquetes_list[this.paquete.numero_paquete].enviar_paquete();
      }  

      else if(this.paquete.estado=="reenviado_y_en_destino")  /*YA REVISADA*/
      {
        
        this.paquete.estado="reenviado_y_en_destino";
        this.paquete.packet2_coordenada_y=this.paquete.packet_coordenada_y_inicial;
        paquetes_list[this.paquete.numero_paquete].enviar_paquete();
      }
      else if(this.paquete.estado=="reenviado_y_reconocido")
      {
        this.paquete.estado="reenviado_y_reconocido";
      }     
      else if(this.paquete.estado=="reconocido_y_reenviado")
      {
        this.paquete.estado="reenviado_y_reconocido";
      }
    }      
    if(this.paquete.estado=="en_destino" || this.paquete.estado=="en_destino_y_reenviado" || this.paquete.stepTimer_en_marcha==false)
    {
      this.paquete.dibujar();     
    }
  }
  
  dibujar(){
    //dibujamos los buffers
    this.dibujar_cuadro_buffer_inferior();  
    this.dibujar_cuadro_buffer_superior(); 
    
    if(this.estado=="agregando_al_buffer")
    {
      this.canvas_area.clearRect(this.packet_coordenada_x, this.packet_coordenada_y-this.step_paso,
        ancho_paquetes, alto_paquetes);
      this.my_gradient=this.canvas_area.createLinearGradient(this.packet_coordenada_x+ancho_paquetes/2, 
        this.packet_coordenada_y + alto_paquetes, this.packet_coordenada_x+ancho_paquetes/2, this.packet_coordenada_y);
      this.my_gradient.addColorStop(0, this.color);
      this.my_gradient.addColorStop(1, "white");
      this.canvas_area.fillStyle = this.my_gradient;
      this.canvas_area.fillRect(this.packet_coordenada_x, this.packet_coordenada_y, ancho_paquetes, alto_paquetes);
      this.canvas_area.strokeRect(this.packet_coordenada_x+this.canvas_area.lineWidth*0.5,
        this.packet_coordenada_y+this.canvas_area.lineWidth*0.5, ancho_paquetes-this.canvas_area.lineWidth,
        alto_paquetes-this.canvas_area.lineWidth);      
    }
    else if(this.estado=="fuera_de_buffer_emisor")
    {
      this.canvas_area.fillStyle = "white";
      this.canvas_area.fillRect(this.packet_coordenada_x, this.packet_coordenada_y, ancho_paquetes, alto_paquetes);
      this.canvas_area.strokeRect(this.packet_coordenada_x+this.canvas_area.lineWidth*0.5,
        this.packet_coordenada_y+this.canvas_area.lineWidth*0.5, ancho_paquetes-
        this.canvas_area.lineWidth,alto_paquetes-this.canvas_area.lineWidth);
     }
    else if(this.estado=="en_buffer_emisor")
    {
      this.canvas_area.fillStyle = this.color;
      this.canvas_area.fillRect(this.packet_coordenada_x, this.packet_coordenada_y, ancho_paquetes, alto_paquetes);
      this.canvas_area.strokeRect(this.packet_coordenada_x+this.canvas_area.lineWidth*0.5,
        this.packet_coordenada_y+this.canvas_area.lineWidth*0.5, ancho_paquetes-
        this.canvas_area.lineWidth,alto_paquetes-this.canvas_area.lineWidth);
      this.escribir_caracter(this.numero_paquete,this.packet_coordenada_x,this.packet_coordenada_y);
    }
    else if(this.estado=="en_destino")
    {
    /*Dibujamos temporizador en buffer emisor*/
      this.canvas_area.fillStyle = "gray";
      this.canvas_area.fillRect(this.packet_coordenada_x, this.packet_coordenada_y_inicial, ancho_paquetes, alto_paquetes);
      this.canvas_area.strokeRect(this.packet_coordenada_x+this.canvas_area.lineWidth*0.5,
        this.packet_coordenada_y_inicial+this.canvas_area.lineWidth*0.5, ancho_paquetes-this.canvas_area.lineWidth,
        alto_paquetes-this.canvas_area.lineWidth);
      this.canvas_area.fillStyle = "red";
      this.canvas_area.font = "bold 15px Arial";
      this.canvas_area.fillText(this.reenvioContador,this.packet_coordenada_x + 4, this.packet_coordenada_y_inicial+alto_paquetes-5);
      this.escribir_caracter(this.numero_paquete,this.packet_coordenada_x,this.packet_coordenada_y_inicial);
    }
    else if(this.estado=="en_viaje" || this.estado=="en_destino_y_reenviado" || this.estado=="reenviado" ||
      this.estado=="reenviado_y_en_destino" || this.estado=="perdido" || this.estado=="perdido_reenviado")
    {      
      /*Dibujamos paquete principal en tránsito*/         
      this.canvas_area.clearRect(this.packet_coordenada_x, this.packet_coordenada_y-this.step_paso,
        ancho_paquetes, alto_paquetes);
//      this.canvas_area.fillStyle = "blue";
      this.my_gradient=this.canvas_area.createLinearGradient(this.packet_coordenada_x+ancho_paquetes/2, 
        this.packet_coordenada_y + alto_paquetes, this.packet_coordenada_x+ancho_paquetes/2, this.packet_coordenada_y);
      this.my_gradient.addColorStop(0, this.color);
      this.my_gradient.addColorStop(1, "white");
      this.canvas_area.fillStyle = this.my_gradient;
      this.canvas_area.fillRect(this.packet_coordenada_x, this.packet_coordenada_y, ancho_paquetes, alto_paquetes);
      this.canvas_area.strokeRect(this.packet_coordenada_x+this.canvas_area.lineWidth*0.5,
        this.packet_coordenada_y+this.canvas_area.lineWidth*0.5, ancho_paquetes-this.canvas_area.lineWidth,
        alto_paquetes-this.canvas_area.lineWidth);
      /*Dibujamos la R*/
      if(this.estado=="en_destino_y_reenviado" || this.estado=="reenviado_y_en_destino" || this.estado=="reenviado" ||
         this.estado=="perdido_reenviado")
      {
        this.canvas_area.fillStyle = "black";
        this.canvas_area.font = paquetes_fuente;
        this.canvas_area.fillText("R",this.packet_coordenada_x + ancho_paquetes/2-6, this.packet_coordenada_y+alto_paquetes/2);  
      }
      /*Dibujamos paquete 2 en tránsito*/
      if(this.packet2_coordenada_y!=-1)
      {                 
        this.canvas_area.clearRect(this.packet_coordenada_x, this.packet2_coordenada_y-this.step_paso,
          ancho_paquetes, alto_paquetes);
//        this.canvas_area.fillStyle = this.color;
        this.my_gradient=this.canvas_area.createLinearGradient(this.packet_coordenada_x+ancho_paquetes/2, 
          this.packet2_coordenada_y + alto_paquetes, this.packet_coordenada_x+ancho_paquetes/2, this.packet_coordenada_y);
        this.my_gradient.addColorStop(0, this.color);
        this.my_gradient.addColorStop(1, "white");
        this.canvas_area.fillStyle = this.my_gradient;
        this.canvas_area.fillRect(this.packet_coordenada_x, this.packet2_coordenada_y, ancho_paquetes, alto_paquetes);
        this.canvas_area.strokeRect(this.packet_coordenada_x+this.canvas_area.lineWidth*0.5,
          this.packet2_coordenada_y+this.canvas_area.lineWidth*0.5, ancho_paquetes-this.canvas_area.lineWidth,
          alto_paquetes-this.canvas_area.lineWidth);
        /*Dibujamos la R*/
        this.canvas_area.fillStyle = "black";
        this.canvas_area.font = paquetes_fuente;
        this.escribir_caracter("R",this.packet_coordenada_x + ancho_paquetes/2-6, this.packet2_coordenada_y+alto_paquetes/2-6);
      }    
      /*Dibujamos temporizador en buffer emisor*/
      this.canvas_area.fillStyle = "gray";
      this.canvas_area.fillRect(this.packet_coordenada_x, this.packet_coordenada_y_inicial, ancho_paquetes, alto_paquetes);
      this.canvas_area.strokeRect(this.packet_coordenada_x+this.canvas_area.lineWidth*0.5,
        this.packet_coordenada_y_inicial+this.canvas_area.lineWidth*0.5, ancho_paquetes-this.canvas_area.lineWidth, 
        alto_paquetes-this.canvas_area.lineWidth);
      this.canvas_area.fillStyle = "red";
      this.canvas_area.font = "bold 15px Arial";
      this.canvas_area.fillText(this.reenvioContador,this.packet_coordenada_x + 4, this.packet_coordenada_y_inicial+alto_paquetes-5);
      this.escribir_caracter(this.numero_paquete,this.packet_coordenada_x,this.packet_coordenada_y_inicial);
      /*Dibujamos LOSS*/
      if(this.estado=="perdido" && this.stepTimer_en_marcha==false)
      {
        this.canvas_area.clearRect(this.packet_coordenada_x, this.packet_coordenada_y, ancho_paquetes, alto_paquetes);
        this.canvas_area.fillStyle = "red";
        this.canvas_area.font = "bold 14px Arial";
        this.canvas_area.fillText("Lost",this.packet_coordenada_x, this.packet_coordenada_y+alto_paquetes-2);
      }      
    }
    else if(this.estado=="reconocido" || this.estado=="reconocido_y_reenviado" || this.estado=="reenviado_y_reconocido")
    { 
      if(this.estado=="reconocido_y_reenviado" || this.estado=="reenviado_y_reconocido")
      {
        /*Dibujamos paquete en tránsito*/
        this.canvas_area.clearRect(this.packet_coordenada_x, this.packet_coordenada_y-this.step_paso,
          ancho_paquetes, alto_paquetes);
//        this.canvas_area.fillStyle = this.color;
        this.my_gradient=this.canvas_area.createLinearGradient(this.packet_coordenada_x+ancho_paquetes/2, 
        this.packet_coordenada_y + alto_paquetes, this.packet_coordenada_x+ancho_paquetes/2, this.packet_coordenada_y);
        this.my_gradient.addColorStop(0, this.color);
        this.my_gradient.addColorStop(1, "white");
        this.canvas_area.fillStyle = this.my_gradient;
        this.canvas_area.fillRect(this.packet_coordenada_x, this.packet_coordenada_y, ancho_paquetes, alto_paquetes);
        this.canvas_area.strokeRect(this.packet_coordenada_x+this.canvas_area.lineWidth*0.5,
          this.packet_coordenada_y+this.canvas_area.lineWidth*0.5, ancho_paquetes-this.canvas_area.lineWidth,
          alto_paquetes-this.canvas_area.lineWidth);
        /*Dibujamos la R*/
       //escribir_caracter(caracter,x,y)
        this.escribir_caracter("R",this.packet_coordenada_x,this.packet_coordenada_y);  
      }  
      /*pintando paquetes superiores*/
      this.canvas_area.fillStyle = "green";
      this.x = this.packet_coordenada_x;
      this.y = this.packet_coordenada_y_inicial;
      this.canvas_area.fillRect(this.x, this.y, ancho_paquetes, alto_paquetes);
      this.canvas_area.strokeRect(this.x+this.canvas_area.lineWidth*0.5,
        this.y+this.canvas_area.lineWidth*0.5, ancho_paquetes-this.canvas_area.lineWidth, alto_paquetes-
        this.canvas_area.lineWidth);    
      this.escribir_caracter(this.numero_paquete,this.x, this.y);  
    }       
    
    if(this.estado_buffer_receptor=="quitando_del_buffer_receptor")
    {
      this.x = this.packet_coordenada_x;        
      this.y = this.packet_coordenada_y_quitando;
      this.canvas_area.clearRect(this.x, this.y-this.step_paso, ancho_paquetes, alto_paquetes);
//      this.canvas_area.fillStyle = this.color;
      this.my_gradient=this.canvas_area.createLinearGradient(this.x+ancho_paquetes/2, this.y + alto_paquetes,
        this.x+ancho_paquetes/2, this.y);
      this.my_gradient.addColorStop(0, this.color);
      this.my_gradient.addColorStop(1, "white");
      this.canvas_area.fillStyle = this.my_gradient;
      this.canvas_area.fillRect(this.x, this.y, ancho_paquetes, alto_paquetes);
      this.canvas_area.strokeRect(this.x+this.canvas_area.lineWidth*0.5,
        this.y+this.canvas_area.lineWidth*0.5, ancho_paquetes-this.canvas_area.lineWidth,alto_paquetes-this.canvas_area.lineWidth);      
    }
    else if(this.estado_buffer_receptor=="en_buffer_receptor") 
    {
      this.x = this.packet_coordenada_x;        
      this.y = this.packet_coordenada_y_final;
      this.canvas_area.fillStyle = "blue";
      this.canvas_area.fillRect(this.x, this.y, ancho_paquetes, alto_paquetes);
      this.canvas_area.strokeRect(this.x+this.canvas_area.lineWidth*0.5,
        this.y+this.canvas_area.lineWidth*0.5, ancho_paquetes- this.canvas_area.lineWidth, alto_paquetes-
        this.canvas_area.lineWidth);
      this.escribir_caracter(this.numero_paquete,this.x,this.y);  

    }
    else if(this.estado_buffer_receptor=="fuera_de_buffer_receptor") 
    {
      this.x = this.packet_coordenada_x;        
      this.y = this.packet_coordenada_y_final;
      this.canvas_area.fillStyle = "white";
      this.canvas_area.fillRect(this.x, this.y, ancho_paquetes, alto_paquetes);
      this.canvas_area.strokeRect(this.x+this.canvas_area.lineWidth*0.5,
        this.y+this.canvas_area.lineWidth*0.5, ancho_paquetes- this.canvas_area.lineWidth, alto_paquetes-
        this.canvas_area.lineWidth);
    }
    else if(this.estado_buffer_receptor=="esperando_paquete") 
    {
      this.y = this.packet_coordenada_y_final;
      this.canvas_area.fillStyle = "silver";
      this.canvas_area.fillRect(this.packet_coordenada_x, this.y, ancho_paquetes, alto_paquetes);
      this.canvas_area.strokeRect(this.packet_coordenada_x+this.canvas_area.lineWidth*0.5,
        this.y+this.canvas_area.lineWidth*0.5, ancho_paquetes-
        this.canvas_area.lineWidth,alto_paquetes-this.canvas_area.lineWidth);
    }
    else if(this.estado_buffer_receptor=="paquete_invalido")
    {
      this.x = this.packet_coordenada_x;        
      this.y = this.packet_coordenada_y_final;
      this.canvas_area.fillStyle = "blue";
      this.canvas_area.fillRect(this.x, this.y, ancho_paquetes, alto_paquetes);
      this.canvas_area.strokeRect(this.x+this.canvas_area.lineWidth*0.5,
        this.y+this.canvas_area.lineWidth*0.5, ancho_paquetes- this.canvas_area.lineWidth, alto_paquetes-
        this.canvas_area.lineWidth);
      this.canvas_area.fillStyle = "red";
      this.canvas_area.font = "bold 45px Arial";
      this.canvas_area.fillText("X",this.packet_coordenada_x, this.y+alto_paquetes/2+15);
      
      if(this.estado_buffer_receptor_antes_de_invalido=="quitando_del_buffer_receptor")
        {
        this.x = this.packet_coordenada_x;        
        this.y = this.packet_coordenada_y_quitando;
        this.canvas_area.clearRect(this.x, this.y-this.step_paso, ancho_paquetes, alto_paquetes);
        this.my_gradient=this.canvas_area.createLinearGradient(this.x+ancho_paquetes/2, this.y + alto_paquetes,
        this.x+ancho_paquetes/2, this.y);
        this.my_gradient.addColorStop(0, this.color);
        this.my_gradient.addColorStop(1, "white");
        this.canvas_area.fillStyle = this.my_gradient;
        this.canvas_area.fillRect(this.x, this.y, ancho_paquetes, alto_paquetes);
        this.canvas_area.strokeRect(this.x+this.canvas_area.lineWidth*0.5,
        this.y+this.canvas_area.lineWidth*0.5, ancho_paquetes-this.canvas_area.lineWidth,alto_paquetes-this.canvas_area.lineWidth);     
      }    
    }     
    if(inicializacion_finalizada==true)
    {
    ventana_emisor.dibujar();
    ventana_receptor.dibujar();
    }
  } //Fin funcion dibujar
  
  dibujar_cuadro_buffer_superior()
  {
    let x = this.packet_coordenada_x;        
    let y=this.packet_coordenada_y_inicial-margen_buffers;	
    if(this.estado=="en_buffer_emisor" || this.estado=="en_viaje" || this.estado=="en_destino" || 
      this.estado=="en_destino_y_reenviado" || this.estado=="reenviado_y_en_destino" || this.estado=="reenviado" ||
      this.estado=="perdido" || this.estado=="perdido_reenviado")
    {
      this.canvas_area.fillStyle = "DarkKhaki";
    }
    else if(this.estado=="reconocido" || this.estado=="reconocido_y_reenviado" || this.estado=="reenviado_y_reconocido" ||
      this.estado=="fuera_de_buffer_emisor")
    {
      this.canvas_area.fillStyle = "white";
    }   
    this.canvas_area.fillRect(x-margen_buffers, y, margen_buffers, alto_paquetes+2*margen_buffers);   //izquierda
    this.canvas_area.fillRect(x, y, ancho_paquetes,margen_buffers);   //superior  
    this.canvas_area.fillRect(x, y + alto_paquetes+margen_buffers, ancho_paquetes,margen_buffers);//inferior  
    this.canvas_area.fillRect(x+ancho_paquetes, y, margen_buffers, alto_paquetes+2*margen_buffers); //derecho   
  } 

  dibujar_cuadro_buffer_inferior()
  {
    if(this.estado_buffer_receptor=="en_buffer_receptor" || this.estado_buffer_receptor=="esperando_paquete")
    {
      this.canvas_area.fillStyle = "DarkKhaki";
    }
    else if(this.estado_buffer_receptor=="fuera_de_buffer_receptor" || this.estado_buffer_receptor=="paquete_invalido" ||
      this.estado_buffer_receptor=="quitando_del_buffer_receptor")
    {
      this.canvas_area.fillStyle = "white";
    } 
    let x = this.packet_coordenada_x;        
    let y=this.packet_coordenada_y_final-margen_buffers;	
    //let y=200;
    this.canvas_area.fillRect(x-margen_buffers, y, margen_buffers, alto_paquetes+2*margen_buffers);   //izquierda
    this.canvas_area.fillRect(x, y, ancho_paquetes,margen_buffers);   //superior  
    this.canvas_area.fillRect(x, y + alto_paquetes+margen_buffers, ancho_paquetes,margen_buffers);//inferior  
    this.canvas_area.fillRect(x+ancho_paquetes, y, margen_buffers, alto_paquetes+2*margen_buffers); //derecho   
  } 
  
  setear_paquete_invalido()
  {
    this.estado_buffer_receptor_antes_de_invalido=this.estado_buffer_receptor;
    this.estado_buffer_receptor="paquete_invalido";
    setTimeout(cambiar_estado_buffer_receptor,2000,this.numero_paquete,this.estado_buffer_receptor_antes_de_invalido);
  }
  
  desplazar()
  {
    if(desplazamiento>buffers_numero_maximo)
    { 
      desplazamiento=0;
    }
    var aux=(this.numero_paquete-desplazamiento)*(this.ancho_paquetes_contenedor) + margen_buffers;
    if(aux<0)
    {
      aux=this.ancho_paquetes_contenedor*(buffers_numero_maximo-desplazamiento)+(this.numero_paquete+1)*this.ancho_paquetes_contenedor +
        margen_buffers;
    }
    this.packet_coordenada_x=aux;    
  }

  desplazar1()
  {
    let x=this.packet_coordenada_x-10;
    if(x<=(0-ancho_paquetes-margen_buffers))
    {
      x=buffers_numero_maximo*(this.ancho_paquetes_contenedor) + margen_buffers;  
      //this.reiniciar();
    }
//    if(this.numero_paquete==24 || this.numero_paquete==25 || this.numero_paquete==0)
//    {
//      console.log(this.numero_paquete + " " + x);
//    }
    this.packet_coordenada_x=x;  
  }


  escribir_caracter(caracter,x,y)
  {
    this.canvas_area.fillStyle = "black";
    this.canvas_area.font = paquetes_fuente;;
    if(this.numero_paquete<10){
      this.canvas_area.fillText(caracter,x + 8, y + alto_paquetes/2);
    }
    else{
      this.canvas_area.fillText(caracter, x + 4, y +alto_paquetes/2);
    }
  }

  reiniciar()
  {
    this.estado="fuera_de_buffer_emisor";
    this.estado_buffer_receptor="fuera_de_buffer_receptor";
    this.packet_coordenada_y=this.packet_coordenada_y_inicial;
    this.packet2_coordenada_y=-1; //si vale -1, el paquete 2 no existe
  }
  set_perdido()
  {
    if(this.estado=="en_viaje")
    {
      this.estado="perdido";
      this.estado_buffer_receptor=="esperando_paquete";
    }  
  }
  
  pausar()
  {
    if(this.en_pausa_activada==false)
    {
      this.en_pausa_activada=true; 
      if(
          this.estado=="en_viaje" || this.estado=="en_destino_y_reenviado" || this.estado=="reenviado_y_en_destino" ||
          this.estado=="reconocido_y_reenviado" || this.estado=="reenviado_y_reconocido" || this.estado=="reenviado"||
          this.estado=="en_destino" || this.estado=="perdido"
        )
      {      
        if(this.reenvioTimer_en_marcha==true)
        {
          clearInterval(this.reenvioTimer);
          this.reenvioTimer_en_marcha=false;
        }  
      }
      if(
          this.estado=="en_viaje" || this.estado=="en_destino_y_reenviado" || this.estado=="reenviado_y_en_destino" ||
          this.estado=="reconocido_y_reenviado" || this.estado=="reenviado_y_reconocido" || this.estado=="reenviado"          
        )          
      {        
        if(this.stepTimer_en_marcha==true)
        {
          clearInterval(this.stepTimer);
          this.stepTimer_en_marcha=false;
        }
      }
    }
  }
  
  reanudar_luego_de_pausar()
  {
    if(this.en_pausa_activada==true)
    {
      this.en_pausa_activada=false; 
      if(
          this.estado=="en_viaje" || this.estado=="en_destino_y_reenviado" || this.estado=="reenviado_y_en_destino" ||
          this.estado=="reconocido_y_reenviado" || this.estado=="reenviado_y_reconocido" || this.estado=="reenviado"||
          this.estado=="en_destino" || this.estado=="perdido"
        )
      {      
        if(this.reenvioTimer_en_marcha==false)
        {
          this.reenvioTimer = setInterval(this.reenvioTimer_Callback,this.timers_delay,this);
          this.reenvioTimer_en_marcha=true;
        }
      }
      if(
          this.estado=="en_viaje" || this.estado=="en_destino_y_reenviado" || this.estado=="reenviado_y_en_destino" ||
          this.estado=="reconocido_y_reenviado" || this.estado=="reenviado_y_reconocido" || this.estado=="reenviado"          
        )          
      {    
        if(this.stepTimer_en_marcha==false)
        {
          this.stepTimer = setInterval(this.stepTimer_Callback,this.step_delay,this);
          this.stepTimer_en_marcha=true;
        }
      }
    }
  }

  get_coordenada_x()
  {
    return this.packet_coordenada_x;
  }
  get_coordenada_y()
  {
    return this.packet_coordenada_y;
  }
  get_estado(){
    return this.estado;
  }
  set_estado(estado){
    this.estado=estado;
  }

  get_estado_buffer_receptor()
  {
    return this.estado_buffer_receptor;
  }
  
  set_estado_buffer_receptor(estado)
  {
    this.estado_buffer_receptor=estado;
    this.estado_buffer_receptor_antes_de_invalido=""; 
    this.dibujar();
  }
  
  set_reconocido()
  {
    if(this.estado=="en_destino_y_reenviado")
    {
      this.estado="reconocido_y_reenviado";
    }
    else if (this.estado=="reenviado_y_en_destino")
    {
      this.estado="reenviado_y_reconocido";
    }
    
    else if(this.estado=="en_destino" || this.estado=="reconocido")
    {
      this.estado="reconocido";
    }
    this.dibujar();
  }
  set_velocidad()
  {
    if(this.stepTimer_en_marcha==true)
    {
      this.step_delay = step_delay_paquetes;
      clearInterval(this.stepTimer);
      this.stepTimer = setInterval(this.stepTimer_Callback,this.step_delay,this);
      //console.log("Paquete: " + this.numero_paquete + " " + this.step_delay);
    }
    else
    {
      this.step_delay = step_delay_paquetes;
    }  
  }   
}



class Reconocimiento {
  constructor(paquete_a_reconocer){
    this.numero_paquete=paquete_a_reconocer;
    this.color = "lime";
    this.ancho_paquetes_contenedor = ancho_paquetes + 2*margen_buffers;
    this.step_delay = step_delay_paquetes;
    this.step_paso = step_paso_paquetes;
//    this.packet_coordenada_x = (this.numero_paquete-desplazamiento)*(this.ancho_paquetes_contenedor)+margen_buffers;
    this.packet_coordenada_x=paquetes_list[this.numero_paquete].get_coordenada_x(); 
    this.packet_coordenada_y_inicial = packet_coordenada_y_final_buffer_receptor;
    this.packet_coordenada_y_final = packet_coordenada_y_inicial_buffer_emisor;
    this.packet_coordenada_y = this.packet_coordenada_y_inicial;
    this.notificacion_tamano_ventana=0;
    this.mi_canvas = document.getElementById("rectangle_area");
    this.canvas_area = this.mi_canvas.getContext("2d");
    this.canvas_area.lineWidth = "2";
    this.canvas_area.fillStyle = this.color;
    this.stepTimer_en_marcha=false;
    this.canvas_area.fillRect(this.packet_coordenada_x, this.packet_coordenada_y, ancho_paquetes, alto_paquetes);
    this.canvas_area.strokeRect(this.packet_coordenada_x+this.canvas_area.lineWidth*0.5, 
      this.packet_coordenada_y+this.canvas_area.lineWidth*0.5, ancho_paquetes-this.canvas_area.lineWidth, alto_paquetes-
      this.canvas_area.lineWidth);
    this.en_pausa_activada=false;
  }
  
  enviar_paquete(notificacion_tamano_ventana){
    this.notificacion_tamano_ventana=notificacion_tamano_ventana;
    this.stepTimer = setInterval(this.paquete_step_Callback,this.step_delay,this);
    this.stepTimer_en_marcha=true;
  }
  
  paquete_step_Callback(paquete)
  {
    this.paquete = paquete;
    this.paquete.packet_coordenada_y=this.paquete.packet_coordenada_y-this.paquete.step_paso;   
    /*Dibujamos el paquete en tránsito*/
    this.paquete.canvas_area.clearRect(this.paquete.packet_coordenada_x, this.paquete.packet_coordenada_y+this.paquete.step_paso,
      ancho_paquetes, alto_paquetes);
    this.paquete.my_gradient=this.paquete.canvas_area.createLinearGradient(this.paquete.packet_coordenada_x+ancho_paquetes/2, 
    this.paquete.packet_coordenada_y, this.paquete.packet_coordenada_x+ancho_paquetes/2, this.paquete.packet_coordenada_y+ alto_paquetes);
    this.paquete.my_gradient.addColorStop(0, "green");
    this.paquete.my_gradient.addColorStop(1, "white");
    this.paquete.canvas_area.fillStyle = this.paquete.my_gradient;
    this.paquete.canvas_area.fillRect(this.paquete.packet_coordenada_x, this.paquete.packet_coordenada_y,
      ancho_paquetes, alto_paquetes);
    this.paquete.canvas_area.strokeRect(this.paquete.packet_coordenada_x+this.paquete.canvas_area.lineWidth*0.5,
       this.paquete.packet_coordenada_y+this.paquete.canvas_area.lineWidth*0.5,ancho_paquetes-this.paquete.canvas_area.lineWidth,
       alto_paquetes-this.paquete.canvas_area.lineWidth);  
    this.paquete.canvas_area.fillStyle = "black";
    this.paquete.canvas_area.font = "bold 12px Arial";
    this.paquete.y=this.paquete.packet_coordenada_y;
    if(this.paquete.notificacion_tamano_ventana<10){
      this.paquete.canvas_area.fillText("W="+this.paquete.notificacion_tamano_ventana,this.paquete.packet_coordenada_x + 2,
        this.paquete.y+(alto_paquetes/2)+5);
    }
    else
    {
      this.paquete.canvas_area.fillText(this.paquete.notificacion_tamano_ventana,this.paquete.packet_coordenada_x + 4,
        this.paquete.y+(alto_paquetes/2)+5);
    }
    ventana_emisor.dibujar();
    ventana_receptor.dibujar();
    /*Borramos el paquete en caso de estar por debajo del buffer receptor, para que no parezca que aparece y desaparece*/
    if(this.paquete.packet_coordenada_y>=(this.paquete.packet_coordenada_y_inicial-alto_paquetes-margen_buffers))
    {
      this.paquete.canvas_area.fillStyle = "white";
      this.paquete.canvas_area.fillRect(this.paquete.packet_coordenada_x, this.paquete.packet_coordenada_y_inicial,
      ancho_paquetes, alto_paquetes);
    }
    /*El siguiente if tiene la funcion de que no quede borrado el paquete del buffer receptor*/
    if(
       this.paquete.packet_coordenada_y>=(this.paquete.packet_coordenada_y_inicial-margen_buffers-alto_paquetes) ||
       this.paquete.packet_coordenada_y<packet_coordenada_y_inicial_buffer_emisor+alto_paquetes
      )
    {
      if(this.paquete.numero_paquete>=0)
      {
        paquetes_list[this.paquete.numero_paquete].dibujar();        
      }
    }
    
    /*El reconocimiento llegó al emisor*/   
    if(this.paquete.packet_coordenada_y<(this.paquete.packet_coordenada_y_final+this.paquete.step_paso))
    {
       /*El reconocimiento llegó al emisor*/
       clearInterval(this.paquete.stepTimer);
       this.paquete.stepTimer_en_marcha=false;
       verificar_paquetes_reconocidos(this.paquete.numero_paquete,this.paquete.notificacion_tamano_ventana);
       this.paquete.canvas_area.clearRect(this.paquete.packet_coordenada_x, this.paquete.packet_coordenada_y,
         this.paquete.ancho, this.paquete.alto);
       reconocimientos_list.shift();        
       if(this.paquete.numero_paquete>=0)
       {
         paquetes_list[this.paquete.numero_paquete].dibujar();
       }    
    }
  }
  desplazar()
  {
    if(desplazamiento>=buffers_numero_maximo)
    { 
      desplazamiento=0;
    }
    var aux=(this.numero_paquete-desplazamiento)*(this.ancho_paquetes_contenedor) + margen_buffers;
    if(aux<0)
    {
      aux=this.ancho_paquetes_contenedor*(buffers_numero_maximo-desplazamiento)+(this.numero_paquete+1)*this.ancho_paquetes_contenedor 
        + margen_buffers;
    }
    this.packet_coordenada_x=aux;    
  }  
  
  desplazar1()
  {
    let x=this.packet_coordenada_x-10;
    if(x<(0-ancho_paquetes-margen_buffers))
    {
      x=buffers_numero_maximo*(this.ancho_paquetes_contenedor) + margen_buffers;  
    }
//    console.log(this.numero_paquete + " " + x);
    this.packet_coordenada_x=x;  
  }

  
  set_velocidad()
  {
    if(this.stepTimer_en_marcha==true)
    {
      this.step_delay = step_delay_paquetes;
      clearInterval(this.stepTimer);
      this.stepTimer = setInterval(this.paquete_step_Callback,this.step_delay,this);
    }
    else
    {
      this.step_delay = step_delay_paquetes;
    }  
  }  
   
  pausar()
  {
    if(this.en_pausa_activada==false)
    {
      this.en_pausa_activada=true; 
      if(this.stepTimer_en_marcha==true)    
      {   
        clearInterval(this.stepTimer);
        this.stepTimer_en_marcha=false;
      }
    }
  }
  
  reanudar_luego_de_pausar()
  {
  if(this.en_pausa_activada==true)
    {
      this.en_pausa_activada=false; 
      if(this.stepTimer_en_marcha==false)    
      {   
        this.stepTimer = setInterval(this.paquete_step_Callback,this.step_delay,this);
        this.stepTimer_en_marcha=true;
      }
    }
  }
  
  get_paquete_a_reconocer()
  {
    return this.numero_paquete;
  }    
}

class Ventana
{
  constructor(limite_inferior,limite_superior,coordenada_y)
  {
    this.limite_inferior=limite_inferior; //El primero incluido en la ventana
    this.limite_superior=limite_superior; //El ultimo incluido en la ventana 
    this.coordenada_y=coordenada_y;
    this.tamano_maximo=ventanas_tamano_maximo;
    this.paquete_en_buffer=false;
    //Nota: si hay un solo paquete, será limite_inferior=n y limite_superior=n
    //Nota: si hay un cero paquetes, será limite_inferior=n y limite_superior=n-1

   }
/*
  dibujar_cuadro(numero)
  {
    if(this.verificar_si_esta_en_ventana(numero)==true)
    {
      //let x=(numero-desplazamiento)*(ancho_paquetes+2*margen_ventanas+2*margen_buffers);	
      let x=paquetes_list[numero].get_coordenada_x()-margen_ventanas-margen_buffers;
      let y=this.coordenada_y;
      this.mi_canvas = document.getElementById("rectangle_area");
      this.canvas_area = this.mi_canvas.getContext("2d");
      this.canvas_area.fillStyle = "yellow";
      this.canvas_area.fillRect(x+margen_buffers, y+margen_buffers, margen_ventanas, alto_paquetes+2*margen_ventanas);   //izquierda
      this.canvas_area.fillRect(x+margen_buffers+margen_ventanas, y+margen_buffers, ancho_paquetes, margen_ventanas);     //superior
      this.canvas_area.fillRect(x+margen_buffers+margen_ventanas, y+margen_buffers+margen_ventanas+alto_paquetes, ancho_paquetes,
        margen_ventanas);//infer 
      this.canvas_area.fillRect(x+margen_buffers+margen_ventanas+ancho_paquetes, y+margen_buffers, margen_ventanas,
       alto_paquetes+2*margen_ventanas);  //derecha   
    }  
  }  
  */
  dibujar()
  {
    this.mi_canvas = document.getElementById("rectangle_area");
    this.canvas_area = this.mi_canvas.getContext("2d");
    this.canvas_area.fillStyle = "DarkRed";
    this.y=this.coordenada_y;
    this.x_inf=paquetes_list[this.limite_inferior].get_coordenada_x();
    this.canvas_area.fillRect(this.x_inf-margen_ventanas-3, this.y-margen_ventanas-3, margen_ventanas, alto_paquetes
      +2*margen_ventanas + 6);//izquierda
    this.x_sup=paquetes_list[this.limite_superior].get_coordenada_x();
    this.canvas_area.fillRect(this.x_sup+ancho_paquetes+3, this.y-margen_ventanas-3, margen_ventanas, alto_paquetes
      +2*margen_ventanas +6 );     //derecho
    this.canvas_area.fillRect(this.x_inf-3, this.y-margen_ventanas-3, 
      paquetes_list[this.limite_superior].get_coordenada_x() - paquetes_list[this.limite_inferior].get_coordenada_x()
      + ancho_paquetes + 6, margen_ventanas);   
    this.canvas_area.fillRect(this.x_inf -3, this.y+alto_paquetes+3, 
      paquetes_list[this.limite_superior].get_coordenada_x() - paquetes_list[this.limite_inferior].get_coordenada_x()
      + ancho_paquetes + 6, margen_ventanas);   
  
    
  }
  desplazar()
  {
//    this.dibujar();
  }
  set_limite_inferior(paquete_inferior)
  {
    this.limite_inferior=paquete_inferior;  
  }
  set_limite_superior(paquete_superior)
  {
    this.limite_superior=paquete_superior;  
  }
  set_tamano_maximo(tamano)
  {
    this.tamano_maximo=tamano;  
  }
  get_limite_inferior()
  {
    return this.limite_inferior;  
  }
  get_limite_superior()
  {
    return this.limite_superior;  
  }
  get_tamano_maximo()
  {
    return this.tamano_maximo;  
  }
  desplazar_un_paquete_lim_superior()
  {
     //agregar codigo que no permita que el tamaño de ventana sea superior a
    if(this.limite_superior<buffers_numero_maximo)
    {
      this.limite_superior=this.limite_superior+1;   
    }
    else
    {
      this.limite_superior=0;
    } 
  }
  desplazar_un_paquete_lim_inferior()
  {
    if(this.limite_inferior<buffers_numero_maximo)
    {
      this.limite_inferior=this.limite_inferior+1;   
    }
    else
    {
      this.limite_inferior=0;
    } 
  }
  verificar_si_esta_en_ventana(numero_paquete)
  {
  this.paquete_en_buffer=false;
    if(this.limite_inferior<=this.limite_superior)
    {
      if(this.limite_superior!=buffers_numero_maximo || this.limite_inferior!=0)
      {
      //  console.log("a");      
        if(this.limite_inferior<=numero_paquete && numero_paquete<=this.limite_superior)
        {
          this.paquete_en_buffer=true;
        }
        else
        {
          this.paquete_en_buffer=false;
        }
      }  
    }
    else if((this.limite_inferior>this.limite_superior) && (this.limite_superior-this.limite_inferior!=-1))
    {
      if(this.limite_superior!=buffers_numero_maximo || this.limite_inferior!=0)
      {
       // console.log("b");
        if(
            (this.limite_inferior<=numero_paquete && numero_paquete<=buffers_numero_maximo) ||
            (0<=numero_paquete && numero_paquete<=this.limite_superior)
          )  
        {
          this.paquete_en_buffer=true;
        }
        else
        {
          this.paquete_en_buffer=false;
        }
      }  
    }
    return this.paquete_en_buffer;
  }
  get_paquetes_en_ventana_list()
  {
    let lista = [];
    if(this.limite_inferior<=this.limite_superior)
    {
      if(this.limite_superior!=buffers_numero_maximo || this.limite_inferior!=0)
        {
        for(let i=this.limite_inferior;i<=this.limite_superior;i++)
        {
          lista.push(i);      
        }
      }
    }
    else if((this.limite_inferior>this.limite_superior) && (this.limite_superior-this.limite_inferior!=-1))
    { 
      if(this.limite_superior!=buffers_numero_maximo || this.limite_inferior!=0)
      {
        for(i=this.limite_inferior;i<=buffers_numero_maximo;i++)
        {
          lista.push(i);
        }
        for(i=0;i<=this.limite_superior;i++)
        {
          lista.push(i);     
        }
      }
    }
  return lista;
  }
}  
  
  
