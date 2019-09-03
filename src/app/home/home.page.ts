
import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import * as MapBoxDraw from '@mapbox/mapbox-gl-draw';


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

    this.draw = new MapBoxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        point: true,
        trash: true,
      }
    });

    this.map.addControl(new mapboxgl.NavigationControl());
    this.map.addControl(this.draw);
    this.map.addControl(new SatelliteViewControl());

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
  }

