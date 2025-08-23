import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CategoryApiService } from '../../shared/services/category-api.service';
import { Category, CreateCategoryRequest } from '../../shared/interface/category.interface';
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
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  loading = false;
  categoryForm: FormGroup;
  isEditing = false;
  currentCategoryId: string | null = null;
  showForm = false;
  searchTerm = '';
  private searchSubject = new Subject<string>();
  
  // File uploads
  selectedIcon: { original_url: string; filename: string } | null = null;
  selectedImage: { original_url: string; filename: string } | null = null;
  iconPreview: string | null = null;
  imagePreview: string | null = null;
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  
  // Messages
  successMessage = '';
  errorMessage = '';
  
  // Expanded categories tracking
  expandedCategories: Set<string> = new Set();
  
  constructor(
    private categoryService: CategoryApiService,
    private fb: FormBuilder
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      slug: [''],
      description: [''],
      parent: [null],
      status: [1]
    });
  }
  
  ngOnInit(): void {
    this.loadCategories();
    this.setupSearch();
    this.expandAllCategories();
  }
  
  // Expand all categories by default
  expandAllCategories(): void {
    this.categories.forEach(category => {
      if (this.hasSubcategories(category)) {
        this.expandedCategories.add((category._id || category.id || '').toString());
      }
    });
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
        this.expandAllCategories(); // Expand all categories after loading
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.errorMessage = 'Failed to load categories. Please try again.';
        this.loading = false;
      }
    });
  }
  
  // Get all categories including subcategories for pagination
  get allCategoriesFlat(): Category[] {
    const allCategories: Category[] = [];
    
    this.filteredCategories.forEach(category => {
      // Add root category
      allCategories.push(category);
      
      // Add subcategories if they exist
      if (category.subcategories && category.subcategories.length > 0) {
        category.subcategories.forEach(subcategory => {
          // Add parent reference to subcategory for proper display
          subcategory.parent = category._id || category.id?.toString() || '';
          allCategories.push(subcategory);
        });
      }
    });
    
    return allCategories;
  }
  
  onNameChange(event: any): void {
    const name = event.target.value;
    if (name && !this.isEditing) {
      const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      this.categoryForm.patchValue({ slug });
    }
  }
  
  onIconSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (this.validateFile(file, 'icon')) {
        this.convertFileToBase64(file, 'icon');
      }
    }
  }
  
  onImageSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (this.validateFile(file, 'image')) {
        this.convertFileToBase64(file, 'image');
      }
    }
  }
  
  private convertFileToBase64(file: File, type: 'icon' | 'image'): void {
    const img = new Image();
    img.onload = () => {
      // Set max dimensions based on type
      const maxWidth = type === 'icon' ? 64 : 400;
      const maxHeight = type === 'icon' ? 64 : 300;
      
      if (img.width > maxWidth || img.height > maxHeight) {
        this.errorMessage = `${type.charAt(0).toUpperCase() + type.slice(1)} dimensions cannot exceed ${maxWidth}x${maxHeight}px. Current: ${img.width}x${img.height}px`;
        this.hideMessageAfterDelay();
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        
        if (type === 'icon') {
          this.iconPreview = base64;
          this.selectedIcon = {
            original_url: base64,
            filename: file.name
          };
        } else {
          this.imagePreview = base64;
          this.selectedImage = {
            original_url: base64,
            filename: file.name
          };
        }
      };
      reader.readAsDataURL(file);
    };
    img.src = URL.createObjectURL(file);
  }
  
  private validateFile(file: File, type: 'icon' | 'image'): boolean {
    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      this.errorMessage = `${type.charAt(0).toUpperCase() + type.slice(1)} file size must be less than 5MB`;
      this.hideMessageAfterDelay();
      return false;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      this.errorMessage = `${type.charAt(0).toUpperCase() + type.slice(1)} must be an image file`;
      this.hideMessageAfterDelay();
      return false;
    }
    
    return true;
  }
  
  createIconPreview(file: File): void {
    // This method is no longer needed as we're using convertFileToBase64
  }
  
  createImagePreview(file: File): void {
    // This method is no longer needed as we're using convertFileToBase64
  }
  
  removeIcon(): void {
    this.selectedIcon = null;
    this.iconPreview = null;
  }
  
  removeImage(): void {
    this.selectedImage = null;
    this.imagePreview = null;
  }
  
  onSubmit(): void {
    if (this.categoryForm.invalid) {
      this.markFormGroupTouched();
      return;
    }
    
    const formValue = this.categoryForm.value;
    const categoryData: CreateCategoryRequest = {
      name: formValue.name,
      slug: formValue.slug || formValue.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      description: formValue.description,
      parent: formValue.parent,
      icon: this.selectedIcon,
      image: this.selectedImage,
      status: formValue.status
    };
    
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
  
  editCategory(category: Category): void {
    this.isEditing = true;
    this.currentCategoryId = category._id || category.id?.toString() || '';
    this.showForm = true;
    
    // Reset file selections
    this.selectedIcon = null;
    this.selectedImage = null;
    this.iconPreview = category.icon?.original_url || null;
    this.imagePreview = category.image?.original_url || null;
    
    this.categoryForm.patchValue({
      name: category.name,
      slug: category.slug || '',
      description: category.description || '',
      parent: category.parent || null,
      status: category.status || 1
    });
  }
  
  deleteCategory(id: string | number): void {
    const categoryId = typeof id === 'number' ? id.toString() : id;
    if (confirm('Are you sure you want to delete this category?')) {
      this.clearMessages();
      this.categoryService.deleteCategory(categoryId).subscribe({
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
    this.selectedIcon = null;
    this.selectedImage = null;
    this.iconPreview = null;
    this.imagePreview = null;
    this.categoryForm.reset();
    this.categoryForm.patchValue({ status: 1 });
  }
  
  createNewCategory(): void {
    this.resetForm();
    this.showForm = true;
  }
  
  // Pagination methods
  updatePagination(): void {
    this.totalItems = this.allCategoriesFlat.length;
    this.currentPage = 1;
  }
  
  get paginatedCategories(): Category[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    
    // Get the root categories that should be displayed on this page
    const allCategories = this.allCategoriesFlat;
    const pageItems = allCategories.slice(startIndex, endIndex);
    
    // Group items by root category for proper display
    const rootCategories = this.filteredCategories.filter(category => {
      const categoryIndex = allCategories.findIndex(cat => 
        (cat._id === category._id || cat.id === category.id)
      );
      return categoryIndex >= startIndex && categoryIndex < endIndex;
    });
    
    return rootCategories;
  }
  
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }
  
  get totalSubcategories(): number {
    return this.categories.reduce((total, category) => {
      return total + (category.subcategories?.length || 0);
    }, 0);
  }
  
  get rootCategories(): Category[] {
    return this.categories.filter(category => !category.parent);
  }
  
  get availableParentCategories(): Category[] {
    if (!this.isEditing || !this.currentCategoryId) {
      return this.rootCategories;
    }
    
    // When editing, exclude the current category and its descendants
    return this.categories.filter(category => {
      if (category._id === this.currentCategoryId || category.id?.toString() === this.currentCategoryId) {
        return false;
      }
      // Also exclude if this category is a descendant of the current category
      return !this.isDescendant(category, this.currentCategoryId);
    });
  }
  
  private isDescendant(category: Category, parentId: string): boolean {
    if (!category.parent) return false;
    if (category.parent === parentId) return true;
    
    const parent = this.categories.find(cat => cat._id === category.parent || cat.id?.toString() === category.parent);
    return parent ? this.isDescendant(parent, parentId) : false;
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
  
  trackByFn(index: number, item: Category): any {
    return item._id || item.id || index;
  }
  
  getParentName(parentId: string): string {
    const parentCategory = this.categories.find(cat => cat._id === parentId || cat.id?.toString() === parentId);
    return parentCategory ? parentCategory.name : 'Unknown Parent';
  }
  
  // Make Math available in template
  Math = Math;

  toggleCategoryExpansion(categoryId: string): void {
    if (this.expandedCategories.has(categoryId)) {
      this.expandedCategories.delete(categoryId);
    } else {
      this.expandedCategories.add(categoryId);
    }
  }

  isCategoryExpanded(categoryId: string): boolean {
    return this.expandedCategories.has(categoryId);
  }

  hasSubcategories(category: Category): boolean {
    return category.subcategories && category.subcategories.length > 0;
  }
  
  toggleAllCategories(): void {
    if (this.expandedCategories.size > 0) {
      // Collapse all
      this.expandedCategories.clear();
    } else {
      // Expand all
      this.expandAllCategories();
    }
  }
}