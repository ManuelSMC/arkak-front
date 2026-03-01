import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PropertyService, Property } from '../../../core/services/property.service';
import { PropertyCardComponent } from '../../../shared/components/property-card/property-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, PropertyCardComponent],
  template: `
    <!-- ============ HERO ============ -->
    <section class="relative bg-gradient-to-br from-primary-800 via-primary-700 to-primary-600 text-white overflow-hidden">
      <!-- Abstract background shapes -->
      <div class="absolute inset-0 overflow-hidden opacity-10">
        <div class="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-white"></div>
        <div class="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-white"></div>
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
        <div class="max-w-3xl">
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 animate-fade-in-up">
            Encuentra tu<br>
            <span class="text-primary-300">hogar ideal</span>
          </h1>
          <p class="text-lg sm:text-xl text-primary-100 mb-10 max-w-2xl animate-fade-in-up animate-delay-100">
            Explora miles de propiedades en venta y renta. Agenda citas con nuestros agentes certificados y descubre tu próximo hogar.
          </p>

          <!-- Search Bar -->
          <div class="bg-white rounded-2xl p-2 shadow-elevated flex flex-col sm:flex-row gap-2 animate-fade-in-up animate-delay-200">
            <div class="flex-1 flex items-center gap-2 px-4">
              <span class="material-icons-outlined text-gray-400">search</span>
              <input type="text" [(ngModel)]="searchQuery" placeholder="Buscar por ciudad, colonia o tipo..."
                     class="w-full py-3 text-gray-900 text-sm outline-none bg-transparent">
            </div>
            <div class="flex gap-2">
              <select [(ngModel)]="searchType"
                      class="px-4 py-3 bg-earth-100 text-gray-700 rounded-xl text-sm outline-none border-none">
                <option value="">Tipo</option>
                <option value="casa">Casa</option>
                <option value="departamento">Depto</option>
                <option value="terreno">Terreno</option>
                <option value="local_comercial">Local</option>
              </select>
              <a [routerLink]="['/propiedades']" [queryParams]="getSearchParams()"
                 class="px-8 py-3 bg-primary-600 text-white rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors whitespace-nowrap">
                Buscar
              </a>
            </div>
          </div>

          <!-- Quick stats -->
          <div class="flex flex-wrap gap-8 mt-12 animate-fade-in-up animate-delay-300">
            <div>
              <p class="text-3xl font-bold">500+</p>
              <p class="text-primary-200 text-sm">Propiedades</p>
            </div>
            <div>
              <p class="text-3xl font-bold">120+</p>
              <p class="text-primary-200 text-sm">Agentes</p>
            </div>
            <div>
              <p class="text-3xl font-bold">2,000+</p>
              <p class="text-primary-200 text-sm">Clientes felices</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ FEATURED PROPERTIES ============ -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="text-center mb-12">
        <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Propiedades Destacadas</h2>
        <p class="text-gray-500 text-lg max-w-2xl mx-auto">Selección de propiedades premium elegidas por nuestros expertos</p>
      </div>

      @if (featuredProperties.length) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          @for (property of featuredProperties; track property.id) {
            <app-property-card [property]="property" />
          }
        </div>
      } @else {
        <div class="text-center py-12 text-gray-400">
          <span class="material-icons-outlined text-5xl mb-2">home_work</span>
          <p>Cargando propiedades...</p>
        </div>
      }

      <div class="text-center mt-12">
        <a routerLink="/propiedades"
           class="inline-flex items-center gap-2 px-8 py-3 border-2 border-primary-600 text-primary-600 rounded-xl font-semibold text-sm hover:bg-primary-50 transition-colors">
          Ver todas las propiedades
          <span class="material-icons text-lg">arrow_forward</span>
        </a>
      </div>
    </section>

    <!-- ============ PROPERTY TYPES ============ -->
    <section class="bg-white py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Tipos de Propiedad</h2>
          <p class="text-gray-500 text-lg">Encuentra exactamente lo que buscas</p>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
          @for (type of propertyTypes; track type.value) {
            <a [routerLink]="['/propiedades']" [queryParams]="{property_type: type.value}"
               class="flex flex-col items-center gap-4 p-8 bg-earth-50 rounded-2xl hover:bg-primary-50 hover:shadow-card transition-all group cursor-pointer">
              <div class="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                <span class="material-icons-outlined text-3xl text-primary-600">{{ type.icon }}</span>
              </div>
              <div class="text-center">
                <h3 class="font-semibold text-gray-900">{{ type.label }}</h3>
                <p class="text-sm text-gray-500">{{ type.desc }}</p>
              </div>
            </a>
          }
        </div>
      </div>
    </section>

    <!-- ============ WHY CHOOSE US ============ -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="text-center mb-12">
        <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">¿Por qué elegirnos?</h2>
        <p class="text-gray-500 text-lg">Tu satisfacción es nuestra prioridad</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        @for (feature of features; track feature.title) {
          <div class="bg-white rounded-2xl p-8 shadow-card text-center card-hover">
            <div class="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <span class="material-icons-outlined text-2xl text-primary-600">{{ feature.icon }}</span>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-3">{{ feature.title }}</h3>
            <p class="text-sm text-gray-500 leading-relaxed">{{ feature.desc }}</p>
          </div>
        }
      </div>
    </section>

    <!-- ============ TESTIMONIALS ============ -->
    <section class="bg-primary-800 text-white py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl sm:text-4xl font-bold mb-3">Lo que dicen nuestros clientes</h2>
          <p class="text-primary-200 text-lg">Historias de éxito de quienes encontraron su hogar ideal</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          @for (testimonial of testimonials; track testimonial.name) {
            <div class="bg-primary-700/50 backdrop-blur-sm rounded-2xl p-8">
              <div class="flex gap-1 mb-4">
                @for (star of [1,2,3,4,5]; track star) {
                  <span class="material-icons text-amber-400 text-lg">star</span>
                }
              </div>
              <p class="text-primary-100 text-sm leading-relaxed mb-6 italic">"{{ testimonial.text }}"</p>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center font-bold text-sm">
                  {{ testimonial.name.charAt(0) }}
                </div>
                <div>
                  <p class="font-semibold text-sm">{{ testimonial.name }}</p>
                  <p class="text-primary-300 text-xs">{{ testimonial.role }}</p>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- ============ CTA ============ -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="bg-gradient-to-r from-primary-600 to-primary-700 rounded-3xl p-12 lg:p-16 text-center text-white">
        <h2 class="text-3xl sm:text-4xl font-bold mb-4">¿Listo para encontrar tu hogar?</h2>
        <p class="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
          Regístrate gratis y accede a miles de propiedades. Agenda citas con nuestros agentes en minutos.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a routerLink="/registro"
             class="px-8 py-4 bg-white text-primary-600 rounded-xl font-bold text-sm hover:bg-primary-50 transition-colors">
            Crear cuenta gratis
          </a>
          <a routerLink="/propiedades"
             class="px-8 py-4 border-2 border-white text-white rounded-xl font-bold text-sm hover:bg-white/10 transition-colors">
            Explorar propiedades
          </a>
        </div>
      </div>
    </section>
  `,
})
export class HomeComponent implements OnInit {
  private propertyService = inject(PropertyService);

  featuredProperties: Property[] = [];
  searchQuery = '';
  searchType = '';

  propertyTypes = [
    { value: 'casa', icon: 'house', label: 'Casas', desc: 'Hogares para toda la familia' },
    { value: 'departamento', icon: 'apartment', label: 'Departamentos', desc: 'Vida urbana moderna' },
    { value: 'terreno', icon: 'landscape', label: 'Terrenos', desc: 'Construye tu sueño' },
    { value: 'local_comercial', icon: 'storefront', label: 'Locales', desc: 'Impulsa tu negocio' },
  ];

  features = [
    { icon: 'verified_user', title: 'Agentes Certificados', desc: 'Todos nuestros vendedores pasan por un proceso riguroso de verificación para garantizar tu seguridad.' },
    { icon: 'schedule', title: 'Agenda Fácil', desc: 'Agenda citas directamente en la plataforma. Elige el día y hora que mejor te convenga.' },
    { icon: 'trending_up', title: 'Propiedades Verificadas', desc: 'Cada propiedad es revisada por nuestro equipo para asegurar información precisa y actualizada.' },
  ];

  testimonials = [
    { name: 'Ana García', role: 'Compradora', text: 'Encontré mi casa ideal en menos de una semana. El proceso de agendado de citas fue muy sencillo y el agente fue excelente.' },
    { name: 'Roberto Martínez', role: 'Vendedor', text: 'Como vendedor, ArkaK me ha ayudado a conseguir más clientes potenciales. La gestión de mi agenda nunca fue tan fácil.' },
    { name: 'Laura Sánchez', role: 'Inquilina', text: 'Rentar un departamento fue muy rápido. Me encantó poder comparar propiedades y ver los horarios disponibles al instante.' },
  ];

  ngOnInit(): void {
    this.propertyService.getAll({ featured: true, limit: 6 }).subscribe({
      next: (res) => this.featuredProperties = res.data,
    });
  }

  getSearchParams(): Record<string, string> {
    const params: Record<string, string> = {};
    if (this.searchQuery) params['search'] = this.searchQuery;
    if (this.searchType) params['property_type'] = this.searchType;
    return params;
  }
}
