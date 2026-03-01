import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-verify-account',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-surface flex items-center justify-center px-4">
      <div class="bg-white rounded-2xl shadow-card p-8 max-w-md w-full text-center">
        @if (loading) {
          <span class="material-icons text-5xl text-primary-400 animate-spin mb-4">sync</span>
          <p class="text-gray-600">Verificando tu cuenta...</p>
        } @else if (success) {
          <span class="material-icons text-5xl text-emerald-500 mb-4">check_circle</span>
          <h2 class="text-xl font-bold text-gray-900 mb-2">¡Cuenta verificada!</h2>
          <p class="text-gray-600 mb-6">Tu cuenta ha sido verificada exitosamente.</p>
          <a routerLink="/login" class="inline-block px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold text-sm hover:bg-primary-700">
            Iniciar sesión
          </a>
        } @else {
          <span class="material-icons text-5xl text-red-400 mb-4">error</span>
          <h2 class="text-xl font-bold text-gray-900 mb-2">Error de verificación</h2>
          <p class="text-gray-600 mb-6">{{ errorMessage }}</p>
          <a routerLink="/" class="text-primary-600 font-semibold">Volver al inicio</a>
        }
      </div>
    </div>
  `,
})
export class VerifyAccountComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);

  loading = true;
  success = false;
  errorMessage = '';

  ngOnInit(): void {
    const token = this.route.snapshot.params['token'];
    this.authService.verifyAccount(token).subscribe({
      next: () => { this.loading = false; this.success = true; },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.error || 'Token inválido';
      },
    });
  }
}
