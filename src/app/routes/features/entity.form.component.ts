import { IBiz } from '@core/store/bizModel/biz.model';
import { IEntity } from '@core/store/entity/entity.model';
import { EntityService } from '@core/store/providers/entity.service';
import { ErrorService } from '@core/store/providers/error.service';
import { ObjectID } from 'bson';
import { NzMessageService, NzModalRef, UploadFile } from 'ng-zorro-antd';

export enum EntityFormMode {
    create,
    edit
}

export interface ComponentType {
    createEntity();
}

export abstract class EntityFormComponent<T extends IEntity, U extends IBiz> {
    //#region Private member

    private _newEntity: U;
    private _originalEntity: U;
    private _filesMap: Map<string, UploadFile[]> = new Map<string, UploadFile[]>();

    //#endregion

    //#region Protected member
    protected _mode: EntityFormMode = EntityFormMode.create;
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

    //#endregion

    //#region Protected methods

    protected addFile(key: string, file: UploadFile) {
        if (this._filesMap.has(key)) {
            this._filesMap.get(key).push(file);
        } else {
            this._filesMap.set(key, [file]);
        }
    }

    protected getBase64(img: File, callback: (img: {}) => void): void {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
      }

    //#endregion

    //#region Public abstract methods

    public abstract isSubmitDisAllowed(): boolean;

    //#endregion
}
