import { Component, OnInit } from '@angular/core';
import { alertController } from '@ionic/core';
import { Deposito } from '../class/request';
import { ESBserviceService } from '../services/esbservice.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.page.html',
  styleUrls: ['./transaction.page.scss'],
})
export class TransactionPage implements OnInit {

  private deposito = new Deposito()
  private bank: any
  private response: any
  
  cedulaBeneficiario: string
  cuentaBeneficiario: string
  cedulaDepositante: string
  monto: string

  constructor(private esbService : ESBserviceService) { 
    
    //this.bankInfo = this.esbService.startTransaction(this.aux).subscribe();
    
  }

  ngOnInit() {
    
  }

  async makeTransaction() {

    this.deposito.cedulaBeneficiario = this.cedulaBeneficiario
    this.deposito.cuentaBeneficiario = this.cuentaBeneficiario
    this.deposito.cedulaDepositante = this.cedulaDepositante
    this.deposito.monto = Number(this.monto)

    if((this.cedulaBeneficiario != this.cedulaDepositante)){
      console.log("YES IT IS!")
     
      this.esbService.startTransaction(this.deposito).subscribe(async (items) => {
        
        this.response = items
        console.log( this.response );

        try {
          const alert = await alertController.create({
            header: this.response.status,
            message: 'Deposito: '+this.response.status,
            buttons: ['OK']
          });
          await alert.present();
          
        } catch (error) {
          const alert = await alertController.create({
            header: 'Transacción fallida',
            message: 'Un error ocurrio y no se pudo realizar la transacción',
            buttons: ['OK']
          });
  
          await alert.present();
        } 

      })

    } else {
      console.log("INGRESE LOS CAMPOS")
      const alert = await alertController.create({
        header: 'Transacción fallida',
        message: 'Ingrese todos los campos obligatorios',
        buttons: ['OK']
      });

      await alert.present();
    }

    
  }

}
