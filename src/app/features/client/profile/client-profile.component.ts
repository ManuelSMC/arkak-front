import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-client-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Mi Perfil</h1>
        <p class="text-gray-500 mt-1">Actualiza tu información personal</p>
      </div>

      <!-- Avatar -->
      <div class="bg-white rounded-2xl shadow-card p-6 text-center">
        <div class="w-24 h-24 bg-primary-100 text-primary-600 rounded-2xl mx-auto flex items-center justify-center font-bold text-4xl">
          {{ user?.first_name?.charAt(0) }}
        </div>
        <p class="font-bold text-gray-900 text-lg mt-3">{{ user?.first_name }} {{ user?.last_name }}</p>
        <p class="text-gray-500 text-sm">{{ user?.email }}</p>
        <span class="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Cliente</span>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
        <!-- Personal Info -->
        <div class="bg-white rounded-2xl shadow-card p-6 space-y-4">
          <h2 class="font-bold text-gray-900">Información personal</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input formControlName="first_name" type="text"
                     class="w-full px-4 py-3 border border-earth-200 rounded-xl focus:ring-2 focus:ring-primary-300 focus:border-primary-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
              <input formControlName="last_name" type="text"
                     class="w-full px-4 py-3 border border-earth-200 rounded-xl focus:ring-2 focus:ring-primary-300 focus:border-primary-500">
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input formControlName="phone" type="tel"
                   class="w-full px-4 py-3 border border-earth-200 rounded-xl focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
                   placeholder="Ej: +52 55 1234 5678">
          </div>
        </div>

        <!-- Change Password -->
        <div class="bg-white rounded-2xl shadow-card p-6 space-y-4">
          <h2 class="font-bold text-gray-900">Cambiar contraseña</h2>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña actual</label>
            <input formControlName="current_password" type="password"
                   class="w-full px-4 py-3 border border-earth-200 rounded-xl focus:ring-2 focus:ring-primary-300 focus:border-primary-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
            <input formControlName="new_password" type="password"
                   class="w-full px-4 py-3 border border-earth-200 rounded-xl focus:ring-2 focus:ring-primary-300 focus:border-primary-500">
          </div>
        </div>

        <button type="submit" [disabled]="saving"
                class="w-full py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 disabled:opacity-50 transition-colors">
          {{ saving ? 'Guardando...' : 'Guardar cambios' }}
        </button>
      </form>
    </div>
  `,
})
export class ClientProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toast = inject(ToastService);

  user: any = null;
  saving = false;

  form: FormGroup = this.fb.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    phone: [''],
    current_password: [''],
    new_password: [''],
  });

  ngOnInit(): void {
    this.user = this.authService.currentUser;
    if (this.user) {
      this.form.patchValue(this.user);
    }
  }

  onSubmit(): void {
    this.saving = true;
    const data = { ...this.form.value };
    if (!data.current_password) delete data.current_password;
    if (!data.new_password) delete data.new_password;

    this.authService.updateProfile(data).subscribe({
      next: () => {
        this.toast.success('Perfil actualizado');
        this.saving = false;
      },
      error: () => this.saving = false,
    });
  }
}
