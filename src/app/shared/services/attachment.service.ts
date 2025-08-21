import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../public/environments/environment";
import { Params } from "../interface/core.interface";
import { Attachment, AttachmentModel } from "../interface/attachment.interface";

@Injectable({
  providedIn: "root",
})
export class AttachmentService {

  constructor(private http: HttpClient) {}

  getAttachments(payload?: Params): Observable<AttachmentModel> {
    return this.http.get<AttachmentModel>(`${environment.URL}/attachments`, { params: payload });
  }

  createAttachment(files: File[]): Observable<Attachment[]> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    return this.http.post<Attachment[]>(`${environment.URL}/attachments`, formData);
  }

  deleteAttachment(id: number): Observable<any> {
    return this.http.delete(`${environment.URL}/attachments/${id}`);
  }

}
