import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { FloatLabel } from 'primeng/floatlabel';
import { IProduct } from '../../../models/Iproducts';

export interface ProductModalConfig {
  visible: boolean;
  mode: 'view' | 'edit';
  product?: IProduct;
}

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    InputNumber,
    FloatLabel
  ],
  templateUrl: './product-modal.component.html',
  styleUrl: './product-modal.component.scss'
})
export class ProductModalComponent implements OnInit, OnChanges {
  @Input() config: ProductModalConfig = { visible: false, mode: 'view' };
  @Output() configChange = new EventEmitter<ProductModalConfig>();
  @Output() onSave = new EventEmitter<IProduct>();
  @Output() onCancel = new EventEmitter<void>();

  productForm: FormGroup;
  isReadonly: boolean = true;

  constructor(private fb: FormBuilder) {
    this.productForm = this.createForm();
  }

  ngOnInit() {
    this.updateFormState();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['config']) {
      this.updateFormState();
      if (this.config.product) {
        this.loadProductData();
      } else {
        this.resetForm();
      }
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      price: [0, [Validators.required, Validators.min(0.01)]]
    });
  }

  private updateFormState() {
    this.isReadonly = this.config.mode === 'view';
    
    if (this.isReadonly) {
      this.productForm.disable();
    } else {
      this.productForm.enable();
    }
  }

  private loadProductData() {
    if (this.config.product) {
      this.productForm.patchValue({
        name: this.config.product.name,
        description: this.config.product.description,
        price: this.config.product.price
      });
    }
  }

  private resetForm() {
    this.productForm.reset();
    this.productForm.patchValue({
      name: '',
      description: '',
      price: 0
    });
  }

  get modalTitle(): string {
    switch (this.config.mode) {
      case 'view':
        return 'Ver Producto';
      case 'edit':
        return this.config.product ? 'Editar Producto' : 'Nuevo Producto';
      default:
        return 'Producto';
    }
  }

  get submitButtonLabel(): string {
    return this.config.product ? 'Actualizar' : 'Crear';
  }

  onDialogHide() {
    this.configChange.emit({ ...this.config, visible: false });
    this.onCancel.emit();
  }

  onSubmit() {
    if (this.productForm.valid) {
      const formValue = this.productForm.value;
      const productData: IProduct = {
        id: this.config.product?.id || 0,
        name: formValue.name,
        description: formValue.description,
        price: formValue.price
      };
      
      this.onSave.emit(productData);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.productForm.controls).forEach(key => {
        this.productForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancelClick() {
    this.onDialogHide();
  }

  // Helper methods for validation
  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.productForm.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} es requerido`;
      }
      if (field.errors['minlength']) {
        return `${this.getFieldLabel(fieldName)} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
      }
      if (field.errors['min']) {
        return `${this.getFieldLabel(fieldName)} debe ser mayor a ${field.errors['min'].min}`;
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Nombre',
      description: 'Descripción',
      price: 'Precio'
    };
    return labels[fieldName] || fieldName;
  }
}
