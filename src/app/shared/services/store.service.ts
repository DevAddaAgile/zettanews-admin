import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../public/environments/environment";
import { Params } from "../interface/core.interface";
import { Stores, StoresModel } from "../interface/store.interface";

@Injectable({
  providedIn: "root",
})
export class StoreService {

  constructor(private http: HttpClient) {}

  getStores(payload?: Params): Observable<StoresModel> {
    return this.http.get<StoresModel>(`${environment.URL}/store.json`, { params: payload });
  }

}
