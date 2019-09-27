
import { Component, OnInit } from '@angular/core';
import { ContourControl } from './buttons/contours';
import { SatelliteViewControl } from './buttons/satelliteview';

import * as mapboxgl from 'mapbox-gl';
import * as MapBoxDraw from '@mapbox/mapbox-gl-draw';
import 'mapbox-gl-draw-freehand-mode';
import * as kml2json from '@mapbox/togeojson';
import * as shp from 'shpjs';

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
    const reader = new FileReader();
    this.file = event.target.files[0];

    switch (this.file.type) {
      case 'application/geo+json': {
        reader.onload = (e) => {
          this.draw.add(JSON.parse(reader.result.toString()));
        };
        reader.readAsText(this.file);
        break;
      }
      case 'application/vnd.google-earth.kml+xml': {
        const parser = new DOMParser();
        reader.onload = (e) => {
          this.parsedKML = parser.parseFromString(reader.result.toString(), 'text/xml');
          this.geojson = kml2json.kml(this.parsedKML);
          this.draw.add(this.geojson);
        };
        reader.readAsText(this.file);
        break;
      }
      case 'application/zip' || 'application/x-qgis': {
        reader.onload = (e) => {
          console.log(shp.parseZip(reader.result));
          this.draw.add(shp.parseZip(reader.result));
        };
        reader.readAsArrayBuffer(this.file);
        break;
      }
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
    this.map.addControl(new ContourControl());

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
    };

    const Map = this.map;
    document.getElementById('downloadpng').onclick = function() {

      let link = document.createElement('a');
      link.download = 'image.png';

      Map.getCanvas().toBlob(function(blob) {
        link.href = URL.createObjectURL(blob);
        console.log(blob);
        console.log(link.href);
        link.click();
      }, 'image/png');
    };

    // *** Map Files Inport
    document.getElementById('Import_file').onchange = (event) => {
      this.handleFileInput(event); // TODO handleFileInput function can likely be moved in here
    };
  }
}
