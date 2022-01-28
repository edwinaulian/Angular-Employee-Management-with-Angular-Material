import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../common/service/auth.service';
import { AddUserDialogComponent } from '../user/dialog/dialog-user.component';
import { UserParamService } from '../user/user-service-param';

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
    private userParamService: UserParamService,
    private dialog: MatDialog) { }

  ngOnInit() {
  }

  goToAddUser() {
    this.dialog.open(AddUserDialogComponent, {
      width: '100%'
    }).afterClosed().subscribe(val => {
      if (val === "save") {
        window.location.reload();
      }
    })
  }

  goToListUser() {
    this.userParamService.cleanDataFilter();
    this.router.navigate(["/employees"]);
  }

  goToContact() {
    this.router.navigate(["/contact"]);
  }

  logout() {
    this.authService.logoutUser();
    this.userParamService.cleanDataFilter();
    let keysToRemove = ["login", "dataEmployee"];
    keysToRemove.forEach(element => {
      localStorage.removeItem(element);
    });
    this.router.navigate(["/login"]);
  }

}