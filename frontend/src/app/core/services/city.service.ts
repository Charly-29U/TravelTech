import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, catchError } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface City {
  id: number;
  name: string;
  country: string;
  utcOffset: number;
  lat: number;
  lng: number;
}

@Injectable({
  providedIn: 'root'
})
export class CityService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/cities`;

  getCities(): Observable<City[]> {
    const mockCities: City[] = [
      // Colombia
      { id: 1, name: 'Bogotá', country: 'Colombia', utcOffset: -5, lat: 4.711, lng: -74.072 },
      { id: 2, name: 'Medellín', country: 'Colombia', utcOffset: -5, lat: 6.244, lng: -75.581 },
      { id: 3, name: 'Cali', country: 'Colombia', utcOffset: -5, lat: 3.451, lng: -76.532 },
      { id: 4, name: 'Barranquilla', country: 'Colombia', utcOffset: -5, lat: 10.968, lng: -74.781 },
      { id: 5, name: 'Cartagena', country: 'Colombia', utcOffset: -5, lat: 10.391, lng: -75.479 },
      // Estados Unidos
      { id: 6, name: 'Nueva York', country: 'Estados Unidos', utcOffset: -5, lat: 40.712, lng: -74.006 },
      { id: 7, name: 'San Francisco', country: 'Estados Unidos', utcOffset: -8, lat: 37.774, lng: -122.419 },
      { id: 8, name: 'Los Ángeles', country: 'Estados Unidos', utcOffset: -8, lat: 34.052, lng: -118.243 },
      { id: 9, name: 'Chicago', country: 'Estados Unidos', utcOffset: -6, lat: 41.878, lng: -87.629 },
      { id: 10, name: 'Austin', country: 'Estados Unidos', utcOffset: -6, lat: 30.267, lng: -97.743 },
      // Francia
      { id: 11, name: 'París', country: 'Francia', utcOffset: 1, lat: 48.856, lng: 2.352 },
      { id: 12, name: 'Lyon', country: 'Francia', utcOffset: 1, lat: 45.764, lng: 4.835 },
      { id: 13, name: 'Marsella', country: 'Francia', utcOffset: 1, lat: 43.296, lng: 5.369 },
      { id: 14, name: 'Toulouse', country: 'Francia', utcOffset: 1, lat: 43.604, lng: 1.444 },
      { id: 15, name: 'Niza', country: 'Francia', utcOffset: 1, lat: 43.710, lng: 7.261 },
      // Jamaica
      { id: 16, name: 'Kingston', country: 'Jamaica', utcOffset: -5, lat: 17.971, lng: -76.793 },
      { id: 17, name: 'Montego Bay', country: 'Jamaica', utcOffset: -5, lat: 18.476, lng: -77.918 },
      { id: 18, name: 'Spanish Town', country: 'Jamaica', utcOffset: -5, lat: 17.996, lng: -76.955 },
      { id: 19, name: 'Portmore', country: 'Jamaica', utcOffset: -5, lat: 17.942, lng: -76.873 },
      { id: 20, name: 'Ocho Ríos', country: 'Jamaica', utcOffset: -5, lat: 18.407, lng: -77.103 },
      // Japón
      { id: 21, name: 'Tokio', country: 'Japón', utcOffset: 9, lat: 35.676, lng: 139.650 },
      { id: 22, name: 'Osaka', country: 'Japón', utcOffset: 9, lat: 34.693, lng: 135.502 },
      { id: 23, name: 'Yokohama', country: 'Japón', utcOffset: 9, lat: 35.443, lng: 139.638 },
      { id: 24, name: 'Nagoya', country: 'Japón', utcOffset: 9, lat: 35.181, lng: 136.906 },
      { id: 25, name: 'Fukuoka', country: 'Japón', utcOffset: 9, lat: 33.590, lng: 130.401 },
      // España
      { id: 26, name: 'Madrid', country: 'España', utcOffset: 1, lat: 40.416, lng: -3.703 },
      { id: 27, name: 'Barcelona', country: 'España', utcOffset: 1, lat: 41.385, lng: 2.173 },
      { id: 28, name: 'Valencia', country: 'España', utcOffset: 1, lat: 39.469, lng: -0.376 },
      { id: 29, name: 'Sevilla', country: 'España', utcOffset: 1, lat: 37.389, lng: -5.984 },
      { id: 30, name: 'Bilbao', country: 'España', utcOffset: 1, lat: 43.263, lng: -2.935 },
      // Brasil
      { id: 31, name: 'São Paulo', country: 'Brasil', utcOffset: -3, lat: -23.550, lng: -46.633 },
      { id: 32, name: 'Río de Janeiro', country: 'Brasil', utcOffset: -3, lat: -22.906, lng: -43.172 },
      { id: 33, name: 'Brasilia', country: 'Brasil', utcOffset: -3, lat: -15.794, lng: -47.882 },
      { id: 34, name: 'Belo Horizonte', country: 'Brasil', utcOffset: -3, lat: -19.916, lng: -43.934 },
      { id: 35, name: 'Curitiba', country: 'Brasil', utcOffset: -3, lat: -25.428, lng: -49.273 },
      // Italia
      { id: 36, name: 'Milán', country: 'Italia', utcOffset: 1, lat: 45.464, lng: 9.189 },
      { id: 37, name: 'Roma', country: 'Italia', utcOffset: 1, lat: 41.902, lng: 12.496 },
      { id: 38, name: 'Turín', country: 'Italia', utcOffset: 1, lat: 45.070, lng: 7.686 },
      { id: 39, name: 'Bolonia', country: 'Italia', utcOffset: 1, lat: 44.494, lng: 11.342 },
      { id: 40, name: 'Florencia', country: 'Italia', utcOffset: 1, lat: 43.769, lng: 11.255 },
      // Canadá
      { id: 41, name: 'Toronto', country: 'Canadá', utcOffset: -5, lat: 43.653, lng: -79.383 },
      { id: 42, name: 'Vancouver', country: 'Canadá', utcOffset: -8, lat: 49.282, lng: -123.120 },
      { id: 43, name: 'Montreal', country: 'Canadá', utcOffset: -5, lat: 45.501, lng: -73.567 },
      { id: 44, name: 'Calgary', country: 'Canadá', utcOffset: -7, lat: 51.044, lng: -114.071 },
      { id: 45, name: 'Ottawa', country: 'Canadá', utcOffset: -5, lat: 45.421, lng: -75.697 },
      // Australia
      { id: 46, name: 'Sídney', country: 'Australia', utcOffset: 11, lat: -33.868, lng: 151.209 },
      { id: 47, name: 'Melbourne', country: 'Australia', utcOffset: 11, lat: -37.813, lng: 144.963 },
      { id: 48, name: 'Brisbane', country: 'Australia', utcOffset: 10, lat: -27.469, lng: 153.025 },
      { id: 49, name: 'Perth', country: 'Australia', utcOffset: 8, lat: -31.950, lng: 115.860 },
      { id: 50, name: 'Adelaida', country: 'Australia', utcOffset: 10, lat: -34.928, lng: 138.600 }
    ];

    return this.http.get<any>(this.apiUrl).pipe(
      map(res => res.data),
      catchError(() => of(mockCities))
    );
  }
}
