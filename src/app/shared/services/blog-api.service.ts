import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../public/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BlogApiService {
  private apiUrl = `${environment.URL}/blogs`;

  constructor(private http: HttpClient) {}

  getBlogs(filters?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  getBlogById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  getBlogBySlug(slug: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${slug}`);
  }

  createBlog(blogData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, blogData);
  }

  updateBlog(id: string, blogData: any): Observable<any> {
    console.log('Making PUT request to:', `${this.apiUrl}/${id}`);
    console.log('With data:', blogData);
    const headers = { 'Content-Type': 'application/json' };
    return this.http.put(`${this.apiUrl}/${id}`, blogData, { headers });
  }



  deleteBlog(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}