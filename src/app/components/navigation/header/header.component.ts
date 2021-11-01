import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocialAuthService } from 'angularx-social-login';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public spacesUrl: string = environment.spacesUrl;
  public modalID!: string;
  public checked: boolean = false;
  public isMobile: boolean = false;
  public isTablet: boolean = false;
  public user: User = new User();
  public userIsAuthenticated: boolean = false;
  public isSocialLogin: boolean = false;
  private authSubscription: Subscription = new Subscription();

  constructor(
    private deviceService: DeviceDetectorService,
    private authService: AuthenticationService,
    private router: Router,
    private socialAuthService: SocialAuthService
  ) { }

  ngOnInit(): void {

    this.spacesUrl = environment.spacesUrl;
    this.user = this.authService.getUser();
    this.isMobile = this.deviceService.isMobile();
    this.isTablet = this.deviceService.isTablet();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.isSocialLogin = this.authService.getIsSocialLogin();

    this.authSubscription = this.authService.getAuthStatusListener().subscribe(response => {
      this.userIsAuthenticated = response;
    });
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  openModal(id: string) {

    // Set modal in factory
    this.modalID = id;

    // Open modal
    let modal = document.getElementById('modal');
    if(modal != null)
      modal.style.display = "block";

    // Close dropdown
    this.checked != this.checked;
  }

  openModalFromChildEvent(value: string) {
    this.openModal(value);
  }

  logout() {
    this.authService.logout();
    if(this.isSocialLogin)
      this.socialAuthService.signOut();
    this.router.navigate(['/']);
  }
}
