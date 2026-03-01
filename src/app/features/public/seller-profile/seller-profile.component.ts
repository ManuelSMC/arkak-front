import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PropertyService, Property } from '../../../core/services/property.service';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-seller-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <a routerLink="/" class="hover:text-primary-600">Inicio</a>
        <span class="material-icons text-xs">chevron_right</span>
        <span class="text-gray-900">Perfil del agente</span>
      </nav>

      @if (seller) {
        <!-- Profile Header -->
        <div class="bg-white rounded-2xl shadow-card overflow-hidden mb-8">
          <div class="h-32 bg-gradient-to-r from-primary-600 to-primary-400"></div>
          <div class="px-6 pb-6 -mt-12">
            <div class="flex flex-col sm:flex-row items-start sm:items-end gap-4">
              <div class="w-24 h-24 bg-primary-100 text-primary-600 rounded-2xl border-4 border-white shadow-md flex items-center justify-center font-bold text-3xl">
                {{ seller.first_name?.charAt(0) }}
              </div>
              <div class="flex-1">
                <h1 class="text-2xl font-bold text-gray-900">{{ seller.first_name }} {{ seller.last_name }}</h1>
                <p class="text-gray-500">Agente inmobiliario</p>
              </div>
              <div class="flex gap-6 text-center">
                <div>
                  <p class="text-2xl font-bold text-primary-600">{{ properties.length }}</p>
                  <p class="text-xs text-gray-500">Propiedades</p>
                </div>
                @if (seller.years_experience) {
                  <div>
                    <p class="text-2xl font-bold text-primary-600">{{ seller.years_experience }}</p>
                    <p class="text-xs text-gray-500">Años exp.</p>
                  </div>
                }
                @if (seller.rating) {
                  <div>
                    <p class="text-2xl font-bold text-amber-500">{{ seller.rating }}</p>
                    <p class="text-xs text-gray-500">Rating</p>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>

        <!-- Bio & Properties -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="space-y-6">
            @if (seller.bio) {
              <div class="bg-white rounded-2xl shadow-card p-6">
                <h3 class="font-bold text-gray-900 mb-3">Sobre mí</h3>
                <p class="text-gray-600 text-sm leading-relaxed">{{ seller.bio }}</p>
              </div>
            }
            @if (seller.specialties) {
              <div class="bg-white rounded-2xl shadow-card p-6">
                <h3 class="font-bold text-gray-900 mb-3">Especialidades</h3>
                <div class="flex flex-wrap gap-2">
                  @for (s of seller.specialties.split(','); track s) {
                    <span class="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium">{{ s.trim() }}</span>
                  }
                </div>
              </div>
            }
            @if (seller.service_areas) {
              <div class="bg-white rounded-2xl shadow-card p-6">
                <h3 class="font-bold text-gray-900 mb-3">Zonas de servicio</h3>
                <div class="flex flex-wrap gap-2">
                  @for (area of seller.service_areas.split(','); track area) {
                    <span class="px-3 py-1 bg-earth-100 text-gray-700 rounded-full text-xs font-medium">{{ area.trim() }}</span>
                  }
                </div>
              </div>
            }
          </div>

          <div class="lg:col-span-2">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Propiedades ({{ properties.length }})</h2>
            @if (properties.length === 0) {
              <div class="bg-white rounded-2xl shadow-card p-12 text-center">
                <span class="material-icons-outlined text-6xl text-earth-300">home</span>
                <p class="text-gray-500 mt-2">Este agente no tiene propiedades publicadas aún.</p>
              </div>
            } @else {
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                @for (prop of properties; track prop.id) {
                  <a [routerLink]="['/propiedades', prop.id]"
                     class="bg-white rounded-2xl shadow-card overflow-hidden hover:shadow-lg transition-all group">
                    <div class="aspect-[4/3] bg-earth-100 overflow-hidden">
                      @if (prop.main_image) {
                        <img [src]="prop.main_image" [alt]="prop.title"
                             class="w-full h-full object-cover group-hover:scale-105 transition-transform">
                      } @else {
                        <div class="w-full h-full flex items-center justify-center">
                          <span class="material-icons-outlined text-5xl text-earth-300">home</span>
                        </div>
                      }
                    </div>
                    <div class="p-4">
                      <p class="font-semibold text-gray-900 truncate">{{ prop.title }}</p>
                      <p class="text-sm text-gray-500 mt-1">{{ prop.city }}</p>
                      <p class="text-lg font-bold text-primary-600 mt-2">
                        {{ prop.price | currency:'MXN':'symbol-narrow':'1.0-0' }}
                      </p>
                    </div>
                  </a>
                }
              </div>
            }
          </div>
        </div>
      } @else if (loading) {
        <div class="animate-pulse space-y-6">
          <div class="h-48 bg-earth-200 rounded-2xl"></div>
          <div class="h-8 bg-earth-200 rounded w-1/3"></div>
        </div>
      }
    </div>
  `,
})
export class SellerProfileComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private adminService = inject(AdminService);
  private propertyService = inject(PropertyService);

  seller: any = null;
  properties: Property[] = [];
  loading = true;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.params['id']);
    this.adminService.getSellerProfile(id).subscribe({
      next: (data) => {
        this.seller = data.seller;
        this.properties = data.properties || [];
        this.loading = false;
      },
      error: () => this.loading = false,
    });
  }
}
