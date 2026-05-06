import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrdersService } from '../../../services/orders';

@Component({
  selector: 'app-admin-orders',
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class Orders implements OnInit {
  ordersService = inject(OrdersService);

  orders = signal<any[]>([]);
  expanded = signal<string | null>(null);

  statusOptions = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

  async ngOnInit() {
    try {
      const data = await this.ordersService.getAllOrders();
      this.orders.set(data ?? []);
    } catch (e) {
      console.error(e);
    }
  }

  toggle(id: string) {
    this.expanded.set(this.expanded() === id ? null : id);
  }

  async changeStatus(order: any, status: string) {
    try {
      await this.ordersService.updateStatus(order.id, status);
      this.orders.update(orders =>
        orders.map(o => o.id === order.id ? { ...o, status } : o)
      );
    } catch (e) {
      console.error(e);
    }
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
