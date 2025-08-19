import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, timeout, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post('http://localhost:8080/api/auth/login', { username, password }).pipe(
      timeout(10000),
      tap((res: any) => {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('token', res.token);
          console.log('Token stocké après login :', res.token);
        }
      }),
      catchError(error => {
        console.error('Erreur de connexion:', error);
        return throwError(() => error);
      })
    );
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('token');
    }
    return null;
  }

  logout(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('token');
    }
  }

  getCurrentUserId(): number | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub ? parseInt(payload.sub) : null;
    } catch {
      return null;
    }
  }

  getUserPermissions(): string[] {
    const token = this.getToken();
    if (!token) return [];
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.authorities || [];
    } catch {
      return [];
    }
  }
}
