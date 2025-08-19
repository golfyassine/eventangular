import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, throwError } from 'rxjs';

export const authInterceptorFn: HttpInterceptorFn = (req, next) => {
	const authService = inject(AuthService);
	const token = authService.getToken();
	const isAuthEndpoint = req.url.includes('/api/auth/');
	const authReq = token && !isAuthEndpoint
		? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
		: req;
	return next(authReq).pipe(
		catchError(err => throwError(() => err))
	);
};
