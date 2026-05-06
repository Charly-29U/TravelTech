import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { ItineraryService } from '../../core/services/itinerary.service';

@Component({
  selector: 'app-itinerary-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container" *ngIf="itinerary">
      <header class="detail-header">
        <div class="header-main">
          <a routerLink="/planner" class="back-link">← Back to Planner</a>
          <h1>Trip to {{ itinerary.destinations[itinerary.destinations.length - 1] }}</h1>
          <div class="status-row">
            <span class="badge" [ngClass]="itinerary.status === 'OPTIMAL' ? 'badge-success' : 'badge-danger'">
              {{ itinerary.status }}
            </span>
            <span class="strategy-badge">{{ itinerary.strategy }}</span>
          </div>
        </div>
        
        <div class="header-stats">
          <div class="stat-card glass-card">
            <span class="label">Total Cost</span>
            <span class="value">{{ formatCurrency(itinerary.totalCost) }}</span>
          </div>
          <div class="stat-card glass-card">
            <span class="label">Total Time</span>
            <span class="value">{{ itinerary.totalTime | number:'1.1-1' }}h</span>
          </div>
        </div>
      </header>

      <section class="timeline-section">
        <h3>Travel Timeline</h3>
        <div class="timeline">
          <div *ngFor="let segment of itinerary.result; let i = index" class="timeline-item">
            <div class="timeline-marker">
              <div class="dot"></div>
              <div class="line" *ngIf="i < itinerary.result.length - 1"></div>
            </div>
            <div class="timeline-content glass-card">
              <div class="segment-meta">
                <span class="transport-type">{{ segment.transportType }}</span>
                <span class="distance">{{ segment.distance | number:'1.0-0' }} km</span>
              </div>
              <div class="segment-main">
                <div class="location-group">
                  <div class="location">
                    <span class="city">{{ segment.from }}</span>
                    <span class="time">{{ segment.departureTime | date:'MMM d, HH:mm' }}</span>
                  </div>
                  <div class="arrow">→</div>
                  <div class="location">
                    <span class="city">{{ segment.to }}</span>
                    <span class="time">{{ segment.arrivalTime | date:'MMM d, HH:mm' }}</span>
                  </div>
                </div>
                <div class="segment-price">
                  {{ formatCurrency(segment.estimatedCost) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .detail-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 3rem; }
    .back-link { color: var(--accent-primary); text-decoration: none; font-size: 0.875rem; margin-bottom: 1rem; display: block; }
    h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
    .status-row { display: flex; gap: 0.75rem; }
    .strategy-badge { background: var(--bg-secondary); padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; color: var(--text-secondary); border: 1px solid var(--glass-border); }
    
    .header-stats { display: flex; gap: 1rem; }
    .stat-card { padding: 1rem 2rem; min-width: 150px; }
    .stat-card .label { font-size: 0.75rem; color: var(--text-secondary); display: block; }
    .stat-card .value { font-size: 1.25rem; font-weight: 700; color: var(--accent-primary); }

    .timeline-section { margin-top: 2rem; }
    h3 { margin-bottom: 2rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 1px; }

    .timeline { display: flex; flex-direction: column; gap: 1.5rem; }
    .timeline-item { display: flex; gap: 1.5rem; }
    .timeline-marker { display: flex; flex-direction: column; align-items: center; }
    .dot { width: 12px; height: 12px; border-radius: 50%; background: var(--accent-primary); box-shadow: 0 0 10px var(--accent-primary); }
    .line { width: 2px; flex-grow: 1; background: var(--glass-border); margin: 4px 0; }

    .timeline-content { flex-grow: 1; padding: 1.25rem; transition: transform 0.2s; }
    .timeline-content:hover { transform: translateX(5px); border-color: var(--accent-primary); }
    
    .segment-meta { display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: 600; color: var(--accent-secondary); margin-bottom: 1rem; text-transform: uppercase; }
    .segment-main { display: flex; justify-content: space-between; align-items: center; }
    
    .location-group { display: flex; align-items: center; gap: 2rem; }
    .location { display: flex; flex-direction: column; }
    .city { font-size: 1.125rem; font-weight: 700; }
    .time { font-size: 0.875rem; color: var(--text-secondary); }
    .arrow { font-size: 1.5rem; color: var(--glass-border); }
    .segment-price { font-size: 1.25rem; font-weight: 700; color: var(--text-primary); }
  `]
})
export class ItineraryDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private itineraryService = inject(ItineraryService);
  
  itinerary: any = null;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.itineraryService.getItinerary(id).subscribe(res => {
        this.itinerary = res.data;
      });
    }
  }

  formatCurrency(value: number): string {
    if (value === undefined || value === null) return '$0';
    return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
}
