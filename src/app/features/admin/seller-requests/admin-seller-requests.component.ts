import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-admin-seller-requests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Solicitudes de Vendedores</h1>
        <p class="text-gray-500 mt-1">Revisa y aprueba solicitudes de nuevos vendedores</p>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-2xl shadow-card p-4 flex flex-wrap gap-4 items-center">
        <select [(ngModel)]="statusFilter" (ngModelChange)="loadRequests()"
                class="px-4 py-2.5 border border-earth-200 rounded-xl text-sm bg-white">
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendientes</option>
          <option value="aprobada">Aprobadas</option>
          <option value="rechazada">Rechazadas</option>
        </select>
        <span class="text-sm text-gray-500">{{ requests.length }} solicitudes</span>
      </div>

      <!-- Requests List -->
      @if (loading) {
        <div class="space-y-4">
          @for (i of [1,2,3]; track i) {
            <div class="bg-white rounded-2xl shadow-card p-6 animate-pulse">
              <div class="h-5 bg-earth-200 rounded w-1/3 mb-3"></div>
              <div class="h-4 bg-earth-200 rounded w-1/2"></div>
            </div>
          }
        </div>
      } @else if (requests.length === 0) {
        <div class="bg-white rounded-2xl shadow-card p-12 text-center">
          <span class="material-icons-outlined text-6xl text-earth-300">assignment</span>
          <p class="text-gray-500 mt-3">No hay solicitudes</p>
        </div>
      } @else {
        <div class="space-y-4">
          @for (req of requests; track req.id) {
            <div class="bg-white rounded-2xl shadow-card p-6">
              <div class="flex flex-wrap items-start justify-between gap-4">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-3 mb-2">
                    <div class="w-11 h-11 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-semibold text-lg">
                      {{ req.first_name?.charAt(0) }}
                    </div>
                    <div>
                      <h3 class="font-bold text-gray-900">{{ req.first_name }} {{ req.last_name }}</h3>
                      <p class="text-sm text-gray-500">{{ req.email }}</p>
                    </div>
                  </div>
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                    @if (req.phone) {
                      <div class="flex items-center gap-2 text-sm text-gray-600">
                        <span class="material-icons text-base text-gray-400">phone</span>
                        {{ req.phone }}
                      </div>
                    }
                    @if (req.years_experience != null) {
                      <div class="flex items-center gap-2 text-sm text-gray-600">
                        <span class="material-icons text-base text-gray-400">work</span>
                        {{ req.years_experience }} años de experiencia
                      </div>
                    }
                    <div class="flex items-center gap-2 text-sm text-gray-500">
                      <span class="material-icons text-base text-gray-400">calendar_today</span>
                      {{ req.created_at | date:'mediumDate' }}
                    </div>
                  </div>
                  @if (req.bio) {
                    <p class="mt-3 text-sm text-gray-600 bg-earth-50 p-3 rounded-xl">{{ req.bio }}</p>
                  }
                  @if (req.message) {
                    <p class="mt-2 text-sm text-gray-500 italic">"{{ req.message }}"</p>
                  }
                </div>
                <div class="flex items-center gap-2">
                  @if (req.status === 'pendiente') {
                    <button (click)="approve(req)" [disabled]="req._loading"
                            class="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 disabled:opacity-50 flex items-center gap-1">
                      <span class="material-icons text-lg">check</span> Aprobar
                    </button>
                    <button (click)="reject(req)" [disabled]="req._loading"
                            class="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 disabled:opacity-50 flex items-center gap-1">
                      <span class="material-icons text-lg">close</span> Rechazar
                    </button>
                  } @else {
                    <span class="px-3 py-1.5 text-xs font-semibold rounded-full"
                          [class]="req.status === 'aprobada' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                      {{ req.status === 'aprobada' ? 'Aprobada' : 'Rechazada' }}
                    </span>
                  }
                </div>
              </div>
              @if (req._tempPassword) {
                <div class="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <p class="text-sm font-semibold text-green-800">¡Vendedor aprobado! Se creó la cuenta automáticamente.</p>
                  <p class="text-sm text-green-700 mt-1">Contraseña temporal: <code class="bg-green-100 px-2 py-0.5 rounded font-mono">{{ req._tempPassword }}</code></p>
                  <p class="text-xs text-green-600 mt-1">El vendedor deberá cambiar esta contraseña al iniciar sesión por primera vez.</p>
                </div>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class AdminSellerRequestsComponent implements OnInit {
  private adminService = inject(AdminService);
  private toast = inject(ToastService);

  requests: any[] = [];
  loading = true;
  statusFilter = '';

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.loading = true;
    this.adminService.getSellerRequests({ status: this.statusFilter }).subscribe({
      next: (data: any) => {
        this.requests = data.data || data || [];
        this.loading = false;
      },
      error: () => this.loading = false,
    });
  }

  approve(req: any): void {
    req._loading = true;
    this.adminService.approveSellerRequest(req.id).subscribe({
      next: (res: any) => {
        req._loading = false;
        req.status = 'aprobada';
        req._tempPassword = res.tempPassword;
        this.toast.success('Solicitud aprobada. Se creó la cuenta del vendedor.');
      },
      error: (err) => {
        req._loading = false;
        this.toast.error(err.error?.error || 'Error al aprobar solicitud');
      },
    });
  }

  reject(req: any): void {
    req._loading = true;
    this.adminService.rejectSellerRequest(req.id).subscribe({
      next: () => {
        req._loading = false;
        req.status = 'rechazada';
        this.toast.success('Solicitud rechazada');
      },
      error: (err) => {
        req._loading = false;
        this.toast.error(err.error?.error || 'Error al rechazar solicitud');
      },
    });
  }
}
