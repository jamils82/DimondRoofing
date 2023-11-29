import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CmsService } from '@spartacus/core';

import { CreateAccountsService } from 'src/app/shared/services/create-accounts.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

import { createAccountLabelConstants, createAccountFormConstants } from 'src/app/core/constants/general';
import { Router } from '@angular/router';
import { ShareEvents } from 'src/app/shared/services/shareEvents.service';
import { CommonUtils } from 'src/app/core/config/utils/utils';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent implements OnInit {
  createAccountFormLabel = createAccountLabelConstants;
  createAccountFormConstants = createAccountFormConstants;

  createAccountForm: FormGroup;
  subFormDisplayType: string = 'display';
  bgImage: any;
  numpattern = '^[0-9]*$';
  postalCodeNumPattern = /^\d{4}$/;
  isMobile: boolean = false;
  formData: any;
  public successMessageContent: any;
  public errorMessageContent: any;

  @ViewChild('createAccountSuccessModal', { static: true }) createAccountSuccessModal: any;

  emailCheck: boolean = false;
  nameCheck: boolean = false;
  companyNameCheck: boolean = false;
  accountNoCheck: boolean = false;
  dropDownCheck: boolean = false;
  postalCodeCheck: boolean = false;
  zipCodeCheck: boolean = false;
  cityCheck: boolean = false;
  companyAddressCheck: boolean = false;
  suburbCheck: boolean = false;
  responseOpen: boolean = true;
  responseSuccess: boolean = false;
  private subscription = new Subscription();


  constructor(
    private fb: FormBuilder,
    private cmsService: CmsService,
    private createAccountService: CreateAccountsService,
    private modalService: NgbModal,
    private shareEvents: ShareEvents,
    private router: Router
  ) {
    this.createAccountForm = this.fb.group({
      emailAddress: new FormControl(null, [Validators.required, Validators.email]),
      customerName: new FormControl('', [Validators.required, Validators.minLength(4)]),
      phoneNumber: new FormControl('', [Validators.minLength(6), Validators.maxLength(16)]),
      dimondAccountDropdown: new FormControl(),
      accountNumber: new FormControl('', [Validators.required, Validators.pattern(this.numpattern)]),
      companyName: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      companyDetails: new FormControl(),
      postalCode: new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern(this.postalCodeNumPattern)]),
      city: new FormControl(null, [Validators.required]),
      companyAddress: new FormControl(null, [Validators.required, Validators.minLength(5)]),
      suburb: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      companyDescription: new FormControl()
    });
  }

  ngOnInit(): void {

    this.isMobile = CommonUtils.isMobile();
    this.subscription.add(this.shareEvents.createAccountSubjectReceiveEvent().subscribe(() => {
      this.openPopup();
    }));
    this.cmsService.getComponentData("SubmitSuccessMessageComponent").subscribe((data: any) => {
      this.successMessageContent = data?.content;
    })
    this.cmsService.getComponentData("SubmitErrorMessageComponent").subscribe((data: any) => {
      this.errorMessageContent = data?.content;
    })
  }

  submit() {

    if (this.isNullOrEmpty(this.createAccountForm.value.emailAddress)) {
      this.emailCheck = true;
    }

    if (this.isNullOrEmpty(this.createAccountForm.value.accountNumber)) {
      this.accountNoCheck = true;
    }

    if (this.isNullOrEmpty(this.createAccountForm.value.customerName)) {
      this.nameCheck = true;
    }
    if (this.isNullOrEmpty(this.createAccountForm.value.companyName)) {
      this.companyNameCheck = true;
    }

    if (this.isNullOrEmpty(this.createAccountForm.value.postalCode)) {
      this.postalCodeCheck = true;
    }

    if (this.isNullOrEmpty(this.createAccountForm.value.city)) {
      this.cityCheck = true;
    }
    if (this.isNullOrEmpty(this.createAccountForm.value.companyAddress)) {
      this.companyAddressCheck = true;
    }
    if (this.isNullOrEmpty(this.createAccountForm.value.suburb)) {
      this.suburbCheck = true;
    }
    if (this.isNullOrEmpty(this.createAccountForm.value.dimondAccountDropdown)) {
      this.dropDownCheck = true;
    }

    if (!this.emailCheck && !this.nameCheck && !this.dropDownCheck &&
      ((this.createAccountForm.value.dimondAccountDropdown === 'Yes' && !this.accountNoCheck && !this.companyNameCheck) ||
        (this.createAccountForm.value.dimondAccountDropdown === 'No' && !this.companyNameCheck && !this.companyAddressCheck && !this.suburbCheck && !this.cityCheck && !this.postalCodeCheck && this.createAccountForm.controls.postalCode.valid))
    ) {
      let companyDetails;
      if (this.createAccountForm.value.dimondAccountDropdown === 'Yes') {
        this.formData = {
          "email": this.createAccountForm.value.emailAddress,
          "name": this.createAccountForm.value.customerName,
          "accountNumber": this.createAccountForm.value.accountNumber,
          "accountName": this.createAccountForm.value.companyName,
          "phoneNumber": this.createAccountForm.value.phoneNumber,
          "isCustomerAccountExist": this.createAccountForm.value.dimondAccountDropdown,
          "additionalInfo": this.createAccountForm.value.companyDescription
        }
      }
      else {
        this.formData = {
          "email": this.createAccountForm.value.emailAddress,
          "name": this.createAccountForm.value.customerName,
          "accountName": this.createAccountForm.value.companyName,
          "companyDetails":
            companyDetails = {
              "city": this.createAccountForm.value.city,
              "postCode": this.createAccountForm.value.postalCode,
              "region": this.createAccountForm.value.suburb,
              "companyAddress": this.createAccountForm.value.companyAddress
            },
          "phoneNumber": this.createAccountForm.value.phoneNumber,
          "isCustomerAccountExist": this.createAccountForm.value.dimondAccountDropdown,
          "additionalInfo": this.createAccountForm.value.companyDescription
        }

      }

      this.createAccountService.createAccount(this.formData).subscribe(data => {

        this.responseOpen = false;
        this.responseSuccess = true;
        this.shareEvents.createAccountSubjectSendEvent();
        this.resetPage();
      }, (error) => {

        if (error.error.text == 'Success') {
          this.responseOpen = false;
          this.responseSuccess = true;
          this.shareEvents.createAccountSubjectSendEvent();
          this.resetPage();
        }
      })
    }
    else {
    }
  }

  // Method to Check if Form's Required Fields are Valid or Not
  formValidationCheck() {

    // Check if Customer has FI Account
    if (this.createAccountForm.value.dimondAccountDropdown === "Yes") {
      if (this.getCommonFieldsValidation()) {
        return true;
      } else {
        return false
      }
    } else if (this.createAccountForm.value.dimondAccountDropdown === "No") {
      if (this.getCommonFieldsValidation()
        || this.isNullOrEmpty(this.createAccountForm.value.companyAddress)
        || this.isNullOrEmpty(this.createAccountForm.value.postalCode)
        || this.isNullOrEmpty(this.createAccountForm.value.city)
        || this.isNullOrEmpty(this.createAccountForm.value.suburb)
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }


  isNullOrEmpty(valueToCheck: string) {
    return (valueToCheck == null || valueToCheck == '') ? true : false;
  }

  getCommonFieldsValidation() {
    return (this.isNullOrEmpty(this.createAccountForm.value.emailAddress) ||
      this.isNullOrEmpty(this.createAccountForm.value.customerName) || this.isNullOrEmpty(this.createAccountForm.value.companyName))
  }


  // Input Field Focus changes

  emailInputVal() {
    this.emailCheck = false;
  }

  nameInputVal() {
    this.nameCheck = false;
  }

  accountNoInputVal() {
    this.accountNoCheck = false;
  }
  companyNameInputVal() {
    this.companyNameCheck = false;
  }

  postalCodeInputVal() {
    this.postalCodeCheck = false;
  }

  zipCodeInputVal() {
    this.zipCodeCheck = false;
  }

  cityInputVal() {
    this.cityCheck = false;
  }
  companyAddressCheckInputVal() {
    this.companyAddressCheck = false;
  }
  suburbInputVal() {
    this.suburbCheck = false;
  }

  dropDownCheckSelectVal() {
    this.dropDownCheck = false;
  }

  // validatePhoneNum() {
  //   return (!this.createAccountForm.get('phoneNumber').valid && this.createAccountForm.get('phoneNumber').touched);
  // }
  openPopup() {
    this.modalService
      .open(this.createAccountSuccessModal, { centered: true, windowClass: 'createAccountForm', size: 'lg' })
      .result.then(
        (result) => {
          this.resetAndCloseForm();
          window.location.href = '/login';
        },
        (reason) => {
          this.resetAndCloseForm();
          setTimeout(() => {
            window.scroll(0, 0);
          }, 100);
          window.location.href = '/login';
        }
      );
  }
  resetAndCloseForm() {
    this.responseOpen = true;
    this.modalService.dismissAll();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.resetAndCloseForm();
  }

  resetPage() {
    this.createAccountForm = this.fb.group({
      emailAddress: new FormControl(null, [Validators.required, Validators.email]),
      customerName: new FormControl('', [Validators.required, Validators.minLength(4)]),
      phoneNumber: new FormControl('', [Validators.minLength(6), Validators.maxLength(16)]),
      dimondAccountDropdown: new FormControl(),
      accountNumber: new FormControl('', [Validators.required, Validators.pattern(this.numpattern)]),
      companyName: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      companyAddress: new FormControl(),
      postalCode: new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern(this.postalCodeNumPattern)]),
      city: new FormControl(null, [Validators.required]),
      suburb: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      companyDescription: new FormControl()
    });
  }
  validateChar(event: any) {
    var regex = new RegExp("^[0-9-+()-]");
    var key = String.fromCharCode(event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
      event.preventDefault();
      return false;
    }
    else {
      return true;
    }
  }
}
