import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../public/environments/environment';
import { Params } from '../interface/core.interface';
import { ReviewModel, Review } from '../interface/review.interface';
import { Review as BlogReview } from '../interface/blog.interface';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private http: HttpClient) {}

  getReviews(payload?: Params): Observable<ReviewModel> {
    return this.http.get<ReviewModel>(`${environment.URL}/review.json`, { params: payload });
  }

  getBlogReviews(blogId: number): Observable<{ success: boolean; data: BlogReview[] }> {
    return this.http.get<{ success: boolean; data: BlogReview[] }>(`${environment.URL}/blogs/${blogId}/reviews`);
  }

  createBlogReview(blogId: number, payload: Partial<BlogReview>): Observable<{ success: boolean; data: BlogReview }> {
    return this.http.post<{ success: boolean; data: BlogReview }>(`${environment.URL}/blogs/${blogId}/reviews`, payload);
  }

  deleteBlogReview(id: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${environment.URL}/reviews/${id}`);
  }
  
}
