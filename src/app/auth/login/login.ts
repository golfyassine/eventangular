import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

type ToastType = 'success' | 'error' | 'info';

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
  loading = false;
  showPassword = false;

  toast = { visible: false, message: '', type: 'info' as ToastType };

  constructor(private authService: AuthService, private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  private openToast(message: string, type: ToastType = 'info', ms = 2200) {
    this.toast = { visible: true, message, type };
    setTimeout(() => (this.toast.visible = false), ms);
  }

  onSubmit() {
    if (!this.username || !this.password) {
      this.openToast('Veuillez saisir vos identifiants 📝', 'error');
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.openToast(`Bienvenue ${this.username} 🐵`, 'success');
        this.router.navigateByUrl('/events').then(() => window.location.reload());
      },
      error: () => {
        this.loading = false;
        this.error = 'Nom d’utilisateur ou mot de passe incorrect.';
        this.openToast('Connexion refusée ❌', 'error');
      }
    });
  }

  loginWithGoogle() {
    this.openToast('Option bientôt disponible 🚀', 'info');
  }
}
