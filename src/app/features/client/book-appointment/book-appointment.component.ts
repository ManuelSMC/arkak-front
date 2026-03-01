import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppointmentService, TimeSlot } from '../../../core/services/appointment.service';
import { PropertyService, Property } from '../../../core/services/property.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-book-appointment',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="max-w-3xl mx-auto space-y-6">
      <!-- Back -->
      <div class="flex items-center gap-3">
        <button (click)="goBack()"
                class="w-10 h-10 rounded-xl border border-earth-200 flex items-center justify-center hover:bg-earth-100 transition-colors">
          <span class="material-icons">arrow_back</span>
        </button>
        <h1 class="text-2xl font-bold text-gray-900">Agendar cita</h1>
      </div>

      @if (property) {
        <!-- Property Summary -->
        <div class="bg-white rounded-2xl shadow-card p-4 flex gap-4">
          <div class="w-20 h-20 bg-earth-100 rounded-xl overflow-hidden flex-shrink-0">
            @if (property.main_image) {
              <img [src]="property.main_image" class="w-full h-full object-cover">
            }
          </div>
          <div>
            <p class="font-semibold text-gray-900">{{ property.title }}</p>
            <p class="text-sm text-gray-500">{{ property.city }}</p>
            <p class="text-primary-600 font-bold mt-1">{{ property.price | currency:'MXN':'symbol-narrow':'1.0-0' }}</p>
          </div>
        </div>

        <!-- Step 1: Select Date -->
        <div class="bg-white rounded-2xl shadow-card p-6">
          <h2 class="font-bold text-gray-900 mb-4">
            <span class="inline-flex items-center justify-center w-7 h-7 bg-primary-100 text-primary-600 rounded-full text-sm font-bold mr-2">1</span>
            Selecciona una fecha
          </h2>
          <input type="date" [(ngModel)]="selectedDate" (ngModelChange)="loadSlots()"
                 [min]="minDate"
                 class="w-full px-4 py-3 border border-earth-200 rounded-xl focus:ring-2 focus:ring-primary-300 focus:border-primary-500">
        </div>

        <!-- Step 2: Select Time -->
        @if (selectedDate) {
          <div class="bg-white rounded-2xl shadow-card p-6">
            <h2 class="font-bold text-gray-900 mb-4">
              <span class="inline-flex items-center justify-center w-7 h-7 bg-primary-100 text-primary-600 rounded-full text-sm font-bold mr-2">2</span>
              Selecciona un horario
            </h2>

            @if (loadingSlots) {
              <div class="flex justify-center py-8">
                <div class="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
              </div>
            } @else if (slots.length === 0) {
              <div class="text-center py-8">
                <span class="material-icons-outlined text-4xl text-earth-300">event_busy</span>
                <p class="text-gray-500 mt-2">No hay horarios disponibles para esta fecha</p>
                <p class="text-sm text-gray-400 mt-1">Intenta con otra fecha</p>
              </div>
            } @else {
              <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                @for (slot of slots; track slot.start_time) {
                  <button (click)="selectedSlot = slot"
                          [disabled]="!slot.available"
                          class="py-3 text-sm font-medium rounded-xl border transition-colors"
                          [class]="selectedSlot === slot
                            ? 'border-primary-500 bg-primary-600 text-white'
                            : slot.available
                              ? 'border-earth-200 hover:border-primary-300 hover:bg-primary-50 text-gray-700'
                              : 'border-earth-100 bg-earth-50 text-gray-300 cursor-not-allowed'">
                    {{ slot.start_time }}
                  </button>
                }
              </div>
            }
          </div>
        }

        <!-- Step 3: Notes & Confirm -->
        @if (selectedSlot) {
          <div class="bg-white rounded-2xl shadow-card p-6">
            <h2 class="font-bold text-gray-900 mb-4">
              <span class="inline-flex items-center justify-center w-7 h-7 bg-primary-100 text-primary-600 rounded-full text-sm font-bold mr-2">3</span>
              Confirmar cita
            </h2>

            <div class="bg-primary-50 rounded-xl p-4 mb-4">
              <div class="flex items-center gap-3">
                <span class="material-icons-outlined text-primary-600">calendar_today</span>
                <div>
                  <p class="font-semibold text-primary-700">{{ selectedDate }}</p>
                  <p class="text-sm text-primary-600">{{ selectedSlot.start_time }} - {{ selectedSlot.end_time }}</p>
                </div>
              </div>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Notas (opcional)</label>
              <textarea [(ngModel)]="notes" rows="3"
                        class="w-full px-4 py-3 border border-earth-200 rounded-xl resize-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
                        placeholder="¿Hay algo que quieras comentarle al agente?"></textarea>
            </div>

            <button (click)="bookAppointment()" [disabled]="booking"
                    class="w-full py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 disabled:opacity-50 transition-colors">
              {{ booking ? 'Agendando...' : 'Confirmar cita' }}
            </button>
          </div>
        }
      } @else if (loading) {
        <div class="animate-pulse space-y-4">
          <div class="h-24 bg-earth-200 rounded-2xl"></div>
          <div class="h-48 bg-earth-200 rounded-2xl"></div>
        </div>
      }
    </div>
  `,
})
export class BookAppointmentComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private propertyService = inject(PropertyService);
  private appointmentService = inject(AppointmentService);
  private toast = inject(ToastService);

  property: Property | null = null;
  loading = true;
  loadingSlots = false;
  booking = false;
  selectedDate = '';
  selectedSlot: TimeSlot | null = null;
  slots: TimeSlot[] = [];
  notes = '';
  minDate = new Date().toISOString().split('T')[0];

  ngOnInit(): void {
    const propertyId = Number(this.route.snapshot.params['propertyId']);
    this.propertyService.getById(propertyId).subscribe({
      next: (p) => {
        this.property = p;
        this.loading = false;
      },
      error: () => this.loading = false,
    });
  }

  loadSlots(): void {
    if (!this.property || !this.selectedDate) return;
    this.loadingSlots = true;
    this.selectedSlot = null;
    this.appointmentService.getAvailableSlots(this.property.seller_user_id!, this.selectedDate).subscribe({
      next: (data) => {
        this.slots = data;
        this.loadingSlots = false;
      },
      error: () => this.loadingSlots = false,
    });
  }

  bookAppointment(): void {
    if (!this.property || !this.selectedSlot) return;
    this.booking = true;
    this.appointmentService.create({
      property_id: this.property.id,
      seller_id: this.property.seller_user_id!,
      date: this.selectedDate,
      start_time: this.selectedSlot.start_time,
      end_time: this.selectedSlot.end_time,
      notes: this.notes,
    }).subscribe({
      next: () => {
        this.toast.success('¡Cita agendada exitosamente!');
        this.router.navigate(['/cliente/citas']);
      },
      error: () => this.booking = false,
    });
  }

  goBack(): void {
    window.history.back();
  }
}
