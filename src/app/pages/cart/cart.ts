import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart';
import { OrdersService } from '../../services/orders';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart {
  cart = inject(CartService);
  orders = inject(OrdersService);
  auth = inject(AuthService);
  router = inject(Router);

  shippingAddress = '';
  notes = '';
  showCheckout = signal(false);
  loading = signal(false);
  error = signal('');

  async finishOrder() {
    this.loading.set(true);
    this.error.set('');
    try {
      await this.orders.createOrder({
        items: this.cart.cartItems(),
        total_amount: this.cart.totalPrice(),
        shipping_address: this.shippingAddress,
        notes: this.notes
      });
      this.cart.clear();
      this.router.navigate(['/my-orders']);
    } catch (e: any) {
      this.error.set(e.message ?? 'Error al realizar el pedido');
    } finally {
      this.loading.set(false);
    }
  }
}
