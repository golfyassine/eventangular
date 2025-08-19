import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService, Event } from '../event.service';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-event-list',
  imports: [CommonModule],
  templateUrl: './event-list.html',
  styleUrls: ['./event-list.css']
})
export class EventList implements OnInit {
  events: Event[] = [];
  userRegistrations: Set<number> = new Set();
  loading = false;
  error: string | null = null;
  currentUserId: number | null = null;

  constructor(private eventService: EventService, private router: Router, private auth: AuthService) {}

  ngOnInit(): void {
    this.currentUserId = this.auth.getCurrentUserId();
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    this.error = null;

    this.eventService.getAllEvents().subscribe({
      next: events => {
        this.events = events || [];
        if (this.events.length > 0 && this.currentUserId !== null) {
          this.loadUserRegistrations();
        } else {
          this.loading = false;
        }
      },
      error: err => {
        this.error = 'Erreur lors du chargement des événements.';
        this.loading = false;
      }
    });
  }

  loadUserRegistrations(): void {
    if (this.currentUserId === null) return;
    this.eventService.getUserRegistrations(this.currentUserId).subscribe({
      next: registeredEvents => {
        this.userRegistrations = new Set(registeredEvents.map(e => e.id));
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  isRegistered(event: Event): boolean {
    return this.userRegistrations.has(event.id);
  }

  register(eventId: number) {
    this.eventService.registerToEvent(eventId).subscribe({ next: () => this.userRegistrations.add(eventId) });
  }

  unregister(eventId: number) {
    this.eventService.unregisterFromEvent(eventId).subscribe({ next: () => this.userRegistrations.delete(eventId) });
  }

  goToCreate() { this.router.navigate(['/events/create']); }
  editEvent(event: Event) { this.router.navigate(['/events/edit', event.id]); }
  deleteEvent(eventId: number) { this.events = this.events.filter(e => e.id !== eventId); }
}
