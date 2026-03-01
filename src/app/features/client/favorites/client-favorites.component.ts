import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FavoriteService } from '../../../core/services/favorite.service';
import { Property } from '../../../core/services/property.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-client-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Mis Favoritos</h1>
        <p class="text-gray-500 mt-1">Propiedades que has guardado</p>
      </div>

      @if (loading) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (i of [1,2,3]; track i) {
            <div class="bg-white rounded-2xl shadow-card p-4 animate-pulse">
              <div class="aspect-[4/3] bg-earth-200 rounded-xl mb-4"></div>
              <div class="h-5 bg-earth-200 rounded w-3/4 mb-2"></div>
              <div class="h-4 bg-earth-200 rounded w-1/2"></div>
            </div>
          }
        </div>
      } @else if (favorites.length === 0) {
        <div class="bg-white rounded-2xl shadow-card p-12 text-center">
          <span class="material-icons-outlined text-7xl text-earth-300">favorite_border</span>
          <p class="text-lg text-gray-500 mt-4">No tienes propiedades favoritas</p>
          <p class="text-sm text-gray-400 mt-1">Guarda propiedades que te interesen para verlas después</p>
          <a routerLink="/propiedades"
             class="inline-block mt-6 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors">
            Explorar propiedades
          </a>
        </div>
      } @else {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (prop of favorites; track prop.id) {
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
                <div class="p-4">
                  <h3 class="font-semibold text-gray-900 truncate">{{ prop.title }}</h3>
                  <p class="text-sm text-gray-500 mt-1 flex items-center gap-1">
                    <span class="material-icons text-sm">location_on</span> {{ prop.city }}
                  </p>
                  <p class="text-lg font-bold text-primary-600 mt-2">
                    {{ prop.price | currency:'MXN':'symbol-narrow':'1.0-0' }}
                  </p>
                  <div class="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    @if (prop.bedrooms) {
                      <span>{{ prop.bedrooms }} rec</span>
                    }
                    @if (prop.bathrooms) {
                      <span>{{ prop.bathrooms }} baños</span>
                    }
                    @if (prop.total_area) {
                      <span>{{ prop.total_area }} m²</span>
                    }
                  </div>
                </div>
              </a>
              <div class="px-4 pb-4">
                <button (click)="removeFavorite(prop)"
                        class="w-full py-2 text-sm font-medium text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-colors">
                  <span class="material-icons text-sm align-text-bottom">favorite</span> Quitar de favoritos
                </button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class ClientFavoritesComponent implements OnInit {
  private favoriteService = inject(FavoriteService);
  private toast = inject(ToastService);

  favorites: Property[] = [];
  loading = true;

  ngOnInit(): void {
    this.favoriteService.getMyFavorites().subscribe({
      next: (data) => {
        this.favorites = data;
        this.loading = false;
      },
      error: () => this.loading = false,
    });
  }

  removeFavorite(prop: Property): void {
    this.favoriteService.toggle(prop.id).subscribe({
      next: () => {
        this.favorites = this.favorites.filter(f => f.id !== prop.id);
        this.toast.success('Removido de favoritos');
      },
    });
  }
}
