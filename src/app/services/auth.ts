import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from './supabase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser = signal<any>(null);

  constructor(private supabase: SupabaseService, private router: Router) {
    this.supabase.client.auth.getSession().then(({ data }) => {
      this.currentUser.set(data.session?.user ?? null);
    });

    this.supabase.client.auth.onAuthStateChange((_, session) => {
      this.currentUser.set(session?.user ?? null);
    });
  }

  get isLoggedIn() {
    return !!this.currentUser();
  }

  get isAdmin() {
    return this.currentUser()?.user_metadata?.role === 'admin';
  }

  async login(email: string, password: string) {
    const { data, error } = await this.supabase.client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async register(email: string, password: string, fullName: string) {
    const { data, error } = await this.supabase.client.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, role: 'user' } }
    });
    if (error) throw error;
    return data;
  }

  async logout() {
    await this.supabase.client.auth.signOut();
    this.router.navigate(['/']);
  }
}
