// Variables y Objetos globales.
var v_mapa = null;
var v_layer_todos_barrios_asu = null;

// Carga el mapa.
function cargarMapa(p_coordenadas){
	// Zoom inicial del mapa de todos los barrios de Asuncion.
	var v_zoom = 10;
	v_mapa = L.map('map-container', {
	    zoom: v_zoom,
		attributionControl: false
	});

	// Attribuciones.
	var v_creditos = L.control.attribution().addTo(v_mapa);
	v_creditos.addAttribution("Datos <a href='http://datos.gov.py/organization/direccion-general-de-estadisticas-encuestas-y-censos-dgeec'>DGEEC</a>");

	// Se obtiene todos los barrios de Asuncion.
    $.getJSON("datos/barrios/Asuncion.geojson", function(data){
        v_layer_todos_barrios_asu = L.geoJson(data, {
			style: estilo_barrios,
			onEachFeature: popup
		}).addTo(v_mapa);

		// Info.
		// var info = L.control();
		// info.onAdd = function (v_mapa) {
		//     this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
		//     this.update();
		//     return this._div;
		// };
		// // method that we will use to update the control based on feature properties passed
		// info.update = function (props) {
		//     this._div.innerHTML = '<h4>Barrio</h4>' +  (props ?
		//         '<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
		//         : 'Hover over a state');
		// };
		// info.addTo(v_mapa);

		// Leyenda.
		var leyenda = L.control({position: 'bottomright'});
		leyenda.onAdd = function (mapa) {
		    var div = L.DomUtil.create('div', 'info leyenda');
		    var turnos = ["manhana", "tarde", "noche"];

			for (var i = 0; i < turnos.length; i++) {
				div.innerHTML +=
	              '<i style="background:' + getColor(turnos[i]) + '"></i> ' +
	              turnos[i] + '<p>';
			}
			return div;
		};
		leyenda.addTo(v_mapa);

		// Se centra el layer de todos los barrios de Asuncion.
		v_mapa.fitBounds(v_layer_todos_barrios_asu.getBounds());

		// Mostrar ubicacion actual.
		//mostrar(p_coordenadas);
	});

	// Muestra un pop por cada barrio.
	function popup(feature, layer) {
		if (feature.properties && feature.properties.nombre) {
			var info;
			if(feature.properties.turno != null){
				info = feature.properties.nombre + " (" +
			      feature.properties.turno + ")";
			}else{
				info = feature.properties.nombre;
			}
			layer.bindPopup(info);
		}else if(feature){
			//console.log(feature);
			layer.bindPopup(feature);
		}
	}

	//
	function mostrar(p_coordenadas){
		// Mostrar ubicacion actual.
		var layer = leafletPip.pointInLayer([p_coordenadas.longitud, p_coordenadas.latitud],
			v_layer_todos_barrios_asu, true);
			//console.log("v_layer_todos_barrios_asu: ", v_layer_todos_barrios_asu);
		if(layer.length) {
			popup(layer[0].feature.properties.nombre + " (" +
			  layer[0].feature.properties.turno + ")", v_layer_todos_barrios_asu);
		}else{
			 v_layer_todos_barrios_asu.bindPopup = '';
		}
	}

	//
	function estilo_barrios(feature){
		return {
	        fillColor: getColor(feature.properties.turno),
	        weight: 2,
	        opacity: 1,
	        color: 'white',
	        dashArray: '3',
	        fillOpacity: 0.7
	    };
	}

	//
	function getColor(turno) {
	    return turno == "manhana" ? '#339848' :
	           turno == "tarde"  ? '#F69522' :
	           turno == "noche"  ? '#D9138e' :
	               '#CEE49B';
	}
}
