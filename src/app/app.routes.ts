import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { EventList } from './events/event-list/event-list';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'events', component: EventList },
  {
    path: 'events/create',
    loadComponent: () => import('./events/event-create/event-create').then(m => m.EventCreate)
  },
  {
    path: 'events/edit/:id',
    loadComponent: () => import('./events/event-create/event-create').then(m => m.EventCreate)
  }
];
