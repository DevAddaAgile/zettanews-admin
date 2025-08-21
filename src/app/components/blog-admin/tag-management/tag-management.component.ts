import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TagApiService } from '../../../shared/services/tag-api.service';

interface Tag {
  _id?: string;
  name: string;
  slug: string;
}

@Component({
  selector: 'app-tag-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './tag-management.component.html',
  styleUrls: ['./tag-management.component.scss']
})
export class TagManagementComponent implements OnInit {
  tags: Tag[] = [];
  loading = false;
  tagForm: FormGroup;
  isEditing = false;
  currentTagId: string | null = null;
  showForm = false;
  
  constructor(
    private tagService: TagApiService,
    private fb: FormBuilder
  ) {
    this.tagForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]]
    });
  }
  
  ngOnInit(): void {
    this.loadTags();
  }
  
  loadTags(): void {
    this.loading = true;
    this.tagService.getTags().subscribe({
      next: (response) => {
        this.tags = response.tags;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading tags:', error);
        this.loading = false;
      }
    });
  }
  
  onSubmit(): void {
    if (this.tagForm.invalid) {
      return;
    }
    
    const tagData = this.tagForm.value;
    
    if (this.isEditing && this.currentTagId) {
      // Update existing tag
      this.tagService.updateTag(this.currentTagId, tagData).subscribe({
        next: () => {
          this.loadTags();
          this.resetForm();
        },
        error: (error) => {
          console.error('Error updating tag:', error);
        }
      });
    } else {
      // Create new tag
      this.tagService.createTag(tagData).subscribe({
        next: () => {
          this.loadTags();
          this.resetForm();
        },
        error: (error) => {
          console.error('Error creating tag:', error);
        }
      });
    }
  }
  
  editTag(tag: Tag): void {
    this.isEditing = true;
    this.currentTagId = tag._id || null;
    this.showForm = true;
    
    this.tagForm.patchValue({
      name: tag.name
    });
  }
  
  deleteTag(id: string): void {
    if (confirm('Are you sure you want to delete this tag?')) {
      this.tagService.deleteTag(id).subscribe({
        next: () => {
          this.loadTags();
        },
        error: (error) => {
          console.error('Error deleting tag:', error);
        }
      });
    }
  }
  
  resetForm(): void {
    this.isEditing = false;
    this.currentTagId = null;
    this.showForm = false;
    this.tagForm.reset();
  }
  
  createNewTag(): void {
    this.resetForm();
    this.showForm = true;
  }
}