import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [CommonModule, FormsModule]
})
export class Login {
  username = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.error = '';
    this.auth.login(this.username, this.password).subscribe({
      next: () => {
        this.router.navigateByUrl('/events');
      },
      error: () => {
        this.error = 'Nom d’utilisateur ou mot de passe incorrect';
      }
    });
  }
}
