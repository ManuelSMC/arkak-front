import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-seller-request',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-surface flex items-center justify-center px-4 py-12">
      <div class="w-full max-w-lg">
        <div class="text-center mb-8">
          <a routerLink="/" class="inline-flex items-center gap-2 text-primary-600 font-extrabold text-3xl">
            <span class="material-icons text-4xl">apartment</span> ArkaK
          </a>
          <p class="text-gray-500 mt-2">Solicitud para ser vendedor</p>
        </div>

        @if (submitted) {
          <div class="bg-white rounded-2xl shadow-card p-8 text-center">
            <span class="material-icons text-6xl text-green-500 mb-4">check_circle</span>
            <h2 class="text-xl font-bold text-gray-900 mb-2">¡Solicitud enviada!</h2>
            <p class="text-gray-600 mb-6">Tu solicitud será revisada por un administrador. Te notificaremos cuando sea aprobada.</p>
            <a routerLink="/login" class="inline-block px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold text-sm hover:bg-primary-700">
              Ir al inicio de sesión
            </a>
          </div>
        } @else {
          <div class="bg-white rounded-2xl shadow-card p-8">
            <form (ngSubmit)="onSubmit()" class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">Nombre *</label>
                  <input type="text" [(ngModel)]="form.first_name" name="first_name" required
                         class="w-full px-4 py-3 border border-earth-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-400 outline-none"
                         placeholder="Juan">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">Apellido *</label>
                  <input type="text" [(ngModel)]="form.last_name" name="last_name" required
                         class="w-full px-4 py-3 border border-earth-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-400 outline-none"
                         placeholder="Pérez">
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Correo electrónico *</label>
                <input type="email" [(ngModel)]="form.email" name="email" required
                       class="w-full px-4 py-3 border border-earth-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-400 outline-none"
                       placeholder="tu@correo.com">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Teléfono</label>
                <input type="tel" [(ngModel)]="form.phone" name="phone"
                       class="w-full px-4 py-3 border border-earth-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-400 outline-none"
                       placeholder="+52 555 123 4567">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Años de experiencia</label>
                <input type="number" [(ngModel)]="form.years_experience" name="years_experience" min="0"
                       class="w-full px-4 py-3 border border-earth-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-400 outline-none"
                       placeholder="0">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Sobre ti</label>
                <textarea [(ngModel)]="form.bio" name="bio" rows="3"
                          class="w-full px-4 py-3 border border-earth-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-400 outline-none resize-none"
                          placeholder="Cuéntanos sobre tu experiencia en el sector inmobiliario..."></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Mensaje adicional</label>
                <textarea [(ngModel)]="form.message" name="message" rows="2"
                          class="w-full px-4 py-3 border border-earth-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-400 outline-none resize-none"
                          placeholder="¿Por qué quieres unirte a ArkaK?"></textarea>
              </div>
              <button type="submit" [disabled]="loading"
                      class="w-full py-3 bg-primary-600 text-white rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors disabled:opacity-50">
                {{ loading ? 'Enviando solicitud...' : 'Enviar solicitud' }}
              </button>
            </form>
            <p class="mt-6 text-center text-sm text-gray-500">
              ¿Ya tienes cuenta?
              <a routerLink="/login" class="text-primary-600 font-semibold hover:text-primary-700"> Inicia sesión</a>
            </p>
            <p class="mt-2 text-center text-sm text-gray-500">
              ¿Eres cliente?
              <a routerLink="/registro" class="text-primary-600 font-semibold hover:text-primary-700"> Regístrate aquí</a>
            </p>
          </div>
        }
      </div>
    </div>
  `,
})
export class SellerRequestComponent {
  private adminService = inject(AdminService);
  private toast = inject(ToastService);

  form: any = { email: '', first_name: '', last_name: '', phone: '', bio: '', years_experience: null, message: '' };
  loading = false;
  submitted = false;

  onSubmit(): void {
    if (!this.form.email || !this.form.first_name || !this.form.last_name) {
      this.toast.warning('Completa los campos obligatorios');
      return;
    }
    this.loading = true;
    this.adminService.createSellerRequest(this.form).subscribe({
      next: () => { this.submitted = true; this.loading = false; },
      error: (err) => { this.loading = false; this.toast.error(err.error?.error || 'Error al enviar solicitud'); },
    });
  }
}
