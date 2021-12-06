
This is your site JavaScript code - you can add interactivity and carry out processing
- Initially the JS writes a message to the console, and moves a button you can add from the README
*/

// Print a message in the browser's dev tools console each time the page loads
// Use your menus or right-click / control-click and choose "Inspect" > "Console"
console.log("Violent Crime in Kansas");

* 
Make the "Click me!" button move when the visitor clicks it:
- First add the button to the page by following the "Next steps" in the README
*/
const btn = document.querySelector("button"); // Get the button from the page
// Detect clicks on the button
if (btn) {
  btn.onclick = function() {
    // The JS works in conjunction with the 'dipped' code in style.css
    btn.classList.toggle("dipped");
  };
}

// This is a single line JS comment
/*
This is a comment that can span multiple lines 
- use comments to make your own notes!
*/
const H = Highcharts,
    map = H.maps['countries/us/us-ks-all'];

let chart;

// Add series with state capital bubbles
Highcharts.getJSON("/rate.json", function(json) {
  const data = json.map(p => {
    p.z = p.violent;
    return p;
  });

    chart = Highcharts.mapChart('container', {
        title: {
            text: 'Crime in Kansas'
        },
    subtitle: {
      text: "Source: FBI",
      y: 40
    },

          tooltip: {
      pointFormat: "{point.state/city}<br>" + "Violent Crime: {point.violent}<br>" + "Population: {point.population}"
    },

        xAxis: {
            crosshair: {
                zIndex: 5,
                dashStyle: 'dot',
                snap: false,
                color: 'gray'
            }
        },

        yAxis: {
            crosshair: {
                zIndex: 5,
                dashStyle: 'dot',
                snap: false,
                color: 'gray'
            }
        },

        series: [{
            name: 'Basemap',
            mapData: map,
            borderColor: '#606060',
            nullColor: 'rgba(200, 200, 200, 0.2)',
            showInLegend: false
        }, {
            name: 'Separators',
            type: 'mapline',
            data: H.geojson(map, 'mapline'),
            color: '#101010',
            enableMouseTracking: false,
            showInLegend: false
        }, {
            type: 'mapbubble',
            dataLabels: {
                enabled: true,
                format: '{point.capital}'
            },
            name: 'Cities',
            data: data,
            maxSize: '12%',
            color: H.getOptions().colors[8],
        }]
    });
});

// Display custom label with lat/lon next to crosshairs
document.getElementById('container').addEventListener('mousemove', function (e) {
    if (chart) {
        if (!chart.lbl) {
            chart.lbl = chart.renderer.text('', 0, 0)
                .attr({
                    zIndex: 5
                })
                .css({
                    color: '#505050'
                })
                .add();
        }

        e = chart.pointer.normalize(e);
        const projectedPosition = chart.mapView.pixelsToProjectedUnits({
            x: Math.round(e.chartX - chart.plotLeft),
            y: Math.round(e.chartY - chart.plotTop)
        });
        const position = chart.fromPointToLatLon(projectedPosition);

        chart.lbl.attr({
            x: e.chartX + 5,
            y: e.chartY - 22,
            text: 'Lat: ' + position.lat.toFixed(2) + '<br>Lon: ' + position.lon.toFixed(2)
        });
    }
});

document.getElementById('container').addEventListener('mouseout', function () {
    if (chart && chart.lbl) {
        chart.lbl = chart.lbl.destroy();
    }
});
   
