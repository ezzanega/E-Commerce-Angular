import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-modal-component',
  templateUrl: './confirmation-modal-component.component.html',
  styleUrls: ['./confirmation-modal-component.component.css']
})
export class ConfirmationModalComponentComponent implements OnInit {

  @Input() message: string = '';

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
  }

}
