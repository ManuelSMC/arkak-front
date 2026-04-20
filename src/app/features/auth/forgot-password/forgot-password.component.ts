import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-surface flex items-center justify-center px-4 py-12">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <a routerLink="/" class="inline-flex items-center gap-2 text-primary-600 font-extrabold text-3xl">
            <span class="material-icons text-4xl">apartment</span> Callix
          </a>
          <p class="text-gray-500 mt-2">Recupera tu contraseña</p>
        </div>

        <div class="bg-white rounded-2xl shadow-card p-8">
          @if (!sent) {
            <form (ngSubmit)="onSubmit()" class="space-y-5">
              <p class="text-sm text-gray-600">Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.</p>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Correo electrónico</label>
                <input type="email" [(ngModel)]="email" name="email" required
                       class="w-full px-4 py-3 border border-earth-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-400 outline-none"
                       placeholder="tu@correo.com">
              </div>
              <button type="submit" [disabled]="loading"
                      class="w-full py-3 bg-primary-600 text-white rounded-xl font-semibold text-sm hover:bg-primary-700 disabled:opacity-50">
                {{ loading ? 'Enviando...' : 'Enviar enlace' }}
              </button>
            </form>
          } @else {
            <div class="text-center py-4">
              <span class="material-icons text-5xl text-primary-400 mb-4">mark_email_read</span>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Correo enviado</h3>
              <p class="text-sm text-gray-600">Si la cuenta existe, recibirás instrucciones para restablecer tu contraseña.</p>
            </div>
          }
          <p class="mt-6 text-center text-sm text-gray-500">
            <a routerLink="/login" class="text-primary-600 font-semibold">← Volver al inicio de sesión</a>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class ForgotPasswordComponent {
  private authService = inject(AuthService);
  private toast = inject(ToastService);
  email = '';
  loading = false;
  sent = false;

  onSubmit(): void {
    this.loading = true;
    this.authService.forgotPassword(this.email).subscribe({
      next: () => { this.sent = true; this.loading = false; },
      error: () => { this.loading = false; this.toast.error('Error al procesar solicitud'); },
    });
  }
}
