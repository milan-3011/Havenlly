mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: mapListing.geometry.coordinates, // starting position [lng, lat]
    zoom: 9, // starting zoom
}); 

const marker1 = new mapboxgl.Marker({color: "red"})
.setLngLat(mapListing.geometry.coordinates)
.setPopup(new mapboxgl.Popup({offset: 25})
.setHTML(`<h6 style="color:black;margin: 0; padding: 0;"><b>${mapListing.title}</b></h6>`))
.addTo(map);

const nav = new mapboxgl.NavigationControl({visualizePitch: true});

map
.addControl(new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl
}))
.addControl(nav, 'top-right')
.addControl(new mapboxgl.FullscreenControl());



