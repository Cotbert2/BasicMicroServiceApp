import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap, retry } from 'rxjs/operators';
import { ICategory } from '../models/Icategories';
import { API_URLS, HTTP_CONFIG } from '../config/constants';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService extends BaseService {

  private categoriesSubject = new BehaviorSubject<ICategory[]>([]);

  constructor(private http: HttpClient) { 
    super();
    this.loadCategories();
  }

  getCategories(): Observable<ICategory[]> {
    return this.categoriesSubject.asObservable();
  }

  getCategoryById(id: number): Observable<ICategory> {
    return this.http.get<ICategory>(API_URLS.CATEGORIES.BY_ID(id))
      .pipe(
        retry(HTTP_CONFIG.RETRY_ATTEMPTS),
        catchError(this.handleError)
      );
  }

  addCategory(category: Omit<ICategory, 'id'>): Observable<ICategory> {
    return this.http.post<ICategory>(API_URLS.CATEGORIES.BASE, category)
      .pipe(
        retry(HTTP_CONFIG.RETRY_ATTEMPTS),
        tap(newCategory => {
          const currentCategories = this.categoriesSubject.value;
          this.categoriesSubject.next([...currentCategories, newCategory]);
        }),
        catchError(this.handleError)
      );
  }

  updateCategory(id: number, updatedCategory: Partial<ICategory>): Observable<ICategory> {
    return this.http.put<ICategory>(API_URLS.CATEGORIES.BY_ID(id), updatedCategory)
      .pipe(
        retry(HTTP_CONFIG.RETRY_ATTEMPTS),
        tap(updated => {
          const currentCategories = this.categoriesSubject.value;
          const index = currentCategories.findIndex(c => c.id === id);
          if (index !== -1) {
            currentCategories[index] = updated;
            this.categoriesSubject.next([...currentCategories]);
          }
        }),
        catchError(this.handleError)
      );
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(API_URLS.CATEGORIES.BY_ID(id))
      .pipe(
        retry(HTTP_CONFIG.RETRY_ATTEMPTS),
        tap(() => {
          const currentCategories = this.categoriesSubject.value;
          const filteredCategories = currentCategories.filter(c => c.id !== id);
          this.categoriesSubject.next(filteredCategories);
        }),
        catchError(this.handleError)
      );
  }

  private loadCategories(): void {
    this.http.get<ICategory[]>(API_URLS.CATEGORIES.BASE)
      .pipe(
        retry(HTTP_CONFIG.RETRY_ATTEMPTS),
        catchError(this.handleError)
      )
      .subscribe({
        next: (categories) => this.categoriesSubject.next(categories),
        error: (error) => {
          this.logError('CategoriesService', 'loadCategories', error);
          this.categoriesSubject.next([]);
        }
      });
  }
}
