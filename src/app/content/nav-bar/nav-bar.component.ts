import { Component } from '@angular/core';
import { AuthenticationService } from '../../shared/service/authentication';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  
  constructor(private authService: AuthenticationService) {}

  logout(): void {
    this.authService.logout();
  }
}
