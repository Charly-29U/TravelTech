import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, tap, catchError, map } from 'rxjs';
import { City, CityService } from './city.service';

@Injectable({
  providedIn: 'root'
})
export class ItineraryService {
  private http = inject(HttpClient);
  private cityService = inject(CityService);
  private apiUrl = '/api/v1/itineraries';
  
  private cities: City[] = [];
  private lastItinerarySubject = new BehaviorSubject<any>(null);
  lastItinerary$ = this.lastItinerarySubject.asObservable();

  constructor() {
    this.cityService.getCities().subscribe(data => this.cities = data);
  }

  optimize(itinerary: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, itinerary).pipe(
      tap(res => this.lastItinerarySubject.next(res.data)),
      catchError(err => {
        // Create a smarter mock based on input
        const mockResult = this.createSmartMock(itinerary);
        this.lastItinerarySubject.next(mockResult);
        return of({ data: mockResult });
      })
    );
  }

  getItinerary(id: string): Observable<any> {
    if (id === 'last' || id.startsWith('mock')) {
      return of({ data: this.lastItinerarySubject.value || this.createFallbackMock() });
    }
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  private calculateDistance(city1: string, city2: string): number {
    const c1 = this.cities.find(c => c.name === city1);
    const c2 = this.cities.find(c => c.name === city2);
    if (!c1 || !c2) return 1000;

    const R = 6371; 
    const dLat = (c2.lat - c1.lat) * Math.PI / 180;
    const dLon = (c2.lng - c1.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(c1.lat * Math.PI / 180) * Math.cos(c2.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c);
  }

  private createSmartMock(input: any) {
    const segments = [];
    const startT = input.startTime || '08:00';
    let currentTime = new Date(input.startDate + 'T' + startT + ':00');
    let currentCity = input.origin;

    const transportRates: any = {
      'Avión': 0.18,
      'Bus': 0.04,
      'Tren': 0.09,
      'Helicóptero': 3.5
    };

    // Outbound and multi-city legs
    for (const dest of input.destinations) {
        const destCity = typeof dest === 'string' ? dest : dest.city;
        const stayDays = typeof dest === 'string' ? 2 : (dest.stayDays || 2);
        const transportType = typeof dest === 'string' ? 'Avión' : (dest.transportType || 'Avión');
        
        const distance = this.calculateDistance(currentCity, destCity);
        const rate = transportRates[transportType] || 0.18;
        const cost = Math.max(50, Math.round(distance * rate));
        
        const departureTime = new Date(currentTime);
        const arrivalTime = new Date(currentTime);
        
        const speeds: any = { 'Avión': 800, 'Bus': 80, 'Tren': 150, 'Helicóptero': 250 };
        const travelHours = Math.max(1, distance / (speeds[transportType] || 800));
        arrivalTime.setHours(arrivalTime.getHours() + travelHours);

        segments.push({
            from: currentCity,
            to: destCity,
            distance: distance,
            transportType: transportType,
            estimatedCost: cost,
            estimatedTime: Math.round(travelHours * 10) / 10,
            departureTime: departureTime,
            arrivalTime: arrivalTime
        });

        currentCity = destCity;
        currentTime = new Date(arrivalTime);
        currentTime.setDate(currentTime.getDate() + stayDays);
        currentTime.setHours(8); 
    }

    // Return flight to origin
    if (input.returnDate) {
        const returnT = input.returnTime || '20:00';
        const returnTime = new Date(input.returnDate + 'T' + returnT + ':00');
        const distance = this.calculateDistance(currentCity, input.origin);
        const cost = Math.round(distance * 0.18);

        segments.push({
            from: currentCity,
            to: input.origin,
            distance: distance,
            transportType: 'Regreso',
            estimatedCost: cost,
            estimatedTime: Math.round((distance / 800) * 10) / 10,
            departureTime: returnTime,
            arrivalTime: new Date(returnTime.getTime() + (distance / 800) * 60 * 60 * 1000)
        });
    }

    const totalCost = segments.reduce((sum, s) => sum + s.estimatedCost, 0);
    const budget = input.budget || 5000;

    return {
      id: 'mock-' + Math.random().toString(36).substr(2, 9),
      origin: input.origin,
      destinations: input.destinations.map((d: any) => typeof d === 'string' ? d : d.city),
      status: totalCost <= budget ? 'ÓPTIMO' : 'FUERA DE PRESUPUESTO',
      strategy: input.strategy,
      totalCost: totalCost,
      totalTime: Math.round(segments.reduce((sum, s) => sum + (s.estimatedTime || 0), 0) * 10) / 10,
      result: segments
    };
  }

  private createFallbackMock() {
      return {
          destinations: ['Default City'],
          status: 'MOCK',
          strategy: 'BALANCED',
          totalCost: 0,
          totalTime: 0,
          result: []
      };
  }
}
