import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { ECamera } from 'src/app/models/enums/camera';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CameraService } from 'src/app/services/camera.service';
import { ValidateEmail } from 'src/app/utils/validate-email';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  public base64Image: any; // Wordt door image-cropper met een emitter opgevuld
  public spacesUrl!: string;
  public user: User = new User();
  public isSocialLogin: boolean = false;
  public timeStamp: Number = (new Date()).getTime();
  private flashMessageSubscription: Subscription = new Subscription();

  public form: FormGroup = new FormGroup({
    username: new FormControl(),
    firstname: new FormControl(),
    lastname: new FormControl(),
    city: new FormControl(),
    country: new FormControl(),
  });

  constructor(
    private authService: AuthenticationService,
    private toasterService: ToastrService,
    private cameraService: CameraService
  ) { }


  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.spacesUrl = environment.spacesUrl;
    this.isSocialLogin = this.authService.getIsSocialLogin();

    this.form.get("username")?.setValue(this.user.username);
    this.form.get("firstname")?.setValue(this.user.firstname);
    this.form.get("lastname")?.setValue(this.user.lastname);
    this.form.get("city")?.setValue(this.user.city);
    this.form.get("country")?.setValue(this.user.country);

    this.flashMessageSubscription = this.authService.getflashMessageListener().subscribe(response => {
      this.toasterService.success(
        response.message.body,
        response.message.title,
        {
          closeButton: true,
          progressBar: true,
          progressAnimation: 'decreasing'
        });
    });

    this.cameraService.setCameraType(ECamera.FRONT);
  }

  ngOnDestroy(): void {
    this.flashMessageSubscription.unsubscribe();
  }

  selectImage( base64Data : any ) {
    this.base64Image = base64Data;
    let avatars = [...document.querySelectorAll('.avatar') as any as Array<HTMLImageElement>];
    avatars.map(x => x.src = base64Data);
  }

  selectedFiles?: FileList;

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  updateUser() {
    if (this.form.invalid) { return; }

    this.user.username = this.form.value['username'];
    this.user.firstname = this.form.value['firstname'];
    this.user.lastname = this.form.value['lastname'];
    this.user.city = this.form.value['city'];
    this.user.country = this.form.value['country'];
    this.user.base64Image = this.base64Image;

    this.authService.updateUser(this.user).subscribe(() => {
      this.setTimeStamp();
    }, (err: any) => {
      console.log(err);
    })
  }

  getAvatarFromSpaces() {
    if(this.timeStamp) {
      return this.spacesUrl + this.user.avatar + '?' + this.timeStamp;
    }
    return this.user.avatar;
  }

  getAvatar() {
    if(this.timeStamp) {
      return this.user.avatar + '?' + this.timeStamp;
    }
    return this.user.avatar;
  }

  public setTimeStamp() {
    this.timeStamp = (new Date()).getTime();
  }

}
