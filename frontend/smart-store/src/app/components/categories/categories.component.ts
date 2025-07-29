import { Component } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-categories',
  imports: [ToolbarModule, ButtonModule, InputIconModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {

}
