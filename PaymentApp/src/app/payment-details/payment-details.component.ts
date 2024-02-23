import { Component, OnInit } from '@angular/core';
import { PaymentDetailService } from '../shared/payment-detail.service';
import { PaymentDetail } from '../shared/payment-detail.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styles: []
})
export class PaymentDetailsComponent implements OnInit {
  constructor(public service: PaymentDetailService, private toastr: ToastrService) {

  }
  ngOnInit(): void {
    this.service.refreshList();
  }

  populateForm(selectedRecord: PaymentDetail) {
    this.service.formData = Object.assign({}, selectedRecord);
  }

  onDelete(id: number) {
    if (confirm('Are you sure to delete this record??'))
      this.service.deletePaymentDetail(id)
        .subscribe({
          next: res => {
            this.service.list = res as PaymentDetail[]
            this.toastr.error('Deleted successfully', 'Payment Detail Register')
          },
          error: err => {
            console.log(err)
          }
        })
  }

  formatCardNumber(cardNumber: string): string {
    if (cardNumber.length > 0) {
      cardNumber = cardNumber.replace(/\s/g, ''); // Remove existing spaces
      cardNumber = cardNumber.replace(/(.{4})/g, '$1 '); // Insert spaces every four characters

      // Remove space from the end if present
      if (cardNumber.endsWith(' ')) {
        cardNumber = cardNumber.slice(0, -1);
      }
    }
    return cardNumber;
  }
}
