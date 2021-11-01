import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.css']
})
export class ImageCropperComponent implements OnInit {

  imageChangedEvent: any = '';
  @Input() croppedImage: any = '';
  @Output() onSelectImage = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
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
