import { Component, Input, OnInit, OnChanges, Output, EventEmitter } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { IftaLabelModule} from 'primeng/iftalabel';
import { IconFieldModule } from 'primeng/iconfield';
import { IProduct } from '../../../models';
import { ButtonModule } from 'primeng/button';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-product-modal',
  imports: [DialogModule,
    IconFieldModule,
    ReactiveFormsModule,
    IftaLabelModule,
    InputText,
    InputIconModule,
    ButtonModule,
    TitleCasePipe
  ],
  templateUrl: './product-modal.component.html',
  styleUrl: './product-modal.component.scss'
})
export class ProductModalComponent implements OnInit, OnChanges {

  header: string = '';
  productForm: FormGroup;
  @Input() product?: IProduct;
  @Input() mode : 'create' | 'edit' | 'view' = 'create';
  @Input() visible: boolean = true;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Omit<IProduct, 'id'>>();

  headers: Record<'create' | 'edit' | 'view', string> = {
    create: 'Create Product',
    edit: 'Edit Product',
    view: 'View Product'
  };

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      id: [{value: '', disabled: true}],
      name: ['', [Validators.required, Validators.maxLength(20)]],
      description: ['', [Validators.required, Validators.maxLength(30)]],
      price: ['', [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnInit() {
    this.setHeader();
    this.initializeForm();
  }

  ngOnChanges() {
    if (this.visible) {
      this.setHeader();
      this.initializeForm();
    }
  }

  setHeader() {
    console.log('Setting header for mode:', this.mode);
    this.header = this.headers[this.mode];
  }

  initializeForm() {
    // Reset form first
    this.productForm.reset();
    this.productForm.enable();
    
    // Always keep ID field disabled
    this.productForm.get('id')?.disable();
    
    if (this.product && (this.mode === 'edit' || this.mode === 'view')) {
      this.productForm.patchValue({
        id: this.product.id,
        name: this.product.name,
        description: this.product.description,
        price: this.product.price
      });
    }

    if (this.mode === 'view') {
      this.productForm.disable();
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.productForm.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (field.errors['maxlength']) {
        const maxLength = field.errors['maxlength'].requiredLength;
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} cannot exceed ${maxLength} characters`;
      }
      if (field.errors['min']) {
        return 'Price must be at least $0.01';
      }
    }
    return '';
  }

  onSubmit() {
    if (this.productForm.valid && this.mode !== 'view') {
      const formValue = this.productForm.value;
      const productData: Omit<IProduct, 'id'> = {
        name: formValue.name,
        description: formValue.description,
        price: parseFloat(formValue.price)
      };
      
      console.log('Form submitted:', productData);
      this.save.emit(productData);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.productForm.controls).forEach(key => {
        this.productForm.get(key)?.markAsTouched();
      });
    }
  }

  onModalClose() {
    this.close.emit();
  }

}
