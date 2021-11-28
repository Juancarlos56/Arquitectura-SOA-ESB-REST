import { Component, OnInit } from '@angular/core';
import { alertController } from '@ionic/core';
import { RequestESB } from '../class/request';
import { ESBserviceService } from '../services/esbservice.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.page.html',
  styleUrls: ['./transaction.page.scss'],
})
export class TransactionPage implements OnInit {

  private bankInfo: any
  private aux = new RequestESB()
  private bank: any
  private response: any
  
  cedula: string
  cuentaCl: string
  cuenta: string
  monto: string

  constructor(private esbService : ESBserviceService) { 
    
    //this.bankInfo = this.esbService.startTransaction(this.aux).subscribe();
    
  }

  ngOnInit() {
    
  }

  getBank($event) {
    this.bank = Number($event.target.value)
    console.log("BANK>> "+this.bank+" CEDULA>> "+this.cedula)    
  }

  async makeTransaction() {
    this.aux.id = this.bank
    this.aux.cedula = this.cedula
    this.aux.cuentaCl = this.cuentaCl
    this.aux.cuenta = this.cuenta
    this.aux.monto = Number(this.monto)

    if(this.cedula && this.cuenta && this.cuentaCl && this.monto && this.bank){
      console.log("YES IT IS!")
      console.log("BANK>> "+this.bank+" CEDULA>> "+this.cedula)
      
      this.esbService.startTransaction(this.aux).subscribe(async (items) => {
        
        this.response = items
        console.log( this.response );

        try {
          const alert = await alertController.create({
            header: this.response.status,
            message: 'BITCOIN: '+this.response.bitcoin,
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
