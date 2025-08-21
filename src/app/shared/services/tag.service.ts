import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../public/environments/environment";
import { Params } from "../interface/core.interface";
import { TagModel, Tag } from "../interface/tag.interface";

@Injectable({
  providedIn: "root",
})
export class TagService {

  constructor(private http: HttpClient) {}

  getTags(payload?: Params): Observable<{ success: boolean; data: Tag[] }> {
    return this.http.get<{ success: boolean; data: Tag[] }>(`${environment.URL}/tags`, { params: payload });
  }

  createTag(payload: Partial<Tag>): Observable<{ success: boolean; data: Tag }> {
    return this.http.post<{ success: boolean; data: Tag }>(`${environment.URL}/tags`, payload);
  }

  updateTag(id: number, payload: Partial<Tag>): Observable<{ success: boolean; data: Tag }> {
    return this.http.put<{ success: boolean; data: Tag }>(`${environment.URL}/tags/${id}`, payload);
  }

  deleteTag(id: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${environment.URL}/tags/${id}`);
  }

}
