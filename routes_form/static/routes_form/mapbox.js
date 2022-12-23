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