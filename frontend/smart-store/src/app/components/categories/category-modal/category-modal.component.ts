import { Component, Input, OnInit, OnChanges, Output, EventEmitter } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { IftaLabelModule} from 'primeng/iftalabel';
import { IconFieldModule } from 'primeng/iconfield';
import { ICategory } from '../../../models';
import { ButtonModule } from 'primeng/button';
import { TitleCasePipe } from '@angular/common';

// Custom validators
function noWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const isWhitespace = (control.value || '').trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  };
}

function trimValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const trimmed = control.value.trim();
    if (control.value !== trimmed) {
      control.setValue(trimmed);
    }
    return null;
  };
}

@Component({
  selector: 'app-category-modal',
  imports: [DialogModule,
    IconFieldModule,
    ReactiveFormsModule,
    IftaLabelModule,
    InputTextModule,
    InputIconModule,
    ButtonModule,
    TitleCasePipe
  ],
  templateUrl: './category-modal.component.html',
  styleUrl: './category-modal.component.scss'
})
export class CategoryModalComponent implements OnInit, OnChanges {

  header: string = '';
  categoryForm: FormGroup;
  @Input() category?: ICategory;
  @Input() mode : 'create' | 'edit' | 'view' = 'create';
  @Input() visible: boolean = true;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Omit<ICategory, 'id' | 'createdAt'>>();

  headers: Record<'create' | 'edit' | 'view', string> = {
    create: 'Create Category',
    edit: 'Edit Category',
    view: 'View Category'
  };

  constructor(private fb: FormBuilder) {
    this.categoryForm = this.fb.group({
      id: [{value: '', disabled: true}],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), noWhitespaceValidator()]],
      description: ['', [Validators.maxLength(200), noWhitespaceValidator()]],
      createdAt: [{value: '', disabled: true}]
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
    this.categoryForm.reset();
    this.categoryForm.enable();
    
    // Always keep ID and createdAt fields disabled
    this.categoryForm.get('id')?.disable();
    this.categoryForm.get('createdAt')?.disable();
    
    if (this.category && (this.mode === 'edit' || this.mode === 'view')) {
      this.categoryForm.patchValue({
        id: this.category.id,
        name: this.category.name,
        description: this.category.description || '',
        createdAt: this.category.createdAt ? new Date(this.category.createdAt).toLocaleDateString() : ''
      });
    }

    if (this.mode === 'view') {
      this.categoryForm.disable();
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.categoryForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.categoryForm.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (field.errors['minlength']) {
        const minLength = field.errors['minlength'].requiredLength;
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must have at least ${minLength} characters`;
      }
      if (field.errors['maxlength']) {
        const maxLength = field.errors['maxlength'].requiredLength;
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} cannot exceed ${maxLength} characters`;
      }
      if (field.errors['whitespace']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} cannot be only whitespace`;
      }
    }
    return '';
  }

  onSubmit() {
    if (this.categoryForm.valid && this.mode !== 'view') {
      const formValue = this.categoryForm.value;
      const categoryData: Omit<ICategory, 'id' | 'createdAt'> = {
        name: formValue.name?.trim(),
        description: formValue.description?.trim() || undefined
      };
      
      console.log('Form submitted:', categoryData);
      this.save.emit(categoryData);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.categoryForm.controls).forEach(key => {
        this.categoryForm.get(key)?.markAsTouched();
      });
    }
  }

  onModalClose() {
    this.close.emit();
  }

}
