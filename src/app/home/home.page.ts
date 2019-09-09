
import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import * as MapBoxDraw from '@mapbox/mapbox-gl-draw';
import 'mapbox-gl-draw-freehand-mode';

class SatelliteViewControl {

  map: mapboxgl.Map;
  button: HTMLButtonElement;
  container: HTMLElement;
  

  onAdd(map: mapboxgl.Map) {
    this.map = map;
    this.button = document.createElement('button');
    this.button.className = 'mapboxgl-ctrl-icon mapboxgl-ctrl-pitchtoggle-3d';
    this.button.type = 'button';
    this.button.onclick = () => {
      if (map.getStyle().name === 'Mapbox Streets') {
        this.map.setStyle('mapbox://styles/mapbox/satellite-v9');
      } else {
        this.map.setStyle('mapbox://styles/mapbox/streets-v11');
      }
    };

    this.container = document.createElement('div');
    this.container.className = 'mapboxgl-ctrl-group mapboxgl-ctrl';
    this.container.appendChild(this.button);

    return this.container;
  }

  onRemove() {
    this.button.parentNode.removeChild(this.button);
    this.map = undefined;
  }
}




@Component({
  selector: 'src-app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {

  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat = -35.28;
  lng = 149.13;

  draw: MapBoxDraw;

  constructor() {
    Object.getOwnPropertyDescriptor(mapboxgl, 'accessToken')
          .set('pk.eyJ1IjoiaHp6enoiLCJhIjoiY2p6cG1hOGFoMDE3dzNtbjQ2ZHpiZmI4cSJ9.5PMTx2nHNouS-uTeNO8FVQ');
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
   this.buildMap();
  }

  buildMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 11,
      center: [this.lng, this.lat]
    });

    this.draw = new MapBoxDraw();

    this.map.addControl(new mapboxgl.NavigationControl());
    this.map.addControl(this.draw);
    this.map.addControl(new SatelliteViewControl());

    this.map.on('draw.create', () => console.log(this.draw.getAll()));

    var Draw = this.draw
    document.getElementById('export').onclick = function(e) {
      var data = Draw.getAll();

      if (data.features.length > 0) {
          var convertedData = 'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data));
          document.getElementById('export').setAttribute('href', 'data:' + convertedData);
          document.getElementById('export').setAttribute('download','data.geojson');    
      } else {
          alert("Please draw some data");
      }
      
      }

    }

    import_geojson() {

        var url = 'https://raw.githubusercontent.com/Yutian98/tests/master/data.geojson'

        this.map.addLayer({
            'id': 'geojson_Polygon',
            'type': 'fill',
            'source': {
                'type': 'geojson',
                'data': url
            },
            "paint": {
                "fill-color": "#888888",
                "fill-opacity": 0.4
            },
            "filter": ["==", "$type", "Polygon"]
        });

        this.map.addLayer({
            'id': 'geojson_Point',
            'type': 'circle',
            'source': {
                'type': 'geojson',
                'data': url
            },
            "paint": {
                "circle-radius": 5,
                "circle-color": "#ff0000"
            },
            "filter": ["==", "$type", "Point"]
        });

        this.map.addLayer({
            'id': 'geojson_LineString',
            'type': 'line',
            'source': {
                'type': 'geojson',
                'data': url
            },
            "paint": {
                "line-color": "#888888",
                "line-width": 4
            },
            "filter": ["==", "$type", "LineString"]
        });


        
        /*
        this.map.addLayer({
            "id": "points",
            "type": "symbol",
            "source": {
                "type": "geojson",
                "data": {
                    "type": "FeatureCollection",
                    "features": [{
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [-77.03238901390978, 38.913188059745586]
                        },
                        "properties": {
                            "title": "Mapbox DC",
                            "icon": "monument"
                        }
                    }, {
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [-122.414, 37.776]
                        },
                        "properties": {
                            "title": "Mapbox SF",
                            "icon": "harbor"
                        }
                    }]
                }
            },
            "layout": {
                "icon-image": "{icon}-15",
                "text-field": "{title}",
                "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                "text-offset": [0, 0.6],
                "text-anchor": "top"
            }
        });
       */
    }

  }

