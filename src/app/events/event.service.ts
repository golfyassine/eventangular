import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, timeout, throwError, tap } from 'rxjs';

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  maxParticipants: number;
  // ajoute d’autres propriétés si besoin
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private baseUrl = 'http://localhost:8080/api/event';

  constructor(private http: HttpClient) {}

  // Récupère tous les événements à venir
  getAllEvents(): Observable<Event[]> {
    console.log('Appel API: récupération des événements');
    return this.http.get<Event[]>(`${this.baseUrl}/upcoming`).pipe(
      timeout(10000), // 10 secondes de timeout
      tap((events: Event[]) => {
        console.log(`${events?.length || 0} événements récupérés`);
      }),
      catchError(error => {
        console.error('Erreur lors de la récupération des événements:', error);
        // Si le serveur est inaccessible, on retourne un tableau vide pour éviter un blocage
        if (error.status === 0 || error.name === 'TimeoutError') {
          console.warn('Serveur inaccessible, retour d\'une liste vide');
          return []; // Retourne un tableau vide au lieu de propager l'erreur
        }
        return throwError(() => error);
      })
    );
  }

  // Récupère les événements auxquels l'utilisateur est inscrit
  getUserRegistrations(userId: number): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.baseUrl}/user/${userId}/registrations`).pipe(
      timeout(8000), // 8 secondes de timeout
      catchError(error => {
        console.error('Erreur lors de la récupération des inscriptions:', error);
        return throwError(() => error);
      })
    );
  }

  // Inscrire l'utilisateur à un événement
  registerToEvent(eventId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${eventId}/register`, {}, { responseType: 'text' });
  }

  // Désinscrire l'utilisateur d'un événement
  unregisterFromEvent(eventId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${eventId}/unregister`, { responseType: 'text' });
  }

  createEvent(eventData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, eventData);
  }

  deleteEvent(eventId: number) {
    return this.http.delete(`${this.baseUrl}/${eventId}`);
  }

  getEventById(id: number) {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  updateEvent(id: number, updatedData: any) {
    return this.http.put(`${this.baseUrl}/${id}`, updatedData);
  }

}
