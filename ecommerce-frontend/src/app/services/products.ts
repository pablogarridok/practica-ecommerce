import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  async getAll() {
    return firstValueFrom(this.http.get<any[]>(`${this.apiUrl}/products`));
  }

  async getBySlug(slug: string) {
    return firstValueFrom(this.http.get<any>(`${this.apiUrl}/products/${slug}`));
  }

  async create(formData: FormData) {
    return firstValueFrom(this.http.post<any>(`${this.apiUrl}/products`, formData));
  }

  async update(id: string, formData: FormData) {
    return firstValueFrom(this.http.put<any>(`${this.apiUrl}/products/${id}`, formData));
  }

  async delete(id: string) {
    return firstValueFrom(this.http.delete<any>(`${this.apiUrl}/products/${id}`));
  }
}
