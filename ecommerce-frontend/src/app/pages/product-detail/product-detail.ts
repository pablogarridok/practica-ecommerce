import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../services/products';
import { CartService } from '../../services/cart';
import { AuthService } from '../../services/auth';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-product-detail',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetail implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  products = inject(ProductsService);
  cart = inject(CartService);
  auth = inject(AuthService);

  product = signal<any>(null);
  selectedSize = '';
  quantity = 1;
  added = signal(false);

  async ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) return;
    try {
      const p = await this.products.getBySlug(slug);
      this.product.set(p);
    } catch (e) {
      console.error(e);
    }
  }

  addToCart() {
    if (!this.selectedSize) return;
    this.cart.addItem(this.product(), this.selectedSize, 1);
    this.added.set(true);
    setTimeout(() => this.added.set(false), 2000);
  }
}
