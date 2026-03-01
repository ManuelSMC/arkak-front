import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PropertyService, Property } from '../../../core/services/property.service';
import { AuthService } from '../../../core/services/auth.service';
import { FavoriteService } from '../../../core/services/favorite.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (property) {
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Breadcrumb -->
        <nav class="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <a routerLink="/" class="hover:text-primary-600">Inicio</a>
          <span class="material-icons text-xs">chevron_right</span>
          <a routerLink="/propiedades" class="hover:text-primary-600">Propiedades</a>
          <span class="material-icons text-xs">chevron_right</span>
          <span class="text-gray-900">{{ property.title }}</span>
        </nav>

        <!-- Gallery -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8 rounded-2xl overflow-hidden">
          <div class="aspect-[4/3] bg-earth-100 rounded-2xl overflow-hidden">
            @if (selectedImage) {
              <img [src]="selectedImage" [alt]="property.title" class="w-full h-full object-cover">
            } @else {
              <div class="w-full h-full flex items-center justify-center text-earth-400">
                <span class="material-icons-outlined text-8xl">home</span>
              </div>
            }
          </div>
          @if (property.images && property.images.length > 1) {
            <div class="grid grid-cols-2 gap-4">
              @for (img of property.images.slice(1, 5); track img.id) {
                <div class="aspect-[4/3] bg-earth-100 rounded-xl overflow-hidden cursor-pointer"
                     (click)="selectedImage = img.image_url">
                  <img [src]="img.image_url" [alt]="property.title" class="w-full h-full object-cover hover:scale-105 transition-transform">
                </div>
              }
            </div>
          }
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Main Info -->
          <div class="lg:col-span-2 space-y-8">
            <!-- Title & Actions -->
            <div class="flex items-start justify-between gap-4">
              <div>
                <div class="flex items-center gap-2 mb-2">
                  <span class="px-3 py-1 text-xs font-semibold rounded-full"
                        [class]="property.operation_type === 'venta' ? 'bg-primary-100 text-primary-700' : 'bg-amber-100 text-amber-700'">
                    {{ property.operation_type === 'venta' ? 'Venta' : 'Renta' }}
                  </span>
                  <span class="px-3 py-1 text-xs font-medium rounded-full bg-earth-100 text-gray-600">
                    {{ getPropertyTypeLabel(property.property_type) }}
                  </span>
                </div>
                <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">{{ property.title }}</h1>
                @if (property.street || property.neighborhood) {
                  <p class="text-gray-500 flex items-center gap-1 mt-2">
                    <span class="material-icons-outlined text-lg">location_on</span>
                    {{ property.street }}{{ property.neighborhood ? ', ' + property.neighborhood : '' }}{{ property.city ? ', ' + property.city : '' }}
                  </p>
                }
              </div>
              <div class="flex gap-2">
                @if (authService.isAuthenticated) {
                  <button (click)="toggleFavorite()"
                          class="w-10 h-10 rounded-xl border border-earth-200 flex items-center justify-center hover:bg-red-50 transition-colors">
                    <span class="material-icons text-xl" [class.text-red-500]="isFavorited">
                      {{ isFavorited ? 'favorite' : 'favorite_border' }}
                    </span>
                  </button>
                }
                <button (click)="shareProperty()"
                        class="w-10 h-10 rounded-xl border border-earth-200 flex items-center justify-center hover:bg-earth-100 transition-colors">
                  <span class="material-icons-outlined text-xl">share</span>
                </button>
              </div>
            </div>

            <!-- Price -->
            <div class="bg-primary-50 rounded-2xl p-6">
              <p class="text-3xl font-bold text-primary-700">
                {{ property.price | currency:'MXN':'symbol-narrow':'1.0-0' }}
                @if (property.operation_type === 'renta') {
                  <span class="text-lg font-normal text-primary-500">/mes</span>
                }
              </p>
            </div>

            <!-- Specs Grid -->
            <div class="bg-white rounded-2xl shadow-card p-6">
              <h2 class="text-lg font-bold text-gray-900 mb-4">Características</h2>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                @if (property.total_area) {
                  <div class="text-center p-4 bg-earth-50 rounded-xl">
                    <span class="material-icons-outlined text-primary-500 text-2xl">square_foot</span>
                    <p class="font-bold text-gray-900 mt-1">{{ property.total_area }} m²</p>
                    <p class="text-xs text-gray-500">Superficie total</p>
                  </div>
                }
                @if (property.built_area) {
                  <div class="text-center p-4 bg-earth-50 rounded-xl">
                    <span class="material-icons-outlined text-primary-500 text-2xl">home</span>
                    <p class="font-bold text-gray-900 mt-1">{{ property.built_area }} m²</p>
                    <p class="text-xs text-gray-500">Construida</p>
                  </div>
                }
                @if (property.bedrooms) {
                  <div class="text-center p-4 bg-earth-50 rounded-xl">
                    <span class="material-icons-outlined text-primary-500 text-2xl">bed</span>
                    <p class="font-bold text-gray-900 mt-1">{{ property.bedrooms }}</p>
                    <p class="text-xs text-gray-500">Recámaras</p>
                  </div>
                }
                @if (property.bathrooms) {
                  <div class="text-center p-4 bg-earth-50 rounded-xl">
                    <span class="material-icons-outlined text-primary-500 text-2xl">bathtub</span>
                    <p class="font-bold text-gray-900 mt-1">{{ property.bathrooms }}</p>
                    <p class="text-xs text-gray-500">Baños</p>
                  </div>
                }
                @if (property.half_bathrooms) {
                  <div class="text-center p-4 bg-earth-50 rounded-xl">
                    <span class="material-icons-outlined text-primary-500 text-2xl">shower</span>
                    <p class="font-bold text-gray-900 mt-1">{{ property.half_bathrooms }}</p>
                    <p class="text-xs text-gray-500">Medios baños</p>
                  </div>
                }
                @if (property.parking_spaces) {
                  <div class="text-center p-4 bg-earth-50 rounded-xl">
                    <span class="material-icons-outlined text-primary-500 text-2xl">directions_car</span>
                    <p class="font-bold text-gray-900 mt-1">{{ property.parking_spaces }}</p>
                    <p class="text-xs text-gray-500">Estacionamientos</p>
                  </div>
                }
                @if (property.year_built) {
                  <div class="text-center p-4 bg-earth-50 rounded-xl">
                    <span class="material-icons-outlined text-primary-500 text-2xl">calendar_today</span>
                    <p class="font-bold text-gray-900 mt-1">{{ property.year_built }}</p>
                    <p class="text-xs text-gray-500">Año construcción</p>
                  </div>
                }
              </div>
            </div>

            <!-- Features -->
            @if (getFeatures().length) {
              <div class="bg-white rounded-2xl shadow-card p-6">
                <h2 class="text-lg font-bold text-gray-900 mb-4">Amenidades</h2>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  @for (feat of getFeatures(); track feat) {
                    <div class="flex items-center gap-2 text-sm text-gray-700">
                      <span class="material-icons text-primary-500 text-lg">check_circle</span>
                      {{ feat }}
                    </div>
                  }
                </div>
              </div>
            }

            <!-- Description -->
            <div class="bg-white rounded-2xl shadow-card p-6">
              <h2 class="text-lg font-bold text-gray-900 mb-4">Descripción</h2>
              <p class="text-gray-600 leading-relaxed whitespace-pre-line">{{ property.description }}</p>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- Seller Card -->
            <div class="bg-white rounded-2xl shadow-card p-6 sticky top-24">
              <h3 class="font-bold text-gray-900 mb-4">Agente inmobiliario</h3>
              <div class="flex items-center gap-3 mb-4">
                <div class="w-14 h-14 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-xl">
                  {{ property.seller_first_name?.charAt(0) }}
                </div>
                <div>
                  <p class="font-semibold text-gray-900">{{ property.seller_first_name }} {{ property.seller_last_name }}</p>
                  @if (property.seller_years_experience) {
                    <p class="text-xs text-gray-500">{{ property.seller_years_experience }} años de experiencia</p>
                  }
                  @if (property.seller_rating) {
                    <div class="flex items-center gap-1 mt-0.5">
                      <span class="material-icons text-amber-400 text-sm">star</span>
                      <span class="text-xs text-gray-600">{{ property.seller_rating }}</span>
                    </div>
                  }
                </div>
              </div>

              @if (property.seller_bio) {
                <p class="text-sm text-gray-500 mb-4">{{ property.seller_bio }}</p>
              }

              @if (authService.isAuthenticated && authService.userRole === 'cliente') {
                <a [routerLink]="['/cliente/agendar', property.id]"
                   class="block w-full py-3 bg-primary-600 text-white rounded-xl font-semibold text-sm text-center hover:bg-primary-700 transition-colors mb-3">
                  <span class="material-icons-outlined text-lg align-middle mr-1">calendar_month</span>
                  Agendar cita
                </a>
              } @else if (!authService.isAuthenticated) {
                <a routerLink="/login"
                   class="block w-full py-3 bg-primary-600 text-white rounded-xl font-semibold text-sm text-center hover:bg-primary-700 transition-colors mb-3">
                  Inicia sesión para agendar
                </a>
              }

              @if (property.seller_user_id) {
                <a [routerLink]="['/vendedor', property.seller_user_id]"
                   class="block w-full py-3 border border-primary-600 text-primary-600 rounded-xl font-semibold text-sm text-center hover:bg-primary-50 transition-colors">
                  Ver perfil del agente
                </a>
              }
            </div>

            <!-- Views Counter -->
            <div class="bg-white rounded-2xl shadow-card p-4 flex items-center gap-3">
              <span class="material-icons-outlined text-gray-400">visibility</span>
              <span class="text-sm text-gray-600">{{ property.view_count }} visitas</span>
            </div>
          </div>
        </div>
      </div>
    } @else if (loading) {
      <div class="max-w-7xl mx-auto px-4 py-8">
        <div class="animate-pulse space-y-6">
          <div class="h-96 bg-earth-200 rounded-2xl"></div>
          <div class="h-8 bg-earth-200 rounded w-2/3"></div>
          <div class="h-6 bg-earth-200 rounded w-1/3"></div>
        </div>
      </div>
    }
  `,
})
export class PropertyDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private propertyService = inject(PropertyService);
  private favoriteService = inject(FavoriteService);
  private toast = inject(ToastService);
  authService = inject(AuthService);

  property: Property | null = null;
  loading = true;
  selectedImage = '';
  isFavorited = false;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.params['id']);
    this.propertyService.getById(id).subscribe({
      next: (p) => {
        this.property = p;
        this.selectedImage = p.images?.[0]?.image_url || p.main_image || '';
        this.loading = false;
        if (this.authService.isAuthenticated) {
          this.favoriteService.check(id).subscribe(res => this.isFavorited = res.favorited);
        }
      },
      error: () => this.loading = false,
    });
  }

  getPropertyTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      casa: 'Casa', departamento: 'Departamento', terreno: 'Terreno', local_comercial: 'Local Comercial',
    };
    return labels[type] || type;
  }

  getFeatures(): string[] {
    if (!this.property) return [];
    const features = [];
    if (this.property.has_garden) features.push('Jardín');
    if (this.property.has_pool) features.push('Alberca');
    if (this.property.has_storage) features.push('Bodega');
    if (this.property.has_security) features.push('Seguridad 24h');
    if (this.property.is_furnished) features.push('Amueblado');
    return features;
  }

  toggleFavorite(): void {
    if (!this.property) return;
    this.favoriteService.toggle(this.property.id).subscribe({
      next: (res) => {
        this.isFavorited = res.favorited;
        this.toast.success(res.message);
      },
    });
  }

  shareProperty(): void {
    if (navigator.share) {
      navigator.share({ title: this.property?.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      this.toast.info('Enlace copiado al portapapeles');
    }
  }
}
