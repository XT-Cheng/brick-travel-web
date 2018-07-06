import { Component, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ICityBiz } from '@core/store/bizModel/model/city.biz.model';
import { IViewPointBiz } from '@core/store/bizModel/model/viewPoint.biz.model';
import { IViewPoint } from '@core/store/entity/model/viewPoint.model';
import { CityService } from '@core/store/providers/city.service';
import { ErrorService } from '@core/store/providers/error.service';
import { ViewPointService } from '@core/store/providers/viewPoint.service';
import { ViewPointUIService } from '@core/store/providers/viewPoint.ui.service';
import { ViewPointCategoryService } from '@core/store/providers/viewPointCategory.service';
import { WEBAPI_HOST } from '@core/utils/constants';
import { NzMessageService, NzModalRef, NzModalService, UploadFile } from 'ng-zorro-antd';

import { EntityFormComponent, EntityFormMode } from '../../../entity.form.component';
import { MapModalComponent } from '../mapModal.component';

@Component({
  selector: 'bt-vp-form',
  templateUrl: 'viewPoint.form.component.html',
  styleUrls: ['./viewPoint.form.component.scss']
})
export class ViewPointFormComponent extends EntityFormComponent<IViewPoint, IViewPointBiz> {
  //#region Private member

  //#endregion

  //#region Protected member

  protected selectedCity: ICityBiz;

  uploadUrl = `${WEBAPI_HOST}/fileUpload`;

  imagesFileList: UploadFile[];
  thumbnailFileList: UploadFile[];

  //#endregion

  //#region Protected property

  //#endregion

  //#region Constructor

  constructor(public _viewPointService: ViewPointService, private _modalService: NzModalService, private _element: ElementRef,
    public _viewPointUIService: ViewPointUIService, public _viewPointCategoryService: ViewPointCategoryService,
    public _cityService: CityService, protected _errorService: ErrorService,
    protected _messageService: NzMessageService,
    protected _activeModal: NzModalRef) {
    super(_viewPointService, _errorService, _messageService, _activeModal);

    this.addFile('thumbnail');
    this.addFile('images');

    this.imagesFileList = this.fileList('images');
    this.thumbnailFileList = this.fileList('thumbnail');
  }

  //#endregion

  //#region Interface implementation

  isDataInvalid(): boolean {
    return this.newEntity.timeNeeded === 0 || this.newEntity.thumbnail === '' ||
      this.newEntity.images.length === 0;
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
      this.newEntity.tags.length === this.originalEntity.tags.length &&
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

    for (let i = 0; i < this.newEntity.tags.length; i++) {
      if (this.newEntity.tags[i] !== this.originalEntity.tags[i]) {
        return true;
      }
    }

    return false;
  }

  //#endregion

  //#region Protected method

  protected onOriginalEntitySet() {
    this.originalEntity.images.forEach((img) => {
      const image = {
        uid: img,
        size: 0,
        name: img,
        type: '',
        thumbUrl: img
      };
      this.imagesFileList.push(image);
      this.addFile('images', image);
    });

    const thumbnail = {
      uid: this.originalEntity.thumbnail,
      size: 0,
      name: this.originalEntity.thumbnail,
      type: '',
      thumbUrl: this.originalEntity.thumbnail
    };

    this.thumbnailFileList.push(thumbnail);
    this.addFile('thumbnail', thumbnail);
  }

  //#endregion

  //#region Public method
  beforeThumbnailUpload = (file: any): boolean => {
    this.getBase64(file, (img: string) => {
      this.addFile('thumbnail', file);
      file.status = 'done';
      file.thumbUrl = img;
      this.newEntity.thumbnail = img;
      this.thumbnailFileList = this.fileList('thumbnail').slice();
    });
    return false;
  }

  beforeImagesUpload = (file: any): boolean => {
    this.getBase64(file, (img: string) => {
      this.addFile('images', file);
      file.status = 'done';
      file.thumbUrl = img;
      this.newEntity.images.push(img);
      this.imagesFileList = this.fileList('images').slice();
    });
    return false;
  }

  beforeImagesRemove = (file: any): boolean => {
    this.removeFile('images', file.uid);
    this.newEntity.images = this.newEntity.images.filter((img) => img !== file.uid);
    this.imagesFileList = this.fileList('images').slice();
    return true;
  }

  beforeThumbnailRemove = (file: any): boolean => {
    this.removeFile('thumbnail', file.uid);
    this.newEntity.thumbnail = '';
    this.thumbnailFileList = this.fileList('thumbnail').slice();
    return true;
  }

  hasCity(): boolean {
    return !!this.newEntity.city;
  }

  compareEntityFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  isRequiredInValid(control: FormControl): boolean {
    if (control && control.errors)
      return control.invalid && control.errors.required;

    return false;
  }

  isThumbnailInValid(): boolean {
    return !this.newEntity.thumbnail && this.fileList('thumbnail').length === 0;
  }

  isImageInValid(): boolean {
    return this.newEntity.images.length === 0 && this.fileList('images').length === 0;
  }

  isCityInValid(city: FormControl): boolean {
    if (city && city.errors)
      return city.invalid && city.errors.required;

    return false;
  }

  isNumberInValid(control: FormControl): boolean {
    if (control && control.errors)
      return control.invalid && control.errors.required;

    if (control.value <= 0)
      return true;

    return false;
  }

  openMap() {
    this._activeModal.getInstance().nzVisible = false;

    const componentParams: any = {
      minHeight: 500,
      city: this.newEntity.city
    };

    if (this.newEntity.latitude) {
      componentParams.pointChoosed = new AMap.LngLat(this.newEntity.longtitude, this.newEntity.latitude);
    }

    const mapModal = this._modalService.create({
      nzTitle: '',
      nzContent: MapModalComponent,
      nzBodyStyle: { padding: 0 },
      nzMask: false,
      nzComponentParams: componentParams,
      nzFooter: null
    });
    mapModal.getInstance().nzAfterClose.subscribe((pos: AMap.LngLat) => {
      if (pos) {
        this.newEntity.latitude = pos.getLat();
        this.newEntity.longtitude = pos.getLng();
      }
      this._activeModal.getInstance().nzVisible = true;
    });
  }

  //#endregion

  //#region Private method

  //#endregion
}
