import { OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IBiz } from '@core/store/bizModel/biz.model';
import { IEntity } from '@core/store/entity/entity.model';
import { EntityService } from '@core/store/providers/entity.service';
import { ErrorService } from '@core/store/providers/error.service';
import { SearchService } from '@core/store/providers/search.service';
import { UIService } from '@core/store/providers/ui.service';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { LayoutDefaultComponent } from '../../layout/default/default.component';
import { ComponentType, EntityFormComponent, EntityFormMode } from './entity.form.component';

export abstract class EntityListComponent<T extends IEntity, U extends IBiz> implements ComponentType,
    OnInit, OnDestroy {
    //#region Private members
    private _layoutCmp: LayoutDefaultComponent;

    private _changeAction = (componentInstance: EntityFormComponent<T, U>) => {
        this._service.change(componentInstance.newEntity, componentInstance.filesToUpload).subscribe(
            (_) => {
                this._modelRef.close();
                this._messageService.success(`${componentInstance.entityName} changed`);
            },
            (err) => {
                this._messageService.error(`Can't edit ${this.entityDescription}, pls try later`);
            });
    }

    private _deleteAction = (entity: U, name: string) => (componentInstance: ModalComponent) => {
        this._service.remove(entity).subscribe(
            (_) => {
                this._modelRef.close();
                this._messageService.success(`${name} deleted`);
            },
            (err) => {
                this._messageService.error(`Can't delete ${this.entityDescription}, pls try later`);
            });
    }

    private _createAction = (componentInstance: EntityFormComponent<T, U>) => {
        this._service.add(componentInstance.newEntity, componentInstance.filesToUpload).subscribe(
            (_) => {
                this._modelRef.close();
                this._messageService.success(`${componentInstance.entityName} created`);
            },
            (err) => {
                this._messageService.error(`Can't create ${this.entityDescription}, pls try later`);
            });
    }

    private _modelRef: NzModalRef;

    private _oKBtnOption = {
        label: 'OK',
        type: 'primary',
        disabled: (componentInstance: EntityFormComponent<T, U>) => {
            return componentInstance.isSubmitDisAllowed();
        }
    };

    private _cancelBtnOption = {
        label: 'Cancel',
        onClick: (componentInstance: EntityFormComponent<T, U>) => {
            this._modelRef.close();
        }
    };

    //#endregion

    //#region Protected members

    protected _destroyed$: Subject<boolean> = new Subject();

    //#endregion

    //#region Constructor

    constructor(protected _route: ActivatedRoute, protected _uiService: UIService<T, U>,
        protected _errorService: ErrorService, protected _modalService: NzModalService,
        protected _messageService: NzMessageService,
        protected _searchService: SearchService, protected _service: EntityService<T, U>) {
        this._service.fetch();
        this._searchService.onSearchSubmit().pipe(takeUntil(this._destroyed$))
            .subscribe(value => {
                this._searchService.currentSearchKey = value.term;
                this._uiService.search(value.term);
            });
    }

    //#endregion

    //#region Protected property

    protected abstract get entityDescription(): string;
    protected abstract get entityName(): string;
    protected abstract get componentType(): any;
    protected abstract get newEntity(): U;

    //#endregion

    //#region Public property

    get layoutComp(): LayoutDefaultComponent {
        return this._layoutCmp;
    }

    set layoutComp(layout: LayoutDefaultComponent) {
        this._layoutCmp = layout;
    }

    //#endregion

    //#region Interface implementation
    ngOnDestroy(): void {
        this._destroyed$.next(true);
        this._destroyed$.complete();
    }

    ngOnInit(): void {
        this._searchService.currentSearchKey = this._uiService.searchKey;
    }

    createEntity() {
        this._modelRef = this._modalService.create({
            nzTitle: `Create ${this.entityDescription}`,
            nzContent: this.componentType,
            nzComponentParams: {
                mode: EntityFormMode.create,
                originalEntity: this.newEntity,
                ...this.createEntityParas
            },
            nzFooter: [{ ...this._oKBtnOption, ...{ onClick: this._createAction } }, this._cancelBtnOption]
        });
    }

    //#endregion

    //#region Public methods

    //#endregion

    //#region Private methods
    private _onReuseInit() {
        this._layoutCmp.entityListComp = this;
    }

    private editEntity(entity: U, name: string) {
        this._modelRef = this._modalService.create({
            nzTitle: `Edit ${this.entityDescription} ${name}`,
            nzContent: this.componentType,
            nzComponentParams: {
                mode: EntityFormMode.edit,
                originalEntity: entity,
                ...this.editEntityParas
            },
            nzFooter: [{ ...this._oKBtnOption, ...{ onClick: this._changeAction } }, this._cancelBtnOption]
        });
    }

    private deleteEntity(entity: U, name: string) {
        this._modelRef = this._modalService.create({
            nzTitle: `Delete ${this.entityDescription} ${name}`,
            nzContent: ModalComponent,
            nzComponentParams: {
                modalHeader: `Confrim`,
                modalContent: `Delete ${name}, are you sure?`,
                ...this.deleteEntityParas
            },
            nzFooter: [{ ...this._oKBtnOption, ...{ disabled: () => false, onClick: this._deleteAction(entity, name) } },
            {
                label: 'Cancel', onClick: () => {
                    this._modelRef.close();
                }
            }]
        });
    }

    //#endregion

    //#region Protected methods
    protected get createEntityParas(): any {
        return {};
    }

    protected get editEntityParas(): any {
        return {};
    }

    protected get deleteEntityParas(): any {
        return {};
    }

    protected edit(entity: U) {
        this.editEntity(entity, entity[this.entityName]);
    }

    protected delete(entity: U) {
        this.deleteEntity(entity, entity[this.entityName]);
    }

    //#endregion
}
