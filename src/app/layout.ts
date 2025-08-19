import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Navbar } from './core/navbar/navbar';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, Navbar],
  template: `
    <app-navbar *ngIf="!isLoginPage()"></app-navbar>
    <router-outlet></router-outlet>
  `
})
export class Layout {
  constructor(private router: Router) {}

  isLoginPage(): boolean {
    return this.router.url === '/login';
  }
}
