import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PropertyService, Property, PaginatedResponse, PropertyFilters } from '../../../core/services/property.service';
import { PropertyCardComponent } from '../../../shared/components/property-card/property-card.component';

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PropertyCardComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Propiedades</h1>
          <p class="text-gray-500 text-sm mt-1">{{ pagination.total }} resultados encontrados</p>
        </div>
        <div class="flex items-center gap-3">
          <select [(ngModel)]="filters.sort" (change)="search()"
                  class="px-4 py-2 bg-white border border-earth-200 rounded-xl text-sm outline-none">
            <option value="">Más recientes</option>
            <option value="price_asc">Precio: menor a mayor</option>
            <option value="price_desc">Precio: mayor a menor</option>
            <option value="views">Más vistos</option>
          </select>
          <button (click)="showFilters = !showFilters"
                  class="lg:hidden px-4 py-2 bg-white border border-earth-200 rounded-xl text-sm flex items-center gap-2">
            <span class="material-icons-outlined text-lg">tune</span> Filtros
          </button>
        </div>
      </div>

      <div class="flex gap-8">
        <!-- Sidebar Filters -->
        <aside class="w-72 flex-shrink-0" [class.hidden]="!showFilters" [class.lg:block]="true">
          <div class="bg-white rounded-2xl shadow-card p-6 sticky top-24 space-y-6">
            <h3 class="font-semibold text-gray-900 flex items-center gap-2">
              <span class="material-icons-outlined text-lg">tune</span> Filtros
            </h3>

            <!-- Operation Type -->
            <div>
              <label class="text-sm font-medium text-gray-700 mb-2 block">Operación</label>
              <div class="flex gap-2">
                <button (click)="filters.operation_type = ''; search()"
                        class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                        [class]="!filters.operation_type ? 'bg-primary-600 text-white' : 'bg-earth-100 text-gray-600'">Todas</button>
                <button (click)="filters.operation_type = 'venta'; search()"
                        class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                        [class]="filters.operation_type === 'venta' ? 'bg-primary-600 text-white' : 'bg-earth-100 text-gray-600'">Venta</button>
                <button (click)="filters.operation_type = 'renta'; search()"
                        class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                        [class]="filters.operation_type === 'renta' ? 'bg-primary-600 text-white' : 'bg-earth-100 text-gray-600'">Renta</button>
              </div>
            </div>

            <!-- Property Type -->
            <div>
              <label class="text-sm font-medium text-gray-700 mb-2 block">Tipo</label>
              <select [(ngModel)]="filters.property_type" (change)="search()"
                      class="w-full px-3 py-2 border border-earth-200 rounded-xl text-sm outline-none">
                <option value="">Todos</option>
                <option value="casa">Casa</option>
                <option value="departamento">Departamento</option>
                <option value="terreno">Terreno</option>
                <option value="local_comercial">Local comercial</option>
              </select>
            </div>

            <!-- Price Range -->
            <div>
              <label class="text-sm font-medium text-gray-700 mb-2 block">Precio</label>
              <div class="flex gap-2">
                <input type="number" [(ngModel)]="filters.min_price" placeholder="Mín" (blur)="search()"
                       class="w-full px-3 py-2 border border-earth-200 rounded-xl text-sm outline-none">
                <input type="number" [(ngModel)]="filters.max_price" placeholder="Máx" (blur)="search()"
                       class="w-full px-3 py-2 border border-earth-200 rounded-xl text-sm outline-none">
              </div>
            </div>

            <!-- Bedrooms -->
            <div>
              <label class="text-sm font-medium text-gray-700 mb-2 block">Recámaras mínimas</label>
              <div class="flex gap-2">
                @for (n of [0,1,2,3,4]; track n) {
                  <button (click)="filters.bedrooms = n || undefined; search()"
                          class="w-10 h-10 rounded-lg text-sm font-medium transition-all"
                          [class]="filters.bedrooms === n ? 'bg-primary-600 text-white' : 'bg-earth-100 text-gray-600'">
                    {{ n === 0 ? 'Any' : n + '+' }}
                  </button>
                }
              </div>
            </div>

            <!-- Bathrooms -->
            <div>
              <label class="text-sm font-medium text-gray-700 mb-2 block">Baños mínimos</label>
              <div class="flex gap-2">
                @for (n of [0,1,2,3]; track n) {
                  <button (click)="filters.bathrooms = n || undefined; search()"
                          class="w-10 h-10 rounded-lg text-sm font-medium transition-all"
                          [class]="filters.bathrooms === n ? 'bg-primary-600 text-white' : 'bg-earth-100 text-gray-600'">
                    {{ n === 0 ? 'Any' : n + '+' }}
                  </button>
                }
              </div>
            </div>

            <!-- Area -->
            <div>
              <label class="text-sm font-medium text-gray-700 mb-2 block">Superficie (m²)</label>
              <div class="flex gap-2">
                <input type="number" [(ngModel)]="filters.min_area" placeholder="Mín" (blur)="search()"
                       class="w-full px-3 py-2 border border-earth-200 rounded-xl text-sm outline-none">
                <input type="number" [(ngModel)]="filters.max_area" placeholder="Máx" (blur)="search()"
                       class="w-full px-3 py-2 border border-earth-200 rounded-xl text-sm outline-none">
              </div>
            </div>

            <!-- City -->
            <div>
              <label class="text-sm font-medium text-gray-700 mb-2 block">Ciudad</label>
              <input type="text" [(ngModel)]="filters.city" placeholder="Ej: Guadalajara" (blur)="search()"
                     class="w-full px-3 py-2 border border-earth-200 rounded-xl text-sm outline-none">
            </div>

            <button (click)="clearFilters()"
                    class="w-full py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors">
              Limpiar filtros
            </button>
          </div>
        </aside>

        <!-- Results Grid -->
        <div class="flex-1">
          @if (loading) {
            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              @for (i of [1,2,3,4,5,6]; track i) {
                <div class="bg-white rounded-2xl shadow-card overflow-hidden animate-pulse">
                  <div class="aspect-[4/3] bg-earth-200"></div>
                  <div class="p-5 space-y-3">
                    <div class="h-5 bg-earth-200 rounded w-3/4"></div>
                    <div class="h-6 bg-earth-200 rounded w-1/2"></div>
                    <div class="h-4 bg-earth-200 rounded w-full"></div>
                  </div>
                </div>
              }
            </div>
          } @else if (properties.length) {
            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              @for (property of properties; track property.id) {
                <app-property-card [property]="property" />
              }
            </div>

            <!-- Pagination -->
            @if (pagination.pages > 1) {
              <div class="flex justify-center gap-2 mt-10">
                @for (p of getPages(); track p) {
                  <button (click)="goToPage(p)"
                          class="w-10 h-10 rounded-xl text-sm font-medium transition-all"
                          [class]="p === pagination.page ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-earth-100'">
                    {{ p }}
                  </button>
                }
              </div>
            }
          } @else {
            <div class="text-center py-20 text-gray-400">
              <span class="material-icons-outlined text-6xl mb-4">search_off</span>
              <p class="text-lg font-medium">No se encontraron propiedades</p>
              <p class="text-sm mt-1">Intenta con otros filtros</p>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class PropertyListComponent implements OnInit {
  private propertyService = inject(PropertyService);
  private route = inject(ActivatedRoute);

  properties: Property[] = [];
  pagination = { total: 0, page: 1, limit: 12, pages: 0 };
  loading = true;
  showFilters = false;

  filters: PropertyFilters = {
    operation_type: '', property_type: '', min_price: undefined, max_price: undefined,
    bedrooms: undefined, bathrooms: undefined, min_area: undefined, max_area: undefined,
    city: '', search: '', sort: '', page: 1, limit: 12,
  };

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['operation_type']) this.filters.operation_type = params['operation_type'];
      if (params['property_type']) this.filters.property_type = params['property_type'];
      if (params['search']) this.filters.search = params['search'];
      this.search();
    });
  }

  search(): void {
    this.loading = true;
    this.filters.page = 1;
    this.loadProperties();
  }

  loadProperties(): void {
    this.propertyService.getAll(this.filters).subscribe({
      next: (res) => {
        this.properties = res.data;
        this.pagination = res.pagination;
        this.loading = false;
      },
      error: () => this.loading = false,
    });
  }

  goToPage(page: number): void {
    this.filters.page = page;
    this.loadProperties();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getPages(): number[] {
    const pages = [];
    for (let i = 1; i <= Math.min(this.pagination.pages, 10); i++) pages.push(i);
    return pages;
  }

  clearFilters(): void {
    this.filters = {
      operation_type: '', property_type: '', min_price: undefined, max_price: undefined,
      bedrooms: undefined, bathrooms: undefined, min_area: undefined, max_area: undefined,
      city: '', search: '', sort: '', page: 1, limit: 12,
    };
    this.search();
  }
}
