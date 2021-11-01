import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { AuthenticationService } from 'src/app/services/authentication.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  hasWebcam: boolean = false;
  show: boolean = false;
  @Output() modalEvent = new EventEmitter<string>();

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private socialAuthService: SocialAuthService
  ){ }

  ngOnInit(): void {
    this.detectWebcam();
  }

  login() {
    if (this.form.invalid) {
      return;
    }
    this.authService.login(this.form.value['email'], this.form.value['password']).subscribe(
      response => {
        this.closeModal();
        this.router.navigate(['/dashboard']);
      }, err => {
        console.log(err);
      });
  }

  signInWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(googleUser => {
      this.authService.googleLogin(googleUser).subscribe(response => {
        this.closeModal();
        this.router.navigate(['/dashboard']);
      }, err => {
        console.log(err);
      })
    });
  }

  signInWithFB(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).then(facebookUser => {
      this.authService.facebookLogin(facebookUser).subscribe(response => {
        this.closeModal();
        this.router.navigate(['/dashboard']);
      }, err => {
        console.log(err);
      })
    });
  }

  signOut(): void {
    this.socialAuthService.signOut();
  }

  showPassword() {
    this.show = !this.show;
  }

  detectWebcam() {
    let md = navigator.mediaDevices;

    if (!md || !md.enumerateDevices)
      return;

    md.enumerateDevices().then(devices => {
      this.hasWebcam = devices.some(device => 'videoinput' === device.kind);
      console.log("Has webcam? " + this.hasWebcam);
    })
  }

  closeModal() {
    let modal = document.getElementById('modal');
    if(modal != null)
      modal.style.display = "none";
  }

  openRegisterModal() {
    this.closeModal();
    this.modalEvent.next('join');
  }

}
