import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProductsService } from '../../services/products.service';
import { IProduct } from '../../models/Iproducts';
import { Table } from 'primeng/table';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ToolbarModule } from 'primeng/toolbar';
import { SplitButtonModule } from 'primeng/splitbutton'
import { InputText } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { ProductModalComponent } from "./product-modal/product-modal.component";  

@Component({
  selector: 'app-products',
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
    InputText,
    TooltipModule,
    ProductModalComponent
],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  
  @ViewChild('dt') dt!: Table;
  
  products$: Observable<IProduct[]>;
  products: IProduct[] = [];
  loading: boolean = true;
  globalFilterValue: string = '';

  modalMode : 'create' | 'edit' | 'view' = 'create';
  visibleModal: boolean = false;
  selectedProduct?: IProduct;

  onModalClose() {
    console.log('Modal closed');
    this.visibleModal = false;
    this.modalMode = 'create';
    this.selectedProduct = undefined;
  }

  addProduct() {
    console.log('Adding new product');
    this.modalMode = 'create';
    this.selectedProduct = undefined;
    this.visibleModal = true;
  }

  editProduct(product: IProduct) {
    console.log('Editing product:', product);
    this.modalMode = 'edit';
    this.selectedProduct = product;
    this.visibleModal = true;
  }

  viewProduct(product: IProduct) {
    console.log('Viewing product:', product);
    this.modalMode = 'view';
    this.selectedProduct = product;
    this.visibleModal = true;
  }

  onProductSave(productData: Omit<IProduct, 'id'>) {
    console.log('Saving product:', productData);
    
    if (this.modalMode === 'create') {
      this.productsService.addProduct(productData).subscribe({
        next: (newProduct) => {
          this.loadProducts();
          this.visibleModal = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Product created successfully'
          });
        },
        error: (error) => {
          console.error('Error creating product:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error creating product. Please try again.'
          });
        }
      });
    } else if (this.modalMode === 'edit' && this.selectedProduct) {
      this.productsService.updateProduct(this.selectedProduct.id, productData).subscribe({
        next: (updatedProduct) => {
          if (updatedProduct) {
            this.loadProducts();
            this.visibleModal = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Product updated successfully'
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Product not found'
            });
          }
        },
        error: (error) => {
          console.error('Error updating product:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error updating product. Please try again.'
          });
        }
      });
    }
  }


  constructor(
    private productsService: ProductsService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.products$ = this.productsService.getProducts();
  }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.products$.subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
      }
    });
  }

  deleteProduct(id: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this product? This action cannot be undone.',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      acceptLabel: 'Yes, delete',
      rejectLabel: 'Cancel',
      accept: () => {
        this.productsService.deleteProduct(id).subscribe({
          next: (success) => {
            if (success) {
                this.loadProducts();
                this.messageService.add({
                  severity: 'success', 
                  summary: 'Success', 
                  detail: 'Product deleted successfully'
                });
            } else {
                this.messageService.add({
                  severity: 'error', 
                  summary: 'Error', 
                  detail: 'Could not delete the product'
                });
            }
          },
          error: (error) => {
            console.error('Error deleting product:', error);
            this.messageService.add({
              severity: 'error', 
              summary: 'Error', 
              detail: 'Error deleting the product. Please try again.'
            });
          }
        });
      }
    });
  }

  getPriceSeverity(price: number): string {
    if (price < 100) return 'success';
    if (price < 500) return 'warning';
    return 'danger';
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
        detail: 'Products exported to CSV successfully'
      });
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error exporting products to CSV. Please try again.'
      });
    }
  }



  exportToPdf() {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Products Report', 14, 22);
    
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    const tableData = this.products.map(product => [
      product.id.toString(),
      product.name,
      product.description,
      `$${product.price.toFixed(2)}`
    ]);
    
    autoTable(doc, {
      head: [['ID', 'Name', 'Description', 'Price']],
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
    doc.save('products-report.pdf');
    
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Products exported to PDF successfully'
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
