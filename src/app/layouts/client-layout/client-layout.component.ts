import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-client-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-surface">
      <!-- Top Nav -->
      <header class="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-earth-200 shadow-sm">
        <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <a routerLink="/cliente/inicio" class="flex items-center gap-2 text-primary-600 font-extrabold text-xl">
              <span class="material-icons">apartment</span> Callix
            </a>

            <div class="hidden md:flex items-center gap-6">
              @for (item of navItems; track item.path) {
                <a [routerLink]="item.path" routerLinkActive="text-primary-600 font-semibold"
                   class="flex items-center gap-1.5 text-sm text-gray-700 hover:text-primary-600 transition-colors">
                  <span class="material-icons-outlined text-lg">{{ item.icon }}</span>
                  {{ item.label }}
                </a>
              }
            </div>

            <div class="flex items-center gap-3">
              <span class="text-sm font-medium text-gray-700 hidden sm:inline">{{ (authService.user$ | async)?.first_name }}</span>
              <button (click)="authService.logout()" class="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1">
                <span class="material-icons-outlined text-lg">logout</span>
                Salir
              </button>
            </div>
          </div>
        </nav>
      </header>

      <!-- Mobile Bottom Nav -->
      <nav class="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-earth-200 md:hidden">
        <div class="flex items-center justify-around py-2">
          @for (item of mobileNavItems; track item.path) {
            <a [routerLink]="item.path" routerLinkActive="text-primary-600"
               class="flex flex-col items-center gap-0.5 text-xs text-gray-500 py-1 px-3">
              <span class="material-icons-outlined text-xl">{{ item.icon }}</span>
              {{ item.label }}
            </a>
          }
        </div>
      </nav>

      <main class="pt-16 pb-20 md:pb-6 min-h-screen">
        <router-outlet />
      </main>
    </div>
  `,
})
export class ClientLayoutComponent {
  authService = inject(AuthService);

  navItems = [
    { path: '/cliente/inicio', icon: 'home', label: 'Inicio' },
    { path: '/cliente/propiedades', icon: 'search', label: 'Propiedades' },
    { path: '/cliente/favoritos', icon: 'favorite_border', label: 'Favoritos' },
    { path: '/cliente/citas', icon: 'calendar_month', label: 'Citas' },
    { path: '/cliente/perfil', icon: 'person_outline', label: 'Perfil' },
  ];

  mobileNavItems = [
    { path: '/cliente/inicio', icon: 'home', label: 'Inicio' },
    { path: '/cliente/propiedades', icon: 'search', label: 'Buscar' },
    { path: '/cliente/favoritos', icon: 'favorite_border', label: 'Favoritos' },
    { path: '/cliente/citas', icon: 'calendar_month', label: 'Citas' },
    { path: '/cliente/perfil', icon: 'person_outline', label: 'Perfil' },
  ];
}
