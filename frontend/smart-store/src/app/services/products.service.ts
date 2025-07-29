import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap, retry } from 'rxjs/operators';
import { IProduct } from '../models/Iproducts';
import { API_URLS, HTTP_CONFIG } from '../config/constants';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService extends BaseService {

  private productsSubject = new BehaviorSubject<IProduct[]>([]);

  constructor(private http: HttpClient) { 
    super();
    this.loadProducts();
  }

  getProducts(): Observable<IProduct[]> {
    return this.productsSubject.asObservable();
  }

  getProductById(id: number): Observable<IProduct> {
    return this.http.get<IProduct>(API_URLS.PRODUCTS.BY_ID(id))
      .pipe(
        retry(HTTP_CONFIG.RETRY_ATTEMPTS),
        catchError(this.handleError)
      );
  }

  addProduct(product: Omit<IProduct, 'id'>): Observable<IProduct> {
    return this.http.post<IProduct>(API_URLS.PRODUCTS.BASE, product)
      .pipe(
        retry(HTTP_CONFIG.RETRY_ATTEMPTS),
        tap(newProduct => {
          const currentProducts = this.productsSubject.value;
          this.productsSubject.next([...currentProducts, newProduct]);
        }),
        catchError(this.handleError)
      );
  }

  updateProduct(id: number, updatedProduct: Partial<IProduct>): Observable<IProduct> {
    return this.http.put<IProduct>(API_URLS.PRODUCTS.BY_ID(id), updatedProduct)
      .pipe(
        retry(HTTP_CONFIG.RETRY_ATTEMPTS),
        tap(updated => {
          const currentProducts = this.productsSubject.value;
          const index = currentProducts.findIndex(p => p.id === id);
          if (index !== -1) {
            currentProducts[index] = updated;
            this.productsSubject.next([...currentProducts]);
          }
        }),
        catchError(this.handleError)
      );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(API_URLS.PRODUCTS.BY_ID(id))
      .pipe(
        retry(HTTP_CONFIG.RETRY_ATTEMPTS),
        tap(() => {
          const currentProducts = this.productsSubject.value;
          const filteredProducts = currentProducts.filter(p => p.id !== id);
          this.productsSubject.next(filteredProducts);
        }),
        catchError(this.handleError)
      );
  }

  private loadProducts(): void {
    this.http.get<IProduct[]>(API_URLS.PRODUCTS.BASE)
      .pipe(
        retry(HTTP_CONFIG.RETRY_ATTEMPTS),
        catchError(this.handleError)
      )
      .subscribe({
        next: (products) => this.productsSubject.next(products),
        error: (error) => {
          this.logError('ProductsService', 'loadProducts', error);
          this.productsSubject.next([]);
        }
      });
  }
}
