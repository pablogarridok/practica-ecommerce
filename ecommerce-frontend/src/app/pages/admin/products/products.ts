import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../../services/products';

@Component({
  selector: 'app-admin-products',
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products implements OnInit {
  productsService = inject(ProductsService);

  products = signal<any[]>([]);
  showForm = signal(false);
  editing = signal<any>(null);
  loading = signal(false);
  error = signal('');

  form: any = this.emptyForm();
  selectedFile: File | null = null;

  emptyForm() {
    return {
      name: '', brand: '', price: '', stock: '',
      description: '', category_id: '', sizes: ''
    };
  }

  async ngOnInit() {
    await this.loadProducts();
  }

  async loadProducts() {
    try {
      const data = await this.productsService.getAll();
      this.products.set(data ?? []);
    } catch (e) {
      console.error(e);
    }
  }

  openCreate() {
    this.editing.set(null);
    this.form = this.emptyForm();
    this.selectedFile = null;
    this.showForm.set(true);
  }

  openEdit(product: any) {
    this.editing.set(product);
    this.form = {
      name: product.name,
      brand: product.brand ?? '',
      price: product.price,
      stock: product.stock,
      description: product.description ?? '',
      category_id: product.category_id ?? '',
      sizes: product.sizes?.join(', ') ?? ''
    };
    this.selectedFile = null;
    this.showForm.set(true);
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0] ?? null;
  }

  async onSubmit() {
    this.loading.set(true);
    this.error.set('');
    try {
      const formData = new FormData();
      Object.entries(this.form).forEach(([k, v]) => formData.append(k, v as string));
      if (this.selectedFile) formData.append('image', this.selectedFile);

      if (this.editing()) {
        await this.productsService.update(this.editing().id, formData);
      } else {
        await this.productsService.create(formData);
      }
      this.showForm.set(false);
      await this.loadProducts();
    } catch (e: any) {
      this.error.set(e.message ?? 'Error al guardar');
    } finally {
      this.loading.set(false);
    }
  }

  async onDelete(id: string) {
    if (!confirm('¿Seguro que quieres eliminar este producto?')) return;
    try {
      await this.productsService.delete(id);
      await this.loadProducts();
    } catch (e) {
      console.error(e);
    }
  }
}
