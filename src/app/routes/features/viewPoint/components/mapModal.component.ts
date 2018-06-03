import { Component, Input } from '@angular/core';
import { ICityBiz } from '@core/store/bizModel/model/city.biz.model';
import { NzModalRef } from 'ng-zorro-antd';

@Component({
  selector: 'bt-map-modal',
  templateUrl: 'mapModal.component.html',
  styleUrls: [`./mapModal.component.scss`]
})
export class MapModalComponent {
  @Input() city: ICityBiz;
  @Input() minHeight: number;
  @Input() pointChoosed: AMap.LngLat;

  constructor(private activeModal: NzModalRef) { }

  confirm() {
    this.activeModal.close();
  }

  reject() {
    this.activeModal.close();
  }

  onPointChoosed(pos: AMap.LngLat) {
    this.activeModal.close(pos);
  }
}
