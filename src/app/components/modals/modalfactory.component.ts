import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { Subscription } from 'rxjs';
import { EModal } from 'src/app/models/enums/modals';
import { ModalService } from 'src/app/services/modal.service';


@Component({
  selector: 'app-modalfactory',
  templateUrl: './modalfactory.component.html',
  styleUrls: ['./modalfactory.component.css']
})
export class ModalFactoryComponent implements OnInit, OnChanges, OnDestroy {

  @Input() modalID!: string;
  @Output() modalEvent = new EventEmitter<string>();
  public modalSubscription = new Subscription();

  showJoinModal: boolean = false;
  showLoginModal: boolean = false;
  showRecoverModal: boolean = false;
  showPinMachineModal: boolean = false;
  showAddDelayModal: boolean = false;

  modals: boolean [] = [
    this.showJoinModal,
    this.showLoginModal,
    this.showRecoverModal,
    this.showPinMachineModal
  ]

  constructor(
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.modalSubscription = this.modalService.getClickCall().subscribe(modalID => {
      this.setModal(modalID);
    });

    this.closeModal();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.setModal(changes.modalID.currentValue);
  }

  ngOnDestroy(): void {
    this.modalSubscription.unsubscribe();
  }

  setModal(value: string) {

    // Not working
    //this.modals.map(x => x = false);
    //this.modals.forEach((v, i) => v = false);

    this.showJoinModal = false;
    this.showLoginModal = false;
    this.showRecoverModal = false;
    this.showPinMachineModal = false;
    this.showAddDelayModal = false;

    switch(value) {
      case EModal.LOGIN:
        this.showLoginModal = true;
        break;
      case EModal.JOIN:
        this.showJoinModal = true;
        break;
      case EModal.RECOVER:
        this.showRecoverModal = true;
        break;
      case EModal.PINMACHINE:
        this.showPinMachineModal = true;
        break;
      case EModal.ADDDELAY:
        this.showAddDelayModal = true;
        break;
    }

    this.openModal(value);
  }

  openModal(id: string) {
    this.modalID = id;
    this.toggleModal('none'); // Close
    this.toggleModal('block'); // Open
  }

  closeModal() {
    this.toggleModal('none');
  }

  toggleModal(value: string) {
    let modal = document.getElementById('modal');
    if(modal != null)
      modal.style.display = value;
  }

  // TODO - replace this EvenEmitter by ModalService
  openOtherModal(value: string) {
    this.modalEvent.next(value);
  }


}
