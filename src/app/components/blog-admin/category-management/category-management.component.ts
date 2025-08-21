import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryApiService } from '../../../shared/services/category-api.service';

interface Category {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
}

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.scss']
})
export class CategoryManagementComponent implements OnInit {
  categories: Category[] = [];
  loading = false;
  categoryForm: FormGroup;
  isEditing = false;
  currentCategoryId: string | null = null;
  showForm = false;
  
  constructor(
    private categoryService: CategoryApiService,
    private fb: FormBuilder
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['']
    });
  }
  
  ngOnInit(): void {
    this.loadCategories();
  }
  
  loadCategories(): void {
    this.loading = true;
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.categories;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.loading = false;
      }
    });
  }
  
  onSubmit(): void {
    if (this.categoryForm.invalid) {
      return;
    }
    
    const categoryData = this.categoryForm.value;
    
    if (this.isEditing && this.currentCategoryId) {
      // Update existing category
      this.categoryService.updateCategory(this.currentCategoryId, categoryData).subscribe({
        next: () => {
          this.loadCategories();
          this.resetForm();
        },
        error: (error) => {
          console.error('Error updating category:', error);
        }
      });
    } else {
      // Create new category
      this.categoryService.createCategory(categoryData).subscribe({
        next: () => {
          this.loadCategories();
          this.resetForm();
        },
        error: (error) => {
          console.error('Error creating category:', error);
        }
      });
    }
  }
  
  editCategory(category: Category): void {
    this.isEditing = true;
    this.currentCategoryId = category._id || null;
    this.showForm = true;
    
    this.categoryForm.patchValue({
      name: category.name,
      description: category.description || ''
    });
  }
  
  deleteCategory(id: string): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.loadCategories();
        },
        error: (error) => {
          console.error('Error deleting category:', error);
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
}