import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-surface flex items-center justify-center px-4 py-12">
      <div class="w-full max-w-md bg-white rounded-2xl shadow-card p-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Nueva contraseña</h2>
        <form (ngSubmit)="onSubmit()" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Nueva contraseña</label>
            <input type="password" [(ngModel)]="password" name="password" required minlength="6"
                   class="w-full px-4 py-3 border border-earth-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-400 outline-none"
                   placeholder="Mínimo 6 caracteres">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Confirmar contraseña</label>
            <input type="password" [(ngModel)]="confirmPassword" name="confirmPassword" required
                   class="w-full px-4 py-3 border border-earth-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-400 outline-none"
                   placeholder="Repite tu contraseña">
          </div>
          <button type="submit" [disabled]="loading"
                  class="w-full py-3 bg-primary-600 text-white rounded-xl font-semibold text-sm hover:bg-primary-700 disabled:opacity-50">
            {{ loading ? 'Restableciendo...' : 'Restablecer contraseña' }}
          </button>
        </form>
      </div>
    </div>
  `,
})
export class ResetPasswordComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  token = '';
  password = '';
  confirmPassword = '';
  loading = false;

  ngOnInit(): void {
    this.token = this.route.snapshot.params['token'];
  }

  onSubmit(): void {
    if (this.password !== this.confirmPassword) {
      this.toast.error('Las contraseñas no coinciden');
      return;
    }
    this.loading = true;
    this.authService.resetPassword(this.token, this.password).subscribe({
      next: () => {
        this.toast.success('Contraseña restablecida. Ya puedes iniciar sesión.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        this.toast.error(err.error?.error || 'Token inválido o expirado');
      },
    });
  }
}
