import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Usuarios</h1>
          <p class="text-gray-500 mt-1">Gestión de usuarios de la plataforma</p>
        </div>
        <button (click)="showCreateModal = true"
                class="px-4 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors flex items-center gap-2">
          <span class="material-icons text-lg">person_add</span> Crear usuario
        </button>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-2xl shadow-card p-4 flex flex-wrap gap-4 items-center">
        <div class="relative flex-1 min-w-[200px]">
          <span class="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">search</span>
          <input type="text" [(ngModel)]="search" (ngModelChange)="loadUsers()"
                 placeholder="Buscar por nombre o email..."
                 class="w-full pl-10 pr-4 py-2.5 border border-earth-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-300 focus:border-primary-500">
        </div>
        <select [(ngModel)]="roleFilter" (ngModelChange)="loadUsers()"
                class="px-4 py-2.5 border border-earth-200 rounded-xl text-sm bg-white">
          <option value="">Todos los roles</option>
          <option value="admin">Admin</option>
          <option value="vendedor">Vendedor</option>
          <option value="cliente">Cliente</option>
        </select>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-2xl shadow-card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-earth-100 bg-earth-50">
                <th class="text-left py-3 px-4 font-semibold text-gray-600">Usuario</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-600">Email</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-600">Teléfono</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-600">Rol</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-600">Estado</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-600">Registro</th>
                <th class="text-right py-3 px-4 font-semibold text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-earth-100">
              @for (user of users; track user.id) {
                <tr class="hover:bg-earth-50 transition-colors">
                  <td class="py-3 px-4">
                    <div class="flex items-center gap-3">
                      <div class="w-9 h-9 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-semibold text-sm">
                        {{ user.first_name?.charAt(0) }}
                      </div>
                      <span class="font-medium text-gray-900">{{ user.first_name }} {{ user.last_name }}</span>
                    </div>
                  </td>
                  <td class="py-3 px-4 text-gray-600">{{ user.email }}</td>
                  <td class="py-3 px-4 text-gray-600">{{ user.phone || '-' }}</td>
                  <td class="py-3 px-4">
                    <span class="px-2 py-1 text-xs font-medium rounded-full"
                          [class]="getRoleClass(user.role)">
                      {{ getRoleLabel(user.role) }}
                    </span>
                  </td>
                  <td class="py-3 px-4">
                    <span class="px-2 py-1 text-xs font-medium rounded-full"
                          [class]="user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                      {{ user.is_active ? 'Activo' : 'Inactivo' }}
                    </span>
                  </td>
                  <td class="py-3 px-4 text-gray-500">{{ user.created_at | date:'shortDate' }}</td>
                  <td class="py-3 px-4 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <button (click)="openEditModal(user)"
                              class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg" title="Editar">
                        <span class="material-icons text-lg">edit</span>
                      </button>
                      <select [ngModel]="user.role" (ngModelChange)="changeRole(user, $event)"
                              class="px-2 py-1 text-xs border border-earth-200 rounded-lg bg-white">
                        <option value="admin">Admin</option>
                        <option value="vendedor">Vendedor</option>
                        <option value="cliente">Cliente</option>
                      </select>
                      @if (!user.is_active) {
                        <button (click)="toggleActive(user, true)"
                                class="p-1.5 text-green-600 hover:bg-green-50 rounded-lg" title="Activar">
                          <span class="material-icons text-lg">check_circle</span>
                        </button>
                      } @else {
                        <button (click)="toggleActive(user, false)"
                                class="p-1.5 text-red-500 hover:bg-red-50 rounded-lg" title="Desactivar">
                          <span class="material-icons text-lg">block</span>
                        </button>
                      }
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="7" class="py-8 text-center text-gray-400">No se encontraron usuarios</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Create User Modal -->
      @if (showCreateModal) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/50" (click)="showCreateModal = false"></div>
          <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-fade-in-up">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-bold text-gray-900">Crear usuario</h2>
              <button (click)="showCreateModal = false" class="text-gray-400 hover:text-gray-600">
                <span class="material-icons">close</span>
              </button>
            </div>
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                  <input type="text" [(ngModel)]="newUser.first_name"
                         class="w-full px-3 py-2.5 border border-earth-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-300">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Apellido *</label>
                  <input type="text" [(ngModel)]="newUser.last_name"
                         class="w-full px-3 py-2.5 border border-earth-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-300">
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input type="email" [(ngModel)]="newUser.email"
                       class="w-full px-3 py-2.5 border border-earth-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-300">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input type="tel" [(ngModel)]="newUser.phone"
                       class="w-full px-3 py-2.5 border border-earth-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-300">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Rol *</label>
                <select [(ngModel)]="newUser.role"
                        class="w-full px-3 py-2.5 border border-earth-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-primary-300">
                  <option value="cliente">Cliente</option>
                  <option value="vendedor">Vendedor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <p class="text-xs text-gray-500">Se generará una contraseña temporal automáticamente.</p>
              <button (click)="createUser()" [disabled]="creatingUser"
                      class="w-full py-2.5 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 disabled:opacity-50">
                {{ creatingUser ? 'Creando...' : 'Crear usuario' }}
              </button>
            </div>
            @if (createdTempPassword) {
              <div class="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                <p class="text-sm font-semibold text-green-800">¡Usuario creado!</p>
                <p class="text-sm text-green-700 mt-1">Contraseña temporal: <code class="bg-green-100 px-2 py-0.5 rounded font-mono">{{ createdTempPassword }}</code></p>
                <p class="text-xs text-green-600 mt-1">El usuario deberá cambiar su contraseña al iniciar sesión.</p>
              </div>
            }
          </div>
        </div>
      }

      <!-- Edit User Modal -->
      @if (showEditModal && editingUser) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/50" (click)="showEditModal = false"></div>
          <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-fade-in-up">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-bold text-gray-900">Editar usuario</h2>
              <button (click)="showEditModal = false" class="text-gray-400 hover:text-gray-600">
                <span class="material-icons">close</span>
              </button>
            </div>
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input type="text" [(ngModel)]="editingUser.first_name"
                         class="w-full px-3 py-2.5 border border-earth-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-300">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                  <input type="text" [(ngModel)]="editingUser.last_name"
                         class="w-full px-3 py-2.5 border border-earth-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-300">
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input type="tel" [(ngModel)]="editingUser.phone"
                       class="w-full px-3 py-2.5 border border-earth-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-300">
              </div>
              <button (click)="saveEditUser()" [disabled]="savingEdit"
                      class="w-full py-2.5 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 disabled:opacity-50">
                {{ savingEdit ? 'Guardando...' : 'Guardar cambios' }}
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class AdminUsersComponent implements OnInit {
  private adminService = inject(AdminService);
  private toast = inject(ToastService);

  users: any[] = [];
  search = '';
  roleFilter = '';

  showCreateModal = false;
  creatingUser = false;
  createdTempPassword = '';
  newUser: any = { email: '', first_name: '', last_name: '', phone: '', role: 'cliente' };

  showEditModal = false;
  savingEdit = false;
  editingUser: any = null;

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.adminService.getUsers({ search: this.search, role: this.roleFilter }).subscribe({
      next: (data) => this.users = data.data || data || [],
    });
  }

  createUser(): void {
    if (!this.newUser.email || !this.newUser.first_name || !this.newUser.last_name) {
      this.toast.warning('Completa los campos obligatorios');
      return;
    }
    this.creatingUser = true;
    this.createdTempPassword = '';
    this.adminService.createUser(this.newUser).subscribe({
      next: (res: any) => {
        this.creatingUser = false;
        this.createdTempPassword = res.tempPassword;
        this.toast.success('Usuario creado');
        this.loadUsers();
      },
      error: (err) => {
        this.creatingUser = false;
        this.toast.error(err.error?.error || 'Error al crear usuario');
      },
    });
  }

  openEditModal(user: any): void {
    this.editingUser = { ...user };
    this.showEditModal = true;
  }

  saveEditUser(): void {
    this.savingEdit = true;
    const { id, first_name, last_name, phone } = this.editingUser;
    this.adminService.updateUser(id, { first_name, last_name, phone }).subscribe({
      next: () => {
        this.savingEdit = false;
        this.showEditModal = false;
        this.toast.success('Usuario actualizado');
        this.loadUsers();
      },
      error: () => { this.savingEdit = false; },
    });
  }

  changeRole(user: any, newRole: string): void {
    this.adminService.updateUser(user.id, { role: newRole }).subscribe({
      next: () => {
        user.role = newRole;
        this.toast.success('Rol actualizado');
      },
    });
  }

  toggleActive(user: any, active: boolean): void {
    this.adminService.updateUser(user.id, { is_active: active }).subscribe({
      next: () => {
        user.is_active = active;
        this.toast.success(active ? 'Usuario activado' : 'Usuario desactivado');
      },
    });
  }

  getRoleClass(role: string): string {
    const m: Record<string, string> = {
      admin: 'bg-purple-100 text-purple-700',
      vendedor: 'bg-blue-100 text-blue-700',
      cliente: 'bg-green-100 text-green-700',
    };
    return m[role] || 'bg-gray-100 text-gray-600';
  }

  getRoleLabel(role: string): string {
    return { admin: 'Admin', vendedor: 'Vendedor', cliente: 'Cliente' }[role] || role;
  }
}
