import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Property } from './property.service';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private readonly API = `${environment.apiUrl}/favorites`;

  constructor(private http: HttpClient) {}

  getMyFavorites(): Observable<Property[]> {
    return this.http.get<any>(this.API).pipe(
      map(res => res.data || res)
    );
  }

  toggle(propertyId: number): Observable<{ favorited: boolean; message: string }> {
    return this.http.post<{ favorited: boolean; message: string }>(`${this.API}/${propertyId}`, {});
  }

  check(propertyId: number): Observable<{ favorited: boolean }> {
    return this.http.get<{ favorited: boolean }>(`${this.API}/check/${propertyId}`);
  }
}
