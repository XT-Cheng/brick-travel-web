// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/dist/zone-testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IonicStorageModule } from '@ionic/storage';
import { AuthModule } from '@core/auth/auth.module';
import { StoreModule } from '@core/store/store.module';
import { DataFlushService } from '@core/store/providers/dataFlush.service';
import { first } from 'rxjs/operators';
import { rootReducer } from '@core/store/store.reducer';
import { deepExtend } from '@core/utils/helpers';
import { INIT_APP_STATE, IAppState } from '@core/store/store.model';
import { createLogger } from 'redux-logger';
import { createEpicMiddleware } from 'redux-observable';
import * as Immutable from 'seamless-immutable';
import { stateTransformer } from 'redux-seamless-immutable';
import { NgRedux } from '@angular-redux/store';
import { RootEpics } from '@core/store/store.epic';
import { CoreModule } from '@core/core.module';

export async function initTest() {
  TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
      IonicStorageModule.forRoot(),
      CoreModule,
      AuthModule.forRoot(),
      StoreModule.forRoot()
    ]
  });

  const flushSrv = <DataFlushService>getTestBed().get(DataFlushService);
  const store = <NgRedux<IAppState>>getTestBed().get(NgRedux);
  const rootEpics = <RootEpics>getTestBed().get(RootEpics);
  return flushSrv.restoreState().then((restoredState) => {
    store.configureStore(
      rootReducer,
      <any>Immutable(deepExtend(INIT_APP_STATE, restoredState)),
      [createLogger({ stateTransformer: stateTransformer }), createEpicMiddleware(rootEpics.createEpics())]);
  });
}

declare const require: any;

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);
