import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import localeZhHans from '@angular/common/locales/zh-Hans';
import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DefaultInterceptor } from '@core/net/default.interceptor';
import { StartupService } from '@core/startup/startup.service';
import { SimpleInterceptor } from '@delon/auth';
import { IonicStorageModule } from '@ionic/storage';
import { JsonSchemaModule } from '@shared/json-schema/json-schema.module';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { DelonModule } from './delon.module';
import { LayoutModule } from './layout/layout.module';
import { RoutesModule } from './routes/routes.module';
import { SharedModule } from './shared/shared.module';
import { FileUploadModule } from '@shared/fileUpload/fileUpload.module';
import { WEBAPI_HOST } from '@core/utils/constants';
import { StoreModule } from '@core/store/store.module';
import { AuthModule } from '@core/auth/auth.module';

// angular i18n
registerLocaleData(localeZhHans);

// @delon/form: JSON Schema form
export function StartupServiceFactory(startupService: StartupService): Function {
  return () => startupService.load();
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    DelonModule.forRoot(),
    CoreModule,
    SharedModule,
    LayoutModule,
    RoutesModule,
    // JSON-Schema form
    JsonSchemaModule,
    // Brick Travel Modules
    StoreModule.forRoot(),
    AuthModule.forRoot(),
    FileUploadModule.forRoot({ url: `${WEBAPI_HOST}/fileUpload` }),
    IonicStorageModule.forRoot()
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'zh-Hans' },
    // { provide: HTTP_INTERCEPTORS, useClass: SimpleInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true },
    StartupService,
    {
      provide: APP_INITIALIZER,
      useFactory: StartupServiceFactory,
      deps: [StartupService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
