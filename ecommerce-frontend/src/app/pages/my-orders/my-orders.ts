import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersService } from '../../services/orders';

@Component({
  selector: 'app-my-orders',
  imports: [CommonModule],
  templateUrl: './my-orders.html',
  styleUrl: './my-orders.css'
})
export class MyOrders implements OnInit {
  orders = inject(OrdersService);

  myOrders = signal<any[]>([]);
  expanded = signal<string | null>(null);

  async ngOnInit() {
    try {
      const data = await this.orders.getMyOrders();
      this.myOrders.set(data ?? []);
    } catch (e) {
      console.error(e);
    }
  }

  toggle(id: string) {
    this.expanded.set(this.expanded() === id ? null : id);
  }

  getStatusLabel(status: string) {
    const labels: any = {
      pending: '🕐 Pendiente',
      confirmed: '✅ Confirmado',
      shipped: '🚚 Enviado',
      delivered: '📦 Entregado',
      cancelled: '❌ Cancelado'
    };
    return labels[status] ?? status;
  }
}
