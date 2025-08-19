import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../event.service';

@Component({
  standalone: true,
  selector: 'app-event-create',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './event-create.html',
  styleUrls: ['./event-create.css']
})
export class EventCreate {
  eventForm;
  loading = false;
  eventId?: number;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      location: ['', Validators.required],
      date: ['', Validators.required],
      maxParticipants: [1, [Validators.required, Validators.min(1)]],
      organizerId: [null, Validators.required]
    });

    // Récupère l'id dans l'URL si existant, sinon undefined
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.eventId = +id;
      }
    });
  }
  get isEditMode(): boolean {
    return !!this.eventId;
  }
  onSubmit() {
    if (this.eventForm.invalid) {
      alert('Veuillez remplir correctement le formulaire.');
      return;
    }

    this.loading = true;

    if (this.eventId) {
      // Mode édition : on met à jour via PUT
      this.eventService.updateEvent(this.eventId, this.eventForm.value).subscribe({
        next: () => {
          this.loading = false;
          alert('Événement mis à jour avec succès.');
          this.router.navigate(['/events']);
        },
        error: () => {
          this.loading = false;
          alert('Erreur lors de la mise à jour de l’événement.');
        }
      });
    } else {
      // Mode création : on crée via POST
      this.eventService.createEvent(this.eventForm.value).subscribe({
        next: (event) => {
          this.loading = false;
          alert(`Événement "${event.title}" créé avec succès.`);
          this.eventForm.reset();
        },
        error: () => {
          this.loading = false;
          alert('Erreur lors de la création de l’événement.');
        }
      });
    }
  }
}