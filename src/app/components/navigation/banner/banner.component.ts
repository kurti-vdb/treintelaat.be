import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit {

  public isMobile: boolean = false;
  public isTablet: boolean = false;

  constructor(
    private deviceService: DeviceDetectorService,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.isMobile = this.deviceService.isMobile();
    this.isTablet = this.deviceService.isTablet();
  }

  openModal(value: string) {
    this.modalService.sendClickCall(value);
  }
}
