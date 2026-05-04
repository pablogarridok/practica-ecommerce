import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  auth = inject(AuthService);
  router = inject(Router);

  fullName = '';
  email = '';
  password = '';
  confirmPassword = '';
  error = signal('');
  loading = signal(false);

  async onSubmit() {
    this.error.set('');
    if (this.password !== this.confirmPassword) {
      this.error.set('Las contraseñas no coinciden');
      return;
    }
    this.loading.set(true);
    try {
      await this.auth.register(this.email, this.password, this.fullName);
      this.router.navigate(['/']);
    } catch (e: any) {
      this.error.set(e.message ?? 'Error al registrarse');
    } finally {
      this.loading.set(false);
    }
  }
}
