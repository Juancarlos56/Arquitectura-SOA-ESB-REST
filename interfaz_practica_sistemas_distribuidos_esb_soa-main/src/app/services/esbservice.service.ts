import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { RequestESB } from '../class/request';

@Injectable({
  providedIn: 'root'
})
export class ESBserviceService {

  constructor(private http: HttpClient) { }

  startTransaction(params: RequestESB):Observable<any[]>  {
    const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };  
    const body = {'id': params.id, 'cedula': params.cedula, 'cuentaCl': params.cuentaCl, 'cuenta': params.cuenta, 'monto': params.monto}
    console.log(body)

    return this.http.post<any>(environment.WS_PATH, body, config)
  }

}
