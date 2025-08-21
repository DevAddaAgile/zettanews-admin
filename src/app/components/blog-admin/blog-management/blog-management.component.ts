import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlogApiService } from '../../../shared/services/blog-api.service';
import { TagApiService } from '../../../shared/services/tag-api.service';
import { CategoryApiService } from '../../../shared/services/category-api.service';

interface Blog {
  _id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  featuredImage?: string;
  tags?: any[];
  categories?: any[];
  published: boolean;
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

@Component({
  selector: 'app-blog-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './blog-management.component.html',
  styleUrls: ['./blog-management.component.scss']
})
export class BlogManagementComponent implements OnInit {
  blogs: Blog[] = [];
  tags: any[] = [];
  categories: any[] = [];
  loading = false;
  tagsLoading = false;
  categoriesLoading = false;
  blogForm: FormGroup;
  isEditing = false;
  currentBlogId: string | null = null;
  showForm = false;
  
  constructor(
    private blogService: BlogApiService,
    private tagService: TagApiService,
    private categoryService: CategoryApiService,
    private fb: FormBuilder
  ) {
    this.blogForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      content: ['', [Validators.required, Validators.minLength(20)]],
      excerpt: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      featuredImage: [''],
      tags: [[]],
      categories: [[]],
      author: ['Admin'], // Default author
      published: [false]
    });
  }
  
  ngOnInit(): void {
    this.loadBlogs();
    this.loadTags();
    this.loadCategories();
  }
  
  loadTags(): void {
    this.tagsLoading = true;
    this.tagService.getTags().subscribe({
      next: (response) => {
        this.tags = response.tags;
        this.tagsLoading = false;
      },
      error: (error) => {
        console.error('Error loading tags:', error);
        this.tagsLoading = false;
      }
    });
  }
  
  loadCategories(): void {
    this.categoriesLoading = true;
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.categories;
        this.categoriesLoading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.categoriesLoading = false;
      }
    });
  }
  
  loadBlogs(): void {
    this.loading = true;
    this.blogService.getBlogs().subscribe({
      next: (response) => {
        this.blogs = response.data || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading blogs:', error);
        this.loading = false;
      }
    });
  }
  
  onSubmit(): void {
    if (this.blogForm.invalid) {
      return;
    }
    
    const blogData = this.blogForm.value;
    
    // Create or update blog directly
    this.saveBlog(blogData);
  }
  
  saveBlog(blogData: any): void {
    const processedBlogData = { ...blogData };
    
    // Convert tag IDs to tag objects
    if (processedBlogData.tags && processedBlogData.tags.length > 0) {
      processedBlogData.tags = processedBlogData.tags.map((tagId: string) => {
        const tag = this.tags.find(t => t._id === tagId);
        return tag ? { _id: tag._id, name: tag.name, slug: tag.slug } : null;
      }).filter(Boolean);
    } else {
      processedBlogData.tags = [];
    }
    
    // Convert category IDs to category objects
    if (processedBlogData.categories && processedBlogData.categories.length > 0) {
      processedBlogData.categories = processedBlogData.categories.map((catId: string) => {
        const category = this.categories.find(c => c._id === catId);
        return category ? { _id: category._id, name: category.name, slug: category.slug } : null;
      }).filter(Boolean);
    } else {
      processedBlogData.categories = [];
    }
    
    if (this.isEditing && this.currentBlogId) {
      this.blogService.updateBlog(this.currentBlogId, processedBlogData).subscribe({
        next: () => {
          this.loadBlogs();
          this.resetForm();
        },
        error: (error) => {
          console.error('Error updating blog:', error);
        }
      });
    } else {
      this.blogService.createBlog(processedBlogData).subscribe({
        next: () => {
          this.loadBlogs();
          this.resetForm();
        },
        error: (error) => {
          console.error('Error creating blog:', error);
        }
      });
    }
  }
  
  editBlog(blog: Blog): void {
    this.isEditing = true;
    this.currentBlogId = blog._id || null;
    this.showForm = true;
    
    this.blogForm.patchValue({
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt,
      author: blog.author,
      featuredImage: blog.featuredImage || '',
      tags: blog.tags?.map(tag => tag._id) || [],
      categories: blog.categories?.map(cat => cat._id) || [],
      published: blog.published
    });
  }
  
  deleteBlog(id: string): void {
    if (confirm('Are you sure you want to delete this blog?')) {
      this.blogService.deleteBlog(id).subscribe({
        next: () => {
          this.loadBlogs();
        },
        error: (error) => {
          console.error('Error deleting blog:', error);
        }
      });
    }
  }
  
  togglePublishStatus(blog: Blog): void {
    if (!blog._id) return;
    
    const updatedData = { ...blog, published: !blog.published };
    this.blogService.updateBlog(blog._id, updatedData).subscribe({
      next: () => {
        this.loadBlogs();
      },
      error: (error) => {
        console.error('Error toggling publish status:', error);
      }
    });
  }
  
  resetForm(): void {
    this.isEditing = false;
    this.currentBlogId = null;
    this.showForm = false;
    this.blogForm.reset({
      published: false
    });
  }
  
  createNewBlog(): void {
    this.resetForm();
    this.showForm = true;
  }
}