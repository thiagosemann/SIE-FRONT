import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../shared/service/authentication';
import { User } from 'src/app/shared/utilitarios/user';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  user: User | null = null;

  constructor(private authService: AuthenticationService) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
  }

  logout(): void {
    this.authService.logout();
    this.user = this.authService.getUser();
  }
}
