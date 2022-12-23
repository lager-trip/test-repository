// Add your Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoibGFnZXJ0cmlwIiwiYSI6ImNsYWthb3gyYzBrYjAzb3FodGNqczBodGoifQ.ZN2ufFAb1kYidqr_eEE-bA';
const map = new mapboxgl.Map({
    container: 'map', // Specify the container ID
    style: 'mapbox://styles/mapbox/streets-v12', // Specify which map style to use
    center: [-122.42136449, 37.80176523], // Specify the starting position
    zoom: 14.5, // Specify the starting zoom
});


const draw = new MapboxDraw({
    // Instead of showing all the draw tools, show only the line string and delete tools.
    displayControlsDefault: false,
    controls: {
        line_string: true,
        trash: true
    },
    // Set the draw mode to draw LineStrings by default.
    defaultMode: 'draw_line_string',
    styles: [
        // Set the line style for the user-input coordinates.
        {
            id: 'gl-draw-line',
            type: 'line',
            filter: ['all', ['==', '$type', 'LineString'], ['!=', 'mode', 'static']],
            layout: {
                'line-cap': 'round',
                'line-join': 'round'
            },
            paint: {
                'line-color': '#438EE4',
                'line-dasharray': [0.2, 2],
                'line-width': 4,
                'line-opacity': 0.7
            }
        },
        // Style the vertex point halos.
        {
            id: 'gl-draw-polygon-and-line-vertex-halo-active',
            type: 'circle',
            filter: [
                'all',
                ['==', 'meta', 'vertex'],
                ['==', '$type', 'Point'],
                ['!=', 'mode', 'static']
            ],
            paint: {
                'circle-radius': 12,
                'circle-color': '#FFF'
            }
        },
        // Style the vertex points.
        {
            id: 'gl-draw-polygon-and-line-vertex-active',
            type: 'circle',
            filter: [
                'all',
                ['==', 'meta', 'vertex'],
                ['==', '$type', 'Point'],
                ['!=', 'mode', 'static']
            ],
            paint: {
                'circle-radius': 8,
                'circle-color': '#438EE4'
            }
        }
    ]
});

// Add the draw tool to the map.
map.addControl(draw);

// Use the coordinates you drew to make the Map Matching API request
function updateRoute() {
    // Set the profile
    const profile = 'driving';
    // Get the coordinates that were drawn on the map
    const data = draw.getAll();
    const lastFeature = data.features.length - 1;
    const coords = data.features[lastFeature].geometry.coordinates;
    // Format the coordinates
    const newCoords = coords.join(';');
    // Set the radius for each coordinate pair to 25 meters
    const radius = coords.map(() => 25);
    getMatch(newCoords, radius, profile);
}

var request_url = 'some string'

// Make a Map Matching request
async function getMatch(coordinates, radius, profile) {
    // Separate the radiuses with semicolons
    const radiuses = radius.join(';');
    // Create the query
    const query = await fetch(
        `https://api.mapbox.com/matching/v5/mapbox/${profile}/${coordinates}?geometries=geojson&radiuses=${radiuses}&steps=true&access_token=${mapboxgl.accessToken}`,
        { method: 'GET' }
    );
    // request_url = `https://api.mapbox.com/matching/v5/mapbox/${profile}/${coordinates}?geometries=geojson&radiuses=${radiuses}&steps=true&access_token=${mapboxgl.accessToken}`
    const response = await query.json();
    // Handle errors
    if (response.code !== 'Ok') {
        alert(
            `${response.code} - ${response.message}.\n\nFor more information: https://docs.mapbox.com/api/navigation/map-matching/#map-matching-api-errors`
        );
        return;
    }
    // Get the coordinates from the response
    const coords = response.matchings[0].geometry;
    console.log(coords);
    // Code from the next step will go here
}

map.on('draw.create', updateRoute);
map.on('draw.update', updateRoute);


// Draw the Map Matching route as a new layer on the map
function addRoute(coords) {
    // If a route is already loaded, remove it
    if (map.getSource('route')) {
        map.removeLayer('route');
        map.removeSource('route');
    } else {
        // Add a new layer to the map
        map.addLayer({
            id: 'route',
            type: 'line',
            source: {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    properties: {},
                    geometry: coords
                }
            },
            layout: {
                'line-join': 'round',
                'line-cap': 'round'
            },
            paint: {
                'line-color': '#03AA46',
                'line-width': 8,
                'line-opacity': 0.8
            }
        });
    }
}


// Make a Map Matching request
async function getMatch(coordinates, radius, profile) {
    // Separate the radiuses with semicolons
    const radiuses = radius.join(';');
    // Create the query
    const query = await fetch(
        `https://api.mapbox.com/matching/v5/mapbox/${profile}/${coordinates}?geometries=geojson&radiuses=${radiuses}&steps=true&access_token=${mapboxgl.accessToken}`,
        { method: 'GET' }
    );
    document.getElementById('get-url').value = `https://api.mapbox.com/matching/v5/mapbox/${'profile'}/${coordinates}?geometries=geojson&radiuses=${radiuses}&steps=true&access_token=${mapboxgl.accessToken}`;
    console.log(`https://api.mapbox.com/matching/v5/mapbox/${profile}/${coordinates}?geometries=geojson&radiuses=${radiuses}&steps=true&access_token=${mapboxgl.accessToken}`)
    const response = await query.json();
    // Handle errors
    if (response.code !== 'Ok') {
        alert(
            `${response.code} - ${response.message}.\n\nFor more information: https://docs.mapbox.com/api/navigation/map-matching/#map-matching-api-errors`
        );
        return;
    }
    // Get the coordinates from the response
    const coords = response.matchings[0].geometry;
    // Draw the route on the map
    addRoute(coords);

    // fetch(forms.URLField(label='Your website', required=False))

}

function removeRoute() {
    if (!map.getSource('route')) return;
    map.removeLayer('route');
    map.removeSource('route');
}

map.on('draw.delete', removeRoute);