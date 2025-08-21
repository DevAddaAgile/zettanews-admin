import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../public/environments/environment';
import { Params } from '../interface/core.interface';
import { Setting } from '../interface/setting.interface';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  constructor(private http: HttpClient) { }

  getSettingOption(): Observable<Setting> {
    return this.http.get<Setting>('assets/data/setting.json');
  }

  getBackendSettingOption(): Observable<Setting> {
    return this.http.get<Setting>('assets/data/setting.json');
  }

}
