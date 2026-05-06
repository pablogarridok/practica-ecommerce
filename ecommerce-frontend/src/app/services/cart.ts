import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items = signal<any[]>([]);

  cartItems = this.items.asReadonly();

  totalItems = computed(() => this.items().reduce((acc, i) => acc + i.quantity, 0));

  totalPrice = computed(() => this.items().reduce((acc, i) => acc + i.unit_price * i.quantity, 0));

  addItem(product: any, size: string, quantity: number) {
    const existing = this.items().find(i => i.product_id === product.id && i.size === size);
    if (existing) {
      this.items.update(items => items.map(i =>
        i.product_id === product.id && i.size === size
          ? { ...i, quantity: i.quantity + quantity }
          : i
      ));
    } else {
      this.items.update(items => [...items, {
        product_id: product.id,
        name: product.name,
        image_url: product.image_url,
        unit_price: product.price,
        size,
        quantity
      }]);
    }
  }

  removeItem(product_id: string, size: string) {
    this.items.update(items => items.filter(i => !(i.product_id === product_id && i.size === size)));
  }

  clear() {
    this.items.set([]);
  }
}
