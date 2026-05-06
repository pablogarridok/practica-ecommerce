import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { SupabaseService } from './supabase';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private supabase: SupabaseService) {}

  private async getHeaders() {
    const { data } = await this.supabase.client.auth.getSession();
    const token = data.session?.access_token;
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  async createOrder(order: any) {
    const headers = await this.getHeaders();
    return firstValueFrom(this.http.post<any>(`${this.apiUrl}/orders`, order, { headers }));
  }

  async getMyOrders() {
    const headers = await this.getHeaders();
    return firstValueFrom(this.http.get<any[]>(`${this.apiUrl}/orders/my-orders`, { headers }));
  }

  async getAllOrders() {
    const headers = await this.getHeaders();
    return firstValueFrom(this.http.get<any[]>(`${this.apiUrl}/orders`, { headers }));
  }

  async updateStatus(id: string, status: string) {
    const headers = await this.getHeaders();
    return firstValueFrom(this.http.patch<any>(`${this.apiUrl}/orders/${id}/status`, { status }, { headers }));
  }
}
