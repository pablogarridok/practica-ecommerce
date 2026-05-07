import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { SupabaseService } from './supabase';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private supabase: SupabaseService) {}

  private async getHeaders() {
    const { data } = await this.supabase.client.auth.getSession();
    const token = data.session?.access_token;
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

 async getAll() {
  const result = await firstValueFrom(this.http.get<any>(`${this.apiUrl}/products`));
  return result?.data ?? result;
}

  async getBySlug(slug: string) {
    return firstValueFrom(this.http.get<any>(`${this.apiUrl}/products/${slug}`));
  }

  async create(formData: FormData) {
    const headers = await this.getHeaders();
    return firstValueFrom(this.http.post<any>(`${this.apiUrl}/products`, formData, { headers }));
  }

  async update(id: string, formData: FormData) {
    const headers = await this.getHeaders();
    return firstValueFrom(this.http.put<any>(`${this.apiUrl}/products/${id}`, formData, { headers }));
  }

  async delete(id: string) {
    const headers = await this.getHeaders();
    return firstValueFrom(this.http.delete<any>(`${this.apiUrl}/products/${id}`, { headers }));
  }
}
