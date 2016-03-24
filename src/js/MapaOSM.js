// Variables y Objetos globales.
var v_mapa = null;
var v_layer_todos_barrios_asu = null;

// Carga el mapa.
function cargarMapa(p_coordenadas){
	// Zoom inicial del mapa de todos los barrios de Asuncion.
	var v_zoom = 10;
	v_mapa = L.map('map-container', {
	    zoom: v_zoom
	});

	// Se obtiene todos los barrios de Asuncion.
    $.getJSON("../datos/barrios/Asuncion.geojson", function(data){
        v_layer_todos_barrios_asu = L.geoJson(data, {
			style: function(feature) {
			    switch (feature.properties.turno) {
			        case 'manhana': return {
						weight: 1,
						color: "#000000",
						fillColor: "#339848",
					    opacity: 1,
					    fillOpacity: 1
					};
			        case 'tarde': return {
						weight: 1,
						color: "#000000",
						fillColor: "#f69522",
					    opacity: 1,
					    fillOpacity: 1
					};
					case 'noche': return {
						weight: 1,
						color: "#000000",
						fillColor: "#d9138e",
					    opacity: 1,
					    fillOpacity: 1
					};
					default: return {
						weight: 1,
						color: "#000000",
						fillColor: "#cee49b",
					    opacity: 1,
					    fillOpacity: 1
					};
			    }
			},
			//onEachFeature: popup
		}).addTo(v_mapa);

		// // Leyenda.
		// var leyenda = L.control({
		// 	position: 'bottomright'
		// });
		// leyenda.onAdd = function (mapa) {
		// 	var div = L.DomUtil.create('div', 'info leyenda');
		// 	div.innerHTML +=
		// 	'<img alt="legend" src="" width="127" height="120" />';
		// };
		//leyenda.addTo(v_mapa);

		// Se centra el layer de todos los barrios de Asuncion.
		v_mapa.fitBounds(v_layer_todos_barrios_asu.getBounds());

		// Mostrar ubicacion actual.
		mostrar(p_coordenadas);
	});

	// Muestra un pop por cada barrio.
	function popup(feature, layer) {
		if (feature.properties && feature.properties.nombre) {
			layer.bindPopup(feature.properties.nombre + " (" +
		      feature.properties.turno + ")");
		}else if(feature){
			console.log(feature);
			layer.bindPopup(feature);
		}
	}

	//
	function mostrar(p_coordenadas){
		// Mostrar ubicacion actual.
		var layer = leafletPip.pointInLayer([p_coordenadas.longitud, p_coordenadas.latitud],
			v_layer_todos_barrios_asu, true);
			console.log("v_layer_todos_barrios_asu: ", v_layer_todos_barrios_asu);
		if(layer.length) {
			popup(layer[0].feature.properties.nombre + " (" +
			  layer[0].feature.properties.turno + ")", v_layer_todos_barrios_asu);
		}else{
			 v_layer_todos_barrios_asu.bindPopup = '';
		}
	}
}
