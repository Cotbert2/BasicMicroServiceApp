import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, MenubarModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  items: MenuItem[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        routerLink: ['/home']
      },
      {
        label: 'Products',
        icon: 'pi pi-shopping-cart',
        routerLink: ['/products'],
        
      },
      {
        label: 'Categories',
        icon: 'pi pi-tags',
        routerLink: ['/categories']
      }
    ];
  }
}
