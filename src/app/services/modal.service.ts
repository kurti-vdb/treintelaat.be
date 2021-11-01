import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private subject = new Subject<any>();

  constructor() { }

  sendClickCall(message: string) {
    this.subject.next(message);
  }

  getClickCall(): Observable<any> {
      return this.subject.asObservable();
  }

  openModal(id: string) {
    let modal = document.getElementById(id);
    if(modal != null)
      modal.style.display = "block";
  }

}
