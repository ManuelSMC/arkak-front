import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Panel de Administración</h1>
        <p class="text-gray-500 mt-1">Resumen general de la plataforma</p>
      </div>

      <!-- KPI Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        @for (kpi of kpis; track kpi.label) {
          <div class="bg-white rounded-2xl shadow-card p-6">
            <div class="flex items-center justify-between mb-4">
              <span class="w-12 h-12 rounded-xl flex items-center justify-center" [style.background]="kpi.bgColor">
                <span class="material-icons-outlined text-2xl" [style.color]="kpi.color">{{ kpi.icon }}</span>
              </span>
              @if (kpi.change) {
                <span class="text-xs font-semibold px-2 py-1 rounded-full"
                      [class]="kpi.change > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                  {{ kpi.change > 0 ? '+' : '' }}{{ kpi.change }}%
                </span>
              }
            </div>
            <p class="text-3xl font-bold text-gray-900">{{ kpi.value }}</p>
            <p class="text-sm text-gray-500 mt-1">{{ kpi.label }}</p>
          </div>
        }
      </div>

      <!-- Recent Activity -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Properties -->
        <div class="bg-white rounded-2xl shadow-card p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-bold text-gray-900">Propiedades recientes</h2>
            <a routerLink="/admin/propiedades" class="text-sm text-primary-600 hover:underline">Ver todas</a>
          </div>
          @if (recentProperties.length === 0) {
            <p class="text-gray-400 text-sm py-4 text-center">Sin propiedades</p>
          } @else {
            <div class="divide-y divide-earth-100">
              @for (prop of recentProperties; track prop.id) {
                <div class="flex items-center gap-3 py-3">
                  <div class="w-12 h-12 bg-earth-100 rounded-xl flex-shrink-0 overflow-hidden">
                    @if (prop.main_image) {
                      <img [src]="prop.main_image" class="w-full h-full object-cover">
                    } @else {
                      <div class="w-full h-full flex items-center justify-center">
                        <span class="material-icons text-earth-300">home</span>
                      </div>
                    }
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">{{ prop.title }}</p>
                    <p class="text-xs text-gray-500">{{ prop.city }} · {{ prop.seller_name }}</p>
                  </div>
                  <span class="px-2 py-1 text-xs font-medium rounded-full"
                        [class]="prop.status === 'activa' ? 'bg-green-100 text-green-700' : prop.status === 'pausada' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'">
                    {{ prop.status === 'activa' ? 'Activa' : prop.status === 'pausada' ? 'Pausada' : 'Vendida' }}
                  </span>
                </div>
              }
            </div>
          }
        </div>

        <!-- Recent Users -->
        <div class="bg-white rounded-2xl shadow-card p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-bold text-gray-900">Usuarios recientes</h2>
            <a routerLink="/admin/usuarios" class="text-sm text-primary-600 hover:underline">Ver todos</a>
          </div>
          @if (recentUsers.length === 0) {
            <p class="text-gray-400 text-sm py-4 text-center">Sin usuarios recientes</p>
          } @else {
            <div class="divide-y divide-earth-100">
              @for (user of recentUsers; track user.id) {
                <div class="flex items-center gap-3 py-3">
                  <div class="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-semibold text-sm">
                    {{ user.first_name?.charAt(0) }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900">{{ user.first_name }} {{ user.last_name }}</p>
                    <p class="text-xs text-gray-500">{{ user.email }}</p>
                  </div>
                  <span class="px-2 py-1 text-xs font-medium rounded-full"
                        [class]="user.role === 'vendedor' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'">
                    {{ user.role === 'vendedor' ? 'Vendedor' : 'Cliente' }}
                  </span>
                </div>
              }
            </div>
          }
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div class="bg-white rounded-2xl shadow-card p-6 text-center">
          <span class="material-icons-outlined text-4xl text-primary-400">assignment</span>
          <p class="text-2xl font-bold text-gray-900 mt-2">{{ stats.pendingRequests || 0 }}</p>
          <p class="text-sm text-gray-500">Solicitudes pendientes</p>
        </div>
        <div class="bg-white rounded-2xl shadow-card p-6 text-center">
          <span class="material-icons-outlined text-4xl text-amber-400">person_add</span>
          <p class="text-2xl font-bold text-gray-900 mt-2">{{ stats.newUsersThisMonth || 0 }}</p>
          <p class="text-sm text-gray-500">Nuevos usuarios este mes</p>
        </div>
        <div class="bg-white rounded-2xl shadow-card p-6 text-center">
          <span class="material-icons-outlined text-4xl text-green-400">add_home</span>
          <p class="text-2xl font-bold text-gray-900 mt-2">{{ stats.newPropertiesThisMonth || 0 }}</p>
          <p class="text-sm text-gray-500">Propiedades este mes</p>
        </div>
      </div>
    </div>
  `,
})
export class AdminDashboardComponent implements OnInit {
  private adminService = inject(AdminService);

  kpis: any[] = [];
  recentProperties: any[] = [];
  recentUsers: any[] = [];
  stats: any = {};

  ngOnInit(): void {
    this.adminService.getDashboard().subscribe({
      next: (data) => {
        this.kpis = [
          { label: 'Usuarios', value: data.totalUsers || 0, icon: 'people', bgColor: '#e8f5e9', color: '#2d6a4f', change: data.usersChange },
          { label: 'Propiedades', value: data.totalProperties || 0, icon: 'home', bgColor: '#fff3e0', color: '#e65100', change: data.propertiesChange },
          { label: 'Solicitudes', value: data.pendingRequests || 0, icon: 'assignment', bgColor: '#e3f2fd', color: '#1565c0' },
          { label: 'Vendedores', value: data.totalSellers || 0, icon: 'storefront', bgColor: '#fce4ec', color: '#c62828' },
        ];
        this.recentProperties = data.recentProperties || [];
        this.recentUsers = data.recentUsers || [];
        this.stats = data;
      },
    });
  }
}
