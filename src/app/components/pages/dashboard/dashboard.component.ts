import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public delay: number = 5;
  public base64Image: any; // Wordt door image-cropper met een emitter opgevuld




  constructor(
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
  }

  openModal(value: string) {
    this.modalService.sendClickCall(value);
  }

  selectImage( base64Data : any ) {
    this.base64Image = base64Data;
  }

  addDelay() {

  }
}
