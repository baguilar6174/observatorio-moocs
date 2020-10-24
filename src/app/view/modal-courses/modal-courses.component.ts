import { Component, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-courses',
  templateUrl: './modal-courses.component.html',
  styleUrls: ['./modal-courses.component.scss']
})
export class ModalCoursesComponent implements OnInit {

  list: any[] = [];

  constructor(
    public bsModalRef: BsModalRef,
  ) { }

  ngOnInit(): void {
    console.log(this.list);
  }

  // modalRef: BsModalRef;
  public event: EventEmitter<any> = new EventEmitter();

  triggerEvent(item: string) {
    this.event.emit({ data: item, res: 200 });
  }

}
