// add contour overlay

export class ContourControl {

    map: mapboxgl.Map;
    button: HTMLButtonElement;
    container: HTMLElement;

    onAdd(map: mapboxgl.Map) {
        this.map = map;
        this.button = document.createElement('button');
        this.button.className = 'mapboxgl-ctrl-icon mapboxgl-ctrl-pitchtoggle-3d';
        this.button.type = 'button';
        this.button.onclick = () => {
            if (this.map.getLayer('contour-line')) {
                if (this.map.getLayoutProperty('contour-line', 'visibility') === 'none') {
                    this.map.setLayoutProperty('contour-line', 'visibility', 'visible');
                    this.map.setLayoutProperty('contour-label', 'visibility', 'visible');
                } else {
                    this.map.setLayoutProperty('contour-line', 'visibility', 'none');
                    this.map.setLayoutProperty('contour-label', 'visibility', 'none');
                }
            } else {
                    this.map.addLayer(
                        {
                            id: 'contour-line',
                            source: {
                                type: 'vector',
                                url: 'mapbox://mapbox.mapbox-terrain-v2'
                            },
                            'source-layer': 'contour',
                            type: 'line',
                            layout: {
                                visibility: 'visible',
                            },
                            paint: {
                                'line-color': '#ffffff'
                            }
                        }
                );
                    this.map.addLayer(
                    {
                        id: 'contour-label',
                        source: {
                            type: 'vector',
                            url: 'mapbox://mapbox.mapbox-terrain-v2'
                        },
                        'source-layer': 'contour',
                        type: 'symbol',
                        layout: {
                            visibility: 'visible',
                            'text-field': '{ele} m',
                            'symbol-placement': 'line',
                            'text-pitch-alignment': 'viewport',
                            'text-max-angle': 25,
                            'text-padding': 5,
                            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Regular'],
                            'text-size': { base: 1, stops: [[15, 9.5], [20, 12]] }
                        },
                        paint: {
                            'text-color': '#003366',
                            'text-halo-width': 1,
                            'text-halo-blur': 0,
                            'text-halo-color': 'hsla(0, 0%, 100%, 0.5)'
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
