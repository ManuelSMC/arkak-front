import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly API = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<any> {
    return this.http.get(`${this.API}/dashboard`);
  }

  getUsers(filters: any = {}): Observable<any> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([k, v]) => { if (v !== undefined && v !== '') params = params.set(k, String(v)); });
    return this.http.get(`${this.API}/users`, { params });
  }

  createUser(data: { email: string; first_name: string; last_name: string; phone?: string; role: string }): Observable<any> {
    return this.http.post(`${this.API}/users`, data);
  }

  updateUser(id: number, data: any): Observable<any> {
    return this.http.put(`${this.API}/users/${id}`, data);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.API}/users/${id}`);
  }

  getAllProperties(filters: any = {}): Observable<any> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([k, v]) => { if (v !== undefined && v !== '') params = params.set(k, String(v)); });
    return this.http.get(`${this.API}/admin/properties`, { params });
  }

  updateProperty(id: number, data: any): Observable<any> {
    return this.http.put(`${this.API}/admin/properties/${id}`, data);
  }

  deleteProperty(id: number): Observable<any> {
    return this.http.delete(`${this.API}/admin/properties/${id}`);
  }

  // Seller Requests
  createSellerRequest(data: any): Observable<any> {
    return this.http.post(`${this.API}/seller-requests`, data);
  }

  getSellerRequests(filters: any = {}): Observable<any> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([k, v]) => { if (v !== undefined && v !== '') params = params.set(k, String(v)); });
    return this.http.get(`${this.API}/seller-requests`, { params });
  }

  approveSellerRequest(id: number): Observable<any> {
    return this.http.put(`${this.API}/seller-requests/${id}/approve`, {});
  }

  rejectSellerRequest(id: number): Observable<any> {
    return this.http.put(`${this.API}/seller-requests/${id}/reject`, {});
  }

  getSellerDashboard(): Observable<any> {
    return this.http.get(`${this.API}/seller/dashboard`);
  }

  getNotifications(): Observable<{ data: any[]; unread: number }> {
    return this.http.get<{ data: any[]; unread: number }>(`${this.API}/notifications`);
  }

  markNotificationRead(id: number): Observable<any> {
    return this.http.put(`${this.API}/notifications/${id}/read`, {});
  }

  markAllNotificationsRead(): Observable<any> {
    return this.http.put(`${this.API}/notifications/read-all`, {});
  }

  getSellerProfile(id: number): Observable<any> {
    return this.http.get(`${this.API}/sellers/${id}/profile`);
  }
}
