import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  modalRef?: BsModalRef;
  config = { animated: true };

  @Input() title = '';
  @Input() okLabel = 'OK';
  @Input() okDisabled = false;
  @Input() cancelLabel = 'Cancel';
  @Input() cancelDisabled = false;
  @Input() autoClose = true;

  @Output() okClicked = new EventEmitter();
  @Output() cancelClicked = new EventEmitter();
  @Output() closeClicked = new EventEmitter();

  constructor(private modalService: BsModalService) {}

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
  }

  onOkButtonClicked(): void {
    this.okClicked.emit();
    if (this.autoClose) this.modalRef?.hide();
  }

  onCancelButtonClicked(): void {
    this.cancelClicked.emit();
    if (this.autoClose) this.modalRef?.hide();
  }

  onCloseButtonClicked(): void {
    this.closeClicked.emit();
    if (this.autoClose) this.modalRef?.hide();
  }
}
