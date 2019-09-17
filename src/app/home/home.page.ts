
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

  file: any;
  handleFileInput(event: any) {
    this.file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      this.draw.add(JSON.parse(reader.result.toString()));
    };
    reader.readAsText(this.file);
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

    document.getElementById('Import_geojson').onchange = (event) => {
      this.handleFileInput(event); // TODO this function can likely be moved in here
    };
  }
}
