mapboxgl.accessToken =
    'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
let map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [-95.5, 40], // starting position [lng, lat]
    zoom: 4, // starting zoom
    projection: 'albers'
});

const grades = [1, 2000, 4000, 6500, 9000], 
    colors = ['rgb(237,248,251)', 'rgb(178,226,226)', 'rgb(102,194,164)', 'rgb(44,162,95)', 'rgb(0,109,44)'], 
    radii = [3, 5, 7, 9, 11];
    layers = [
        '1-1999',
        '2000-3999',
        '4000-6499',
        '6500-8999',
        '9000+'
    ];

map.on('load', () => {
    map.addSource('covid_cases', {
        type: 'geojson',
        data: 'assets/us-covid-2020-counts.json'
    });

    map.addLayer({
        'id': 'cases-layer',
        'type': 'circle',
        'source': 'covid_cases',

        'paint': { // increase the radius of the circle as the zoom level and dbh value increases
            'circle-radius': {
                'property': 'cases',
                'stops': [
                    [{zoom: 5, value: grades[0]}, radii[0]],
                    [{zoom: 5, value: grades[1]}, radii[1]],
                    [{zoom: 5, value: grades[2]}, radii[2]],
                    [{zoom: 5, value: grades[3]}, radii[3]], 
                    [{zoom: 5, value: grades[4]}, radii[4]]
            ]},
            'circle-color': {
                'property': 'cases',
                'stops': [
                    [grades[0], colors[0]],
                    [grades[1], colors[1]],
                    [grades[2], colors[2]],
                    [grades[3], colors[3]],
                    [grades[4], colors[4]]
                ]},
                'circle-stroke-color': 'white',
                'circle-stroke-width': 1,
                'circle-opacity': 0.6
            }
        });

            // click on tree to view magnitude in a popup
    map.on('click', 'cases-layer', (event) => {
        new mapboxgl.Popup()
        .setLngLat(event.features[0].geometry.coordinates)
        .setHTML(`<strong>State</strong> ${event.features[0].properties.state} <br>
                  <strong>County</strong> ${event.features[0].properties.county} <br>
                  <strong>Cases:</strong> ${event.features[0].properties.cases} <br>`)
        .addTo(map);
    });
});

/// create legend
const legend = document.getElementById('legend');

//set up legend grades and labels
var labels = ['<strong>Cases</strong>'], vbreak;

//iterate through grades and create a scaled circle and label for each
for (var i = 0; i < grades.length; i++) { vbreak = layers[i];
    // you need to manually adjust the radius of each dot on the legend 
    // in order to make sure the legend can be properly referred to the dot on the map.
    dot_radii = 1.7 * radii[i];
    labels.push(
        '<p class="break"><i class="dot" style="background:' + colors[i] + '; width: ' + dot_radii +
        'px; height: ' + dot_radii + 'px; "></i> <span class="dot-label" style="top: ' + dot_radii / 2 + 'px;">' + 
        vbreak + '</span></p>');
        }
        
// add the data source
const source =
    '<p style="font-size:10pt">Source: NYTimes <a href="https://github.com/nytimes/covid-19-data/blob/43d32dde2f87bd4dafbb7d23f5d9e878124018b8/live/us-counties.csv">(Case)</a>, US Census Bureau<a href="https://data.census.gov/cedsci/table?g=0100000US%24050000&d=ACS%205-Year%20Estimates%20Data%20Profiles&tid=ACSDP5Y2018.DP05&hidePreview=true">(Population)</a> & <a href="https://www.census.gov/geographies/mapping-files/time-series/geo/carto-boundary-file.html">(Shapefile)</a></p>'
// combine all the html codes.
legend.innerHTML = labels.join('')