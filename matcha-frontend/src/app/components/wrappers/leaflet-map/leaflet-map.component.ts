import {
  Component,
  ElementRef,
  OnInit,
  computed,
  effect,
  inject,
  input,
  model,
  viewChild,
} from '@angular/core';
import * as L from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { I18nService } from '../../../core/services/i18nService/i18n.service';

export interface MapCoordinates {
  lat: number;
  lng: number;
}

@Component({
  selector: 'app-leaflet-map',
  standalone: true,
  imports: [],
  template: `<div #map class="h-full w-full" style="min-height: 400px;"></div>`,
  host: {
    class: 'block rounded-lg overflow-hidden shadow-md',
  },
})
export class LeafletMapComponent implements OnInit {
  readonly #i18nService = inject(I18nService);

  private readonly mapRef = viewChild.required<ElementRef<HTMLDivElement>>('map');

  readonly pointLocation = model.required<MapCoordinates>();
  readonly zoomLevel = input<number>(15);
  readonly preventSelection = input<boolean>(false);
  readonly perimeterRadius = input<number>(0);

  readonly #marker = computed(() => {
    const loc = this.pointLocation();
    return L.marker([loc.lat, loc.lng]);
  });

  readonly #markerPerimeterRadius = computed(() => {
    const pointLocation = this.pointLocation();
    const perimeterRadius = this.perimeterRadius();

    if (perimeterRadius <= 0) return null;

    return L.circle([pointLocation.lat, pointLocation.lng], {
      radius: perimeterRadius * 1000,
      color: '#3b82f6',
      fillColor: '#60a5fa',
      fillOpacity: 0.2,
      weight: 2,
    });
  });

  private map?: L.Map;

  constructor() {
    effect(() => {
      if (!this.map) return;
      const marker = this.#marker();
      const circle = this.#markerPerimeterRadius();
      const loc = this.pointLocation();

      this.map.eachLayer((layer) => {
        if (layer instanceof L.Marker || layer instanceof L.Circle) {
          this.map?.removeLayer(layer);
        }
      });

      marker.addTo(this.map);

      if (circle) {
        circle.addTo(this.map);
        this.map.fitBounds(circle.getBounds(), { padding: [20, 20] });
      } else {
        const mapCenter = this.map.getCenter();
        if (mapCenter.lat !== loc.lat || mapCenter.lng !== loc.lng) {
          this.map.setView([loc.lat, loc.lng], this.zoomLevel());
        }
      }
    });
  }

  ngOnInit() {
    this.initMap();
    this.setupMapClick();
  }

  private initMap() {
    const baseMapURl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const initialLoc = this.pointLocation();

    this.map = L.map(this.mapRef().nativeElement).setView(
      [initialLoc.lat, initialLoc.lng],
      this.zoomLevel(),
    );
    L.tileLayer(baseMapURl).addTo(this.map);

    this.#marker().addTo(this.map);
    this.#markerPerimeterRadius()?.addTo(this.map);

    const geoProvider = new OpenStreetMapProvider();
    const searchControl = new (GeoSearchControl as any)({
      provider: geoProvider,
      style: 'bar',
      showMarker: true,
      showPopup: false,
      autoClose: true,
      retainZoomLevel: false,
    });

    this.map.addControl(searchControl);
    this.map.on('locationfound', (event: L.LocationEvent) => {
      this.pointLocation.set({ lat: event.latlng.lat, lng: event.latlng.lng });
      this.map?.setView(event.latlng, this.zoomLevel());
    });

    this.map.on('locationerror', (error) => {
      alert(
        `${this.#i18nService.translateSnapshot('Erreur de géolocalisation')} : ${error.message}`,
      );
    });

    const LocateControl = L.Control.extend({
      options: { position: 'topleft' },
      onAdd: (mapInstance: L.Map) => {
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        const button = L.DomUtil.create('a', '', container);
        button.innerHTML = '📍';
        button.classList.add('cursor-pointer', 'text-lg', 'flex', 'items-center', 'justify-center');
        button.title = this.#i18nService.translateSnapshot('Centrer sur ma position');

        L.DomEvent.on(button, 'click', (e) => {
          L.DomEvent.stopPropagation(e);
          mapInstance.locate({ setView: false, enableHighAccuracy: true });
        });

        return container;
      },
    });

    this.map.addControl(new LocateControl());
  }

  private setupMapClick() {
    if (!this.map) return;

    this.map.on('click', async (event: L.LeafletMouseEvent) => {
      if (this.preventSelection()) return;
      const { lat, lng } = event.latlng;
      this.pointLocation.set({ lat, lng });
    });
  }
}
