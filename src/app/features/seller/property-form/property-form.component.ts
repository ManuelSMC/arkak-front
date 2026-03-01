import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PropertyService } from '../../../core/services/property.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-property-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="space-y-6">
      <div class="flex items-center gap-3">
        <a routerLink="/vendedor/propiedades"
           class="w-10 h-10 rounded-xl border border-earth-200 flex items-center justify-center hover:bg-earth-100 transition-colors">
          <span class="material-icons">arrow_back</span>
        </a>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ isEdit ? 'Editar' : 'Nueva' }} propiedad</h1>
          <p class="text-gray-500 mt-0.5">{{ isEdit ? 'Modifica los datos de tu propiedad' : 'Publica una nueva propiedad' }}</p>
        </div>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
        <!-- Basic Info -->
        <div class="bg-white rounded-2xl shadow-card p-6 space-y-5">
          <h2 class="font-bold text-gray-900 text-lg">Información básica</h2>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Título *</label>
            <input formControlName="title" type="text"
                   class="w-full px-4 py-3 border border-earth-200 rounded-xl focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
                   placeholder="Ej: Casa moderna en zona residencial">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
            <textarea formControlName="description" rows="4"
                      class="w-full px-4 py-3 border border-earth-200 rounded-xl focus:ring-2 focus:ring-primary-300 focus:border-primary-500 resize-none"
                      placeholder="Describe tu propiedad en detalle..."></textarea>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de propiedad *</label>
              <select formControlName="property_type"
                      class="w-full px-4 py-3 border border-earth-200 rounded-xl bg-white">
                <option value="">Seleccionar</option>
                <option value="casa">Casa</option>
                <option value="departamento">Departamento</option>
                <option value="terreno">Terreno</option>
                <option value="local_comercial">Local Comercial</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de operación *</label>
              <select formControlName="operation_type"
                      class="w-full px-4 py-3 border border-earth-200 rounded-xl bg-white">
                <option value="">Seleccionar</option>
                <option value="venta">Venta</option>
                <option value="renta">Renta</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Precio (MXN) *</label>
            <input formControlName="price" type="number"
                   class="w-full px-4 py-3 border border-earth-200 rounded-xl focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
                   placeholder="0.00">
          </div>
        </div>

        <!-- Specifications -->
        <div class="bg-white rounded-2xl shadow-card p-6 space-y-5">
          <h2 class="font-bold text-gray-900 text-lg">Especificaciones</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Recámaras</label>
              <input formControlName="bedrooms" type="number" min="0"
                     class="w-full px-4 py-3 border border-earth-200 rounded-xl">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Baños</label>
              <input formControlName="bathrooms" type="number" min="0"
                     class="w-full px-4 py-3 border border-earth-200 rounded-xl">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Medios baños</label>
              <input formControlName="half_bathrooms" type="number" min="0"
                     class="w-full px-4 py-3 border border-earth-200 rounded-xl">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Estacionamientos</label>
              <input formControlName="parking_spaces" type="number" min="0"
                     class="w-full px-4 py-3 border border-earth-200 rounded-xl">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Área total (m²)</label>
              <input formControlName="total_area" type="number" min="0"
                     class="w-full px-4 py-3 border border-earth-200 rounded-xl">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Área construida (m²)</label>
              <input formControlName="built_area" type="number" min="0"
                     class="w-full px-4 py-3 border border-earth-200 rounded-xl">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Año construcción</label>
              <input formControlName="year_built" type="number" min="1900" max="2030"
                     class="w-full px-4 py-3 border border-earth-200 rounded-xl">
            </div>
          </div>
        </div>

        <!-- Amenities -->
        <div class="bg-white rounded-2xl shadow-card p-6 space-y-4">
          <h2 class="font-bold text-gray-900 text-lg">Amenidades</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            @for (amenity of amenities; track amenity.key) {
              <label class="flex items-center gap-3 px-4 py-3 border rounded-xl cursor-pointer transition-colors"
                     [class]="form.get(amenity.key)?.value ? 'border-primary-400 bg-primary-50' : 'border-earth-200 hover:border-earth-300'">
                <input type="checkbox" [formControlName]="amenity.key" class="sr-only">
                <span class="material-icons-outlined text-lg"
                      [class]="form.get(amenity.key)?.value ? 'text-primary-600' : 'text-gray-400'">
                  {{ amenity.icon }}
                </span>
                <span class="text-sm font-medium" [class]="form.get(amenity.key)?.value ? 'text-primary-700' : 'text-gray-700'">
                  {{ amenity.label }}
                </span>
              </label>
            }
          </div>
        </div>

        <!-- Location -->
        <div class="bg-white rounded-2xl shadow-card p-6 space-y-5">
          <h2 class="font-bold text-gray-900 text-lg">Ubicación</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Calle</label>
              <input formControlName="street" type="text"
                     class="w-full px-4 py-3 border border-earth-200 rounded-xl">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Colonia</label>
              <input formControlName="neighborhood" type="text"
                     class="w-full px-4 py-3 border border-earth-200 rounded-xl">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Ciudad *</label>
              <input formControlName="city" type="text"
                     class="w-full px-4 py-3 border border-earth-200 rounded-xl">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
              <input formControlName="state" type="text"
                     class="w-full px-4 py-3 border border-earth-200 rounded-xl">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Código Postal</label>
              <input formControlName="zip_code" type="text"
                     class="w-full px-4 py-3 border border-earth-200 rounded-xl">
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Latitud</label>
              <input formControlName="latitude" type="number" step="any"
                     class="w-full px-4 py-3 border border-earth-200 rounded-xl">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Longitud</label>
              <input formControlName="longitude" type="number" step="any"
                     class="w-full px-4 py-3 border border-earth-200 rounded-xl">
            </div>
          </div>
        </div>

        <!-- Images -->
        <div class="bg-white rounded-2xl shadow-card p-6 space-y-4">
          <h2 class="font-bold text-gray-900 text-lg">Imágenes</h2>

          @if (previewUrls.length > 0) {
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              @for (url of previewUrls; track url; let i = $index) {
                <div class="aspect-square bg-earth-100 rounded-xl overflow-hidden relative group">
                  <img [src]="url" class="w-full h-full object-cover">
                  <button type="button" (click)="removeImage(i)"
                          class="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span class="material-icons text-sm">close</span>
                  </button>
                </div>
              }
            </div>
          }

          <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-earth-300 rounded-xl cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors">
            <span class="material-icons-outlined text-3xl text-gray-400">cloud_upload</span>
            <span class="text-sm text-gray-500 mt-1">Arrastra o haz clic para subir</span>
            <span class="text-xs text-gray-400 mt-0.5">JPG, PNG hasta 5MB (máx. 10 fotos)</span>
            <input type="file" accept="image/*" multiple (change)="onFilesSelected($event)" class="hidden">
          </label>
        </div>

        <!-- Submit -->
        <div class="flex justify-end gap-4">
          <a routerLink="/vendedor/propiedades"
             class="px-6 py-3 border border-earth-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-earth-100 transition-colors">
            Cancelar
          </a>
          <button type="submit" [disabled]="submitting || form.invalid"
                  class="px-8 py-3 bg-primary-600 text-white rounded-xl font-semibold text-sm hover:bg-primary-700 disabled:opacity-50 transition-colors">
            {{ submitting ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Publicar propiedad') }}
          </button>
        </div>
      </form>
    </div>
  `,
})
export class PropertyFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private propertyService = inject(PropertyService);
  private toast = inject(ToastService);

  isEdit = false;
  propertyId = 0;
  submitting = false;
  selectedFiles: File[] = [];
  previewUrls: string[] = [];

  amenities = [
    { key: 'has_garden', label: 'Jardín', icon: 'yard' },
    { key: 'has_pool', label: 'Alberca', icon: 'pool' },
    { key: 'has_storage', label: 'Bodega', icon: 'warehouse' },
    { key: 'has_security', label: 'Seguridad 24h', icon: 'security' },
    { key: 'is_furnished', label: 'Amueblado', icon: 'weekend' },
  ];

  form: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    property_type: ['', Validators.required],
    operation_type: ['', Validators.required],
    price: [null, [Validators.required, Validators.min(1)]],
    bedrooms: [null],
    bathrooms: [null],
    half_bathrooms: [null],
    parking_spaces: [null],
    total_area: [null],
    built_area: [null],
    year_built: [null],
    has_garden: [false],
    has_pool: [false],
    has_storage: [false],
    has_security: [false],
    is_furnished: [false],
    street: [''],
    neighborhood: [''],
    city: ['', Validators.required],
    state: ['', Validators.required],
    zip_code: [''],
    latitude: [null],
    longitude: [null],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit = true;
      this.propertyId = +id;
      this.propertyService.getById(this.propertyId).subscribe({
        next: (p) => {
          this.form.patchValue(p);
          if (p.images) {
            this.previewUrls = p.images.map((img: any) => img.image_url);
          }
        },
      });
    }
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    const files = Array.from(input.files);
    files.forEach(file => {
      if (this.selectedFiles.length < 10) {
        this.selectedFiles.push(file);
        const reader = new FileReader();
        reader.onload = () => this.previewUrls.push(reader.result as string);
        reader.readAsDataURL(file);
      }
    });
  }

  removeImage(index: number): void {
    this.previewUrls.splice(index, 1);
    this.selectedFiles.splice(index, 1);
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.submitting = true;
    const formData = new FormData();

    Object.entries(this.form.value).forEach(([key, val]) => {
      if (val !== null && val !== undefined && val !== '') {
        formData.append(key, String(val));
      }
    });

    this.selectedFiles.forEach(f => formData.append('images', f));

    const req = this.isEdit
      ? this.propertyService.update(this.propertyId, formData)
      : this.propertyService.create(formData);

    req.subscribe({
      next: () => {
        this.toast.success(this.isEdit ? 'Propiedad actualizada' : 'Propiedad publicada');
        this.router.navigate(['/vendedor/propiedades']);
      },
      error: () => this.submitting = false,
    });
  }
}
