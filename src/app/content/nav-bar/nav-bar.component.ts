import { Component } from '@angular/core';
import { AuthenticationService } from '../../shared/service/authentication';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  
  constructor(private authService: AuthenticationService, private router: Router, private toastr: ToastrService) {}

  logout(): void {
    this.authService.logout();
    this.toastr.error("Deslogado.")
    this.router.navigate(['/login']);

  }
}
