import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { appGlobalConstants, appMessagesAlert } from 'src/app/common/actionType/global-constant';
import { AlertService } from 'src/app/common/service/alert-service';
import { GlobalServiceParam } from 'src/app/common/service/global-param-service';
import { UserService } from '../user-service';
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-dialog-addUser',
  templateUrl: './dialog-user.component.html',
  styleUrls: ['./dialog-user.component.css']
})

export class AddUserDialogComponent implements OnInit {
  emailFormControl = new FormControl(appGlobalConstants.EMPLTY_VALUE, [Validators.required, Validators.email]);
  today = new Date();
  matcher = new MyErrorStateMatcher();
  employeesForm: FormGroup;
  actionButtonDinamic: string = "Save";
  groupOption: any[] = [];
  searchTxt: any;
  selectedValue: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialog: MatDialogRef<any>,
    private formBuilder: FormBuilder,
    private userServices: UserService,
    private alertService: AlertService,
    private globalServiceParam: GlobalServiceParam,
  ) {
  }

  ngOnInit(): void {
    this.initFormGroup();
    this.initValueGroup();
  }

  initValueGroup() {
    this.groupOption = [
      { name: "IT", value: "IT Departement" },
      { name: "Accountant", value: "Account Departement" },
      { name: "Audit", value: "Audit Departement" },
      { name: "Marketing Credit", value: "Marketing Credit" },
      { name: "HRD", value: "Human Resource" },
      { name: "Warehouse", value: "Warehouse" },
      { name: "Executive", value: "Executive" },
      { name: "Surveyor", value: "Surveyor" },
      { name: "Credit Analyst", value: "Credit Analyst" },
      { name: "Owner", value: "Owner" }
    ]
  }

  initFormGroup() {
    this.employeesForm = this.formBuilder.group({
      username: [appGlobalConstants.EMPLTY_VALUE, Validators.required],
      firstName: [appGlobalConstants.EMPLTY_VALUE, Validators.required],
      lastName: [appGlobalConstants.EMPLTY_VALUE, Validators.required],
      email: [appGlobalConstants.EMPLTY_VALUE, Validators.required],
      birthDate: [appGlobalConstants.EMPLTY_VALUE, Validators.required],
      basicSalary: [appGlobalConstants.EMPLTY_VALUE, Validators.required],
      status: [appGlobalConstants.EMPLTY_VALUE, Validators.required],
      group: [appGlobalConstants.EMPLTY_VALUE, Validators.required],
      description: [appGlobalConstants.EMPLTY_VALUE, Validators.required]
    });

    if (this.editData) {
      this.employeesForm.patchValue(this.editData);
      this.selectedValue = this.editData.group;
      this.actionButtonDinamic = "Edit";
    }
  }

  onSave() {
    const rawData = this.employeesForm.getRawValue();
    !this.editData ? this.addDataEmployee(rawData) : this.editDataEmployee(rawData);
  }

  addDataEmployee(rawData) {
    if (this.employeesForm.valid) {
      this.userServices.postNewDataEmployee(rawData).subscribe({
        next: (res) => {
          this.alertService.showAlertSuccess(appMessagesAlert.SUCCESS_ADD_DATA_EMPLOYEES);
          this.resetDataValueandBackToEmployeesPage();
        }, error: () => {
          this.alertService.showAlertError(appMessagesAlert.ERROR_SAVE_DATA_EMPLOYEES);
        }
      })
    } else {
      this.alertService.showAlertInfo(appMessagesAlert.ALL_FIELD_HAS_BEEN_REQUIRED);
    }
  }

  editDataEmployee(rawData) {
    this.userServices.editDataEmployee(rawData, this.editData.id).subscribe({
      next: (res) => {
        this.alertService.showAlertSuccess(appMessagesAlert.SUCCESS_EDIT_DATE_EMPLOYEES);
        this.resetDataValueandBackToEmployeesPage();
      }, error: () => {
        this.alertService.showAlertError(appMessagesAlert.ERROR_EDIT_DATA_EMPLOYEES);
      }
    })
  }

  resetDataValueandBackToEmployeesPage() {
    this.employeesForm.reset();
    !this.editData ? this.dialog.close("save") : this.dialog.close("edit");
    this.globalServiceParam.navigateToEmployeesPage();
  }

  onCancel() {
    this.dialog.close();
    this.globalServiceParam.navigateToEmployeesPage();
  }
}