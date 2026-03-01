import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface TimeSlot {
  start_time: string;
  end_time: string;
  available: boolean;
}

export interface Appointment {
  id?: number;
  property_id: number;
  client_id?: number;
  seller_id: number;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
  notes?: string;
  property_title?: string;
  property_address?: string;
  property_image?: string;
  client_name?: string;
  client_phone?: string;
  seller_name?: string;
  created_at?: string;
}

export interface ScheduleDay {
  id?: number;
  day_of_week: number;
  is_available: boolean;
  start_time: string;
  end_time: string;
  slot_duration: number;
}

export interface BlockedSlot {
  id?: number;
  date: string;
  start_time?: string;
  end_time?: string;
  reason?: string;
}

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private readonly API = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Available slots
  getAvailableSlots(sellerId: number, date: string): Observable<TimeSlot[]> {
    return this.http.get<TimeSlot[]>(
      `${this.API}/appointments/available-slots`,
      { params: { seller_id: sellerId.toString(), date } }
    );
  }

  // Appointments
  create(data: {
    property_id: number; seller_id: number; date: string;
    start_time: string; end_time: string; notes?: string;
  }): Observable<any> {
    return this.http.post(`${this.API}/appointments`, data);
  }

  getMyAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.API}/appointments/my`);
  }

  cancel(id: number): Observable<any> {
    return this.http.put(`${this.API}/appointments/${id}/cancel`, {});
  }

  updateStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.API}/appointments/${id}/status`, { status });
  }

  // Schedule
  getMySchedule(): Observable<ScheduleDay[]> {
    return this.http.get<ScheduleDay[]>(`${this.API}/schedule/my`);
  }

  updateMySchedule(schedule: ScheduleDay[]): Observable<ScheduleDay[]> {
    return this.http.put<ScheduleDay[]>(`${this.API}/schedule/my`, { schedule });
  }

  getBlockedSlots(from_date?: string, to_date?: string): Observable<BlockedSlot[]> {
    let params = new HttpParams();
    if (from_date) params = params.set('from_date', from_date);
    if (to_date) params = params.set('to_date', to_date);
    return this.http.get<BlockedSlot[]>(`${this.API}/schedule/blocked`, { params });
  }

  createBlockedSlot(data: { date: string; start_time?: string; end_time?: string; reason?: string }): Observable<BlockedSlot> {
    return this.http.post<BlockedSlot>(`${this.API}/schedule/blocked`, data);
  }

  deleteBlockedSlot(id: number): Observable<any> {
    return this.http.delete(`${this.API}/schedule/blocked/${id}`);
  }
}
