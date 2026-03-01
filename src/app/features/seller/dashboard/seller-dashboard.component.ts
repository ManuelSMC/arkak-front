import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Mi Panel de Vendedor</h1>
        <p class="text-gray-500 mt-1">Resumen de tu actividad</p>
      </div>

      <!-- KPI Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white rounded-2xl shadow-card p-6">
          <div class="flex items-center gap-3 mb-3">
            <span class="w-10 h-10 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
              <span class="material-icons-outlined">home</span>
            </span>
            <span class="text-sm text-gray-500">Propiedades</span>
          </div>
          <p class="text-3xl font-bold text-gray-900">{{ stats.totalProperties || 0 }}</p>
        </div>
        <div class="bg-white rounded-2xl shadow-card p-6">
          <div class="flex items-center gap-3 mb-3">
            <span class="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <span class="material-icons-outlined">calendar_month</span>
            </span>
            <span class="text-sm text-gray-500">Citas próximas</span>
          </div>
          <p class="text-3xl font-bold text-gray-900">{{ stats.upcomingAppointments || 0 }}</p>
        </div>
        <div class="bg-white rounded-2xl shadow-card p-6">
          <div class="flex items-center gap-3 mb-3">
            <span class="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
              <span class="material-icons-outlined">visibility</span>
            </span>
            <span class="text-sm text-gray-500">Visitas totales</span>
          </div>
          <p class="text-3xl font-bold text-gray-900">{{ stats.totalViews || 0 }}</p>
        </div>
        <div class="bg-white rounded-2xl shadow-card p-6">
          <div class="flex items-center gap-3 mb-3">
            <span class="w-10 h-10 rounded-xl bg-red-100 text-red-500 flex items-center justify-center">
              <span class="material-icons-outlined">favorite</span>
            </span>
            <span class="text-sm text-gray-500">Favoritos</span>
          </div>
          <p class="text-3xl font-bold text-gray-900">{{ stats.totalFavorites || 0 }}</p>
        </div>
      </div>

      <!-- Upcoming Appointments -->
      <div class="bg-white rounded-2xl shadow-card p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-bold text-gray-900">Próximas citas</h2>
          <a routerLink="/vendedor/citas" class="text-sm text-primary-600 hover:underline">Ver todas</a>
        </div>
        @if (nextAppointments.length === 0) {
          <p class="text-gray-400 text-sm text-center py-8">No tienes citas programadas</p>
        } @else {
          <div class="divide-y divide-earth-100">
            @for (apt of nextAppointments; track apt.id) {
              <div class="flex items-center gap-4 py-3">
                <div class="w-12 h-12 bg-primary-50 rounded-xl flex flex-col items-center justify-center">
                  <span class="text-xs font-bold text-primary-600">{{ getMonth(apt.appointment_date) }}</span>
                  <span class="text-lg font-bold text-primary-700 -mt-1">{{ getDay(apt.appointment_date) }}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-medium text-gray-900 truncate">{{ apt.property_title }}</p>
                  <p class="text-sm text-gray-500">{{ apt.client_first_name }} {{ apt.client_last_name }} · {{ apt.start_time }} - {{ apt.end_time }}</p>
                </div>
                <span class="px-2 py-1 text-xs font-medium rounded-full"
                      [class]="apt.status === 'confirmada' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'">
                  {{ apt.status === 'confirmada' ? 'Confirmada' : 'Pendiente' }}
                </span>
              </div>
            }
          </div>
        }
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <a routerLink="/vendedor/propiedades/nueva"
           class="bg-white rounded-2xl shadow-card p-6 hover:shadow-lg transition-all group text-center">
          <span class="material-icons-outlined text-4xl text-primary-500 group-hover:scale-110 transition-transform inline-block">add_home</span>
          <p class="font-semibold text-gray-900 mt-2">Publicar propiedad</p>
          <p class="text-sm text-gray-500 mt-1">Agrega una nueva propiedad</p>
        </a>
        <a routerLink="/vendedor/agenda"
           class="bg-white rounded-2xl shadow-card p-6 hover:shadow-lg transition-all group text-center">
          <span class="material-icons-outlined text-4xl text-blue-500 group-hover:scale-110 transition-transform inline-block">schedule</span>
          <p class="font-semibold text-gray-900 mt-2">Mi horario</p>
          <p class="text-sm text-gray-500 mt-1">Configura tu disponibilidad</p>
        </a>
        <a routerLink="/vendedor/perfil"
           class="bg-white rounded-2xl shadow-card p-6 hover:shadow-lg transition-all group text-center">
          <span class="material-icons-outlined text-4xl text-amber-500 group-hover:scale-110 transition-transform inline-block">person</span>
          <p class="font-semibold text-gray-900 mt-2">Mi perfil</p>
          <p class="text-sm text-gray-500 mt-1">Edita tu información</p>
        </a>
      </div>
    </div>
  `,
})
export class SellerDashboardComponent implements OnInit {
  private adminService = inject(AdminService);

  stats: any = {};
  nextAppointments: any[] = [];

  ngOnInit(): void {
    this.adminService.getSellerDashboard().subscribe({
      next: (data) => {
        this.stats = data;
        this.nextAppointments = data.nextAppointments || [];
      },
    });
  }

  getMonth(date: string): string {
    const months = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
    return months[new Date(date).getMonth()];
  }

  getDay(date: string): string {
    return new Date(date).getDate().toString();
  }
}
