import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-surface flex items-center justify-center px-4 py-12">
      <div class="w-full max-w-md">
        <!-- Logo -->
        <div class="text-center mb-8">
          <a routerLink="/" class="inline-flex items-center gap-2 text-primary-600 font-extrabold text-3xl">
            <span class="material-icons text-4xl">apartment</span>
            ArkaK
          </a>
          <p class="text-gray-500 mt-2">Inicia sesión en tu cuenta</p>
        </div>

        <!-- Form Card -->
        <div class="bg-white rounded-2xl shadow-card p-8">
          <form (ngSubmit)="onSubmit()" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Correo electrónico</label>
              <input type="email" [(ngModel)]="email" name="email" required
                     class="w-full px-4 py-3 border border-earth-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-400 focus:border-primary-400 outline-none transition"
                     placeholder="tu@correo.com">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Contraseña</label>
              <input type="password" [(ngModel)]="password" name="password" required
                     class="w-full px-4 py-3 border border-earth-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-400 focus:border-primary-400 outline-none transition"
                     placeholder="••••••••">
            </div>

            <div class="flex items-center justify-end">
              <a routerLink="/recuperar-password" class="text-sm text-primary-600 hover:text-primary-700">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button type="submit" [disabled]="loading"
                    class="w-full py-3 bg-primary-600 text-white rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {{ loading ? 'Iniciando sesión...' : 'Iniciar sesión' }}
            </button>
          </form>

          <p class="mt-6 text-center text-sm text-gray-500">
            ¿No tienes cuenta?
            <a routerLink="/registro" class="text-primary-600 font-semibold hover:text-primary-700"> Regístrate aquí</a>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  email = '';
  password = '';
  loading = false;

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.toast.warning('Por favor completa todos los campos');
      return;
    }
    this.loading = true;
    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        if (res.user.must_change_password) {
          this.toast.warning('Debes cambiar tu contraseña temporal');
          this.router.navigate(['/cambiar-password']);
        } else {
          this.toast.success('¡Bienvenido!');
          this.router.navigate([this.authService.getRedirectUrl()]);
        }
      },
      error: (err) => {
        this.loading = false;
        this.toast.error(err.error?.error || 'Error al iniciar sesión');
      },
    });
  }
}
