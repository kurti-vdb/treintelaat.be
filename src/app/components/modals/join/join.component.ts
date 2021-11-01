import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ValidateEmail } from "src/app/utils/validate-email";
import { SocialUser, SocialAuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { Router } from '@angular/router';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.css']
})
export class JoinComponent implements OnInit {

  show: boolean = false;
  @Output() modalEvent = new EventEmitter<string>();

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email], ValidateEmail.checkForExistingEmail(this.authService)),
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

  }

  showPassword() {
    this.show = !this.show;
  }

  closeModal() {
    let modal = document.getElementById('modal');
    if(modal != null)
      modal.style.display = "none";
  }

  register() {

    if (this.form.invalid) { return; }

    let email = this.form.value['email'];
    let password = this.form.value['password']

    this.authService.signup(email, password).subscribe(response => {
        this.form.reset();
        this.closeModal();
        this.router.navigate(['/account']);
      }, err => {
        console.log(err);
      })
  }

  signInWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(user => {
      this.authService.googleLogin(user).subscribe(response => {
        this.closeModal();
        this.router.navigate(['/account']);
      }, err => {
        console.log(err);
      })
    });
  }

  signInWithFB(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).then(user => {
      this.authService.facebookLogin(user).subscribe(response => {
        this.closeModal();
        this.router.navigate(['/account']);
      }, err => {
        console.log(err);
      })
    });
  }

  signOut(): void {
    this.socialAuthService.signOut();
  }

  openLoginModal() {
    this.closeModal();
    this.modalEvent.next('login');
  }

}
