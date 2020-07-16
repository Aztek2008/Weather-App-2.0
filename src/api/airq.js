

let map = new google.maps.Map(document.getElementById('map'), {
	center: new google.maps.LatLng(),
	mapTypeId: google.maps.MapTypeId.ROADMAP,
	zoom: 11,
});
let t = new Date().getTime();
let waqiMapOverlay = new google.maps.ImageMapType({
	getTileUrl: function (coord, zoom) {
		return (
			'https://tiles.aqicn.org/tiles/usepa-aqi/' +
			zoom +
			'/' +
			coord.x +
			'/' +
			coord.y +
			'.png?token=_TOKEN_ID_'
		);
	},
	name: 'Air  Quality',

});
map.overlayMapTypes.insertAt(0, waqiMapOverlay);