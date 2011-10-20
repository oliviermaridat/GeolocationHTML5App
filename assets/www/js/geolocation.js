// -- Utils
function flush() {
	$('#resultat').html('');
	$('#map').html('').css({height: '0'});
	$('#tweets').html('');
}
function onGeolocation_error(error) {
	var res = '';
	switch(error.code) {
	case error.TIMEOUT:
		res = 'temps de réponse du satellite trop long.';
		break;
	case error.PERMISSION_DENIED:
		res = 'vous n\'avez pas autorisé la géolocalisation.';
		break;
	case error.POSITION_UNVAILABLE:
		res = 'position introuvable.';
		break;
	default:
		res = 'erreur inconnue ('+error.message+').';
	}
	$('#resultat').html('<h2>Arrêt de la géolocalisation</h2><p>'+res+'</p>');
}

function displayLocationInTxt(latitude, longitude, accuracy) {
	$('#resultat').html('<h2>Ma position</h2><ul><li>Latitude : '+latitude+'</li><li>Longitude : '+longitude+'</li><li>Précision : '+accuracy+' mètres</li></ul>');
}
function displayLocationInMap(latitude, longitude, accuracy) {
	// On dessine la map
	var zoom = 8;
	var map = drawMap('map', new google.maps.LatLng(latitude, longitude), zoom);
	$('#map').css({height: '300px'});
	// On dessine ma position
	var location = drawCircleAndMarker(map, new google.maps.LatLng(latitude, longitude), accuracy, 'yellow', 'Ma position');
	// On effectue le zoom adapté
	var circlesBounds = location.getBounds();
	map.fitBounds(circlesBounds);
}
function displayNearByTweets(latitude, longitude){
	$('#tweets').append('<h2>Tweets alentours</h2>');
    var query = "http://search.twitter.com/search.json?callback=onTweetsAvailable";
    query += "&geocode=" + escape(latitude + "," + longitude + ",5mi");
    var script = document.createElement("script");
    script.src = query;
    document.getElementsByTagName("head")[0].appendChild(script);
}
function onTweetsAvailable(response) {
	var tweets = response.results;
	tweets.forEach(function(tweet){
		showTweet(tweet.from_user, tweet.profile_image_url, tweet.text, tweet.location)
	});
}
function showTweet(username, avatarUrl, txt, location) {
//	var img = $('<img>').addClass('avatar').attr({href: avatarUrl, alt: "Avatar de "+username});
	var dt = $('<dt>').html(username);
//	img.prependTo(dt);
	dt.appendTo('#tweets');
	$('<dd>').html(txt+"<br />Localisation : "+location).appendTo('#tweets');
}


// -- Bloch functions
function geolocaliser(){
	flush();
	console.log('test');
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
				function(position){
					var latitude = position.coords.latitude;
					var longitude = position.coords.longitude;
					var accuracy = position.coords.accuracy;
					console.log(latitude);
					displayLocationInTxt(latitude, longitude, accuracy);
				},
				onGeolocation_error,
				{ enableHighAccuracy: true }
		);
	}
	else {
		$('#resultat').html('<h2>Erreur</h2><p>La géolocalisation n\'est pas supportée par votre système. Désolé !</p>');
	}
}
function geolocaliserEtVisualiser(){
	flush();
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
				function(position){
					var latitude = position.coords.latitude;
					var longitude = position.coords.longitude;
					var accuracy = position.coords.accuracy;
					displayLocationInTxt(latitude, longitude, accuracy);
					displayLocationInMap(latitude, longitude, accuracy);
				},
				onGeolocation_error,
				{ enableHighAccuracy: true }
		);
	}
	else {
		$('#resultat').html('<h2>Erreur</h2><p>La géolocalisation n\'est pas supportée par votre système. Désolé !</p>');
	}
}
function nearByTweets(){
	flush();
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
				function(position){
					var latitude = position.coords.latitude;
					var longitude = position.coords.longitude;
					var accuracy = position.coords.accuracy;
					displayLocationInTxt(latitude, longitude, accuracy);
					displayNearByTweets(latitude, longitude);
				},
				onGeolocation_error,
				{ enableHighAccuracy: true }
		);
	}
	else {
		$('#resultat').html('<h2>Erreur</h2><p>La géolocalisation n\'est pas supportée par votre système. Désolé !</p>');
	}
}


$(document).ready(function() {
	$('#geolocaliser').click(geolocaliser);
	$('#geolocaliserEtVisualiser').click(geolocaliserEtVisualiser);
	$('#nearByTweets').click(nearByTweets);
//	document.querySelector('#geolocaliser').addEventListener('click', geolocaliser, false);
//	document.querySelector('#geolocaliserEtVisualiser').addEventListener('click', geolocaliserEtVisualiser, false);
//	document.querySelector('#nearByTweets').addEventListener('click', nearByTweets, false);
});