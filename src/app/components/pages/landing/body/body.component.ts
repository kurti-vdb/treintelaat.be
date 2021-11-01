import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Delay } from 'src/app/models/delay';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DelayService } from 'src/app/services/delay.service';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {

  page: number = 1;
  isLoading: boolean = false;

  public isMobile: boolean = false;
  public isTablet: boolean = false;

  public delays: Delay[] = [];
  private delaysSubscription: Subscription = new Subscription();

  constructor(private deviceService: DeviceDetectorService, private delayService: DelayService) { }

  ngOnInit(): void {

    this.isMobile = this.deviceService.isMobile();
    this.isTablet = this.deviceService.isTablet();

    this.isLoading = true;
    this.delayService.getDelays().subscribe( response => {
      this.isLoading = false;
      console.log(response);
    });

    this.delaysSubscription = this.delayService.getDelaysSubject().subscribe((delays: Delay[]) => {
      this.delays = delays;
    });
  }

  ngOnDestroy(): void {
    this.delaysSubscription.unsubscribe();
  }

}
