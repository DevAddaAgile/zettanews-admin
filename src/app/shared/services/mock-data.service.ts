import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  // Mock settings
  private settings = {
    site_name: 'Fastkart Blog',
    site_title: 'Fastkart Blog System',
    site_description: 'A simple blog system built with Angular and Express',
    site_logo: 'assets/images/logo.png',
    site_favicon: 'assets/images/favicon.ico',
    site_email: 'info@fastkart.com',
    site_phone: '+1 123 456 7890',
    site_address: '123 Street, City, Country',
    social_links: {
      facebook: 'https://facebook.com',
      twitter: 'https://twitter.com',
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com'
    },
    meta: {
      meta_title: 'Fastkart Blog',
      meta_description: 'A simple blog system built with Angular and Express',
      meta_keywords: 'blog, angular, express, mongodb'
    }
  };

  // Mock blogs
  private blogs = [
    {
      _id: '1',
      title: 'Getting Started with Angular',
      slug: 'getting-started-with-angular',
      content: '<p>This is a comprehensive guide to getting started with Angular framework.</p><p>Angular is a platform and framework for building single-page client applications using HTML and TypeScript.</p>',
      excerpt: 'Learn the basics of Angular framework',
      author: 'John Doe',
      featuredImage: 'https://via.placeholder.com/800x400?text=Angular',
      tags: [{ _id: '1', name: 'Angular', slug: 'angular' }],
      categories: [{ _id: '1', name: 'Frontend', slug: 'frontend' }],
      published: true,
      publishedAt: new Date('2023-01-15'),
      createdAt: new Date('2023-01-10'),
      updatedAt: new Date('2023-01-15')
    },
    {
      _id: '2',
      title: 'Introduction to Express.js',
      slug: 'introduction-to-expressjs',
      content: '<p>Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.</p><p>In this blog, we will explore the basics of Express.js and how to create a simple server.</p>',
      excerpt: 'Learn about Express.js framework for Node.js',
      author: 'Jane Smith',
      featuredImage: 'https://via.placeholder.com/800x400?text=Express.js',
      tags: [{ _id: '2', name: 'Express', slug: 'express' }, { _id: '4', name: 'Node.js', slug: 'nodejs' }],
      categories: [{ _id: '2', name: 'Backend', slug: 'backend' }],
      published: true,
      publishedAt: new Date('2023-02-20'),
      createdAt: new Date('2023-02-15'),
      updatedAt: new Date('2023-02-20')
    },
    {
      _id: '3',
      title: 'MongoDB Basics',
      slug: 'mongodb-basics',
      content: '<p>MongoDB is a source-available cross-platform document-oriented database program. Classified as a NoSQL database program, MongoDB uses JSON-like documents with optional schemas.</p><p>In this blog, we will learn the basics of MongoDB and how to perform CRUD operations.</p>',
      excerpt: 'Introduction to MongoDB database',
      author: 'Mike Johnson',
      featuredImage: 'https://via.placeholder.com/800x400?text=MongoDB',
      tags: [{ _id: '3', name: 'MongoDB', slug: 'mongodb' }],
      categories: [{ _id: '3', name: 'Database', slug: 'database' }],
      published: true,
      publishedAt: new Date('2023-03-10'),
      createdAt: new Date('2023-03-05'),
      updatedAt: new Date('2023-03-10')
    },
    {
      _id: '4',
      title: 'JavaScript ES6 Features',
      slug: 'javascript-es6-features',
      content: '<p>ECMAScript 2015 or ES6 introduced many new features to JavaScript that make the code more modern and readable.</p><p>In this blog, we will explore arrow functions, template literals, destructuring, and more.</p>',
      excerpt: 'Learn about modern JavaScript features',
      author: 'Sarah Johnson',
      featuredImage: 'https://via.placeholder.com/800x400?text=JavaScript',
      tags: [{ _id: '5', name: 'JavaScript', slug: 'javascript' }],
      categories: [{ _id: '1', name: 'Frontend', slug: 'frontend' }],
      published: true,
      publishedAt: new Date('2023-04-15'),
      createdAt: new Date('2023-04-10'),
      updatedAt: new Date('2023-04-15')
    },
    {
      _id: '5',
      title: 'Node.js Best Practices',
      slug: 'nodejs-best-practices',
      content: '<p>Node.js is a powerful JavaScript runtime that allows developers to build scalable server-side applications.</p><p>This blog covers best practices for structuring your Node.js applications, error handling, and performance optimization.</p>',
      excerpt: 'Learn how to write better Node.js applications',
      author: 'David Wilson',
      featuredImage: 'https://via.placeholder.com/800x400?text=Node.js',
      tags: [{ _id: '4', name: 'Node.js', slug: 'nodejs' }, { _id: '5', name: 'JavaScript', slug: 'javascript' }],
      categories: [{ _id: '2', name: 'Backend', slug: 'backend' }],
      published: true,
      publishedAt: new Date('2023-05-20'),
      createdAt: new Date('2023-05-15'),
      updatedAt: new Date('2023-05-20')
    }
  ];

  // Mock tags
  private tags = [
    { _id: '1', name: 'Angular', slug: 'angular' },
    { _id: '2', name: 'Express', slug: 'express' },
    { _id: '3', name: 'MongoDB', slug: 'mongodb' },
    { _id: '4', name: 'Node.js', slug: 'nodejs' },
    { _id: '5', name: 'JavaScript', slug: 'javascript' }
  ];

  // Mock categories
  private categories = [
    { _id: '1', name: 'Frontend', slug: 'frontend', description: 'Frontend development topics' },
    { _id: '2', name: 'Backend', slug: 'backend', description: 'Backend development topics' },
    { _id: '3', name: 'Database', slug: 'database', description: 'Database related topics' },
    { _id: '4', name: 'DevOps', slug: 'devops', description: 'DevOps and deployment topics' }
  ];

  // Blog methods
  getBlogs(filters?: any): Observable<any> {
    let filteredBlogs = [...this.blogs];
    
    if (filters && filters.published !== undefined) {
      filteredBlogs = filteredBlogs.filter(blog => blog.published === (filters.published === 'true'));
    }
    
    return of({ blogs: filteredBlogs });
  }
  
  createBlog(blogData: any): Observable<any> {
    // Process tags and categories
    const blogTags = blogData.tags?.map((tagId: string) => 
      this.tags.find(tag => tag._id === tagId)
    ).filter(Boolean) || [];
    
    const blogCategories = blogData.categories?.map((catId: string) => 
      this.categories.find(cat => cat._id === catId)
    ).filter(Boolean) || [];
    
    // Create a new blog with a generated ID
    const now = new Date();
    const newBlog = {
      _id: Math.random().toString(36).substring(2, 15),
      slug: blogData.title.toLowerCase().replace(/\s+/g, '-'),
      title: blogData.title,
      content: blogData.content,
      excerpt: blogData.excerpt,
      author: blogData.author || 'Admin',
      featuredImage: blogData.featuredImage || 'https://via.placeholder.com/800x400?text=Blog',
      tags: blogTags,
      categories: blogCategories,
      published: blogData.published || false,
      publishedAt: blogData.published ? now : null,
      createdAt: now,
      updatedAt: now
    };
    
    // Add to blogs array
    this.blogs.unshift(newBlog); // Add to beginning of array for newest first
    
    return of({ message: 'Blog created successfully', blog: newBlog });
  }

  getBlogById(id: string): Observable<any> {
    const blog = this.blogs.find(b => b._id === id);
    return of({ blog });
  }

  getBlogBySlug(slug: string): Observable<any> {
    const blog = this.blogs.find(b => b.slug === slug);
    return of({ blog });
  }
  
  deleteBlog(id: string): Observable<any> {
    // Find blog index
    const blogIndex = this.blogs.findIndex(blog => blog._id === id);
    if (blogIndex === -1) {
      return of({ message: 'Blog not found', error: true });
    }
    
    // Remove blog from array
    this.blogs.splice(blogIndex, 1);
    
    return of({ message: 'Blog deleted successfully' });
  }
  
  togglePublishStatus(id: string): Observable<any> {
    // Find blog index
    const blogIndex = this.blogs.findIndex(blog => blog._id === id);
    if (blogIndex === -1) {
      return of({ message: 'Blog not found', error: true });
    }
    
    // Toggle published status
    this.blogs[blogIndex].published = !this.blogs[blogIndex].published;
    
    // Set publishedAt date if publishing for the first time
    if (this.blogs[blogIndex].published && !this.blogs[blogIndex].publishedAt) {
      this.blogs[blogIndex].publishedAt = new Date();
    }
    
    return of({ 
      message: `Blog ${this.blogs[blogIndex].published ? 'published' : 'unpublished'} successfully`,
      blog: this.blogs[blogIndex]
    });
  }
  
  updateBlog(id: string, blogData: any): Observable<any> {
    // Find blog index
    const blogIndex = this.blogs.findIndex(blog => blog._id === id);
    if (blogIndex === -1) {
      return of({ message: 'Blog not found', error: true });
    }
    
    // Process tags and categories
    const blogTags = blogData.tags?.map((tagId: string) => 
      this.tags.find(tag => tag._id === tagId)
    ).filter(Boolean) || [];
    
    const blogCategories = blogData.categories?.map((catId: string) => 
      this.categories.find(cat => cat._id === catId)
    ).filter(Boolean) || [];
    
    // Update blog
    const updatedBlog = {
      ...this.blogs[blogIndex],
      title: blogData.title || this.blogs[blogIndex].title,
      content: blogData.content || this.blogs[blogIndex].content,
      excerpt: blogData.excerpt || this.blogs[blogIndex].excerpt,
      author: blogData.author || this.blogs[blogIndex].author,
      featuredImage: blogData.featuredImage || this.blogs[blogIndex].featuredImage,
      tags: blogTags,
      categories: blogCategories,
      published: blogData.published !== undefined ? blogData.published : this.blogs[blogIndex].published,
      publishedAt: (!this.blogs[blogIndex].published && blogData.published) ? new Date() : this.blogs[blogIndex].publishedAt,
      updatedAt: new Date()
    };
    
    // Update slug if title changed
    if (blogData.title && blogData.title !== this.blogs[blogIndex].title) {
      updatedBlog.slug = blogData.title.toLowerCase().replace(/\s+/g, '-');
    }
    
    // Update blogs array
    this.blogs[blogIndex] = updatedBlog;
    
    return of({ message: 'Blog updated successfully', blog: updatedBlog });
  }

  // Tag methods
  getTags(): Observable<any> {
    return of({ tags: this.tags });
  }
  
  createTag(tagData: any): Observable<any> {
    // Create a new tag with a generated ID
    const newTag = {
      _id: Math.random().toString(36).substring(2, 15),
      name: tagData.name,
      slug: tagData.name.toLowerCase().replace(/\s+/g, '-')
    };
    
    // Add to tags array
    this.tags.push(newTag);
    
    return of({ message: 'Tag created successfully', tag: newTag });
  }
  
  updateTag(id: string, tagData: any): Observable<any> {
    // Find tag index
    const tagIndex = this.tags.findIndex(tag => tag._id === id);
    if (tagIndex === -1) {
      return of({ message: 'Tag not found', error: true });
    }
    
    // Update tag
    const updatedTag = {
      ...this.tags[tagIndex],
      name: tagData.name || this.tags[tagIndex].name,
      slug: tagData.name ? tagData.name.toLowerCase().replace(/\s+/g, '-') : this.tags[tagIndex].slug
    };
    
    // Update tags array
    this.tags[tagIndex] = updatedTag;
    
    return of({ message: 'Tag updated successfully', tag: updatedTag });
  }
  
  deleteTag(id: string): Observable<any> {
    // Find tag index
    const tagIndex = this.tags.findIndex(tag => tag._id === id);
    if (tagIndex === -1) {
      return of({ message: 'Tag not found', error: true });
    }
    
    // Remove tag from array
    this.tags.splice(tagIndex, 1);
    
    // Remove tag from all blogs
    this.blogs.forEach(blog => {
      if (blog.tags) {
        blog.tags = blog.tags.filter((tag: any) => tag._id !== id);
      }
    });
    
    return of({ message: 'Tag deleted successfully' });
  }

  // Category methods
  getCategories(): Observable<any> {
    return of({ categories: this.categories });
  }
  
  createCategory(categoryData: any): Observable<any> {
    // Create a new category with a generated ID
    const newCategory = {
      _id: Math.random().toString(36).substring(2, 15),
      name: categoryData.name,
      slug: categoryData.name.toLowerCase().replace(/\s+/g, '-'),
      description: categoryData.description || ''
    };
    
    // Add to categories array
    this.categories.push(newCategory);
    
    return of({ message: 'Category created successfully', category: newCategory });
  }
  
  updateCategory(id: string, categoryData: any): Observable<any> {
    // Find category index
    const categoryIndex = this.categories.findIndex(category => category._id === id);
    if (categoryIndex === -1) {
      return of({ message: 'Category not found', error: true });
    }
    
    // Update category
    const updatedCategory = {
      ...this.categories[categoryIndex],
      name: categoryData.name || this.categories[categoryIndex].name,
      description: categoryData.description !== undefined ? categoryData.description : this.categories[categoryIndex].description
    };
    
    // Update slug if name changed
    if (categoryData.name && categoryData.name !== this.categories[categoryIndex].name) {
      updatedCategory.slug = categoryData.name.toLowerCase().replace(/\s+/g, '-');
    }
    
    // Update categories array
    this.categories[categoryIndex] = updatedCategory;
    
    return of({ message: 'Category updated successfully', category: updatedCategory });
  }
  
  deleteCategory(id: string): Observable<any> {
    // Find category index
    const categoryIndex = this.categories.findIndex(category => category._id === id);
    if (categoryIndex === -1) {
      return of({ message: 'Category not found', error: true });
    }
    
    // Remove category from array
    this.categories.splice(categoryIndex, 1);
    
    // Remove category from all blogs
    this.blogs.forEach(blog => {
      if (blog.categories) {
        blog.categories = blog.categories.filter((category: any) => category._id !== id);
      }
    });
    
    return of({ message: 'Category deleted successfully' });
  }

  // Settings methods
  getSettings(): Observable<any> {
    return of(this.settings);
  }
  
  // Get setting option (for compatibility with existing code)
  getSettingOption(): Observable<any> {
    return of({ values: this.settings });
  }
  
  // Get backend setting option (for compatibility with existing code)
  getBackendSettingOption(): Observable<any> {
    return of({ values: this.settings });
  }

  // Auth methods
  login(credentials: any): Observable<any> {
    if (credentials.email === 'admin@example.com' && credentials.password === 'admin123') {
      return of({
        message: 'Login successful',
        token: 'mock-token',
        user: {
          id: 'admin1',
          name: 'Super Admin',
          email: 'admin@example.com',
          role: 'admin'
        }
      });
    } else if (credentials.email === 'user@example.com' && credentials.password === 'password123') {
      return of({
        message: 'Login successful',
        token: 'mock-token',
        user: {
          id: 'user1',
          name: 'Blog User',
          email: 'user@example.com',
          role: 'user'
        }
      });
    } else {
      throw new Error('Invalid email or password');
    }
  }
}