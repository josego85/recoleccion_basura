/**
 * GeoLocalizacion por html5.
 * @method localizame
 * @param void
 * @returns void
 */
function localizame(){
	/**
	 * OBS:
	 * - Iceweasel 27.0.1 en Debian Wheezy NO funciona la GeoLocalizacion del html5.
	 * - Mozilla Firefox en Windows si funciona la GeoLocaclizacion del html5.
	 */
	if(navigator.geolocation){
   	 	navigator.geolocation.getCurrentPosition(obtenerCoordenadas, errores, {
   	 		enableHighAccuracy: true,
   	 		maximumAge: 30000,
   	 		timeout: 27000
   	 	});
    }else{
    	 // La latitud y longitud usa los valores por defecto que se definieron en las
    	 // variables globales.
    	 // Se carga el mapa.
    	 posicionPorDefecto();
    }
}

/**
 * Metodo que obtiene las coordenadas actuales por medio de la geolocalizacion.
 * @method obtenerCoordenadas
 * @param p_position
 * @returns void
 */
function obtenerCoordenadas(p_position){
	// Se crea un array con latitud y longitud.
	var v_coordenadas = new Array();
	v_coordenadas['latitud'] = p_position.coords.latitude;
	v_coordenadas['longitud']  = p_position.coords.longitude;

	iniciar_mapa(v_coordenadas);
}

/**
 * Metodo errores, sea el codigo de error que salga, va a cargar por defecto coordenadas (latitud y longitud) de USA.
 * @method errores
 * @param error
 * @returns void
 */
function errores(error){
	switch(error.code){
    	case error.PERMISSION_DENIED:
    		alert("User denied the request for Geolocation.");
    		break;
    	case error.POSITION_UNAVAILABLE:
    		alert("Location information is unavailable.");
    		break;
    	case error.TIMEOUT:
    		alert("The request to get user location timed out.");
    		break;
    	case error.UNKNOWN_ERROR:
    		alert("An unknown error occurred.");
    		break;
    }
	posicionPorDefecto();
}

/**
 * Metodo que posiciona por defecto Asuncion - Paraguay.
 * @method posicionPorDefecto
 * @returns void
 */
function posicionPorDefecto(){
	//Asuncion - Paraguay.
	var v_latitud = -25.2961407;
	var v_longitud = -57.6309129;

	// Se crea un array con latitud y longitud.
	var v_coordenadas = new Array();
	v_coordenadas['latitud'] = v_latitud;
	v_coordenadas['longitud']  = v_longitud;

	iniciar_mapa(v_coordenadas);
}

//
function iniciar_mapa(p_coordenadas){
    // Mostrar mapa.
    cargarMapa(p_coordenadas);
}
