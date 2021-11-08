import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-adddelay',
  templateUrl: './adddelay.component.html',
  styleUrls: ['./adddelay.component.css']
})
export class AdddelayComponent implements OnInit {

  public delay: number = 5;
  public base64Image: any; // Wordt door image-cropper met een emitter opgevuld

  public form: FormGroup = new FormGroup({
    username: new FormControl(),
    userID: new FormControl(),
    from: new FormControl(),
    to: new FormControl(),
    delay: new FormControl(),
  });

  constructor() { }

  ngOnInit(): void {
  }

  selectImage( base64Data : any ) {
    this.base64Image = base64Data;
  }

  addDelay() {

  }

  closeModal() {
    let modal = document.getElementById('modal');
    if(modal != null)
      modal.style.display = "none";
  }

}
