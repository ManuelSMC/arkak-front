import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-admin-properties',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Propiedades</h1>
        <p class="text-gray-500 mt-1">Administración de propiedades publicadas</p>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-2xl shadow-card p-4 flex flex-wrap gap-4 items-center">
        <div class="relative flex-1 min-w-[200px]">
          <span class="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">search</span>
          <input type="text" [(ngModel)]="search" (ngModelChange)="loadProperties()"
                 placeholder="Buscar por título o ciudad..."
                 class="w-full pl-10 pr-4 py-2.5 border border-earth-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-300 focus:border-primary-500">
        </div>
        <select [(ngModel)]="statusFilter" (ngModelChange)="loadProperties()"
                class="px-4 py-2.5 border border-earth-200 rounded-xl text-sm bg-white">
          <option value="">Todos los estados</option>
          <option value="activa">Activas</option>
          <option value="pausada">Pausadas</option>
          <option value="vendida">Vendidas</option>
        </select>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-2xl shadow-card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-earth-100 bg-earth-50">
                <th class="text-left py-3 px-4 font-semibold text-gray-600">Propiedad</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-600">Vendedor</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-600">Tipo</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-600">Precio</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-600">Estado</th>
                <th class="text-right py-3 px-4 font-semibold text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-earth-100">
              @for (prop of properties; track prop.id) {
                <tr class="hover:bg-earth-50 transition-colors">
                  <td class="py-3 px-4">
                    <div class="flex items-center gap-3">
                      <div class="w-12 h-10 bg-earth-100 rounded-lg overflow-hidden flex-shrink-0">
                        @if (prop.main_image) {
                          <img [src]="prop.main_image" class="w-full h-full object-cover">
                        }
                      </div>
                      <div>
                        <p class="font-medium text-gray-900 truncate max-w-[200px]">{{ prop.title }}</p>
                        <p class="text-xs text-gray-500">{{ prop.city }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="py-3 px-4 text-gray-600">{{ prop.seller_first_name }} {{ prop.seller_last_name }}</td>
                  <td class="py-3 px-4">
                    <span class="px-2 py-1 text-xs font-medium rounded-full bg-earth-100 text-gray-600">
                      {{ prop.operation_type === 'venta' ? 'Venta' : 'Renta' }}
                    </span>
                  </td>
                  <td class="py-3 px-4 font-semibold text-gray-900">{{ prop.price | currency:'MXN':'symbol-narrow':'1.0-0' }}</td>
                  <td class="py-3 px-4">
                    <span class="px-2 py-1 text-xs font-medium rounded-full"
                          [class]="prop.status === 'activa' ? 'bg-green-100 text-green-700' : prop.status === 'pausada' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'">
                      {{ prop.status === 'activa' ? 'Activa' : prop.status === 'pausada' ? 'Pausada' : 'Vendida' }}
                    </span>
                  </td>
                  <td class="py-3 px-4 text-right">
                    <div class="flex items-center justify-end gap-1">
                      @if (prop.status !== 'activa') {
                        <button (click)="changeStatus(prop, 'activa')"
                                class="p-1.5 text-green-600 hover:bg-green-50 rounded-lg" title="Activar">
                          <span class="material-icons text-lg">check_circle</span>
                        </button>
                      }
                      @if (prop.status !== 'pausada') {
                        <button (click)="changeStatus(prop, 'pausada')"
                                class="p-1.5 text-yellow-500 hover:bg-yellow-50 rounded-lg" title="Pausar">
                          <span class="material-icons text-lg">pause_circle</span>
                        </button>
                      }
                      <button (click)="deleteProperty(prop)"
                              class="p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-lg" title="Eliminar">
                        <span class="material-icons text-lg">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="6" class="py-8 text-center text-gray-400">No se encontraron propiedades</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class AdminPropertiesComponent implements OnInit {
  private adminService = inject(AdminService);
  private toast = inject(ToastService);

  properties: any[] = [];
  search = '';
  statusFilter = '';

  ngOnInit(): void {
    this.loadProperties();
  }

  loadProperties(): void {
    this.adminService.getAllProperties({ search: this.search, status: this.statusFilter }).subscribe({
      next: (data) => this.properties = data.data || data || [],
    });
  }

  changeStatus(prop: any, status: string): void {
    this.adminService.updateProperty(prop.id, { status }).subscribe({
      next: () => {
        prop.status = status;
        this.toast.success('Estado actualizado');
      },
    });
  }

  deleteProperty(prop: any): void {
    if (!confirm('¿Eliminar esta propiedad permanentemente?')) return;
    this.adminService.deleteProperty(prop.id).subscribe({
      next: () => {
        this.properties = this.properties.filter(p => p.id !== prop.id);
        this.toast.success('Propiedad eliminada');
      },
    });
  }
}
