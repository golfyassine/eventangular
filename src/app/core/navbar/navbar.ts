import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {
  constructor(private auth: AuthService, private router: Router) {}

  get isLoggedIn(): boolean {
    return !!this.auth.getToken();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
