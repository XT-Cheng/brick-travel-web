import { Component, ElementRef, ViewChild } from '@angular/core';
import { IViewPointBiz } from '@core/store/bizModel/model/viewPoint.biz.model';
import { IViewPoint } from '@core/store/entity/model/viewPoint.model';
import { CityService } from '@core/store/providers/city.service';
import { ErrorService } from '@core/store/providers/error.service';
import { ViewPointService } from '@core/store/providers/viewPoint.service';
import { ViewPointUIService } from '@core/store/providers/viewPoint.ui.service';
import { ViewPointCategoryService } from '@core/store/providers/viewPointCategory.service';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';

import { EntityFormComponent, EntityFormMode } from '../../../entity.form.component';
import { MapModalComponent } from '../mapModal.component';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'bt-vp-form',
  templateUrl: 'viewPoint.form.component.html',
  styleUrls: ['./viewPoint.form.component.scss']
})
export class ViewPointFormComponent extends EntityFormComponent<IViewPoint, IViewPointBiz> {
  //#region Private member

  //#endregion

  //#region Public member

  //#endregion

  //#region Public property

  // @ViewChildren(NbContextMenuDirective) contextMenus;

  //#endregion

  //#region Constructor

  constructor(public _viewPointService: ViewPointService, private _modalService: NzModalService, private _element: ElementRef,
    public _viewPointUIService: ViewPointUIService, public _viewPointCategoryService: ViewPointCategoryService,
    public _cityService: CityService, protected _errorService: ErrorService,
    protected _messageService: NzMessageService,
    protected _activeModal: NzModalRef) {
    super(_viewPointService, _errorService, _messageService, _activeModal);
  }

  //#endregion

  //#region Public method

  isNameInValid(name: FormControl): boolean {
    if (name && name.errors)
      return name.invalid && name.touched && name.errors.required;

    return false;
  }

  isCategoryInValid(category: FormControl): boolean {
    if (category && category.errors)
      return category.invalid && category.touched &&  category.errors.required;

    return false;
  }

  isRankInValid(rank: FormControl): boolean {
    if (rank && rank.errors)
      return rank.invalid && rank.touched &&  rank.errors.required;

    return false;
  }

  isTimeNeededInValid(timeNeeded: FormControl): boolean {
    if (timeNeeded && timeNeeded.errors)
      return timeNeeded.invalid && timeNeeded.touched &&  timeNeeded.errors.required;

    return false;
  }

  openMap() {
    this._modalService.create({
      nzTitle: 'Modal Title',
      nzContent: MapModalComponent,
      nzComponentParams: {
        minHeight: 500,
        city: this.newEntity.city
      },
      nzFooter: null
    });

    // const activeModal = this._modalService.open(MapModalComponent, { backdrop: false, size: 'lg', container: 'nb-layout' });
    // activeModal.componentInstance.minHeight = 500;
    // activeModal.componentInstance.city = this.newEntity.city;

    this._element.nativeElement.style.display = 'none';

    // if (this.newEntity.latitude) {
    //   activeModal.componentInstance.pointChoosed = new AMap.LngLat(this.newEntity.longtitude, this.newEntity.latitude);
    // }
    // activeModal.result.then((pos: AMap.LngLat) => {
    //   this.newEntity.latitude = pos.getLat();
    //   this.newEntity.longtitude = pos.getLng();
    //   this._element.nativeElement.style.display = 'block';
    //   this._element.nativeElement.ownerDocument.body.classList.add('modal-open');
    // }, (cancel) => {
    //   this._element.nativeElement.style.display = 'block';
    //   this._element.nativeElement.ownerDocument.body.classList.add('modal-open');
    // });
  }


  //#endregion

  //#region Interface implementation

  isSubmitDisAllowed(): boolean {
    return super.isSubmitDisAllowed(); // || this.newEntity.images.length === 0;
    // return !this.isChanged() || !form.valid || (this.newEntity.images.length === 0);
  }

  get entityName(): string {
    if (this.newEntity) return this.newEntity.name;

    return '';
  }

  isChanged(): boolean {
    if (this.mode === EntityFormMode.create) { return true; }

    const changed = !(this.newEntity.name === this.originalEntity.name &&
      this.newEntity.city.id === this.originalEntity.city.id &&
      this.newEntity.category.id === this.originalEntity.category.id &&
      this.newEntity.address === this.originalEntity.address &&
      this.newEntity.description === this.originalEntity.description &&
      this.newEntity.latitude === this.originalEntity.latitude &&
      this.newEntity.longtitude === this.originalEntity.longtitude &&
      this.newEntity.rank === this.originalEntity.rank &&
      this.newEntity.tags === this.originalEntity.tags &&
      this.newEntity.timeNeeded === this.originalEntity.timeNeeded &&
      this.newEntity.tips === this.originalEntity.tips &&
      this.newEntity.thumbnail === this.originalEntity.thumbnail &&
      this.newEntity.images.length === this.originalEntity.images.length);

    if (changed) { return changed; }

    for (let i = 0; i < this.newEntity.images.length; i++) {
      if (this.newEntity.images[i] !== this.originalEntity.images[i]) {
        return true;
      }
    }

    return false;
  }

  //#endregion

  //#region Private method

  //#endregion
}
