// add satellite view

export class SatelliteViewControl {

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
