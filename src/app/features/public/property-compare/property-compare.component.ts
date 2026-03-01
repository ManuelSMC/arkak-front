import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PropertyService, Property } from '../../../core/services/property.service';

@Component({
  selector: 'app-property-compare',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav class="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <a routerLink="/" class="hover:text-primary-600">Inicio</a>
        <span class="material-icons text-xs">chevron_right</span>
        <span class="text-gray-900">Comparar propiedades</span>
      </nav>

      <h1 class="text-2xl font-bold text-gray-900 mb-6">Comparar propiedades</h1>

      @if (properties.length === 0) {
        <div class="bg-white rounded-2xl shadow-card p-12 text-center">
          <span class="material-icons-outlined text-7xl text-earth-300">compare_arrows</span>
          <p class="text-gray-500 mt-4 text-lg">No hay propiedades para comparar.</p>
          <p class="text-gray-400 text-sm mt-1">Agrega propiedades desde la lista de propiedades.</p>
          <a routerLink="/propiedades"
             class="inline-block mt-6 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors">
            Ver propiedades
          </a>
        </div>
      } @else {
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr>
                <th class="text-left py-3 px-4 text-sm font-medium text-gray-500 w-40">Campo</th>
                @for (prop of properties; track prop.id) {
                  <th class="py-3 px-4 min-w-[240px]">
                    <div class="bg-white rounded-2xl shadow-card overflow-hidden">
                      <div class="aspect-[16/10] bg-earth-100">
                        @if (prop.main_image) {
                          <img [src]="prop.main_image" [alt]="prop.title" class="w-full h-full object-cover">
                        }
                      </div>
                      <div class="p-3">
                        <p class="font-semibold text-gray-900 text-sm truncate">{{ prop.title }}</p>
                        <button (click)="removeProperty(prop.id)"
                                class="text-xs text-red-500 hover:underline mt-1">Quitar</button>
                      </div>
                    </div>
                  </th>
                }
              </tr>
            </thead>
            <tbody class="divide-y divide-earth-100">
              @for (row of compareRows; track row.label) {
                <tr class="hover:bg-earth-50">
                  <td class="py-3 px-4 text-sm font-medium text-gray-600">{{ row.label }}</td>
                  @for (prop of properties; track prop.id) {
                    <td class="py-3 px-4 text-sm text-gray-900 text-center">{{ row.getValue(prop) }}</td>
                  }
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
})
export class PropertyCompareComponent {
  properties: Property[] = [];

  compareRows = [
    { label: 'Precio', getValue: (p: Property) => p.price ? `$${Number(p.price).toLocaleString('es-MX')}` : '-' },
    { label: 'Tipo', getValue: (p: Property) => ({ casa: 'Casa', departamento: 'Depto', terreno: 'Terreno', local_comercial: 'Local' }[p.property_type] || p.property_type) },
    { label: 'Operación', getValue: (p: Property) => p.operation_type === 'venta' ? 'Venta' : 'Renta' },
    { label: 'Sup. Total', getValue: (p: Property) => p.total_area ? `${p.total_area} m²` : '-' },
    { label: 'Construida', getValue: (p: Property) => p.built_area ? `${p.built_area} m²` : '-' },
    { label: 'Recámaras', getValue: (p: Property) => p.bedrooms?.toString() || '-' },
    { label: 'Baños', getValue: (p: Property) => p.bathrooms?.toString() || '-' },
    { label: 'Estacionamientos', getValue: (p: Property) => p.parking_spaces?.toString() || '-' },
    { label: 'Año', getValue: (p: Property) => p.year_built?.toString() || '-' },
    { label: 'Ciudad', getValue: (p: Property) => p.city || '-' },
  ];

  constructor() {
    const stored = sessionStorage.getItem('compareProperties');
    if (stored) {
      this.properties = JSON.parse(stored);
    }
  }

  removeProperty(id: number): void {
    this.properties = this.properties.filter(p => p.id !== id);
    sessionStorage.setItem('compareProperties', JSON.stringify(this.properties));
  }
}
