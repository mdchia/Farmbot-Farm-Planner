
import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import * as MapBoxDraw from '@mapbox/mapbox-gl-draw';

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
        trash: true
      }
    });
    this.map.addControl(this.draw);
    this.map.addControl(new mapboxgl.NavigationControl());
    }
  }
