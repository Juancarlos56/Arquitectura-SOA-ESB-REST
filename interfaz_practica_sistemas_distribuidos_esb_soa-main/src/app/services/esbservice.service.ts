import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Deposito } from '../class/request';

@Injectable({
  providedIn: 'root'
})
export class ESBserviceService {

  constructor(private http: HttpClient) { }

  startTransaction(params: Deposito):Observable<any[]>  {
    const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };  
    const body = {'cedulaBeneficiario': params.cedulaBeneficiario, 'cuentaBeneficiario': params.cuentaBeneficiario, 'cedulaDepositante': params.cedulaDepositante, 'monto': params.monto}
    console.log(body)

    return this.http.post<any>(environment.WS_PATH+"crearTransferenciaCuenta/", body, config)
  }

}
