import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-surface flex items-center justify-center px-4 py-12">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <a routerLink="/" class="inline-flex items-center gap-2 text-primary-600 font-extrabold text-3xl">
            <span class="material-icons text-4xl">apartment</span> ArkaK
          </a>
          <p class="text-gray-500 mt-2">Crea tu cuenta</p>
        </div>

        <div class="bg-white rounded-2xl shadow-card p-8">
          <form (ngSubmit)="onSubmit()" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Nombre</label>
                <input type="text" [(ngModel)]="form.first_name" name="first_name" required
                       class="w-full px-4 py-3 border border-earth-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-400 outline-none"
                       placeholder="Juan">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Apellido</label>
                <input type="text" [(ngModel)]="form.last_name" name="last_name" required
                       class="w-full px-4 py-3 border border-earth-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-400 outline-none"
                       placeholder="Pérez">
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Correo electrónico</label>
              <input type="email" [(ngModel)]="form.email" name="email" required
                     class="w-full px-4 py-3 border border-earth-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-400 outline-none"
                     placeholder="tu@correo.com">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Teléfono (opcional)</label>
              <input type="tel" [(ngModel)]="form.phone" name="phone"
                     class="w-full px-4 py-3 border border-earth-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-400 outline-none"
                     placeholder="+52 555 123 4567">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Contraseña</label>
              <input type="password" [(ngModel)]="form.password" name="password" required minlength="6"
                     class="w-full px-4 py-3 border border-earth-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-400 outline-none"
                     placeholder="Mínimo 6 caracteres">
            </div>

            <button type="submit" [disabled]="loading"
                    class="w-full py-3 bg-primary-600 text-white rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors disabled:opacity-50">
              {{ loading ? 'Creando cuenta...' : 'Crear cuenta' }}
            </button>
          </form>

          <p class="mt-6 text-center text-sm text-gray-500">
            ¿Ya tienes cuenta?
            <a routerLink="/login" class="text-primary-600 font-semibold hover:text-primary-700"> Inicia sesión</a>
          </p>
          <p class="mt-2 text-center text-sm text-gray-500">
            ¿Eres vendedor?
            <a routerLink="/solicitud-vendedor" class="text-primary-600 font-semibold hover:text-primary-700"> Solicita tu cuenta aquí</a>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  form = { email: '', password: '', first_name: '', last_name: '', phone: '', role: 'cliente' };
  loading = false;

  onSubmit(): void {
    if (!this.form.email || !this.form.password || !this.form.first_name || !this.form.last_name) {
      this.toast.warning('Por favor completa todos los campos obligatorios');
      return;
    }
    this.loading = true;
    this.authService.register(this.form).subscribe({
      next: () => {
        this.toast.success('¡Cuenta creada! Revisa tu correo para verificar tu cuenta.');
        this.router.navigate([this.authService.getRedirectUrl()]);
      },
      error: (err) => {
        this.loading = false;
        this.toast.error(err.error?.error || 'Error al crear cuenta');
      },
    });
  }
}
