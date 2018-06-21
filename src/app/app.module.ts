import { registerLocaleData } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import localeZhHans from '@angular/common/locales/zh-Hans';
import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthModule } from '@core/auth/auth.module';
import { StartupService } from '@core/startup/startup.service';
import { StoreModule } from '@core/store/store.module';
import { IonicStorageModule } from '@ionic/storage';
import { JsonSchemaModule } from '@shared/json-schema/json-schema.module';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { DelonModule } from './delon.module';
import { LayoutModule } from './layout/layout.module';
import { RoutesModule } from './routes/routes.module';
import { SharedModule } from './shared/shared.module';

import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// angular i18n
registerLocaleData(localeZhHans);

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, `assets/tmp/i18n/`, '.json');
}

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
    IonicStorageModule.forRoot()
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'zh-Hans' },
    // { provide: HTTP_INTERCEPTORS, useClass: SimpleInterceptor, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true },
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
