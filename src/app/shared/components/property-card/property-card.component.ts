import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Property } from '../../../core/services/property.service';

@Component({
  selector: 'app-property-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <a [routerLink]="['/propiedades', property.id]"
       class="block bg-white rounded-2xl overflow-hidden shadow-card card-hover transition-all duration-300 group">
      <!-- Image -->
      <div class="relative aspect-[4/3] overflow-hidden bg-earth-100">
        @if (property.main_image) {
          <img [src]="property.main_image" [alt]="property.title"
               class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
        } @else {
          <div class="w-full h-full flex items-center justify-center text-earth-400">
            <span class="material-icons-outlined text-6xl">home</span>
          </div>
        }
        <!-- Badges -->
        <div class="absolute top-3 left-3 flex gap-2">
          <span class="px-3 py-1 text-xs font-semibold rounded-full"
                [class]="property.operation_type === 'venta' ? 'bg-primary-600 text-white' : 'bg-amber-500 text-white'">
            {{ property.operation_type === 'venta' ? 'Venta' : 'Renta' }}
          </span>
          @if (property.is_featured) {
            <span class="px-3 py-1 text-xs font-semibold rounded-full bg-white/90 text-primary-600">
              ⭐ Destacada
            </span>
          }
        </div>
      </div>

      <!-- Content -->
      <div class="p-5">
        <div class="flex items-start justify-between gap-2 mb-2">
          <h3 class="font-semibold text-lg text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
            {{ property.title }}
          </h3>
        </div>

        <p class="text-2xl font-bold text-primary-600 mb-3">
          {{ property.price | currency:'MXN':'symbol-narrow':'1.0-0' }}
          @if (property.operation_type === 'renta') {
            <span class="text-sm font-normal text-gray-500">/mes</span>
          }
        </p>

        @if (property.neighborhood || property.city) {
          <p class="text-sm text-gray-500 flex items-center gap-1 mb-3">
            <span class="material-icons-outlined text-base">location_on</span>
            {{ property.neighborhood }}{{ property.city ? ', ' + property.city : '' }}
          </p>
        }

        <!-- Specs -->
        <div class="flex items-center gap-4 text-sm text-gray-600 pt-3 border-t border-gray-100">
          @if (property.bedrooms) {
            <span class="flex items-center gap-1">
              <span class="material-icons-outlined text-base text-primary-400">bed</span>
              {{ property.bedrooms }}
            </span>
          }
          @if (property.bathrooms) {
            <span class="flex items-center gap-1">
              <span class="material-icons-outlined text-base text-primary-400">bathtub</span>
              {{ property.bathrooms }}
            </span>
          }
          @if (property.total_area) {
            <span class="flex items-center gap-1">
              <span class="material-icons-outlined text-base text-primary-400">square_foot</span>
              {{ property.total_area }} m²
            </span>
          }
          @if (property.parking_spaces) {
            <span class="flex items-center gap-1">
              <span class="material-icons-outlined text-base text-primary-400">directions_car</span>
              {{ property.parking_spaces }}
            </span>
          }
        </div>
      </div>
    </a>
  `,
})
export class PropertyCardComponent {
  @Input({ required: true }) property!: Property;
}
