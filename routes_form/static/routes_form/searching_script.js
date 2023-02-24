var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};

function success(pos) {
    crd = pos.coords;
    loadMap(crd.longitude, crd.latitude);
};

function error(err) {
    console.log(`ERROR(${err.code}): ${err.message}`);
    loadMap(-73.935242, 40.730610);
};

$("#select-route").change(function () {
    var input = $('#select-route option:selected').val();


    $.ajax({
        url: '/get_response/',
        headers: { "X-CSRFToken": $('meta[name="csrf-token"]').attr('content') },
        data: {
            'inputValue': input
        },
        dataType: 'json',
        success: function (data) {
            document.getElementById('p-text').innerHTML = data["about"];
            coordinates_from_table = data["url"];

        }
    });
});

navigator.geolocation.getCurrentPosition(success, error, options);

function loadMap(lng, lat) {
    coordinates_from_table = [
        [-122.48369693756104, 37.83381888486939],
        [-122.48348236083984, 37.83317489144141],
        [-122.48339653015138, 37.83270036637107],
        [-122.48356819152832, 37.832056363179625],
        [-122.48404026031496, 37.83114119107971],
        [-122.48404026031496, 37.83049717427869],
        [-122.48348236083984, 37.829920943955045],
        [-122.48356819152832, 37.82954808664175],
        [-122.48507022857666, 37.82944639795659],
        [-122.48610019683838, 37.82880236636284],
        [-122.48695850372314, 37.82931081282506],
        [-122.48700141906738, 37.83080223556934],
        [-122.48751640319824, 37.83168351665737],
        [-122.48803138732912, 37.832158048267786],
        [-122.48888969421387, 37.83297152392784],
        [-122.48987674713133, 37.83263257682617],
        [-122.49043464660643, 37.832937629287755],
        [-122.49125003814696, 37.832429207817725],
        [-122.49163627624512, 37.832564787218985],
        [-122.49223709106445, 37.83337825839438],
        [-122.49378204345702, 37.83368330777276]
    ]

    mapboxgl.accessToken = 'pk.eyJ1IjoibGFnZXJ0cmlwIiwiYSI6ImNsYWthb3gyYzBrYjAzb3FodGNqczBodGoifQ.ZN2ufFAb1kYidqr_eEE-bA';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [lng, lat],
        zoom: 14
    });
    var l = 'data-update';
    var s = 'data-update';
    var layerList = document.getElementById('menu');
    var inputs = layerList.getElementsByTagName('input');

    function addSource() {
        map.addSource(s, {
            'type': 'geojson',
            'data': {
                'type': 'Feature',
                'properties': {},
                'geometry': {
                    'type': 'LineString',
                    'coordinates': coordinates_from_table
                }
            }
        });
    }
    var btn = document.getElementById('sender');

    function addLayer() {
        map.addLayer({
            'id': l,
            'type': 'line',
            'source': s,
            'layout': {
                'line-join': 'round',
                'line-cap': 'round'
            },
            'paint': {
                'line-color': '#FA2742',
                'line-width': 8
            }
        });

    }
    
    map.on('style.load', function () {
        addSource();
        addLayer();
        toggleSidebar('left');
    });

    btn.addEventListener('click', function () {
        map.getSource('data-update').setData({
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "geometry": {
                    "type": "LineString",
                    "coordinates": coordinates_from_table,
                }
            }]
        });
        map.flyTo({
            center: coordinates_from_table[0],
            speed: 3,
            zoom: 14,
        })
    })

    function switchLayer(layer) {
        var layerId = layer.target.id;
        map.setStyle('mapbox://styles/mapbox/' + layerId);
        if (layerId == 'outdoors-v12') {
            map.setPaintProperty('data-update', 'line-color', '#4056A1');
            btn.innerHTML = '#3AAFA9'
        }
        toggleSidebar('left');
    }

    for (var i = 0; i < inputs.length; i++) {
        inputs[i].onclick = switchLayer;
    }

    map.addControl(new mapboxgl.NavigationControl());


    map.addControl(
        new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            // When active the map will receive updates to the device's location as it changes.
            trackUserLocation: true,
            // Draw an arrow next to the location dot to indicate which direction the device is heading.
            showUserHeading: true
        })
    );
}


function toggleSidebar(id) {
    const elem = document.getElementById(id);
    // Add or remove the 'collapsed' CSS class from the sidebar element.
    // Returns boolean "true" or "false" whether 'collapsed' is in the class list.
    const collapsed = elem.classList.toggle('collapsed');
    const padding = {};
    // 'id' is 'right' or 'left'. When run at start, this object looks like: '{left: 300}';
    padding[id] = collapsed ? 0 : 300; // 0 if collapsed, 300 px if not. This matches the width of the sidebars in the .sidebar CSS class.
    // Use `map.easeTo()` with a padding option to adjust the map's center accounting for the position of sidebars.
    map.easeTo({
        padding: padding,
        duration: 1000 // In ms. This matches the CSS transition duration property.
    });
}



$(function () {
    var rangePercent = $('[type="range"]').val();
    $('[type="range"]').on('change input', function () {
        rangePercent = $('[type="range"]').val();
        $('h4').html(rangePercent + '<span></span>');
        $('[type="range"], h4>span').css('filter', 'hue-rotate(-' + rangePercent + 'deg)');
        // $('h4').css({'transform': 'translateX(calc(-50% - 20px)) scale(' + (1+(rangePercent/100)) + ')', 'left': rangePercent+'%'});
        $('h4').css({ 'transform': 'translateX(-50%) scale(' + (1 + (rangePercent / 100)) + ')', 'left': rangePercent + '%' });
    });
});

