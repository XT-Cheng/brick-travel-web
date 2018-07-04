import { ViewChild } from '@angular/core';
import { IBiz } from '@core/store/bizModel/biz.model';
import { IEntity } from '@core/store/entity/entity.model';
import { EntityService } from '@core/store/providers/entity.service';
import { ErrorService } from '@core/store/providers/error.service';
import { ObjectID } from 'bson';
import { NzMessageService, NzModalRef, UploadFile } from 'ng-zorro-antd';
import { LayoutDefaultComponent } from '../../layout/default/default.component';
import { NgForm } from '@angular/forms';

export enum EntityFormMode {
    create,
    edit
}

export interface ComponentType {
    createEntity();
    layoutComp: LayoutDefaultComponent;
}

export abstract class EntityFormComponent<T extends IEntity, U extends IBiz> {
    @ViewChild('form') protected _form: NgForm;

    //#region Private member

    private _newEntity: U;
    private _originalEntity: U;
    private _filesMap: Map<string, any[]> = new Map<string, any[]>();

    //#endregion

    //#region Public member

    public mode: EntityFormMode = EntityFormMode.create;

    //#endregion

    //#region Public property
    get newEntity(): U {
        return this._newEntity;
    }

    get files(): Map<string, UploadFile[]> {
        return this._filesMap;
    }

    abstract get entityName(): string;

    //#endregion

    //#region Protected property

    protected set originalEntity(entity: U) {
        if (entity.id === '') {
            entity.id = new ObjectID().toHexString();
        }
        this._originalEntity = entity;
        this._newEntity = Object.assign({}, entity);
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
    protected fileList(key: string): UploadFile[] {
        return this._filesMap.get(key);
    }

    protected setFileList(key: string, files: UploadFile[]) {
        this._filesMap.set(key, files);
    }

    protected addFile(key: string, file?: UploadFile) {
        if (file) {
            if (this._filesMap.has(key)) {
                this._filesMap.get(key).push(file);
            } else {
                this._filesMap.set(key, [file]);
            }
        } else {
            this._filesMap.set(key, []);
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
