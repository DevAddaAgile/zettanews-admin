import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BlogApiService } from '../../../shared/services/blog-api.service';

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
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.scss']
})
export class BlogDetailComponent implements OnInit {
  blog: Blog | null = null;
  loading = false;
  error = '';
  
  constructor(
    private route: ActivatedRoute,
    private blogService: BlogApiService
  ) {}
  
  ngOnInit(): void {
    this.loading = true;
    
    const slug = this.route.snapshot.paramMap.get('slug');
    
    if (slug) {
      this.blogService.getBlogBySlug(slug).subscribe({
        next: (response) => {
          this.blog = response.blog;
          if (!this.blog) {
            this.error = 'Blog not found.';
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading blog:', error);
          this.error = 'Failed to load blog.';
          this.loading = false;
        }
      });
    } else {
      this.error = 'Blog not found.';
      this.loading = false;
    }
  }
}