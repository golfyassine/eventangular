import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-profile',
  imports: [CommonModule],
  template: `
    <div class="card" style="max-width: 600px;">
      <h2>Mon profil</h2>
      <p>Connecté en tant que <strong>{{ username || 'Utilisateur' }}</strong></p>
      <div style="display:flex; gap: 12px; margin-top: 12px;">
        <button (click)="goToEvents()">Voir les événements</button>
        <button (click)="logout()" style="background:#d32f2f;">Se déconnecter</button>
      </div>
    </div>
  `
})
export class Profile {
  username: string | null = null;

  constructor(private auth: AuthService, private router: Router) {
    // Si tu stockes le username dans le token, tu peux le décoder via AuthService plus tard
    this.username = null;
  }

  goToEvents() { this.router.navigate(['/events']); }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
