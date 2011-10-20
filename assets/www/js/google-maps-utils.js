function drawMap(whereId, centre, zoom) {
	var options = {
	zoom: zoom,
	center: centre,
	mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	var map = new google.maps.Map(document.getElementById(whereId), options);
	return map;
}

function drawCircle(map, centre, radius, color) {
	var radius = Math.round(radius);
	var options = {
	center: centre,
	radius: radius,
	map: map,
	fillColor: color,
	fillOpacity: 0.5,
	strokeWeight: 1
	};
	var circle = new google.maps.Circle(options);
	
	// Traçage du radius
	// Calcul d'un point sur le bord du cercle
	var theta = 30;
	var res = destVincenty(centre.lat(), centre.lng(), theta, radius);
	var pointBord = new google.maps.LatLng(res.lat, res.lon);
	var polilyneOptions = {
	path: [centre, pointBord],
	map: map,
	fillColor: 'black',
	strokeWeight: 2
	};
	var polyline = new google.maps.Polyline(polilyneOptions);
	circle.bindTo('position', polyline);
	
	return circle;
}

function drawCircleAndMarker(map, centre, radius, color, description) {
	var marker = new google.maps.Marker({
	map: map,
	position: centre,
	draggable: true,
	title: description
	});
	var circle = drawCircle(map, centre, radius, color);
	circle.bindTo('center', marker, 'position');
	return circle;
}