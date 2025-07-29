import { Component } from '@angular/core';

import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { SplitButtonModule } from 'primeng/splitbutton'
import { CommonModule } from '@angular/common';
import { InputText } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { TooltipModule } from 'primeng/tooltip';  

@Component({
  selector: 'app-bar',
  imports: [
    IconFieldModule,
    InputIconModule,
    ButtonModule,
    ToolbarModule,
    SplitButtonModule,
    CommonModule,
    InputText,
    FloatLabel,
    TooltipModule
  ],
  templateUrl: './bar.component.html',
  styleUrl: './bar.component.scss'
})
export class BarComponent {
  exportOptions = [
    { label: 'Export to CSV', value: 'csv' , icon: 'pi pi-file-excel'},
    { label: 'Export to PDF', value: 'pdf', icon: 'pi pi-file-pdf' }
  ];


}
