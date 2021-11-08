import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Subscription } from 'rxjs';
import { ECamera } from 'src/app/models/enums/camera';
import { CameraService } from 'src/app/services/camera.service';

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.css']
})
export class ImageCropperComponent implements OnInit, OnDestroy {

  camera: string = ECamera.BACK;
  imageChangedEvent: any = '';
  @Input() croppedImage: any = '';
  @Output() onSelectImage = new EventEmitter();
  public cameraSubscription = new Subscription();

  constructor(private cameraService: CameraService) { }


  ngOnInit(): void {
    this.cameraSubscription = this.cameraService.getCameraType().subscribe(response => {
      this.camera = response;
    });
  }

  ngOnDestroy(): void {
    this.cameraSubscription.unsubscribe();
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.openModal();
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.onSelectImage.emit(this.croppedImage);
  }

  imageLoaded() {
    // show cropper
  }

  cropperReady() {
    this.onSelectImage.emit(this.croppedImage);
  }

  loadImageFailed() {
    // show message
  }

  openModal() {
    let modal = document.getElementById('image-modal');
    if(modal != null)
      modal.style.display = 'block';
  }

  closeModal() {
    let modal = document.getElementById('image-modal');
    if(modal != null)
      modal.style.display = 'none';
  }
}
