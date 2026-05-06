import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../services/products';

@Component({
  selector: 'app-catalog',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css'
})
export class Catalog implements OnInit {
  products = inject(ProductsService);
  route = inject(ActivatedRoute);

  allProducts = signal<any[]>([]);
  filtered = signal<any[]>([]);
  search = '';
  selectedCategory = '';

  async ngOnInit() {
    try {
      const all = await this.products.getAll();
      this.allProducts.set(all ?? []);
      this.filtered.set(all ?? []);

      this.route.queryParams.subscribe(params => {
        if (params['category']) {
          this.selectedCategory = params['category'];
          this.applyFilters();
        }
      });
    } catch (e) {
      console.error(e);
    }
  }

  applyFilters() {
    let result = this.allProducts();
    if (this.search) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(this.search.toLowerCase()) ||
        p.brand?.toLowerCase().includes(this.search.toLowerCase())
      );
    }
    if (this.selectedCategory) {
      result = result.filter(p =>
        p.category?.slug === this.selectedCategory ||
        p.category?.name?.toLowerCase() === this.selectedCategory.toLowerCase()
      );
    }
    this.filtered.set(result);
  }

  clearFilters() {
    this.search = '';
    this.selectedCategory = '';
    this.filtered.set(this.allProducts());
  }
}
