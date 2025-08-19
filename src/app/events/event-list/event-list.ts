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
  deletingId: number | null = null;
  feedback: { type: 'success' | 'error' | null; message: string } = { type: null, message: '' };

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
      error: () => {
        this.error = 'Erreur lors du chargement des événements.';
        this.loading = false;
      }
    });
  }

  loadUserRegistrations(): void {
    if (this.currentUserId === null) { this.loading = false; return; }
    this.eventService.getUserRegistrations(this.currentUserId).subscribe({
      next: registeredEvents => {
        const ids = registeredEvents.map(e => Number(e.id));
        this.userRegistrations = new Set(ids);
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  isRegistered(event: Event): boolean {
    return this.userRegistrations.has(Number(event.id));
  }

  register(eventId: number) {
    this.feedback = { type: null, message: '' };
    this.eventService.registerToEvent(eventId).subscribe({
      next: () => {
        const updated = new Set(this.userRegistrations);
        updated.add(Number(eventId));
        this.userRegistrations = updated;
        this.feedback = { type: 'success', message: 'Inscription réussie.' };
      },
      error: () => {
        this.feedback = { type: 'error', message: 'Inscription impossible (droits requis).' };
      }
    });
  }

  unregister(eventId: number) {
    this.feedback = { type: null, message: '' };
    this.eventService.unregisterFromEvent(eventId).subscribe({
      next: () => {
        const updated = new Set(this.userRegistrations);
        updated.delete(Number(eventId));
        this.userRegistrations = updated;
        this.feedback = { type: 'success', message: 'Désinscription réussie.' };
      },
      error: () => {
        this.feedback = { type: 'error', message: 'Désinscription impossible (droits requis).' };
      }
    });
  }

  goToCreate() { this.router.navigate(['/events/create']); }
  editEvent(event: Event) { this.router.navigate(['/events/edit', event.id]); }
  deleteEvent(eventId: number) {
    this.feedback = { type: null, message: '' };
    this.deletingId = eventId;
    this.eventService.deleteEvent(eventId).subscribe({
      next: () => {
        this.events = this.events.filter(e => e.id !== eventId);
        this.deletingId = null;
        this.feedback = { type: 'success', message: 'Événement supprimé.' };
      },
      error: () => {
        this.deletingId = null;
        this.feedback = { type: 'error', message: 'Suppression refusée (droits requis).' };
      }
    });
  }
}
