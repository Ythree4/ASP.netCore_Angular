import { Component } from '@angular/core';
import { PaymentDetailService } from '../../shared/payment-detail.service';
import { NgForm } from '@angular/forms';
import { PaymentDetail } from '../../shared/payment-detail.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-payment-detail-form',
  templateUrl: './payment-detail-form.component.html',
  styles: []
})
export class PaymentDetailFormComponent {
  constructor(public service: PaymentDetailService, private toastr: ToastrService) {
  }

  onSubmit(form: NgForm) {
    this.service.formSubmitted = true;
    if (form.valid) {
      if (this.service.formData.paymentDetailId == 0) {
        this.insertRecord(form)
      }
      else {
        this.updateRecord(form)
      }
    }
  }

  insertRecord(form: NgForm) {
    // Remove spaces from the card number field
    this.service.formData.cardNumber = this.service.formData.cardNumber.replace(/\s/g, '');

    this.service.postPaymentDetail()
      .subscribe({
        next: res => {
          this.service.list = res as PaymentDetail[]
          this.service.resetForm(form)
          this.toastr.success('Inserted successfully', 'Payment Detail Register')
        },
        error: err => {
          console.log(err)
        }
      })
  }

  updateRecord(form: NgForm) {
    this.service.putPaymentDetail()
      .subscribe({
        next: res => {
          this.service.list = res as PaymentDetail[]
          this.service.resetForm(form)
          this.toastr.info('Updated successfully', 'Payment Detail Register')
        },
        error: err => {
          console.log(err)
        }
      })
  }

  transformToUppercase() {
    this.service.formData.cardOwnerName = this.service.formData.cardOwnerName.toUpperCase();
  }

  formatExpirationDate() {
    let expirationDate = this.service.formData.expirationDate;
    if (expirationDate.length > 0) {
        // Remove any non-digit characters from the input value
        expirationDate = expirationDate.replace(/\D/g, '');

        // Ensure that the month value does not exceed 12
        const month = expirationDate.slice(0, 2);
        if (Number(month) > 12) {
            expirationDate = '12' + expirationDate.slice(2);
        }

        // Insert a slash after the second digit if not already present
        if (expirationDate.length > 2 && expirationDate.charAt(2) !== '/') {
            expirationDate = expirationDate.slice(0, 2) + '/' + expirationDate.slice(2);
        }
    }
    this.service.formData.expirationDate = expirationDate;
}

  formatCardNumber() {
    let cardNumber = this.service.formData.cardNumber;
    if (cardNumber.length > 0) {
      cardNumber = cardNumber.replace(/\s/g, ''); // Remove existing spaces
      cardNumber = cardNumber.replace(/(.{4})/g, '$1 '); // Insert spaces every four characters

      // Remove space from the end if present
      if (cardNumber.endsWith(' ')) {
        cardNumber = cardNumber.slice(0, -1);
      }
    }
    this.service.formData.cardNumber = cardNumber;
  }
}
