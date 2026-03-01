import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentService, ScheduleDay, BlockedSlot } from '../../../core/services/appointment.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-seller-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Mi Horario</h1>
        <p class="text-gray-500 mt-1">Configura tu disponibilidad para citas</p>
      </div>

      <!-- Weekly Schedule -->
      <div class="bg-white rounded-2xl shadow-card p-6">
        <h2 class="font-bold text-gray-900 mb-4">Horario semanal</h2>
        <div class="space-y-3">
          @for (day of schedule; track day.day_of_week) {
            <div class="flex items-center gap-4 p-4 rounded-xl border border-earth-100 hover:border-earth-200 transition-colors">
              <label class="flex items-center gap-3 min-w-[140px] cursor-pointer">
                <div class="relative">
                  <input type="checkbox" [(ngModel)]="day.is_available" class="sr-only peer">
                  <div class="w-10 h-6 bg-earth-200 rounded-full peer-checked:bg-primary-500 transition-colors"></div>
                  <div class="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-4"></div>
                </div>
                <span class="font-medium text-gray-900">{{ getDayLabel(day.day_of_week) }}</span>
              </label>

              @if (day.is_available) {
                <div class="flex items-center gap-2 flex-1">
                  <input type="time" [(ngModel)]="day.start_time"
                         class="px-3 py-2 border border-earth-200 rounded-lg text-sm">
                  <span class="text-gray-400">a</span>
                  <input type="time" [(ngModel)]="day.end_time"
                         class="px-3 py-2 border border-earth-200 rounded-lg text-sm">
                  <div class="ml-auto flex items-center gap-2">
                    <label class="text-xs text-gray-500">Duración (min):</label>
                    <select [(ngModel)]="day.slot_duration"
                            class="px-3 py-2 border border-earth-200 rounded-lg text-sm bg-white">
                      <option [ngValue]="15">15</option>
                      <option [ngValue]="30">30</option>
                      <option [ngValue]="45">45</option>
                      <option [ngValue]="60">60</option>
                    </select>
                  </div>
                </div>
              } @else {
                <span class="text-sm text-gray-400 italic">No disponible</span>
              }
            </div>
          }
        </div>

        <button (click)="saveSchedule()" [disabled]="savingSchedule"
                class="mt-6 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold text-sm hover:bg-primary-700 disabled:opacity-50 transition-colors">
          {{ savingSchedule ? 'Guardando...' : 'Guardar horario' }}
        </button>
      </div>

      <!-- Blocked Slots -->
      <div class="bg-white rounded-2xl shadow-card p-6">
        <h2 class="font-bold text-gray-900 mb-4">Bloquear horarios</h2>
        <p class="text-sm text-gray-500 mb-4">Bloquea horarios específicos cuando no estarás disponible</p>

        <div class="flex flex-wrap gap-4 items-end mb-6 p-4 bg-earth-50 rounded-xl">
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Fecha</label>
            <input type="date" [(ngModel)]="newBlock.date"
                   class="px-3 py-2 border border-earth-200 rounded-lg text-sm">
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Hora inicio</label>
            <input type="time" [(ngModel)]="newBlock.start_time"
                   class="px-3 py-2 border border-earth-200 rounded-lg text-sm">
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Hora fin</label>
            <input type="time" [(ngModel)]="newBlock.end_time"
                   class="px-3 py-2 border border-earth-200 rounded-lg text-sm">
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Razón (opcional)</label>
            <input type="text" [(ngModel)]="newBlock.reason" placeholder="Ej: Vacaciones"
                   class="px-3 py-2 border border-earth-200 rounded-lg text-sm">
          </div>
          <button (click)="addBlock()"
                  class="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
            Bloquear
          </button>
        </div>

        @if (blockedSlots.length === 0) {
          <p class="text-gray-400 text-sm text-center py-4">No hay horarios bloqueados</p>
        } @else {
          <div class="divide-y divide-earth-100">
            @for (block of blockedSlots; track block.id) {
              <div class="flex items-center justify-between py-3">
                <div>
                  <p class="font-medium text-gray-900">{{ block.date }} · {{ block.start_time }} - {{ block.end_time }}</p>
                  @if (block.reason) {
                    <p class="text-sm text-gray-500">{{ block.reason }}</p>
                  }
                </div>
                <button (click)="removeBlock(block.id!)"
                        class="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
                  <span class="material-icons text-lg">delete</span>
                </button>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class SellerScheduleComponent implements OnInit {
  private appointmentService = inject(AppointmentService);
  private toast = inject(ToastService);

  schedule: ScheduleDay[] = [];
  blockedSlots: BlockedSlot[] = [];
  savingSchedule = false;
  newBlock: Partial<BlockedSlot> = {};

  private dayLabels = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  ngOnInit(): void {
    this.loadSchedule();
    this.loadBlocked();
  }

  loadSchedule(): void {
    this.appointmentService.getMySchedule().subscribe({
      next: (data) => {
        if (data.length === 0) {
          this.schedule = Array.from({ length: 7 }, (_, i) => ({
            day_of_week: i,
            is_available: i >= 1 && i <= 5,
            start_time: '09:00',
            end_time: '18:00',
            slot_duration: 30,
          }));
        } else {
          this.schedule = data;
        }
      },
    });
  }

  loadBlocked(): void {
    this.appointmentService.getBlockedSlots().subscribe({
      next: (data) => this.blockedSlots = data,
    });
  }

  getDayLabel(day: number): string {
    return this.dayLabels[day] || '';
  }

  saveSchedule(): void {
    this.savingSchedule = true;
    this.appointmentService.updateMySchedule(this.schedule).subscribe({
      next: () => {
        this.toast.success('Horario actualizado');
        this.savingSchedule = false;
      },
      error: () => this.savingSchedule = false,
    });
  }

  addBlock(): void {
    if (!this.newBlock.date || !this.newBlock.start_time || !this.newBlock.end_time) {
      this.toast.error('Completa fecha y horarios');
      return;
    }
    this.appointmentService.createBlockedSlot(this.newBlock as any).subscribe({
      next: (data) => {
        this.blockedSlots.push(data);
        this.newBlock = {};
        this.toast.success('Horario bloqueado');
      },
    });
  }

  removeBlock(id: number): void {
    this.appointmentService.deleteBlockedSlot(id).subscribe({
      next: () => {
        this.blockedSlots = this.blockedSlots.filter(b => b.id !== id);
        this.toast.success('Bloqueo eliminado');
      },
    });
  }
}
