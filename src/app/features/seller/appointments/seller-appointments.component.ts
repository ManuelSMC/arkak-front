import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService, Appointment } from '../../../core/services/appointment.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-seller-appointments',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Mis Citas</h1>
        <p class="text-gray-500 mt-1">Gestiona las citas con tus clientes</p>
      </div>

      <!-- Tabs -->
      <div class="flex gap-2 bg-white rounded-xl shadow-card p-1.5">
        @for (tab of tabs; track tab.value) {
          <button (click)="activeTab = tab.value; filterAppointments()"
                  class="flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors"
                  [class]="activeTab === tab.value ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-earth-100'">
            {{ tab.label }}
          </button>
        }
      </div>

      @if (filtered.length === 0) {
        <div class="bg-white rounded-2xl shadow-card p-12 text-center">
          <span class="material-icons-outlined text-6xl text-earth-300">event_busy</span>
          <p class="text-gray-500 mt-2">No hay citas {{ activeTab === 'all' ? '' : 'con este estado' }}</p>
        </div>
      } @else {
        <div class="space-y-4">
          @for (apt of filtered; track apt.id) {
            <div class="bg-white rounded-2xl shadow-card p-5 flex flex-col sm:flex-row gap-4">
              <!-- Date Badge -->
              <div class="w-16 h-16 bg-primary-50 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                <span class="text-xs font-bold text-primary-600">{{ getMonth(apt.date) }}</span>
                <span class="text-xl font-bold text-primary-700 -mt-0.5">{{ getDay(apt.date) }}</span>
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                  <div>
                    <p class="font-semibold text-gray-900">{{ apt.property_title || 'Propiedad' }}</p>
                    <p class="text-sm text-gray-500 mt-0.5">
                      <span class="material-icons-outlined text-sm align-text-bottom">schedule</span>
                      {{ apt.start_time }} - {{ apt.end_time }}
                    </p>
                  </div>
                  <span class="px-2.5 py-1 text-xs font-semibold rounded-full flex-shrink-0"
                        [class]="getStatusClass(apt.status)">
                    {{ getStatusLabel(apt.status) }}
                  </span>
                </div>

                <div class="flex items-center gap-2 mt-3">
                  <div class="w-8 h-8 bg-earth-100 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600">
                    {{ apt.client_name?.charAt(0) }}
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ apt.client_name }}</p>
                    @if (apt.client_phone) {
                      <p class="text-xs text-gray-400">{{ apt.client_phone }}</p>
                    }
                  </div>
                </div>

                @if (apt.notes) {
                  <p class="text-sm text-gray-500 mt-2 italic">{{ apt.notes }}</p>
                }

                @if (apt.status === 'pendiente') {
                  <div class="flex gap-2 mt-3">
                    <button (click)="confirmAppointment(apt)"
                            class="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors">
                      Confirmar
                    </button>
                    <button (click)="cancelAppointment(apt)"
                            class="px-4 py-2 bg-red-50 text-red-500 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors">
                      Cancelar
                    </button>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class SellerAppointmentsComponent implements OnInit {
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
        this.filterAppointments();
      },
    });
  }

  filterAppointments(): void {
    this.filtered = this.activeTab === 'all'
      ? this.appointments
      : this.appointments.filter(a => a.status === this.activeTab);
  }

  confirmAppointment(apt: Appointment): void {
    this.appointmentService.updateStatus(apt.id!, 'confirmada').subscribe({
      next: () => {
        apt.status = 'confirmada';
        this.filterAppointments();
        this.toast.success('Cita confirmada');
      },
    });
  }

  cancelAppointment(apt: Appointment): void {
    if (!confirm('¿Cancelar esta cita?')) return;
    this.appointmentService.cancel(apt.id!).subscribe({
      next: () => {
        apt.status = 'cancelada';
        this.filterAppointments();
        this.toast.success('Cita cancelada');
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
