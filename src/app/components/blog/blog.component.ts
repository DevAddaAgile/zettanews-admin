import { Component, inject, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BlogApiService } from '../../shared/services/blog-api.service';
import { TranslateModule } from '@ngx-translate/core';
import { TableComponent } from '../../shared/components/ui/table/table.component';

import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
  standalone: true,
  imports: [RouterModule, TableComponent, TranslateModule, CommonModule]
})
export class BlogComponent {
  
  blogs: any[] = [];
  filteredBlogs: any[] = [];
  loading = false;
  
  @ViewChild('deleteModal') deleteModal: any;

  public tableConfig = {
    columns: [
      { title: "No.", dataField: "no", type: "no" },
      { title: "title", dataField: "title", sortable: true, sort_direction: 'desc' },
      { title: "created_at", dataField: "createdAt", type: "date", sortable: true, sort_direction: 'desc' },
      { title: "published", dataField: "published", type: "switch" },
    ],
    rowActions: [
      { label: "Edit", actionToPerform: "edit", icon: "ri-pencil-line" },
      { label: "Delete", actionToPerform: "delete", icon: "ri-delete-bin-line" },
    ],
    data: [] as any[],
    total: 0
  };

  constructor(
    private blogService: BlogApiService,
    public router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.loadBlogs();
  }

  loadBlogs() {
    this.loading = true;
    this.blogService.getBlogs().subscribe({
      next: (response) => {
        this.blogs = response.data || [];
        this.filteredBlogs = [...this.blogs];
        this.updateTableData();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading blogs:', error);
        this.loading = false;
      }
    });
  }

  updateTableData() {
    // Map data for table component
    this.tableConfig.data = this.filteredBlogs.map(blog => ({
      ...blog,
      published: blog.published ? '1' : '0' // Convert boolean to string for switch
    }));
    this.tableConfig.total = this.filteredBlogs.length;
  }

  onTableChange(data?: any) {
    console.log('Table change event received:', data);
    if (data && data.search !== undefined) {
      console.log('Search term:', data.search);
      this.filterBlogs(data.search);
    } else {
      this.loadBlogs();
    }
  }

  filterBlogs(searchTerm: string) {
    console.log('Filtering blogs with term:', searchTerm);
    if (!searchTerm || searchTerm.trim() === '') {
      this.filteredBlogs = [...this.blogs];
      console.log('No search term, showing all blogs:', this.filteredBlogs.length);
    } else {
      const term = searchTerm.toLowerCase().trim();
      this.filteredBlogs = this.blogs.filter(blog => 
        blog.title && blog.title.toLowerCase().includes(term)
      );
      console.log('Filtered blogs:', this.filteredBlogs.length);
    }
    this.updateTableData();
  }

  onActionClicked(action: any) {
    if(action.actionToPerform == 'edit')
      this.edit(action.data)
    else if(action.actionToPerform == 'published')
      this.togglePublished(action.data, action.value)
    else if(action.actionToPerform == 'delete')
      this.delete(action.data)
  }

  edit(data: any) {
    console.log('Editing blog:', data);
    this.router.navigateByUrl(`/blog/edit/${data._id}`);
  }

  togglePublished(data: any, value?: any) {
    const publishedValue = value !== undefined ? value === 1 : !data.published;
    const updatedData = {
      title: data.title,
      slug: data.slug,
      description: data.description,
      content: data.content,
      published: publishedValue,
      featured: data.featured,
      sticky: data.sticky,
      categories: data.categories || [],
      tags: data.tags || []
    };
    this.blogService.updateBlog(data._id, updatedData).subscribe({
      next: () => {
        this.modalService.dismissAll();
        // Reload blogs and reapply current filter
        this.loadBlogs();
      },
      error: (error) => {
        console.error('Error toggling published status:', error);
        this.modalService.dismissAll();
      }
    });
  }

  delete(data: any) {
    this.blogService.deleteBlog(data._id).subscribe({
      next: () => {
        this.modalService.dismissAll();
        // Reload blogs and reapply current filter
        this.loadBlogs();
      },
      error: (error) => {
        console.error('Error deleting blog:', error);
        this.modalService.dismissAll();
      }
    });
  }
}