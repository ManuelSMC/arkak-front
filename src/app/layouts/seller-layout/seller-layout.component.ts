import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-seller-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="flex min-h-screen bg-surface">
      <!-- Sidebar -->
      <aside class="hidden lg:flex flex-col w-64 bg-white border-r border-earth-200 shadow-sm">
        <div class="p-6 border-b border-earth-200">
          <a routerLink="/" class="flex items-center gap-2 text-primary-600 font-extrabold text-xl">
            <span class="material-icons">apartment</span> Callix
          </a>
          <p class="text-xs text-gray-500 mt-1">Panel del Vendedor</p>
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
        <header class="bg-white border-b border-earth-200 px-6 py-4 flex items-center justify-between shadow-sm">
          <button (click)="sidebarOpen = !sidebarOpen" class="lg:hidden p-2 text-gray-600">
            <span class="material-icons">menu</span>
          </button>
          <div></div>
          <div class="flex items-center gap-3">
            <p class="text-sm font-semibold text-gray-900 hidden sm:block">{{ (authService.user$ | async)?.first_name }}</p>
            <div class="w-9 h-9 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-semibold text-sm">
              {{ (authService.user$ | async)?.first_name?.charAt(0) }}
            </div>
          </div>
        </header>

        <main class="flex-1 p-6 overflow-auto">
          <router-outlet />
        </main>
      </div>
    </div>

    @if (sidebarOpen) {
      <div class="fixed inset-0 z-50 lg:hidden">
        <div class="absolute inset-0 bg-black/50" (click)="sidebarOpen = false"></div>
        <aside class="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl animate-fade-in-up">
          <div class="p-6 border-b flex items-center justify-between">
            <span class="text-primary-600 font-extrabold text-xl">Callix</span>
            <button (click)="sidebarOpen = false"><span class="material-icons text-gray-500">close</span></button>
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
export class SellerLayoutComponent {
  authService = inject(AuthService);
  sidebarOpen = false;

  navItems = [
    { path: '/vendedor/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { path: '/vendedor/propiedades', icon: 'home_work', label: 'Mis Propiedades' },
    { path: '/vendedor/agenda', icon: 'event_note', label: 'Mi Agenda' },
    { path: '/vendedor/citas', icon: 'calendar_month', label: 'Mis Citas' },
    { path: '/vendedor/perfil', icon: 'person', label: 'Mi Perfil' },
  ];
}
