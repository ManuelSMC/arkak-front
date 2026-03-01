import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-seller-profile-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Mi Perfil</h1>
        <p class="text-gray-500 mt-1">Actualiza tu información de vendedor</p>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
        <!-- Personal Info -->
        <div class="bg-white rounded-2xl shadow-card p-6 space-y-5">
          <h2 class="font-bold text-gray-900 text-lg">Información personal</h2>
          <div class="flex items-center gap-4 mb-4">
            <div class="w-20 h-20 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center font-bold text-3xl">
              {{ user?.first_name?.charAt(0) }}
            </div>
            <div>
              <p class="font-bold text-gray-900">{{ user?.first_name }} {{ user?.last_name }}</p>
              <p class="text-sm text-gray-500">{{ user?.email }}</p>
            </div>
          </div>

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
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input formControlName="phone" type="tel"
                     class="w-full px-4 py-3 border border-earth-200 rounded-xl focus:ring-2 focus:ring-primary-300 focus:border-primary-500">
            </div>
          </div>
        </div>

        <!-- Seller Profile -->
        <div class="bg-white rounded-2xl shadow-card p-6 space-y-5">
          <h2 class="font-bold text-gray-900 text-lg">Perfil profesional</h2>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Biografía</label>
            <textarea formControlName="bio" rows="4"
                      class="w-full px-4 py-3 border border-earth-200 rounded-xl resize-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
                      placeholder="Cuéntale a tus clientes sobre ti..."></textarea>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Años de experiencia</label>
              <input formControlName="years_experience" type="number" min="0"
                     class="w-full px-4 py-3 border border-earth-200 rounded-xl">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Licencia</label>
              <input formControlName="license_number" type="text"
                     class="w-full px-4 py-3 border border-earth-200 rounded-xl"
                     placeholder="Número de licencia">
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Especialidades</label>
            <input formControlName="specialties" type="text"
                   class="w-full px-4 py-3 border border-earth-200 rounded-xl"
                   placeholder="Ej: Residencial, Comercial, Terrenos">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Zonas de servicio</label>
            <input formControlName="service_areas" type="text"
                   class="w-full px-4 py-3 border border-earth-200 rounded-xl"
                   placeholder="Ej: CDMX, Querétaro, Guadalajara">
          </div>
        </div>

        <!-- Password Change -->
        <div class="bg-white rounded-2xl shadow-card p-6 space-y-5">
          <h2 class="font-bold text-gray-900 text-lg">Cambiar contraseña</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña actual</label>
              <input formControlName="current_password" type="password"
                     class="w-full px-4 py-3 border border-earth-200 rounded-xl">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
              <input formControlName="new_password" type="password"
                     class="w-full px-4 py-3 border border-earth-200 rounded-xl">
            </div>
          </div>
        </div>

        <div class="flex justify-end">
          <button type="submit" [disabled]="saving"
                  class="px-8 py-3 bg-primary-600 text-white rounded-xl font-semibold text-sm hover:bg-primary-700 disabled:opacity-50 transition-colors">
            {{ saving ? 'Guardando...' : 'Guardar cambios' }}
          </button>
        </div>
      </form>
    </div>
  `,
})
export class SellerProfileEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toast = inject(ToastService);

  user: any = null;
  saving = false;

  form: FormGroup = this.fb.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    phone: [''],
    bio: [''],
    years_experience: [null],
    license_number: [''],
    specialties: [''],
    service_areas: [''],
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
    const data = this.form.value;

    // Remove empty password fields
    const profileData = { ...data };
    delete profileData.current_password;
    delete profileData.new_password;

    this.authService.updateProfile(profileData).subscribe({
      next: () => {
        // If password change requested
        if (data.current_password && data.new_password) {
          this.authService.changePassword(data.current_password, data.new_password).subscribe({
            next: () => {
              this.toast.success('Perfil y contraseña actualizados');
              this.saving = false;
              this.form.patchValue({ current_password: '', new_password: '' });
            },
            error: (err) => {
              this.toast.error(err.error?.error || 'Error al cambiar contraseña');
              this.saving = false;
            },
          });
        } else {
          this.toast.success('Perfil actualizado');
          this.saving = false;
        }
      },
      error: () => this.saving = false,
    });
  }
}
