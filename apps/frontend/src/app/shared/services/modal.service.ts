import { Injectable } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';

@Injectable({providedIn: 'root'})
export class ModalService {
  constructor(private modalService: BsModalService) {}

  openModal() {}
}