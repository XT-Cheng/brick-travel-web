import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ITravelAgendaBiz } from '@core/store/bizModel/model/travelAgenda.biz.model';
import { ITravelAgenda } from '@core/store/entity/model/travelAgenda.model';
import { ErrorService } from '@core/store/providers/error.service';
import { TravelAgendaService } from '@core/store/providers/travelAgenda.service';
import { TravelAgendaUIService } from '@core/store/providers/travelAgenda.ui.service';
import { ViewPointService } from '@core/store/providers/viewPoint.service';
import { SearchService } from '@shared/providers/search.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';

import { EntityListComponent } from '../../../entity.list.component';

@Component({
  selector: 'bt-ta-list',
  templateUrl: 'travelAgenda.list.component.html',
  styleUrls: ['./travelAgenda.list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TravelAgendaListComponent extends EntityListComponent<ITravelAgenda, ITravelAgendaBiz> {
  //#region Private members

  //#endregion

  //#region Private members

  //#endregion

  //#region Constructor
  constructor(protected _route: ActivatedRoute,
    protected _searchService: SearchService, protected _modalService: NzModalService, protected _viewPointService: ViewPointService,
    protected _errorService: ErrorService,
    public _travelAgendaService: TravelAgendaService, protected _travelAgendaUIService: TravelAgendaUIService,
    protected _messageService: NzMessageService) {
    super(_route, _travelAgendaUIService, _errorService, _modalService, _searchService, _travelAgendaService);
  }

  //#endregion

  //#region Interface implementation

  protected get componentType(): any {
    throw new Error('not implemented');
  }

  protected get newEntity(): ITravelAgendaBiz {
    throw new Error('not implemented');
  }

  protected get entityDescription(): string {
    return 'Travel Agenda';
  }

  //#endregion

  //#region Public method
  edit(travelAgenda: ITravelAgendaBiz) {
    this.editEntity(travelAgenda, travelAgenda.name);
  }

  delete(travelAgenda: ITravelAgendaBiz) {
    this.deleteEntity(travelAgenda, travelAgenda.name).then((ret) => {
      if (ret) {
        this._messageService.success(`Travel Agenda ${travelAgenda.name} deleted`);
      }
    }, (err) => {
      this._messageService.error(`Can't delete Travel Agenda, pls try later`);
    });
  }

  //#endregion
}
