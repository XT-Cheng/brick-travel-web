import { Component } from '@angular/core';

@Component({
  selector: 'bt-modal',
  templateUrl: 'modal.component.html',
  styleUrls: [`./modal.component.scss`]
})
export class ModalComponent {

  modalHeader: string;
  modalContent: string;

  constructor() { }
}
