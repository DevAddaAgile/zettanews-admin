import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TagApiService } from '../../shared/services/tag-api.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-tag',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit {
  @Input() tagType: string = '';
  tags: any[] = [];
  filteredTags: any[] = [];
  loading = false;
  tagForm: FormGroup;
  isEditing = false;
  currentTagId: string | null = null;
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
    private tagService: TagApiService,
    private fb: FormBuilder
  ) {
    this.tagForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      slug: [''],
      status: [1, Validators.required]
    });
  }
  
  ngOnInit(): void {
    this.loadTags();
    this.setupSearch();
  }
  
  setupSearch(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.filterTags(searchTerm);
    });
  }
  
  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.searchSubject.next(term);
  }
  
  filterTags(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.filteredTags = [...this.tags];
    } else {
      this.filteredTags = this.tags.filter(tag =>
        tag.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    this.updatePagination();
  }
  
  loadTags(): void {
    this.loading = true;
    this.clearMessages();
    this.tagService.getTags().subscribe({
      next: (response) => {
        console.log('Tags response:', response);
        this.tags = response.data || response.tags || [];
        this.filteredTags = [...this.tags];
        this.updatePagination();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading tags:', error);
        this.errorMessage = 'Failed to load tags. Please try again.';
        this.loading = false;
      }
    });
  }
  
  onNameChange(event: any): void {
    const name = event.target.value;
    if (name && !this.isEditing) {
      const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      this.tagForm.patchValue({ slug });
    }
  }
  
  onSubmit(): void {
    if (this.tagForm.invalid) {
      this.markFormGroupTouched();
      return;
    }
    
    const tagData = this.tagForm.value;
    // Ensure slug is generated if empty
    if (!tagData.slug && tagData.name) {
      tagData.slug = tagData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    this.clearMessages();
    
    if (this.isEditing && this.currentTagId) {
      this.tagService.updateTag(this.currentTagId, tagData).subscribe({
        next: () => {
          this.successMessage = 'Tag updated successfully!';
          this.loadTags();
          this.resetForm();
          this.hideMessageAfterDelay();
        },
        error: (error) => {
          console.error('Error updating tag:', error);
          this.errorMessage = 'Failed to update tag. Please try again.';
        }
      });
    } else {
      this.tagService.createTag(tagData).subscribe({
        next: () => {
          this.successMessage = 'Tag created successfully!';
          this.loadTags();
          this.resetForm();
          this.hideMessageAfterDelay();
        },
        error: (error) => {
          console.error('Error creating tag:', error);
          this.errorMessage = 'Failed to create tag. Please try again.';
        }
      });
    }
  }
  
  editTag(tag: any): void {
    this.isEditing = true;
    this.currentTagId = tag._id || tag.id;
    this.showForm = true;
    
    this.tagForm.patchValue({
      name: tag.name,
      slug: tag.slug || '',
      status: tag.status !== undefined ? tag.status : 1
    });
  }
  
  deleteTag(id: string): void {
    if (confirm('Are you sure you want to delete this tag?')) {
      this.clearMessages();
      this.tagService.deleteTag(id).subscribe({
        next: () => {
          this.successMessage = 'Tag deleted successfully!';
          this.loadTags();
          this.hideMessageAfterDelay();
        },
        error: (error) => {
          console.error('Error deleting tag:', error);
          this.errorMessage = 'Failed to delete tag. Please try again.';
        }
      });
    }
  }
  
  resetForm(): void {
    this.isEditing = false;
    this.currentTagId = null;
    this.showForm = false;
    this.tagForm.reset({
      name: '',
      slug: '',
      status: 1
    });
  }
  
  createNewTag(): void {
    this.resetForm();
    this.showForm = true;
    this.tagForm.patchValue({ status: 1 });
  }
  
  // Pagination methods
  updatePagination(): void {
    this.totalItems = this.filteredTags.length;
    this.currentPage = 1;
  }
  
  get paginatedTags(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredTags.slice(startIndex, endIndex);
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
    Object.keys(this.tagForm.controls).forEach(key => {
      this.tagForm.get(key)?.markAsTouched();
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
    const field = this.tagForm.get(fieldName);
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