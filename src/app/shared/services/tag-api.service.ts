import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../public/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TagApiService {
  private apiUrl = `${environment.URL}/tags`;

  constructor(private http: HttpClient) {}

  getTags(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  createTag(tagData: any): Observable<any> {
    return this.http.post(this.apiUrl, tagData);
  }

  updateTag(id: string, tagData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, tagData);
  }

  deleteTag(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}