
import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'src-app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})

export class HomePage implements OnInit {

  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/outdoors-v9';
  lat = 37.75;
  lng = -122.41;

  constructor() {
    Object.getOwnPropertyDescriptor(mapboxgl, "accessToken").set('pk.eyJ1IjoiaHp6enoiLCJhIjoiY2p6cG1hOGFoMDE3dzNtbjQ2ZHpiZmI4cSJ9.5PMTx2nHNouS-uTeNO8FVQ')
    
  }

  ngOnInit(){
    
  }

  ionViewDidLoad(){
   this.buildMap();
  }

  buildMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 13,
      center: [this.lng, this.lat]
    });

console.log(this.map);
    }
  }
