
import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import * as MapBoxDraw from '@mapbox/mapbox-gl-draw';
import 'mapbox-gl-draw-freehand-mode';
import * as kml2json from '@mapbox/togeojson';
import * as shapefile from 'shapefile';

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


class contourControl {

    map: mapboxgl.Map;
    button: HTMLButtonElement;
    container: HTMLElement;

    onAdd(map: mapboxgl.Map) {
        this.map = map;
        this.button = document.createElement('button');
        this.button.className = 'mapboxgl-ctrl-icon mapboxgl-ctrl-pitchtoggle-3d';
        this.button.type = 'button';
        this.button.onclick = () => {
            if (this.map.getLayer("contour-line")) {
                if (this.map.getLayoutProperty("contour-line", 'visibility') === 'none') {
                    this.map.setLayoutProperty("contour-line", 'visibility', 'visible');
                    this.map.setLayoutProperty("contour-label", 'visibility', 'visible');
                }
                else {
                    this.map.setLayoutProperty("contour-line", 'visibility', 'none');
                    this.map.setLayoutProperty("contour-label", 'visibility', 'none');
                }
            } else {
                    this.map.addLayer(
                        {
                            "id": "contour-line",
                            "source": {
                                "type": "vector",
                                "url": "mapbox://mapbox.mapbox-terrain-v2"
                            },
                            "source-layer": "contour",
                            "type": "line",
                            'layout': {
                                'visibility': 'visible',
                            },
                            "paint": {
                                "line-color": "#ffffff"
                            }
                        }
                );
                this.map.addLayer(
                    {
                        "id": "contour-label",
                        "source": {
                            "type": "vector",
                            "url": "mapbox://mapbox.mapbox-terrain-v2"
                        },
                        "source-layer": "contour",
                        "type": "symbol",
                        'layout': {
                            'visibility': 'visible',
                            "text-field": "{ele} m",
                            "symbol-placement": "line",
                            "text-pitch-alignment": "viewport",
                            "text-max-angle": 25,
                            "text-padding": 5,
                            "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Regular"],
                            "text-size": { "base": 1, "stops": [[15, 9.5], [20, 12]] }
                        },
                        'paint': {
                            "text-color": "#003366",
                            "text-halo-width": 1,
                            "text-halo-blur": 0,
                            "text-halo-color": "hsla(0, 0%, 100%, 0.5)"
                        }
                    }
                );
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
  parsedKML: XMLDocument;
  geojson: any;
  file: any;
  coordinate: mapboxgl.LngLat;

  handleFileInput(event: any) {
    this.file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      this.draw.add(JSON.parse(reader.result.toString()));
    };
    reader.readAsText(this.file);
  }

  kml_Geo(event: any) {
    this.file = event.target.files[0];
    const reader = new FileReader();
    const parser = new DOMParser();
    reader.onload = (e) => {
      console.log(reader.result.toString());
      this.parsedKML = parser.parseFromString(reader.result.toString(), 'text/xml');
      this.geojson = kml2json.kml(this.parsedKML);
      this.draw.add(this.geojson);
    };
    reader.readAsText(this.file);
  }

   async shp_Geo (event: any) {
    this.file = event.target.files[0];
    const source = await shapefile.openShp("https://cdn.rawgit.com/mbostock/shapefile/master/test/points.shp");
    while (true) {
      const result = await source.read();
      if (result.done) break;
      this.draw.add(result.value);
    }
  } 


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
      center: [this.lng, this.lat],
      preserveDrawingBuffer: true
    });

    this.draw = new MapBoxDraw();

    this.map.addControl(new mapboxgl.NavigationControl());
    this.map.addControl(this.draw);
    this.map.addControl(new SatelliteViewControl());
    this.map.addControl(new contourControl());

    this.map.on('draw.create', () => console.log(this.draw.getAll()));

    const Draw = this.draw;
    document.getElementById('export').onclick = () => {
      const data = Draw.getAll();

      if (data.features.length > 0) {
        const convertedData = 'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data));
        document.getElementById('export').setAttribute('href', 'data:' + convertedData);
        document.getElementById('export').setAttribute('download', 'data.geojson');
      } else {
        alert('Please draw some data');
        return false;
      }
    }

    const Map = this.map
    document.getElementById("downloadpng").onclick = function() {

      var link = document.createElement("a");
      link.download = "image.png";

      Map.getCanvas().toBlob(function(blob){
        link.href = URL.createObjectURL(blob);
        console.log(blob);
        console.log(link.href);
        link.click();
      }, 'image/png');
    };

    document.getElementById('dropbtn').addEventListener("click", function(){
      var menuBox = document.getElementById('dropdown-content');    
      if(menuBox.style.display == "block") { // if is menuBox displayed, hide it
        menuBox.style.display = "none";
      }
      else { // if is menuBox hidden, display it
        menuBox.style.display = "block";
      }
    });

    // *** Map Files Inport
    document.getElementById('Import_geojson').onchange = (event) => {
      this.handleFileInput(event); // TODO handleFileInput function can likely be moved in here
    };

    document.getElementById('Import_kml').onchange = (event) => {
      this.kml_Geo(event);
    };

    document.getElementById('Import_shapefile').onchange = (event) => {
      this.shp_Geo(event);
    };

    // *** Icon Images Loading
    Map.on('load', function() {
      // Tree-icon
      Map.loadImage('https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Cat_silhouette.svg/400px-Cat_silhouette.svg.png', function(error, image) {
        if (error) throw error;
        Map.addImage('tree', image); 
      });
      // Tomato-icon
      Map.loadImage('https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Cat_silhouette.svg/400px-Cat_silhouette.svg.png', function(error, image) {
        if (error) throw error;
        Map.addImage('tomato', image);
      });
      // Eggplant-icon
      Map.loadImage('https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Cat_silhouette.svg/400px-Cat_silhouette.svg.png', function(error, image) {
        if (error) throw error;
        Map.addImage('eggplant', image);
      });
      // Carrot icon
      Map.loadImage('https://www.flaticon.com/premium-icon/carrot_2072991.png', function(error, image) {
        if (error) throw error;
        Map.addImage('carrot', image);
      });
    });

    var selected_mode;
    var selectedTool;
    // *** Farm_Design Toolbox
    document.getElementById("tree").addEventListener("click", function(){
      Draw.changeMode('draw_point'); 
      selected_mode = 'draw_point'; 
      selectedTool = "tree";  
      
      Map.on('Draw.modechange', e => { 
        Draw.changeMode(selected_mode);
      });
    });

    document.getElementById("tomato").addEventListener("click", function(){
      Draw.changeMode('draw_point'); 
      selected_mode = 'draw_point'; 
      selectedTool = "tomato";
      
      Map.on('Draw.modechange', e => { 
        Draw.changeMode(selected_mode);
      });
    });

    document.getElementById("eggplant").addEventListener("click", function(){
      Draw.changeMode('draw_point'); 
      selected_mode = 'draw_point'; 
      selectedTool = "eggplant"; 

      Map.on('Draw.modechange', e => { 
        Draw.changeMode(selected_mode);
      });
    });

    document.getElementById("carrot").addEventListener("click", function(){
      Draw.changeMode('draw_point'); 
      selected_mode = 'draw_point'; 
      selectedTool = "carrot"; 

      Map.on('Draw.modechange', e => { 
        Draw.changeMode(selected_mode);
      });
    });
 

    // *** Draw icons with Map clicks
    Map.on('click', function (e) {
      var imageId = e.lngLat.lng + e.lngLat.lat + "";
      Map.addLayer({
        "id": imageId,
        "type": "symbol",
        "source": {
          "type": "geojson",
          "data": {
            "type": "FeatureCollection",
            "features": [{
              "type": "Feature",
              "geometry": {
                "type": "Point",
                "coordinates": [e.lngLat.lng, e.lngLat.lat]
              },
              "properties": {}
            }]
          }
        },
        "layout": {
          "icon-image": selectedTool,
          "icon-size" : 1
        }
      });
    });
  }
}
