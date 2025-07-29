import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { ProductsService } from '../../services/products.service';
import { CategoriesService } from '../../services/categories.service';
import { IProduct } from '../../models/Iproducts';
import { ICategory } from '../../models/Icategories';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, AnimateOnScrollModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  productsCount: number = 0;
  categoriesCount: number = 0;
  products: IProduct[] = [];
  categories: ICategory[] = [];

  constructor(
    private router: Router,
    private productsService: ProductsService,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.productsService.getProducts().subscribe(products => {
      this.products = products;
      this.productsCount = products.length;
    });

    this.categoriesService.getCategories().subscribe(categories => {
      this.categories = categories;
      this.categoriesCount = categories.length;
    });
  }

  navigateToProducts() {
    this.router.navigate(['/products']);
  }

  navigateToCategories() {
    this.router.navigate(['/categories']);
  }
}
