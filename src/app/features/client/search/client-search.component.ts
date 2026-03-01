import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PropertyService, Property, PropertyFilters } from '../../../core/services/property.service';
import { FavoriteService } from '../../../core/services/favorite.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-client-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Buscar propiedades</h1>
        <p class="text-gray-500 mt-1">Encuentra tu propiedad ideal</p>
      </div>

      <!-- Search Bar -->
      <div class="bg-white rounded-2xl shadow-card p-4">
        <div class="flex flex-wrap gap-3">
          <div class="relative flex-1 min-w-[200px]">
            <span class="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
            <input type="text" [(ngModel)]="filters.search" (ngModelChange)="search()"
                   placeholder="Buscar por título, ciudad..."
                   class="w-full pl-10 pr-4 py-3 border border-earth-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-300 focus:border-primary-500">
          </div>
          <select [(ngModel)]="filters.operation_type" (ngModelChange)="search()"
                  class="px-4 py-3 border border-earth-200 rounded-xl text-sm bg-white">
            <option value="">Operación</option>
            <option value="venta">Venta</option>
            <option value="renta">Renta</option>
          </select>
          <select [(ngModel)]="filters.property_type" (ngModelChange)="search()"
                  class="px-4 py-3 border border-earth-200 rounded-xl text-sm bg-white">
            <option value="">Tipo</option>
            <option value="casa">Casa</option>
            <option value="departamento">Departamento</option>
            <option value="terreno">Terreno</option>
            <option value="local_comercial">Local Comercial</option>
          </select>
          <select [(ngModel)]="filters.bedrooms" (ngModelChange)="search()"
                  class="px-4 py-3 border border-earth-200 rounded-xl text-sm bg-white">
            <option value="">Recámaras</option>
            <option [ngValue]="1">1+</option>
            <option [ngValue]="2">2+</option>
            <option [ngValue]="3">3+</option>
            <option [ngValue]="4">4+</option>
          </select>
          <button (click)="showAdvanced = !showAdvanced"
                  class="px-4 py-3 border border-earth-200 rounded-xl text-sm hover:bg-earth-100 transition-colors flex items-center gap-1">
            <span class="material-icons text-lg">tune</span> Filtros
          </button>
        </div>

        @if (showAdvanced) {
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 pt-3 border-t border-earth-100">
            <div>
              <label class="text-xs text-gray-500 mb-1 block">Precio mín</label>
              <input type="number" [(ngModel)]="filters.min_price" (ngModelChange)="search()"
                     class="w-full px-3 py-2 border border-earth-200 rounded-lg text-sm" placeholder="0">
            </div>
            <div>
              <label class="text-xs text-gray-500 mb-1 block">Precio máx</label>
              <input type="number" [(ngModel)]="filters.max_price" (ngModelChange)="search()"
                     class="w-full px-3 py-2 border border-earth-200 rounded-lg text-sm" placeholder="Sin límite">
            </div>
            <div>
              <label class="text-xs text-gray-500 mb-1 block">Ciudad</label>
              <input type="text" [(ngModel)]="filters.city" (ngModelChange)="search()"
                     class="w-full px-3 py-2 border border-earth-200 rounded-lg text-sm" placeholder="Ciudad">
            </div>
            <div>
              <label class="text-xs text-gray-500 mb-1 block">Baños</label>
              <select [(ngModel)]="filters.bathrooms" (ngModelChange)="search()"
                      class="w-full px-3 py-2 border border-earth-200 rounded-lg text-sm bg-white">
                <option value="">Todos</option>
                <option [ngValue]="1">1+</option>
                <option [ngValue]="2">2+</option>
                <option [ngValue]="3">3+</option>
              </select>
            </div>
          </div>
        }
      </div>

      <!-- Results -->
      <p class="text-sm text-gray-500">{{ total }} propiedades encontradas</p>

      @if (loading) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (i of [1,2,3,4,5,6]; track i) {
            <div class="bg-white rounded-2xl shadow-card animate-pulse">
              <div class="aspect-[4/3] bg-earth-200 rounded-t-2xl"></div>
              <div class="p-4 space-y-2">
                <div class="h-5 bg-earth-200 rounded w-3/4"></div>
                <div class="h-4 bg-earth-200 rounded w-1/2"></div>
              </div>
            </div>
          }
        </div>
      } @else if (properties.length === 0) {
        <div class="bg-white rounded-2xl shadow-card p-12 text-center">
          <span class="material-icons-outlined text-7xl text-earth-300">search_off</span>
          <p class="text-lg text-gray-500 mt-4">No encontramos propiedades</p>
          <p class="text-sm text-gray-400 mt-1">Intenta ajustar los filtros</p>
        </div>
      } @else {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (prop of properties; track prop.id) {
            <div class="bg-white rounded-2xl shadow-card overflow-hidden group">
              <a [routerLink]="['/propiedades', prop.id]" class="block">
                <div class="aspect-[4/3] bg-earth-100 overflow-hidden relative">
                  @if (prop.main_image) {
                    <img [src]="prop.main_image" [alt]="prop.title"
                         class="w-full h-full object-cover group-hover:scale-105 transition-transform">
                  } @else {
                    <div class="w-full h-full flex items-center justify-center">
                      <span class="material-icons-outlined text-5xl text-earth-300">home</span>
                    </div>
                  }
                  <span class="absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-full"
                        [class]="prop.operation_type === 'venta' ? 'bg-primary-600 text-white' : 'bg-amber-500 text-white'">
                    {{ prop.operation_type === 'venta' ? 'Venta' : 'Renta' }}
                  </span>
                </div>
              </a>
              <div class="p-4">
                <a [routerLink]="['/propiedades', prop.id]">
                  <h3 class="font-semibold text-gray-900 truncate hover:text-primary-600 transition-colors">{{ prop.title }}</h3>
                </a>
                <p class="text-sm text-gray-500 mt-1 flex items-center gap-1">
                  <span class="material-icons text-sm">location_on</span> {{ prop.city }}
                </p>
                <p class="text-lg font-bold text-primary-600 mt-2">
                  {{ prop.price | currency:'MXN':'symbol-narrow':'1.0-0' }}
                </p>
                <div class="flex items-center gap-3 mt-2 text-xs text-gray-500">
                  @if (prop.bedrooms) { <span>{{ prop.bedrooms }} rec</span> }
                  @if (prop.bathrooms) { <span>{{ prop.bathrooms }} baños</span> }
                  @if (prop.total_area) { <span>{{ prop.total_area }} m²</span> }
                </div>
                <div class="flex gap-2 mt-3 pt-3 border-t border-earth-100">
                  <a [routerLink]="['/cliente/agendar', prop.id]"
                     class="flex-1 py-2 text-center text-sm font-medium bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors">
                    Agendar cita
                  </a>
                  <button (click)="toggleFav(prop)"
                          class="w-10 h-10 border border-earth-200 rounded-xl flex items-center justify-center hover:bg-red-50 transition-colors">
                    <span class="material-icons text-lg" [class.text-red-500]="favSet.has(prop.id)">
                      {{ favSet.has(prop.id) ? 'favorite' : 'favorite_border' }}
                    </span>
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
export class ClientSearchComponent implements OnInit {
  private propertyService = inject(PropertyService);
  private favoriteService = inject(FavoriteService);
  private toast = inject(ToastService);

  properties: Property[] = [];
  filters: PropertyFilters = {};
  loading = true;
  total = 0;
  showAdvanced = false;
  favSet = new Set<number>();

  ngOnInit(): void {
    this.search();
    this.favoriteService.getMyFavorites().subscribe({
      next: (favs) => favs.forEach((f: Property) => this.favSet.add(f.id)),
    });
  }

  search(): void {
    this.loading = true;
    this.propertyService.getAll(this.filters).subscribe({
      next: (res) => {
        this.properties = res.data;
        this.total = res.pagination?.total || res.data.length;
        this.loading = false;
      },
      error: () => this.loading = false,
    });
  }

  toggleFav(prop: Property): void {
    this.favoriteService.toggle(prop.id).subscribe({
      next: (res) => {
        if (res.favorited) {
          this.favSet.add(prop.id);
        } else {
          this.favSet.delete(prop.id);
        }
        this.toast.success(res.message);
      },
    });
  }
}
