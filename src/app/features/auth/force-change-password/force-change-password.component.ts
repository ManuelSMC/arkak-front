import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-force-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-surface flex items-center justify-center px-4 py-12">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <span class="material-icons text-6xl text-primary-500">lock_reset</span>
          <h1 class="text-2xl font-bold text-gray-900 mt-4">Cambio de contraseña obligatorio</h1>
          <p class="text-gray-500 mt-2">Tu cuenta fue creada con una contraseña temporal. Debes establecer una nueva contraseña para continuar.</p>
        </div>
        <div class="bg-white rounded-2xl shadow-card p-8">
          <form (ngSubmit)="onSubmit()" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Contraseña actual (temporal)</label>
              <input type="password" [(ngModel)]="currentPassword" name="currentPassword" required
                     class="w-full px-4 py-3 border border-earth-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-400 focus:border-primary-400 outline-none transition"
                     placeholder="Ingresa tu contraseña temporal">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Nueva contraseña</label>
              <input type="password" [(ngModel)]="newPassword" name="newPassword" required minlength="6"
                     class="w-full px-4 py-3 border border-earth-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-400 focus:border-primary-400 outline-none transition"
                     placeholder="Mínimo 6 caracteres">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Confirmar nueva contraseña</label>
              <input type="password" [(ngModel)]="confirmPassword" name="confirmPassword" required
                     class="w-full px-4 py-3 border border-earth-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-400 focus:border-primary-400 outline-none transition"
                     placeholder="Repite tu nueva contraseña">
            </div>
            <button type="submit" [disabled]="loading"
                    class="w-full py-3 bg-primary-600 text-white rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {{ loading ? 'Cambiando...' : 'Cambiar contraseña' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class ForceChangePasswordComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  loading = false;

  onSubmit(): void {
    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.toast.warning('Completa todos los campos');
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.toast.error('Las contraseñas no coinciden');
      return;
    }
    if (this.newPassword.length < 6) {
      this.toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    this.loading = true;
    this.authService.changePassword(this.currentPassword, this.newPassword).subscribe({
      next: () => {
        this.toast.success('Contraseña cambiada exitosamente');
        // Refresh user data
        this.authService.login(this.authService.currentUser!.email, this.newPassword).subscribe({
          next: () => this.router.navigate([this.authService.getRedirectUrl()]),
          error: () => this.router.navigate(['/login']),
        });
      },
      error: (err) => {
        this.loading = false;
        this.toast.error(err.error?.error || 'Error al cambiar contraseña');
      },
    });
  }
}
