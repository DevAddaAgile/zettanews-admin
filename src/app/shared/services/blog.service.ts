import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../public/environments/environment";
import { Params } from "../interface/core.interface";
import { BlogModel, Blog, Review } from "../interface/blog.interface";

@Injectable({
  providedIn: "root",
})
export class BlogService {

  constructor(private http: HttpClient) {}

  getBlogs(payload?: Params): Observable<{ success: boolean; data: Blog[] }> {
    return this.http.get<{ success: boolean; data: Blog[] }>(`${environment.URL}/blogs`, { params: payload });
  }

  getBlog(id: number): Observable<{ success: boolean; data: Blog }> {
    return this.http.get<{ success: boolean; data: Blog }>(`${environment.URL}/blogs/${id}`);
  }

  createBlog(payload: Partial<Blog>): Observable<{ success: boolean; data: Blog }> {
    return this.http.post<{ success: boolean; data: Blog }>(`${environment.URL}/blogs`, payload);
  }

  updateBlog(id: number, payload: Partial<Blog>): Observable<{ success: boolean; data: Blog }> {
    return this.http.put<{ success: boolean; data: Blog }>(`${environment.URL}/blogs/${id}`, payload);
  }

  deleteBlog(id: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${environment.URL}/blogs/${id}`);
  }

  getBlogReviews(blogId: number): Observable<{ success: boolean; data: Review[] }> {
    return this.http.get<{ success: boolean; data: Review[] }>(`${environment.URL}/blogs/${blogId}/reviews`);
  }

  createReview(blogId: number, payload: Partial<Review>): Observable<{ success: boolean; data: Review }> {
    return this.http.post<{ success: boolean; data: Review }>(`${environment.URL}/blogs/${blogId}/reviews`, payload);
  }

  deleteReview(id: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${environment.URL}/reviews/${id}`);
  }

}
