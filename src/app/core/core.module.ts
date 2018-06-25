import { NgReduxModule } from '@angular-redux/store';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { ErrorInterceptorService } from '@core/interceptor/error.interceptor.service';
import { IonicStorageModule } from '@ionic/storage';

import { throwIfAlreadyLoaded } from './module-import-guard';
import { I18NService } from '@core/i18n/i18n.service';

const PROVIDERS = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptorService,
    multi: true
},
I18NService
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
