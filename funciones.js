

function attachInfoCiclorutas(marker, Message) {
  var infowindow = new google.maps.InfoWindow({
    content: Message
  });

  marker.addListener('click', function() {
    infowindow.open(marker.get('map'), marker);
  });
};


function getPoligonosLocalidadesGoogleFormat(dataInicial){

  //**esta función obtiene los poligonos de las localidades en un formato que puede ser usado por la API de google */
  //**se parte de un archivo llamado poligonosLocalidades.js y es esta función quién hace la conversión. */
    let nombreLocalidad;
    let idLocalidad=null;
    let polygonos=[];
    let polygono=[];
    let polygonosLocalidadesBogota=[];
    let lat=null;
    let lng=null;
    let localidad=null;
    


    var dataLocalidades=[];
    
      dataInicial.forEach(localidad=>{
        
        nombreLocalidad=localidad.fields["Nombre de la localidad"];
        idLocalidad=parseInt( localidad.fields["Identificador unico de la localidad"],10);
    
        localidad.fields.geometry.coordinates.forEach(coordenadas=>{
  
          coordenadas.forEach(coordenada=>{
    
    
            coordenada.forEach(latLon=>{
              let coordenada=null;

              lng=latLon[0];
              lat=latLon[1];
              formatoCoordenada={lat,lng};
              polygono.push(formatoCoordenada);
            });

            polygonos.push(polygono);
            polygono=[];
            
    
          });
        
        });

        //console.log(polygonos)

        localidad={
        idLocalidad,
        nombreLocalidad,
        polygonos
        };

        polygonosLocalidadesBogota.push(localidad);
        
        polygonos=[];
        
      
      
      });
      
      
      return polygonosLocalidadesBogota;
    
    
    };



    function verificaPuntoEnPoligono (poligono, coordenada) {

      //*Esta función verifica si una coordenada en formato usado por google {lat: 4.588917862849369, lng: -74.18135180099995} se encuentra adentro de un poligono que tiene esta forma : [{lat:4.85, lng:-75.8},{lat:4.85, lng:-75.8},{lat:4.85, lng:-75.8}] 
      //**el retorno es un booleano, true si el punto pertenece al poligono y false en caso contrario */
    
    
    path=poligono;
    point=coordenada;
    
    
  
        var crossings = 0;
            

        // for each edge
        for (var i=0; i < path.length; i++) {
            var a = path[i];
            var j = i + 1;
            if (j >= path.length) {
                j = 0;
            };
            var b = path[j];
            if (rayCrossesSegment(point, a, b)) {
                crossings++;
            };
        };

        // odd number of crossings?
        return (crossings % 2 == 1);

        function rayCrossesSegment(point, a, b) {
            var px = point.lng;
            var py = point.lat;
            var ax = a.lng;
            var ay = a.lat;
            var bx = b.lng;
            var by = b.lat;
            if (ay > by) {
                ax = b.lng;
                ay = b.lat;
                bx = a.lng;
                by = a.lat;
            };
            // alter longitude to cater for 180 degree crossings
            if (px < 0) { px += 360 };
            if (ax < 0) { ax += 360 };
            if (bx < 0) { bx += 360 };

            if (py == ay || py == by) {py += 0.00000001};
            if ((py > by || py < ay) || (px > Math.max(ax, bx))){return false;}; 
            if (px < Math.min(ax, bx)) {return true};

            var red = (ax != bx) ? ((by - ay) / (bx - ax)) : Infinity;
            var blue = (ax != px) ? ((py - ay) / (px - ax)) : Infinity;
            return (blue >= red);

        };

     };


  
    
    function getCoordenadaCiclorutasGoogleFormat(coordenadas){
      /**esta función obtiene las coordenadas de las ciclorutas en el siguiente formato:  [[{lat:4.85, lng:-75.8}],[{lat:4.85, lng:-75.8}]]  en donde cada arreglo  dentro del arreglo representa un tramo de ciclorruta*/
      /** el retorno esta en un formato compatible con la API de google maps  */
      //** se parte de un archivo en formato json que tiene las coordenadas y fue descargado de internet. */



     var flightPlanCoordinates = []; // variable para alamcenar cada uno de los trazos de las bicicletas
     var rutasTotales=[];  // Variable que almacena todas los trazos de las ciclo ruta de bogota

     coordenadas.features.forEach(features => {  // bucle para navegar en los datos de todas las ciclorutas
      var propiedades = features.properties;
      //console.log(features.properties)   
      
      features.geometry.coordinates.forEach(coordinates => {// bucle para navegar en los datos de todas las ciclorutas
           coordinates.forEach(element => {// bucle para navegar en los datos de todas las ciclorutas
             element.forEach(values =>{// bucle para navegar en los datos de todas las ciclorutas
             
               let lng = values[0]; // valores de longitud de trazo de cicloruta
               let lat = values[1];// valores de latitud de trazo de cicloruta
               flightPlanCoordinates.push({lat: lat, lng: lng}); // se le asignan los valores por cada trazo de cicllo ruta que se ecunetre, en forma de objeto, con los valores de longitud y latitud

             })
           })
         });
         rutasTotales.push({coordenadas:flightPlanCoordinates,propiedades}); //Se asignan los valores de cada longitud y latitud, separandose por trazos
         flightPlanCoordinates=[]; // reinicio de la variable
     });

     //console.log(rutasTotales);

     return rutasTotales;

    };



    
    var localidadesBogotaIPSAP= {
      "L.ANT.NARI?O":15,
      "L.B.UNIDOS":12,
       "L.BOSA":7,
       "L.C.BOLIVAR":19,
       "L.CANDELARIA":17,
       "L.CHAPINERO":2,
       "L.ENGATIVA":10,
       "L.FONTIBON":9,
       "L.KENNEDY":8,
       "L.MARTIRES":14,
       "L.PTE.ARANDA":16,
       "L.R.URIBE":18,
       "L.SN.CRISTOBAL":4,
       "L.STA.FE":3,
       "L.SUBA":11,
       "L.SUMAPAZ":20,
       "L.TEUSAQUILLO":13,
       "L.USAQUEN":1,
       "L.USME":5                   

       };



       


    