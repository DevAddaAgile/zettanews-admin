import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../public/environments/environment";
import { Params } from "../interface/core.interface";
import { CategoryModel, Category } from "../interface/category.interface";

@Injectable({
  providedIn: "root",
})
export class CategoryService {

  constructor(private http: HttpClient) {}

  getCategories(payload?: Params): Observable<{ success: boolean; data: Category[] }> {
    return this.http.get<{ success: boolean; data: Category[] }>(`${environment.URL}/categories`, { params: payload });
  }

  createCategory(payload: Partial<Category>): Observable<{ success: boolean; data: Category }> {
    return this.http.post<{ success: boolean; data: Category }>(`${environment.URL}/categories`, payload);
  }

  updateCategory(id: number, payload: Partial<Category>): Observable<{ success: boolean; data: Category }> {
    return this.http.put<{ success: boolean; data: Category }>(`${environment.URL}/categories/${id}`, payload);
  }

  deleteCategory(id: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${environment.URL}/categories/${id}`);
  }

}
