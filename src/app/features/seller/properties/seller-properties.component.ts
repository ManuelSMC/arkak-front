import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PropertyService, Property } from '../../../core/services/property.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-seller-properties',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Mis Propiedades</h1>
          <p class="text-gray-500 mt-1">{{ properties.length }} propiedades publicadas</p>
        </div>
        <a routerLink="/vendedor/propiedades/nueva"
           class="px-5 py-2.5 bg-primary-600 text-white rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors flex items-center gap-2">
          <span class="material-icons text-lg">add</span>
          Nueva propiedad
        </a>
      </div>

      @if (loading) {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          @for (i of [1,2,3,4]; track i) {
            <div class="bg-white rounded-2xl shadow-card p-4 animate-pulse">
              <div class="aspect-[16/10] bg-earth-200 rounded-xl mb-4"></div>
              <div class="h-5 bg-earth-200 rounded w-3/4 mb-2"></div>
              <div class="h-4 bg-earth-200 rounded w-1/2"></div>
            </div>
          }
        </div>
      } @else if (properties.length === 0) {
        <div class="bg-white rounded-2xl shadow-card p-12 text-center">
          <span class="material-icons-outlined text-7xl text-earth-300">add_home</span>
          <p class="text-lg text-gray-500 mt-4">No has publicado propiedades aún</p>
          <a routerLink="/vendedor/propiedades/nueva"
             class="inline-block mt-4 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors">
            Publicar primera propiedad
          </a>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          @for (prop of properties; track prop.id) {
            <div class="bg-white rounded-2xl shadow-card overflow-hidden">
              <div class="aspect-[16/10] bg-earth-100 relative overflow-hidden">
                @if (prop.main_image) {
                  <img [src]="prop.main_image" [alt]="prop.title" class="w-full h-full object-cover">
                } @else {
                  <div class="w-full h-full flex items-center justify-center">
                    <span class="material-icons-outlined text-5xl text-earth-300">home</span>
                  </div>
                }
                <span class="absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-full"
                      [class]="prop.status === 'activa' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'">
                  {{ prop.status === 'activa' ? 'Activa' : 'Inactiva' }}
                </span>
              </div>
              <div class="p-5">
                <h3 class="font-bold text-gray-900 truncate">{{ prop.title }}</h3>
                <p class="text-sm text-gray-500 mt-1">{{ prop.city }}</p>
                <p class="text-xl font-bold text-primary-600 mt-2">
                  {{ prop.price | currency:'MXN':'symbol-narrow':'1.0-0' }}
                </p>

                <div class="flex items-center gap-4 mt-3 text-xs text-gray-500">
                  @if (prop.bedrooms) {
                    <span class="flex items-center gap-1">
                      <span class="material-icons text-sm">bed</span> {{ prop.bedrooms }}
                    </span>
                  }
                  @if (prop.bathrooms) {
                    <span class="flex items-center gap-1">
                      <span class="material-icons text-sm">bathtub</span> {{ prop.bathrooms }}
                    </span>
                  }
                  @if (prop.total_area) {
                    <span class="flex items-center gap-1">
                      <span class="material-icons text-sm">square_foot</span> {{ prop.total_area }} m²
                    </span>
                  }
                  <span class="flex items-center gap-1 ml-auto">
                    <span class="material-icons text-sm">visibility</span> {{ prop.view_count || 0 }}
                  </span>
                </div>

                <div class="flex gap-2 mt-4 pt-4 border-t border-earth-100">
                  <a [routerLink]="['/vendedor/propiedades/editar', prop.id]"
                     class="flex-1 py-2 text-center text-sm font-medium text-primary-600 border border-primary-200 rounded-xl hover:bg-primary-50 transition-colors">
                    Editar
                  </a>
                  <button (click)="deleteProperty(prop)"
                          class="px-4 py-2 text-sm font-medium text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-colors">
                    <span class="material-icons text-lg">delete</span>
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class SellerPropertiesComponent implements OnInit {
  private propertyService = inject(PropertyService);
  private toast = inject(ToastService);

  properties: Property[] = [];
  loading = true;

  ngOnInit(): void {
    this.propertyService.getMyProperties().subscribe({
      next: (res) => {
        this.properties = res.data || (res as any);
        this.loading = false;
      },
      error: () => this.loading = false,
    });
  }

  deleteProperty(prop: Property): void {
    if (!confirm(`¿Eliminar "${prop.title}"?`)) return;
    this.propertyService.delete(prop.id).subscribe({
      next: () => {
        this.properties = this.properties.filter(p => p.id !== prop.id);
        this.toast.success('Propiedad eliminada');
      },
    });
  }
}
