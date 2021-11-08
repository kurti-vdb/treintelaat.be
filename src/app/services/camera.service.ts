import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  private subject = new Subject<any>();

  constructor() { }

  setCameraType(message: string) {
    this.subject.next(message);
  }

  getCameraType(): Observable<any> {
    return this.subject.asObservable();
  }
}
