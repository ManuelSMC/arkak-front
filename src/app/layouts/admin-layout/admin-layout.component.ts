import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="flex min-h-screen bg-surface">
      <!-- Sidebar -->
      <aside class="hidden lg:flex flex-col w-64 bg-white border-r border-earth-200 shadow-sm">
        <div class="p-6 border-b border-earth-200">
          <a routerLink="/" class="flex items-center gap-2 text-primary-600 font-extrabold text-xl">
            <span class="material-icons">apartment</span> ArkaK
          </a>
          <p class="text-xs text-gray-500 mt-1">Panel de Administración</p>
        </div>

        <nav class="flex-1 p-4 space-y-1">
          @for (item of navItems; track item.path) {
            <a [routerLink]="item.path" routerLinkActive="bg-primary-50 text-primary-600 font-semibold"
               class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-700 hover:bg-earth-100 transition-all">
              <span class="material-icons-outlined text-xl">{{ item.icon }}</span>
              {{ item.label }}
            </a>
          }
        </nav>

        <div class="p-4 border-t border-earth-200">
          <button (click)="authService.logout()"
                  class="flex items-center gap-3 px-4 py-3 w-full text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors">
            <span class="material-icons-outlined text-xl">logout</span>
            Cerrar sesión
          </button>
        </div>
      </aside>

      <!-- Main -->
      <div class="flex-1 flex flex-col">
        <!-- Top Bar -->
        <header class="bg-white border-b border-earth-200 px-6 py-4 flex items-center justify-between shadow-sm">
          <button (click)="sidebarOpen = !sidebarOpen" class="lg:hidden p-2 text-gray-600">
            <span class="material-icons">menu</span>
          </button>
          <div class="flex items-center gap-3">
            <div class="text-right">
              <p class="text-sm font-semibold text-gray-900">{{ (authService.user$ | async)?.first_name }}</p>
              <p class="text-xs text-gray-500">Administrador</p>
            </div>
            <div class="w-9 h-9 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-semibold text-sm">
              {{ (authService.user$ | async)?.first_name?.charAt(0) }}
            </div>
          </div>
        </header>

        <!-- Content -->
        <main class="flex-1 p-6 overflow-auto">
          <router-outlet />
        </main>
      </div>
    </div>

    <!-- Mobile sidebar overlay -->
    @if (sidebarOpen) {
      <div class="fixed inset-0 z-50 lg:hidden">
        <div class="absolute inset-0 bg-black/50" (click)="sidebarOpen = false"></div>
        <aside class="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl animate-fade-in-up">
          <div class="p-6 border-b border-earth-200 flex items-center justify-between">
            <span class="text-primary-600 font-extrabold text-xl">ArkaK</span>
            <button (click)="sidebarOpen = false" class="text-gray-500"><span class="material-icons">close</span></button>
          </div>
          <nav class="p-4 space-y-1">
            @for (item of navItems; track item.path) {
              <a [routerLink]="item.path" (click)="sidebarOpen = false" routerLinkActive="bg-primary-50 text-primary-600"
                 class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-700 hover:bg-earth-100">
                <span class="material-icons-outlined text-xl">{{ item.icon }}</span>
                {{ item.label }}
              </a>
            }
          </nav>
        </aside>
      </div>
    }
  `,
})
export class AdminLayoutComponent {
  authService = inject(AuthService);
  sidebarOpen = false;

  navItems = [
    { path: '/admin/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { path: '/admin/usuarios', icon: 'people', label: 'Usuarios' },
    { path: '/admin/propiedades', icon: 'home_work', label: 'Propiedades' },
    { path: '/admin/solicitudes', icon: 'assignment', label: 'Solicitudes' },
  ];
}
