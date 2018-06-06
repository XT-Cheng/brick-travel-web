import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FileUploadModule } from '@shared/fileUpload/fileUpload.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';

import { CityRoutingModule } from './city-routing.module';
import { CityFormComponent } from './components/form/city.form.component';
import { CityListComponent } from './components/list/city.list.component';

const CITY_COMPONENTS = [
  CityListComponent,
  CityFormComponent
];

@NgModule({
  imports: [
    CommonModule,
    FileUploadModule,
    CityRoutingModule,
    NgZorroAntdModule.forRoot()
  ],
  declarations: [
    ...CITY_COMPONENTS
  ],
  entryComponents: [CityFormComponent]
})
export class CityModule {
}
