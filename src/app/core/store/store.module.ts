import { NgRedux, NgReduxModule } from '@angular-redux/store';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { createLogger } from 'redux-logger';
import { createEpicMiddleware } from 'redux-observable';
import { stateTransformer } from 'redux-seamless-immutable';
import * as Immutable from 'seamless-immutable';

import { TokenService } from '../auth/providers/tokenService';
import { TokenStorage } from '../auth/providers/tokenStorage';
import { deepExtend } from '../utils/helpers';
import { EntityEpics } from './entity/entity.epic';
import { CityService } from './providers/city.service';
import { CityUIService } from './providers/city.ui.service';
import { DataFlushService } from './providers/dataFlush.service';
import { ErrorInterceptorService } from '@core/interceptor/error.interceptor.service';
import { ErrorService } from './providers/error.service';
import { FilterCategoryService } from './providers/filterCategory.service';
import { MasterDataService } from './providers/masterData.service';
import { TransportationCategoryService } from './providers/transportationCategory.service';
import { TravelAgendaService } from './providers/travelAgenda.service';
import { TravelAgendaUIService } from './providers/travelAgenda.ui.service';
import { UserService } from './providers/user.service';
import { ViewPointService } from './providers/viewPoint.service';
import { ViewPointUIService } from './providers/viewPoint.ui.service';
import { ViewPointCategoryService } from './providers/viewPointCategory.service';
import { RootEpics } from './store.epic';
import { IAppState, INIT_APP_STATE } from './store.model';
import { rootReducer } from './store.reducer';
import { throwIfAlreadyLoaded } from '@core/module-import-guard';
import { JWTInterceptor } from '@delon/auth';
import { SearchService } from '@core/store/providers/search.service';

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
    SearchService
];

@NgModule({
    imports: [NgReduxModule, HttpClientModule, IonicStorageModule]
})
export class StoreModule {
    constructor(@Optional() @SkipSelf() parentModule: StoreModule, private _rootEpics: RootEpics,
        private _masterDataService: MasterDataService,
        private _dataFlushService: DataFlushService, private _tokenService: TokenService,
        private _storage: Storage,
        private _store: NgRedux<IAppState>) {
        throwIfAlreadyLoaded(parentModule, 'StoreModule');
    }

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: StoreModule,
            providers: [
                ...PROVIDERS
            ]
        };
    }
}
