import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AppointmentService, Appointment } from '../../../core/services/appointment.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-client-appointments',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Mis Citas</h1>
        <p class="text-gray-500 mt-1">Historial de citas agendadas</p>
      </div>

      <!-- Tabs -->
      <div class="flex gap-2 bg-white rounded-xl shadow-card p-1.5">
        @for (tab of tabs; track tab.value) {
          <button (click)="activeTab = tab.value; filter()"
                  class="flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors"
                  [class]="activeTab === tab.value ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-earth-100'">
            {{ tab.label }}
          </button>
        }
      </div>

      @if (filtered.length === 0) {
        <div class="bg-white rounded-2xl shadow-card p-12 text-center">
          <span class="material-icons-outlined text-6xl text-earth-300">event_busy</span>
          <p class="text-gray-500 mt-2">No tienes citas {{ activeTab !== 'all' ? 'con este estado' : '' }}</p>
          <a routerLink="/propiedades"
             class="inline-block mt-4 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors text-sm">
            Explorar propiedades
          </a>
        </div>
      } @else {
        <div class="space-y-4">
          @for (apt of filtered; track apt.id) {
            <div class="bg-white rounded-2xl shadow-card overflow-hidden">
              <div class="flex flex-col sm:flex-row">
                <!-- Property Image -->
                <div class="w-full sm:w-40 h-32 sm:h-auto bg-earth-100 flex-shrink-0">
                  @if (apt.property_image) {
                    <img [src]="apt.property_image" class="w-full h-full object-cover">
                  } @else {
                    <div class="w-full h-full flex items-center justify-center">
                      <span class="material-icons-outlined text-4xl text-earth-300">home</span>
                    </div>
                  }
                </div>

                <div class="flex-1 p-5">
                  <div class="flex items-start justify-between gap-2">
                    <div>
                      <a [routerLink]="['/propiedades', apt.property_id]"
                         class="font-semibold text-gray-900 hover:text-primary-600 transition-colors">
                        {{ apt.property_title }}
                      </a>
                      <p class="text-sm text-gray-500 mt-1">
                        <span class="material-icons-outlined text-sm align-text-bottom">calendar_today</span>
                        {{ apt.date }} · {{ apt.start_time }} - {{ apt.end_time }}
                      </p>
                    </div>
                    <span class="px-2.5 py-1 text-xs font-semibold rounded-full flex-shrink-0"
                          [class]="getStatusClass(apt.status)">
                      {{ getStatusLabel(apt.status) }}
                    </span>
                  </div>

                  <div class="flex items-center gap-2 mt-3">
                    <span class="material-icons-outlined text-gray-400 text-lg">person</span>
                    <span class="text-sm text-gray-600">Agente: {{ apt.seller_name }}</span>
                  </div>

                  @if (apt.notes) {
                    <p class="text-sm text-gray-500 mt-2 italic">{{ apt.notes }}</p>
                  }

                  @if (apt.status === 'pendiente' || apt.status === 'confirmada') {
                    <button (click)="cancelAppointment(apt)"
                            class="mt-3 px-4 py-2 text-sm font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                      Cancelar cita
                    </button>
                  }
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class ClientAppointmentsComponent implements OnInit {
  private appointmentService = inject(AppointmentService);
  private toast = inject(ToastService);

  appointments: Appointment[] = [];
  filtered: Appointment[] = [];
  activeTab = 'all';

  tabs = [
    { label: 'Todas', value: 'all' },
    { label: 'Pendientes', value: 'pendiente' },
    { label: 'Confirmadas', value: 'confirmada' },
    { label: 'Completadas', value: 'completada' },
  ];

  ngOnInit(): void {
    this.appointmentService.getMyAppointments().subscribe({
      next: (data) => {
        this.appointments = data;
        this.filter();
      },
    });
  }

  filter(): void {
    this.filtered = this.activeTab === 'all'
      ? this.appointments
      : this.appointments.filter(a => a.status === this.activeTab);
  }

  cancelAppointment(apt: Appointment): void {
    if (!confirm('¿Cancelar esta cita?')) return;
    this.appointmentService.cancel(apt.id!).subscribe({
      next: () => {
        apt.status = 'cancelada';
        this.filter();
        this.toast.success('Cita cancelada');
      },
    });
  }

  getStatusClass(status: string): string {
    const m: Record<string, string> = {
      pendiente: 'bg-yellow-100 text-yellow-700', confirmada: 'bg-green-100 text-green-700',
      cancelada: 'bg-red-100 text-red-700', completada: 'bg-blue-100 text-blue-700',
    };
    return m[status] || 'bg-gray-100 text-gray-600';
  }

  getStatusLabel(status: string): string {
    return { pendiente: 'Pendiente', confirmada: 'Confirmada', cancelada: 'Cancelada', completada: 'Completada' }[status] || status;
  }
}
