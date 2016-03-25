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
			onEachFeature: onEachFeature
		}).addTo(v_mapa);

		// Info.
		var info = L.control();
		info.onAdd = function (v_mapa) {
		    this._div = L.DomUtil.create('div', 'info');
		    this.update();
		    return this._div;
		};
		info.update = function (propiedades) {
			var v_info_tmp;
			if (propiedades && propiedades.nombre) {
				var info_tmp = "<b>" + propiedades.nombre + "</b>";
				if(propiedades.turno != null){
					info_tmp += " (" + propiedades.turno + ")";
				}
				v_info_tmp = '<h4>Barrio</h4>' + info_tmp;
			}else{
			     v_info_tmp = '<h4>No es un barrio</h4>';
			}
		    this._div.innerHTML = v_info_tmp;
		};
		info.addTo(v_mapa);

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

		////////////////////////////////////////////////////////////////////////
		// Funciones internas.
		////////////////////////////////////////////////////////////////////////

		// Muestra un pop por cada barrio.
		// function popup(feature, layer) {
		// 	if (feature.properties && feature.properties.nombre) {
		// 		var info;
		// 		if(feature.properties.turno != null){
		// 			info = feature.properties.nombre + " (" +
		// 		      feature.properties.turno + ")";
		// 		}else{
		// 			info = feature.properties.nombre;
		// 		}
		// 		layer.bindPopup(info);
		// 	}else if(feature){
		// 		//console.log(feature);
		// 		layer.bindPopup(feature);
		// 	}
		// }

		//
		// function mostrar(p_coordenadas){
		// 	// Mostrar ubicacion actual.
		// 	var layer = leafletPip.pointInLayer([p_coordenadas.longitud, p_coordenadas.latitud],
		// 		v_layer_todos_barrios_asu, true);
		// 		//console.log("v_layer_todos_barrios_asu: ", v_layer_todos_barrios_asu);
		// 	if(layer.length) {
		// 		popup(layer[0].feature.properties.nombre + " (" +
		// 		  layer[0].feature.properties.turno + ")", v_layer_todos_barrios_asu);
		// 	}else{
		// 		 v_layer_todos_barrios_asu.bindPopup = '';
		// 	}
		// }

		// Funcion que devuelve el estilo de un barrio.
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

		// Funcion que devuelve el color dependiendo
		// del turno.
		function getColor(turno) {
		    return turno == "manhana" ? '#339848' :
		           turno == "tarde"  ? '#F69522' :
		           turno == "noche"  ? '#D9138e' :
		               '#CEE49B';
		}

		// Funcion.
		function highlightFeature(e) {
			var layer = e.target;
			layer.setStyle({
				weight: 4,
				color: '#5C1313',
				dashArray: '',
				fillOpacity: 0.7
			});
			if (!L.Browser.ie && !L.Browser.opera) {
				layer.bringToFront();
			}
			info.update(layer.feature.properties);
		}

		// Funcion.
		function resetHighlight(e) {
			v_layer_todos_barrios_asu.resetStyle(e.target);
			info.update();
		}

		// Funcion.
		function zoomToFeature(e) {
			v_mapa.fitBounds(e.target.getBounds());
		}

		// Funcion.
		function onEachFeature(feature, layer) {
			layer.on({
				mouseover: highlightFeature,
				mouseout: resetHighlight,
				click: zoomToFeature
			});
		}
	});
}
