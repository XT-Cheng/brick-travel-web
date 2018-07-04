import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ICityBiz } from '@core/store/bizModel/model/city.biz.model';
import { ICity } from '@core/store/entity/model/city.model';
import { CityService } from '@core/store/providers/city.service';
import { ErrorService } from '@core/store/providers/error.service';
import { WEBAPI_HOST } from '@core/utils/constants';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';

import { EntityFormComponent } from '../../../entity.form.component';

@Component({
  selector: 'bt-city-form',
  templateUrl: 'city.form.component.html',
  styleUrls: ['./city.form.component.scss']
})
export class CityFormComponent extends EntityFormComponent<ICity, ICityBiz> {

  //#region Private member

  //#endregion

  //#region Public member

  uploadUrl = `${WEBAPI_HOST}/fileUpload`;

  //#endregion

  //#region Public property

  //#endregion

  //#region Constructor

  constructor(protected _cityService: CityService, protected _errorService: ErrorService,
    protected _messageService: NzMessageService, protected _activeModal: NzModalRef) {
    super(_cityService, _errorService, _messageService, _activeModal);
  }

  //#endregion

  //#region Interface implementation

  get entityName(): string {
    if (this.newEntity) return this.newEntity.name;

    return '';
  }

  isDataInvalid(): boolean {
    return this.newEntity.thumbnail === '';
  }

  isChanged(): boolean {
    return !(this.newEntity.name === this.originalEntity.name &&
      this.newEntity.addressCode === this.originalEntity.addressCode &&
      this.newEntity.thumbnail === this.originalEntity.thumbnail);
  }

  //#endregion

  //#region Public method

  isNameInValid(name: FormControl): boolean {
    if (name && name.errors)
      return name.invalid && name.errors.required;

    return false;
  }

  isThumbnailInValid(): boolean {
    return !this.newEntity.thumbnail && this.fileList('thumbnail').length === 0;
  }

  beforeUpload = (file: any): boolean => {
    this.getBase64(file, (img: string) => {
      this.addFile('thumbnail', file);
      this.newEntity.thumbnail = img;
    });
    return false;
  }

  //#endregion

  //#region Private method

}
