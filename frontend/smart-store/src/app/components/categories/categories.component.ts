import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CategoriesService } from '../../services/categories.service';
import { ICategory } from '../../models/Icategories';
import { Table } from 'primeng/table';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ToolbarModule } from 'primeng/toolbar';
import { SplitButtonModule } from 'primeng/splitbutton'
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { CategoryModalComponent } from "./category-modal/category-modal.component";  

@Component({
  selector: 'app-categories',
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    CardModule,
    TagModule,
    IconFieldModule,
    InputIconModule,
    ToolbarModule,
    SplitButtonModule,
    InputTextModule,
    TooltipModule,
    CategoryModalComponent
],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {
  
  @ViewChild('dt') dt!: Table;
  
  categories$: Observable<ICategory[]>;
  categories: ICategory[] = [];
  loading: boolean = true;
  globalFilterValue: string = '';

  modalMode : 'create' | 'edit' | 'view' = 'create';
  visibleModal: boolean = false;
  selectedCategory?: ICategory;

  onModalClose() {
    console.log('Modal closed');
    this.visibleModal = false;
    this.modalMode = 'create';
    this.selectedCategory = undefined;
  }

  addCategory() {
    console.log('Adding new category');
    this.modalMode = 'create';
    this.selectedCategory = undefined;
    this.visibleModal = true;
  }

  editCategory(category: ICategory) {
    console.log('Editing category:', category);
    this.modalMode = 'edit';
    this.selectedCategory = category;
    this.visibleModal = true;
  }

  viewCategory(category: ICategory) {
    console.log('Viewing category:', category);
    this.modalMode = 'view';
    this.selectedCategory = category;
    this.visibleModal = true;
  }

  onCategorySave(categoryData: Omit<ICategory, 'id'>) {
    console.log('Saving category:', categoryData);
    
    if (this.modalMode === 'create') {
      this.categoriesService.addCategory(categoryData).subscribe({
        next: (newCategory) => {
          this.loadCategories();
          this.visibleModal = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Category created successfully'
          });
        },
        error: (error) => {
          console.error('Error creating category:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error creating category. Please try again.'
          });
        }
      });
    } else if (this.modalMode === 'edit' && this.selectedCategory) {
      this.categoriesService.updateCategory(this.selectedCategory.id, categoryData).subscribe({
        next: (updatedCategory) => {
          if (updatedCategory) {
            this.loadCategories();
            this.visibleModal = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Category updated successfully'
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Category not found'
            });
          }
        },
        error: (error) => {
          console.error('Error updating category:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error updating category. Please try again.'
          });
        }
      });
    }
  }


  constructor(
    private categoriesService: CategoriesService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.categories$ = this.categoriesService.getCategories();
  }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.loading = true;
    this.categories$ = this.categoriesService.getCategories();
    this.categories$.subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.loading = false;
      }
    });
  }

  deleteCategory(id: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this category? This action cannot be undone.',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      acceptLabel: 'Yes, delete',
      rejectLabel: 'Cancel',
      accept: () => {
        this.categoriesService.deleteCategory(id).subscribe({
          next: (success) => {
            if (success) {
                this.loadCategories();
                this.messageService.add({
                  severity: 'success', 
                  summary: 'Success', 
                  detail: 'Category deleted successfully'
                });
            } else {
                this.messageService.add({
                  severity: 'error', 
                  summary: 'Error', 
                  detail: 'Could not delete the category'
                });
            }
          },
          error: (error) => {
            console.error('Error deleting category:', error);
            this.messageService.add({
              severity: 'error', 
              summary: 'Error', 
              detail: 'Error deleting the category. Please try again.'
            });
          }
        });
      }
    });
  }

  getDateSeverity(createdAt?: Date): string {
    if (!createdAt) return 'info';
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 7) return 'success';
    if (diffDays < 30) return 'warning';
    return 'info';
  }
  
  onGlobalFilter(event: Event) {
    const target = event.target as HTMLInputElement;
    this.globalFilterValue = target.value;
    this.dt.filterGlobal(target.value, 'contains');
  }

  clearFilter() {
    this.globalFilterValue = '';
    this.dt.clear();
  }

  exportToCsv() {
    try {
      this.dt.exportCSV();
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Categories exported to CSV successfully'
      });
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error exporting categories to CSV. Please try again.'
      });
    }
  }



  exportToPdf() {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Categories Report', 14, 22);
    
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    const tableData = this.categories.map(category => [
      category.id.toString(),
      category.name,
      category.description || 'No description',
      category.createdAt ? new Date(category.createdAt).toLocaleDateString() : 'Unknown'
    ]);
    
    autoTable(doc, {
      head: [['ID', 'Name', 'Description', 'Created At']],
      body: tableData,
      startY: 40,
      styles: {
        fontSize: 10,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      }
    });
    
    // Save the PDF
    doc.save('categories-report.pdf');
    
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Categories exported to PDF successfully'
    });
  }

  printTable() {
    window.print();
    this.messageService.add({
      severity: 'info',
      summary: 'Print',
      detail: 'Print dialog opened'
    });
  }

  onExportOptionSelect(event: any) {
    switch (event.value) {
      case 'csv':
        this.exportToCsv();
        break;
      case 'pdf':
        this.exportToPdf();
        break;
    }
  }

 
  exportOptions = [
    { 
      label: 'Export to CSV', 
      value: 'csv', 
      icon: 'pi pi-file-excel',
      command: () => this.exportToCsv()
    },
    { 
      label: 'Export to PDF', 
      value: 'pdf', 
      icon: 'pi pi-file-pdf',
      command: () => this.exportToPdf()
    }
  ];
}
