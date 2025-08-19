import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

@Injectable({ providedIn: 'root' })
export class EventService {
  private baseUrl = 'http://localhost:8080/api/event';
  private jsonHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) {}

  getAllEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.baseUrl}/upcoming`).pipe(
      timeout(10000),
      tap(list => console.log(`${list?.length ?? 0} événements récupérés`)),
      catchError(err => {
        console.error('Erreur getAllEvents:', err);
        return throwError(() => err);
      })
    );
  }

  getEventById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      catchError(err => {
        console.error('Erreur getEventById:', err);
        return throwError(() => err);
      })
    );
  }

  createEvent(eventData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, eventData, { headers: this.jsonHeaders }).pipe(
      catchError(err => {
        console.error('Erreur createEvent:', err);
        return throwError(() => err);
      })
    );
  }

  updateEvent(id: number, updatedData: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, updatedData, { headers: this.jsonHeaders }).pipe(
      catchError(err => {
        console.error('Erreur updateEvent:', err);
        return throwError(() => err);
      })
    );
  }

  deleteEvent(eventId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${eventId}`).pipe(
      catchError(err => {
        console.error('Erreur deleteEvent:', err);
        return throwError(() => err);
      })
    );
  }

  getUserRegistrations(userId: number): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.baseUrl}/user/${userId}/registrations`).pipe(
      timeout(8000),
      catchError(err => {
        console.error('Erreur getUserRegistrations:', err);
        return throwError(() => err);
      })
    );
  }

  registerToEvent(eventId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${eventId}/register`, {}, { responseType: 'text' }).pipe(
      catchError(err => {
        console.error('Erreur registerToEvent:', err);
        return throwError(() => err);
      })
    );
  }

  unregisterFromEvent(eventId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${eventId}/unregister`, { responseType: 'text' }).pipe(
      catchError(err => {
        console.error('Erreur unregisterFromEvent:', err);
        return throwError(() => err);
      })
    );
  }
}
