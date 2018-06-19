import { Component } from '@angular/core';
import { ICityBiz } from '@core/store/bizModel/model/city.biz.model';
import { ICity } from '@core/store/entity/model/city.model';
import { CityService } from '@core/store/providers/city.service';
import { ErrorService } from '@core/store/providers/error.service';
import { WEBAPI_HOST } from '@core/utils/constants';
import { NzMessageService, NzModalRef, UploadFile } from 'ng-zorro-antd';

import { EntityFormComponent, EntityFormMode } from '../../../entity.form.component';

@Component({
  selector: 'bt-city-form',
  templateUrl: 'city.form.component.html',
  styleUrls: ['./city.form.component.scss']
})
export class CityFormComponent extends EntityFormComponent<ICity, ICityBiz> {
  //#region Private member

  //#endregion

  //#region Public member

  //#endregion

  //#region Public property

  //#endregion

  //#region Constructor

  constructor(protected _cityService: CityService, protected _errorService: ErrorService,
    protected _messageService: NzMessageService, protected _activeModal: NzModalRef) {
    super(_cityService, _errorService, _messageService, _activeModal);
  }

  //#endregion

  //#region Public method
  uploadUrl = `${WEBAPI_HOST}/fileUpload`;
  loading = false;
  avatarUrl: string;

  private getBase64(img: File, callback: (img: {}) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  handleChange(info: { file: UploadFile }) {
    if (info.file.status === 'uploading') {
      this.loading = true;
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.getBase64(info.file.originFileObj, (img: string) => {
        this.loading = false;
        this.avatarUrl = img;
      });
    }
  }

  hasFile(): boolean {
    return this.newEntity.thumbnail !== '';
  }

  isSubmitDisAllowed(): boolean {
    return false;
    // return !this.isChanged() || !form.valid || (this.thumbnailUploader.queue.length === 0 && this.newEntity.thumbnail === '');
  }

  fileDropped(fileItems: any[]): void {
    // const reader = new FileReader();

    // reader.onloadend = (e: any) => {
    //   this.newEntity.thumbnail = e.target.result;
    // };

    // reader.readAsDataURL(fileItems[0]._file);
  }

  createOrUpdate() {
    let successMsg, failMsg;

    if (this.mode === EntityFormMode.create) {
      successMsg = `City ${this.newEntity.name} created`;
      failMsg = `Can't create city, pls try later`;
    } else {
      successMsg = `City ${this.newEntity.name} updated`;
      failMsg = `Can't change city, pls try later`;
    }

    this.action().then((ret) => {
      this._messageService.success(successMsg);
      this.close();
    }, (err) => {
      this._messageService.error(failMsg);
    });
  }
  //#endregion

  //#region Private method

  private isChanged(): boolean {
    return !(this.newEntity.name === this.originalEntity.name &&
      this.newEntity.addressCode === this.originalEntity.addressCode &&
      this.newEntity.thumbnail === this.originalEntity.thumbnail);
  }
}
