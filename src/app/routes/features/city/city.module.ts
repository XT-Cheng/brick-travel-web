import { NgModule } from '@angular/core';
import { FileUploadModule } from '@shared/fileUpload/fileUpload.module';

import { CityRoutingModule } from './city-routing.module';
import { CityFormComponent } from './components/form/city.form.component';
import { CityListComponent } from './components/list/city.list.component';

const CITY_COMPONENTS = [
  CityListComponent,
  CityFormComponent
];

@NgModule({
  imports: [
    FileUploadModule,
    CityRoutingModule
  ],
  declarations: [
    ...CITY_COMPONENTS
  ],
  entryComponents: [CityFormComponent]
})
export class CityModule {
}
