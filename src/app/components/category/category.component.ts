import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CategoryApiService } from '../../shared/services/category-api.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  @Input() categoryType: string = '';
  categories: any[] = [];
  filteredCategories: any[] = [];
  loading = false;
  categoryForm: FormGroup;
  isEditing = false;
  currentCategoryId: string | null = null;
  showForm = false;
  searchTerm = '';
  private searchSubject = new Subject<string>();
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  
  // Messages
  successMessage = '';
  errorMessage = '';
  
  constructor(
    private categoryService: CategoryApiService,
    private fb: FormBuilder
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      slug: [''],
      description: [''],
      status: [1]
    });
  }
  
  ngOnInit(): void {
    this.loadCategories();
    this.setupSearch();
  }
  
  setupSearch(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.filterCategories(searchTerm);
    });
  }
  
  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.searchSubject.next(term);
  }
  
  filterCategories(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.filteredCategories = [...this.categories];
    } else {
      this.filteredCategories = this.categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    this.updatePagination();
  }
  
  loadCategories(): void {
    this.loading = true;
    this.clearMessages();
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        console.log('Categories response:', response);
        this.categories = response.categories || response.data || [];
        console.log('First category:', this.categories[0]);
        this.filteredCategories = [...this.categories];
        this.updatePagination();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.errorMessage = 'Failed to load categories. Please try again.';
        this.loading = false;
      }
    });
  }
  
  onNameChange(event: any): void {
    const name = event.target.value;
    if (name && !this.isEditing) {
      const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      this.categoryForm.patchValue({ slug });
    }
  }
  
  onSubmit(): void {
    if (this.categoryForm.invalid) {
      this.markFormGroupTouched();
      return;
    }
    
    const categoryData = this.categoryForm.value;
    // Ensure slug is generated if empty
    if (!categoryData.slug && categoryData.name) {
      categoryData.slug = categoryData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    this.clearMessages();
    
    if (this.isEditing && this.currentCategoryId) {
      this.categoryService.updateCategory(this.currentCategoryId, categoryData).subscribe({
        next: () => {
          this.successMessage = 'Category updated successfully!';
          this.loadCategories();
          this.resetForm();
          this.hideMessageAfterDelay();
        },
        error: (error) => {
          console.error('Error updating category:', error);
          this.errorMessage = 'Failed to update category. Please try again.';
        }
      });
    } else {
      this.categoryService.createCategory(categoryData).subscribe({
        next: () => {
          this.successMessage = 'Category created successfully!';
          this.loadCategories();
          this.resetForm();
          this.hideMessageAfterDelay();
        },
        error: (error) => {
          console.error('Error creating category:', error);
          this.errorMessage = 'Failed to create category. Please try again.';
        }
      });
    }
  }
  
  editCategory(category: any): void {
    this.isEditing = true;
    this.currentCategoryId = category._id || category.id;
    this.showForm = true;
    
    this.categoryForm.patchValue({
      name: category.name,
      slug: category.slug || '',
      description: category.description || '',
      status: category.status || 1
    });
  }
  
  deleteCategory(id: string): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.clearMessages();
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.successMessage = 'Category deleted successfully!';
          this.loadCategories();
          this.hideMessageAfterDelay();
        },
        error: (error) => {
          console.error('Error deleting category:', error);
          this.errorMessage = 'Failed to delete category. Please try again.';
        }
      });
    }
  }
  
  resetForm(): void {
    this.isEditing = false;
    this.currentCategoryId = null;
    this.showForm = false;
    this.categoryForm.reset();
  }
  
  createNewCategory(): void {
    this.resetForm();
    this.showForm = true;
  }
  
  // Pagination methods
  updatePagination(): void {
    this.totalItems = this.filteredCategories.length;
    this.currentPage = 1;
  }
  
  get paginatedCategories(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredCategories.slice(startIndex, endIndex);
  }
  
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }
  
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
  
  // Utility methods
  private markFormGroupTouched(): void {
    Object.keys(this.categoryForm.controls).forEach(key => {
      this.categoryForm.get(key)?.markAsTouched();
    });
  }
  
  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }
  
  private hideMessageAfterDelay(): void {
    setTimeout(() => {
      this.clearMessages();
    }, 3000);
  }
  
  getFieldError(fieldName: string): string {
    const field = this.categoryForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (field.errors['minlength']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
    }
    return '';
  }
  
  trackByFn(index: number, item: any): any {
    return item._id || item.id || index;
  }
  
  // Make Math available in template
  Math = Math;
}