import { OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IBiz } from '@core/store/bizModel/biz.model';
import { IEntity } from '@core/store/entity/entity.model';
import { EntityService } from '@core/store/providers/entity.service';
import { ErrorService } from '@core/store/providers/error.service';
import { SearchService } from '@core/store/providers/search.service';
import { UIService } from '@core/store/providers/ui.service';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

import { ComponentType, EntityFormComponent, EntityFormMode } from './entity.form.component';

export abstract class EntityListComponent<T extends IEntity, U extends IBiz> implements ComponentType,
    OnInit, OnDestroy {
    //#region Private members

    private _modelRef: NzModalRef;

    private oKBtnOption = {
        label: 'OK',
        type: 'primary',
        disabled: (componentInstance: EntityFormComponent<T, U>) => {
            return componentInstance.isSubmitDisAllowed();
        },
        onClick: (componentInstance: EntityFormComponent<T, U>) => new Promise((resolve, reject) => {
            this._service.change(componentInstance.newEntity, componentInstance.files).subscribe(
                (_) => {
                    this._modelRef.close();
                    resolve();
                },
                (err) => {
                    reject();
                });
        })
    };

    private cancelBtnOption = {
        label: 'Cancel',
        onClick: (componentInstance: EntityFormComponent<T, U>) => {
            this._modelRef.close();
        }
    };

    //#endregion

    //#region Protected members

    protected destroyed$: Subject<boolean> = new Subject();

    //#endregion

    //#region Constructor

    constructor(protected _route: ActivatedRoute, protected _uiService: UIService<T, U>,
        protected _errorService: ErrorService, protected _modalService: NzModalService,
        protected _searchService: SearchService, protected _service: EntityService<T, U>) {
        this._service.fetch();
        this._searchService.onSearchSubmit().pipe(takeUntil(this.destroyed$))
            .subscribe(value => {
                this._searchService.currentSearchKey = value.term;
                this._uiService.search(value.term);
            });
    }

    //#endregion

    //#region Protected property

    protected abstract get entityDescription(): string;
    protected abstract get componentType(): any;
    protected abstract get newEntity(): U;

    //#endregion

    //#region Interface implementation
    ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    ngOnInit(): void {
        this._searchService.currentSearchKey = this._uiService.searchKey;
    }

    editEntity(entity: U, name: string) {
        this._modelRef = this._modalService.create({
            nzTitle: `Edit ${this.entityDescription} ${name}`,
            nzContent: this.componentType,
            nzComponentParams: {
                mode: EntityFormMode.edit,
                originalEntity: entity,
            },
            nzFooter: [this.oKBtnOption, this.cancelBtnOption],
            nzOnOk: (entityForm: EntityFormComponent<T, U>) => new Promise((resolve, reject) => {
                this._service.change(entityForm.newEntity).subscribe((_) => resolve(), (err) => reject());
            })
        });
    }

    async deleteEntity(entity: U, name: string) {
        this._modalService.confirm(
            {
                nzContent: ModalComponent,
                nzComponentParams: {
                    modalHeader: `Confrim`,
                    modalContent: `Delete ${name}, are you sure?`
                },
                nzOnOk: () => new Promise((resolve, reject) => {
                    this._service.remove(entity).subscribe((_) => resolve(), (err) => reject());
                })
            });

    }

    createEntity() {
        this._modalService.create({
            nzTitle: 'Modal Title',
            nzContent: this.componentType,
            nzComponentParams: {
                mode: EntityFormMode.edit,
                originalEntity: this.newEntity,
                title: `Create ${this.entityDescription}`
            },
            nzFooter: null
        });
    }

    //#endregion

    //#region Public methods

    //#endregion

    //#region Protected methods

    //#endregion

}
