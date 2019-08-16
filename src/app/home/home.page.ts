import { AfterContentInit, Component, OnInit, ViewChild} from '@angular/core';
declare var google: { maps: { Map: new (arg0: any, arg1: { center: { lat: number; lng: number; }; zoom: number; }) => void; }; };

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterContentInit {
  map: any;
  @ViewChild('mapElement') MapElement: { nativeElement: any; }
  constructor() {

  }

  ngOnInit(): void {

  }


  ngAfterContentInit(): void{
    this.map = new google.maps.Map(
      this.MapElement.nativeElement,
      {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8
      }
    );
  }

}
