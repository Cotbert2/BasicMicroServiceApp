import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CategoriesComponent } from "./components/categories/categories.component";
import { ProductsComponent } from "./components/products/products.component";
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FooterComponent } from "./components/shared/footer/footer.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [ButtonModule, ProductsComponent,  CategoriesComponent, ToastModule, ConfirmDialogModule, FooterComponent, RouterModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'smart-store';
}
