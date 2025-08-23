import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../public/environments/environment';
import { Category, CreateCategoryRequest } from '../interface/category.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryApiService {
  private apiUrl = `${environment.URL}/categories`;

  constructor(private http: HttpClient) {}

  getCategories(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  createCategory(categoryData: CreateCategoryRequest): Observable<any> {
    return this.http.post(this.apiUrl, categoryData);
  }

  updateCategory(id: string, categoryData: CreateCategoryRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, categoryData);
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}