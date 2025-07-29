import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IProduct } from '../models/Iproducts';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private mockProducts: IProduct[] = [
    {
      id: 1,
      name: 'Laptop Gaming',
      description: 'Laptop de alta gama para gaming con procesador Intel i7 y tarjeta gráfica RTX 4060',
      price: 1299.99
    },
    {
      id: 2,
      name: 'Smartphone Pro',
      description: 'Teléfono inteligente con cámara de 108MP y 256GB de almacenamiento',
      price: 899.99
    },
    {
      id: 3,
      name: 'Auriculares Bluetooth',
      description: 'Auriculares inalámbricos con cancelación de ruido activa',
      price: 249.99
    },
    {
      id: 4,
      name: 'Monitor 4K',
      description: 'Monitor UltraHD de 27 pulgadas ideal para diseño y gaming',
      price: 599.99
    },
    {
      id: 5,
      name: 'Teclado Mecánico',
      description: 'Teclado gaming mecánico con switches cherry MX y iluminación RGB',
      price: 159.99
    },
    {
      id: 6,
      name: 'Mouse Gamer',
      description: 'Mouse óptico de alta precisión con 16000 DPI',
      price: 79.99
    }
  ];

  constructor() { }

  getProducts(): Observable<IProduct[]> {
    return of(this.mockProducts);
  }

  getProductById(id: number): Observable<IProduct | undefined> {
    const product = this.mockProducts.find(p => p.id === id);
    return of(product);
  }

  addProduct(product: Omit<IProduct, 'id'>): Observable<IProduct> {
    const newProduct: IProduct = {
      id: this.generateId(),
      ...product
    };
    this.mockProducts.push(newProduct);
    return of(newProduct);
  }

  updateProduct(id: number, updatedProduct: Partial<IProduct>): Observable<IProduct | null> {
    const index = this.mockProducts.findIndex(p => p.id === id);
    if (index !== -1) {
      this.mockProducts[index] = { ...this.mockProducts[index], ...updatedProduct };
      return of(this.mockProducts[index]);
    }
    return of(null);
  }

  deleteProduct(id: number): Observable<boolean> {
    const index = this.mockProducts.findIndex(p => p.id === id);
    if (index !== -1) {
      this.mockProducts.splice(index, 1);
      return of(true);
    }
    return of(false);
  }

  private generateId(): number {
    return Math.max(...this.mockProducts.map(p => p.id)) + 1;
  }
}
