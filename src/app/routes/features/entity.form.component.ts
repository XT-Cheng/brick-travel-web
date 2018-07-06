import { ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IBiz } from '@core/store/bizModel/biz.model';
import { IEntity } from '@core/store/entity/entity.model';
import { EntityService } from '@core/store/providers/entity.service';
import { ErrorService } from '@core/store/providers/error.service';
import { ObjectID } from 'bson';
import { NzMessageService, NzModalRef, UploadFile } from 'ng-zorro-antd';

import { LayoutDefaultComponent } from '../../layout/default/default.component';

export enum EntityFormMode {
    create,
    edit
}

export interface ComponentType {
    createEntity();
    layoutComp: LayoutDefaultComponent;
}

export abstract class EntityFormComponent<T extends IEntity, U extends IBiz> {

    //#region Protected member

    @ViewChild('form') protected _form: NgForm;

    //#endregion

    //#region Private member

    private _newEntity: U;
    private _originalEntity: U;
    private _filesMap: Map<string, Map<string, any>> = new Map<string, Map<string, any>>();

    //#endregion

    //#region Public member

    public mode: EntityFormMode = EntityFormMode.create;

    //#endregion

    //#region Public property
    get newEntity(): U {
        return this._newEntity;
    }

    get filesToUpload(): Map<string, UploadFile[]> {
        const result: Map<string, UploadFile[]> = new Map<string, UploadFile[]>();

        this._filesMap.forEach((value, key) => {
            value.forEach((file) => {
                if (result.has(key)) {
                    result.get(key).push(file);
                } else {
                    result.set(key, [file]);
                }
            });
        });

        return result;
    }

    abstract get entityName(): string;

    //#endregion

    //#region Protected property

    protected set originalEntity(entity: U) {
        if (entity.id === '') {
            entity.id = new ObjectID().toHexString();
        }
        this._originalEntity = entity;
        this._newEntity = this.copyEntity(entity);

        this.onOriginalEntitySet();
    }

    protected get originalEntity(): U {
        return this._originalEntity;
    }

    //#endregion

    //#region Constructor
    constructor(protected _service: EntityService<T, U>, protected _errorService: ErrorService,
        protected _messageService: NzMessageService, protected _activeModal: NzModalRef) {
    }

    //#endregion

    //#region Public methods

    public isSubmitDisAllowed(): boolean {
        return !this.isChanged() || this._form.invalid || this.isDataInvalid();
    }

    //#endregion

    //#region Protected methods

    protected copyEntity(originalEntity: U): U {
        return JSON.parse(JSON.stringify(originalEntity));
    }

    protected onOriginalEntitySet() {

    }

    protected fileList(key: string): any[] {
        const result: any[] = [];

        if (this._filesMap.has(key)) {
            const files = this._filesMap.get(key);
            files.forEach((file) => {
                result.push(file);
            });
        }

        return result;
    }

    protected addFile(key: string, file?: UploadFile) {
        if (file) {
            if (this._filesMap.has(key)) {
                this._filesMap.get(key).set(file.uid, file);
            } else {
                const map = new Map<string, UploadFile>();
                map.set(file.uid, file);
                this._filesMap.set(key, map);
            }
        } else {
            this._filesMap.set(key, new Map<string, UploadFile>());
        }
    }

    protected removeFile(key: string, uid: string) {
        if (this._filesMap.has(key)) {
            this._filesMap.get(key).delete(uid);
        }
    }

    protected getBase64(img: File, callback: (img: {}) => void): void {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    //#endregion

    //#region Public abstract methods

    public abstract isChanged(): boolean;

    public abstract isDataInvalid(): boolean;

    //#endregion
}
