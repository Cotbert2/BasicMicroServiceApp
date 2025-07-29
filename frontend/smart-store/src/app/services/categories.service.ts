import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { ICategory } from '../models/Icategories';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private mockCategories: ICategory[] = [
    {
      id: 1,
      name: 'Electronics',
      description: 'Electronic devices and gadgets',
      createdAt: new Date('2024-01-15')
    },
    {
      id: 2,
      name: 'Clothing',
      description: 'Fashion and apparel items',
      createdAt: new Date('2024-01-20')
    },
    {
      id: 3,
      name: 'Home & Garden',
      description: 'Home improvement and gardening products',
      createdAt: new Date('2024-02-01')
    },
    {
      id: 4,
      name: 'Sports',
      description: 'Sports equipment and accessories',
      createdAt: new Date('2024-02-10')
    },
    {
      id: 5,
      name: 'Books',
      description: 'Books and educational materials',
      createdAt: new Date('2024-02-15')
    },
    {
      id: 6,
      name: 'Health & Beauty',
      description: 'Health care and beauty products',
      createdAt: new Date('2024-03-01')
    }
  ];

  private categoriesSubject = new BehaviorSubject<ICategory[]>(this.mockCategories);

  constructor() { }

  getCategories(): Observable<ICategory[]> {
    return this.categoriesSubject.asObservable();
  }

  getCategoryById(id: number): Observable<ICategory | undefined> {
    const category = this.mockCategories.find(c => c.id === id);
    return of(category);
  }

  addCategory(category: Omit<ICategory, 'id'>): Observable<ICategory> {
    const newCategory: ICategory = {
      id: this.generateId(),
      ...category,
      createdAt: category.createdAt || new Date()
    };
    this.mockCategories.push(newCategory);
    this.categoriesSubject.next([...this.mockCategories]);
    return of(newCategory);
  }

  updateCategory(id: number, updatedCategory: Partial<ICategory>): Observable<ICategory | null> {
    const index = this.mockCategories.findIndex(c => c.id === id);
    if (index !== -1) {
      this.mockCategories[index] = { 
        ...this.mockCategories[index], 
        ...updatedCategory,
        // Preserve the original createdAt date
        createdAt: this.mockCategories[index].createdAt
      };
      this.categoriesSubject.next([...this.mockCategories]);
      return of(this.mockCategories[index]);
    }
    return of(null);
  }

  deleteCategory(id: number): Observable<boolean> {
    const index = this.mockCategories.findIndex(c => c.id === id);
    if (index !== -1) {
      this.mockCategories.splice(index, 1);
      this.categoriesSubject.next([...this.mockCategories]);
      return of(true);
    }
    return of(false);
  }

  private generateId(): number {
    return Math.max(...this.mockCategories.map(c => c.id)) + 1;
  }
}
