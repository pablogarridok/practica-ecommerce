import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../services/products';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  products = inject(ProductsService);
  featured = signal<any[]>([]);

  async ngOnInit() {
    try {
      const all = await this.products.getAll();
      this.featured.set(all?.slice(0, 4) ?? []);
    } catch (e) {
      console.error(e);
    }
  }
}
