import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Property {
  id: number;
  seller_id: number;
  title: string;
  description: string;
  price: number;
  operation_type: 'venta' | 'renta';
  property_type: 'casa' | 'departamento' | 'terreno' | 'local_comercial';
  street?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  latitude?: number;
  longitude?: number;
  total_area?: number;
  built_area?: number;
  bedrooms: number;
  bathrooms: number;
  half_bathrooms: number;
  parking_spaces: number;
  year_built?: number;
  has_garden: boolean;
  has_pool: boolean;
  has_storage: boolean;
  has_security: boolean;
  is_furnished: boolean;
  status: 'activa' | 'pausada' | 'vendida';
  is_featured: boolean;
  view_count: number;
  main_image?: string;
  images?: PropertyImage[];
  seller_first_name?: string;
  seller_last_name?: string;
  seller_avatar?: string;
  seller_phone?: string;
  seller_email?: string;
  seller_bio?: string;
  seller_years_experience?: number;
  seller_rating?: number;
  seller_user_id?: number;
  created_at: string;
}

export interface PropertyImage {
  id: number;
  image_url: string;
  sort_order: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface PropertyFilters {
  operation_type?: string;
  property_type?: string;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  bathrooms?: number;
  min_area?: number;
  max_area?: number;
  neighborhood?: string;
  city?: string;
  search?: string;
  sort?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
}

@Injectable({ providedIn: 'root' })
export class PropertyService {
  private readonly API = `${environment.apiUrl}/properties`;

  constructor(private http: HttpClient) {}

  getAll(filters: PropertyFilters = {}): Observable<PaginatedResponse<Property>> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });
    return this.http.get<PaginatedResponse<Property>>(this.API, { params });
  }

  getById(id: number): Observable<Property> {
    return this.http.get<Property>(`${this.API}/${id}`);
  }

  getMyProperties(filters: { status?: string; page?: number; limit?: number } = {}): Observable<PaginatedResponse<Property>> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) params = params.set(key, String(value));
    });
    return this.http.get<PaginatedResponse<Property>>(`${this.API}/seller/mine`, { params });
  }

  create(formData: FormData): Observable<Property> {
    return this.http.post<Property>(this.API, formData);
  }

  update(id: number, formData: FormData): Observable<Property> {
    return this.http.put<Property>(`${this.API}/${id}`, formData);
  }

  delete(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API}/${id}`);
  }

  removeImage(propertyId: number, imageId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API}/${propertyId}/images/${imageId}`);
  }
}
