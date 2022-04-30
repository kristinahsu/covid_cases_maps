mapboxgl.accessToken = 'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';

        const map = new mapboxgl.Map({
            container: 'map', // container ID
            style: 'mapbox://styles/mapbox/light-v10', // style URL
            zoom: 4, // starting zoom
            center: [-100, 40], // starting center
            projection: 'albers'
        });

        async function geojsonFetch() { 
            let response = await fetch('assets/us-covid-2020-rates.json');
            let stateData = await response.json();

            map.on('load', function loadingData() {
                map.addSource('covid_rates', {
                    type: 'geojson',
                    data: 'assets/us-covid-2020-rates.json'
                });

                map.addLayer({
                    'id': 'rates-layer',
                    'type': 'fill',
                    'source': 'covid_rates',
                    'paint': {
                        'fill-color': [
                            'step',
                            ['get', 'rates'],
                            '#FFEDA0', 20, 
                            '#FED976', 40,
                            '#FEB24C', 60,
                            '#FD8D3C', 80,
                            '#FC4E2A', 100,
                            '#E31A1C', 150,
                            '#BD0026', 200,                    
                            "#800026"   
                        ],
                        'fill-outline-color': '#BBBBBB',
                        'fill-opacity': 0.7,
                    }
                });

                const layers = [
                    '0-19',
                    '20-39',
                    '40-59',
                    '60-79',
                    '80-99',
                    '100-149',
                    '150-199',
                    '200 and more'
                ];
                const colors = [
                    '#FFEDA070',
                    '#FED97670',
                    '#FEB24C70',
                    '#FD8D3C70',
                    '#FC4E2A70',
                    '#E31A1C70',
                    '#BD002670',
                    '#80002670'
                ];

                // create legend
                const legend = document.getElementById('legend');
                legend.innerHTML = "<b>Rates<br>(cases / per 1000 people)</b><br><br>";

                layers.forEach((layer, i) => {
                    const color = colors[i];
                    const item = document.createElement('div');
                    const key = document.createElement('span');
                    key.className = 'legend-key';
                    key.style.backgroundColor = color;

                    const value = document.createElement('span');
                    value.innerHTML = `${layer}`;
                    item.appendChild(key);
                    item.appendChild(value);
                    legend.appendChild(item);
                });
            });

            map.on('mousemove', ({point}) => {
                const county = map.queryRenderedFeatures(point, {
                    layers: ['rates-layer']
                });
                document.getElementById('text-escription').innerHTML = county.length ?
                    `<h3>${county[0].properties.county}, ${county[0].properties.state}</h3>
                    <p><strong><em>${county[0].properties.rates}</strong> cases per 1000 people</em></p>` :
                    `<p>Hover over a county to examine the data!</p>`;
            });
        };

        geojsonFetch();