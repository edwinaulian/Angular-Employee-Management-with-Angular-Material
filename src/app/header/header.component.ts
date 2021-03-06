import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../common/service/auth.service';
import { AddUserDialogComponent } from '../user/dialog/dialog-user.component';
import { UserParamService } from '../user/user-service-param';
import { appGlobalConstants, appNavigateTo } from '../common/actionType/global-constant';
import { GlobalServiceParam } from '../common/service/global-param-service';
import * as _ from 'lodash';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
  @Input() deviceXs: boolean;
  @Input() deviceLg: boolean;
  @Input() deviceSm: boolean;
  @Input() deviceMd: boolean;

  constructor(
    private router: Router,
    private authService: AuthService,
    private globalServiceParam: GlobalServiceParam,
    private userParamService: UserParamService,
    private dialog: MatDialog) { }

  ngOnInit() {
  }

  goToAddUser() {
    this.dialog.open(AddUserDialogComponent, {
      width: '100%'
    }).afterClosed().subscribe(val => {
      if (_.isEqual(val, "save")) {
        window.location.reload();
      }
    })
  }

  goToListUser() {
    this.userParamService.cleanDataFilter();
    this.globalServiceParam.navigateToEmployeesPage();
  }

  goToContact() {
    this.router.navigate([appNavigateTo.CONTACT_PAGE]);
  }

  logout() {
    this.authService.logoutUser();
    this.userParamService.cleanDataFilter();
    let keysToRemove = [appGlobalConstants.LOGIN, appGlobalConstants.DATA_EMPLOYEE];
    keysToRemove.forEach(element => {
      localStorage.removeItem(element);
    });
    this.globalServiceParam.navigateToLoginPage();
  }

}
