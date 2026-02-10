<html>
<head>
  <meta http-equiv="refresh" content="0;url=index.php">

<?php
  $sugerencias_texto=$_POST["sugerencias_textarea"];
  $fecha_hora=getdate();  
  $file = fopen("registro_sugerencias.txt","a");
  fwrite($file,date("Y/m/d")." - ".date("H:i:sa")." - IP: ".$_SERVER['REMOTE_ADDR']."\n");
  fwrite($file,$sugerencias_texto);  
  fclose($file); 
//  header("Location: index.php");  
?>

</head>
</html>
