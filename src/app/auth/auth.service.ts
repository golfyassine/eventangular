import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post('http://localhost:8080/api/auth/login', {
      username,
      password
    }).pipe(
      tap((res: any) => {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('token', res.token);
          console.log('Token stocké après login :', res.token);
        }
      })
    );
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('token');
    }
    return null;
  }

  private decodePayload(): any | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payloadPart = token.split('.')[1];
      if (!payloadPart) return null;
      const json = typeof window !== 'undefined'
        ? atob(payloadPart)
        : Buffer.from(payloadPart, 'base64').toString('utf-8');
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  getCurrentUserId(): number | null {
    const decoded = this.decodePayload();
    const candidate = decoded?.userId ?? decoded?.id ?? decoded?.sub;
    const asNumber = typeof candidate === 'string' ? Number(candidate) : candidate;
    return Number.isFinite(asNumber) ? (asNumber as number) : null;
  }

  getUserPermissions(): string[] {
    const decoded = this.decodePayload();
    const perms = decoded?.authorities ?? decoded?.roles ?? [];
    return Array.isArray(perms) ? perms : [];
  }

  logout() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('token');
    }
  }
}
