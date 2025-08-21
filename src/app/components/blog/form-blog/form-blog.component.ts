import { Component, Inject, Input, PLATFORM_ID, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgxEditorModule, Editor, Toolbar } from 'ngx-editor';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { AdvancedDropdownComponent } from '../../../shared/components/ui/advanced-dropdown/advanced-dropdown.component';

import { FormFieldsComponent } from '../../../shared/components/ui/form-fields/form-fields.component';
import { BlogApiService } from '../../../shared/services/blog-api.service';
import { TagApiService } from '../../../shared/services/tag-api.service';
import { CategoryApiService } from '../../../shared/services/category-api.service';


@Component({
  selector: 'app-form-blog',
  templateUrl: './form-blog.component.html',
  styleUrls: ['./form-blog.component.scss'],
  imports: [ReactiveFormsModule, FormFieldsComponent, AdvancedDropdownComponent, ButtonComponent, CommonModule, TranslateModule, NgxEditorModule]
})
export class FormBlogComponent implements OnInit, OnDestroy {

  @Input() type: string = '';

  public form: FormGroup;
  public id: string = '';
  public selectedCategories: number[] = [];
  public selectedTags: number[] = [];

  public isBrowser: boolean;
  public editor: Editor;
  public toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];
  public categories: any[] = [];
  public tags: any[] = [];
  public html = '';
  public thumbnailPreview: string | null = null;
  public metaImagePreview: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private blogService: BlogApiService,
    private tagService: TagApiService,
    private categoryService: CategoryApiService,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    this.form = this.formBuilder.group({
      title: new FormControl('', [Validators.required]),
      slug: new FormControl(''),
      description: new FormControl(''),
      content: new FormControl(''),
      metaTitle: new FormControl(),
      metaDescription: new FormControl(),
      metaImage: new FormControl(),
      thumbnail: new FormControl(),
      categories: new FormControl([]),
      tags: new FormControl([]),
      featured: new FormControl(false),
      sticky: new FormControl(false),
      published: new FormControl(false)
    });
  }

  ngOnInit() {
    // Initialize editor only in browser
    if (this.isBrowser) {
      this.editor = new Editor();
    }

    // Load categories and tags first
    this.loadCategoriesAndTags();

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.id = params['id'];
        this.type = 'edit';
        // Wait a bit for categories and tags to load, then load blog
        setTimeout(() => {
          this.loadBlog(this.id);
        }, 100);
      }
    });
  }

  loadCategoriesAndTags() {
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        this.categories = (response.categories || response.data || []).map((cat: any, index: number) => ({
          id: index + 1,
          name: cat.name,
          _id: cat._id || cat.id
        }));
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.categories = [];
      }
    });

    this.tagService.getTags().subscribe({
      next: (response) => {
        this.tags = (response.tags || response.data || []).map((tag: any, index: number) => ({
          id: index + 1,
          name: tag.name,
          _id: tag._id || tag.id
        }));
      },
      error: (error) => {
        console.error('Error loading tags:', error);
        this.tags = [];
      }
    });
  }

  loadBlog(id: string) {
    this.blogService.getBlogById(id).subscribe({
      next: (response) => {
        const blog = response.data || response;
        if (blog) {
          // Handle categories - map to dropdown IDs
          this.selectedCategories = (blog.categories || []).map((cat: any) => {
            const categoryName = typeof cat === 'object' ? cat.name : cat;
            const category = this.categories.find(c => c.name === categoryName);
            return category ? category.id : null;
          }).filter((id: number | null) => id !== null);
          
          // Handle tags - map to dropdown IDs
          this.selectedTags = (blog.tags || []).map((tag: any) => {
            const tagName = typeof tag === 'object' ? tag.name : tag;
            const foundTag = this.tags.find(t => t.name === tagName);
            return foundTag ? foundTag.id : null;
          }).filter((id: number | null) => id !== null);
          
          this.form.patchValue({
            title: blog.title,
            slug: blog.slug || '',
            description: blog.description,
            content: blog.content,
            thumbnail: blog.thumbnail,
            categories: this.selectedCategories,
            tags: this.selectedTags,
            metaTitle: blog.metaTitle,
            metaDescription: blog.metaDescription,
            metaImage: blog.metaImage,
            featured: blog.featured || false,
            sticky: blog.sticky || false,
            published: blog.published || false
          });
          
          // Set preview images - handle both object and string formats
          if (blog.thumbnail) {
            this.thumbnailPreview = typeof blog.thumbnail === 'object' ? 
              blog.thumbnail.original_url : blog.thumbnail;
          }
          if (blog.metaImage) {
            this.metaImagePreview = typeof blog.metaImage === 'object' ? 
              blog.metaImage.original_url : blog.metaImage;
          }
        }
      },
      error: (error) => {
        console.error('Error loading blog:', error);
        this.router.navigateByUrl('/blog');
      }
    });
  }

  selectThumbnail(data: any) {
    this.form.controls['thumbnail'].setValue(data ? data.url : '');
  }



  selectCategoryItem(data: number[]) {
    this.selectedCategories = data;
    this.form.controls['categories'].setValue(data);
  }

  selectTagItem(data: number[]) {
    this.selectedTags = data;
    this.form.controls['tags'].setValue(data);
  }

  onThumbnailSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const maxSize = 2 * 1024 * 1024; // 2MB in bytes
      
      if (file.size > maxSize) {
        alert('Thumbnail image size cannot exceed 2MB. Please choose a smaller file.');
        input.value = '';
        return;
      }
      
      const img = new Image();
      img.onload = () => {
        const maxWidth = 1500;
        const maxHeight = 700;
        
        if (img.width > maxWidth || img.height > maxHeight) {
          alert(`Thumbnail dimensions cannot exceed ${maxWidth}x${maxHeight}px. Current: ${img.width}x${img.height}px`);
          input.value = '';
          return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target?.result as string;
          this.thumbnailPreview = base64;
          this.form.controls['thumbnail'].setValue({
            original_url: base64,
            filename: file.name
          });
        };
        reader.readAsDataURL(file);
      };
      img.src = URL.createObjectURL(file);
    }
  }

  onMetaImageSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const maxSize = 1 * 1024 * 1024; // 1MB in bytes
      
      if (file.size > maxSize) {
        alert('Meta image size cannot exceed 1MB. Please choose a smaller file.');
        input.value = '';
        return;
      }
      
      const img = new Image();
      img.onload = () => {
        const maxWidth = 1200;
        const maxHeight = 630;
        
        if (img.width > maxWidth || img.height > maxHeight) {
          alert(`Meta image dimensions cannot exceed ${maxWidth}x${maxHeight}px. Current: ${img.width}x${img.height}px`);
          input.value = '';
          return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target?.result as string;
          this.metaImagePreview = base64;
          this.form.controls['metaImage'].setValue({
            original_url: base64,
            filename: file.name
          });
        };
        reader.readAsDataURL(file);
      };
      img.src = URL.createObjectURL(file);
    }
  }

  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  submit() {
    this.form.markAllAsTouched();
    
    if (this.form.valid) {
      const blogData = { ...this.form.value };
      
      // Generate slug from title if slug is empty
      if (blogData.title && !blogData.slug) {
        blogData.slug = this.generateSlug(blogData.title);
      }
      
      // Convert category and tag IDs to MongoDB _id values
      blogData.categories = (blogData.categories || []).map((catId: number) => {
        const category = this.categories.find(c => c.id === catId);
        return category ? category._id : null;
      }).filter(id => id);
      
      blogData.tags = (blogData.tags || []).map((tagId: number) => {
        const tag = this.tags.find(t => t.id === tagId);
        return tag ? tag._id : null;
      }).filter(id => id);

      if (this.type === 'edit' && this.id) {
        this.blogService.updateBlog(this.id, blogData).subscribe({
          next: () => {
            alert('Blog updated successfully!');
            this.router.navigateByUrl('/blog');
          },
          error: (error) => {
            console.error('Error updating blog:', error);
            alert('Error updating blog. Please try again.');
          }
        });
      } else {
        this.blogService.createBlog(blogData).subscribe({
          next: () => {
            alert('Blog created successfully!');
            this.router.navigateByUrl('/blog');
          },
          error: (error) => {
            console.error('Error creating blog:', error);
            alert('Error creating blog. Please try again.');
          }
        });
      }
    }
  }

  deleteBlog() {
    if (this.type === 'edit' && this.id) {
      const title = this.form.get('title')?.value || 'this blog';
      if (confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
        this.blogService.deleteBlog(this.id).subscribe({
          next: () => {
            alert('Blog deleted successfully!');
            this.router.navigateByUrl('/blog');
          },
          error: (error) => {
            console.error('Error deleting blog:', error);
            alert('Error deleting blog. Please try again.');
          }
        });
      }
    }
  }

  ngOnDestroy() {
    if (this.editor) {
      this.editor.destroy();
    }
  }
}