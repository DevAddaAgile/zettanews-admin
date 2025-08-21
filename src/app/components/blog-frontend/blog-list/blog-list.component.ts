import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss']
})
export class BlogListComponent implements OnInit {
  blogs: Blog[] = [];
  loading = false;
  
  constructor(
    private blogService: BlogApiService
  ) {}
  
  ngOnInit(): void {
    this.loadBlogs();
  }
  
  loadBlogs(): void {
    this.loading = true;
    
    this.blogService.getBlogs({ published: 'true' }).subscribe({
      next: (response) => {
        this.blogs = response.blogs || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading blogs:', error);
        this.blogs = [];
        this.loading = false;
      }
    });
  }
}