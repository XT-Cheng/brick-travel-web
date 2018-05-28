import { NgReduxModule } from '@angular-redux/store';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { EntityEpics } from '@core/store/entity/entity.epic';
import { CityService } from '@core/store/providers/city.service';
import { CityUIService } from '@core/store/providers/city.ui.service';
import { DataFlushService } from '@core/store/providers/dataFlush.service';
import { ErrorInterceptorService } from '@core/store/providers/error.interceptor.service';
import { ErrorService } from '@core/store/providers/error.service';
import { FilterCategoryService } from '@core/store/providers/filterCategory.service';
import { MasterDataService } from '@core/store/providers/masterData.service';
import { TransportationCategoryService } from '@core/store/providers/transportationCategory.service';
import { TravelAgendaService } from '@core/store/providers/travelAgenda.service';
import { TravelAgendaUIService } from '@core/store/providers/travelAgenda.ui.service';
import { UserService } from '@core/store/providers/user.service';
import { ViewPointService } from '@core/store/providers/viewPoint.service';
import { ViewPointUIService } from '@core/store/providers/viewPoint.ui.service';
import { ViewPointCategoryService } from '@core/store/providers/viewPointCategory.service';
import { RootEpics } from '@core/store/store.epic';
import { IonicStorageModule } from '@ionic/storage';

import { throwIfAlreadyLoaded } from './module-import-guard';

const PROVIDERS = [
  ErrorService,
  RootEpics,
  EntityEpics,
  CityService,
  ViewPointService,
  UserService,
  FilterCategoryService,
  MasterDataService,
  TravelAgendaService,
  TravelAgendaUIService,
  ViewPointCategoryService,
  TransportationCategoryService,
  CityUIService,
  ViewPointUIService,
  DataFlushService,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptorService,
    multi: true
  }
];

@NgModule({
  imports: [NgReduxModule, IonicStorageModule],
  providers: PROVIDERS
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
