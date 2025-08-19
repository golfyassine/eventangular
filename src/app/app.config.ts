// app/app.config.ts
import { ApplicationConfig, inject, ErrorHandler, Injectable, Provider } from '@angular/core';
import { provideRouter, withPreloading, PreloadAllModules, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptors, HttpInterceptorFn, HttpErrorResponse, withFetch } from '@angular/common/http';
import { routes } from './app.routes';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';
import { catchError, throwError, tap } from 'rxjs';

// Intercepteur d'authentification amélioré
export const authInterceptorFn: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  
  // Ne pas ajouter le token aux requêtes d'authentification
  const isAuthRequest = req.url.includes('/auth/');
  
  if (token && !isAuthRequest) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(cloned);
  }
  
  return next(req);
};

// Intercepteur de gestion des erreurs HTTP
export const errorInterceptorFn: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Gestion des erreurs d'authentification
      if (error.status === 401) {
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};

// Intercepteur de logging des requêtes
export const loggingInterceptorFn: HttpInterceptorFn = (req, next) => {
  const startTime = performance.now();
  return next(req).pipe(
    tap({
      next: () => {
        const endTime = performance.now();
        console.log(`✅ ${req.method} ${req.url} en ${(endTime - startTime).toFixed(2)}ms`);
      },
      error: (error) => {
        const endTime = performance.now();
        console.error(`❌ ${req.method} ${req.url} a échoué en ${(endTime - startTime).toFixed(2)}ms`, error);
      }
    })
  );
};

// Gestionnaire d'erreurs global
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    console.error('🔥 Erreur globale capturée :', error);
  }
}

// Configuration des variables d'environnement (à créer)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  enableLogging: true,
  features: {
    socialLogin: true,
    pushNotifications: false,
    analytics: false
  }
};

// Configuration principale de l'application
export const appConfig: ApplicationConfig = {
  providers: [
    // Routeur avec préchargement et gestion du scroll
    provideRouter(
      routes,
      withPreloading(PreloadAllModules),
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'top'
      })
    ),
    
    // Client HTTP avec intercepteurs + Fetch API pour SSR
    provideHttpClient(
      withFetch(),
      withInterceptors([
        loggingInterceptorFn,
        authInterceptorFn,
        errorInterceptorFn
      ])
    ),
    
    // Gestionnaire d'erreurs global
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    
    // Autres providers personnalisés
    ...getCustomProviders()
  ]
};

// Fonction pour obtenir des providers personnalisés
function getCustomProviders(): Provider[] {
  const providers: Provider[] = [];
  // Ajouter des providers conditionnels selon l'environnement si nécessaire
  return providers;
}
