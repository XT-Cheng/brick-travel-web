import { NgModule } from '@angular/core';
import { FileUploadModule } from '@shared/fileUpload/fileUpload.module';

import { TravelAgendaListComponent } from './components/list/travelAgenda.list.component';
import { TravelAgendaRoutingModule } from './travelAgenda-routing.module';

const TRAVELAGENDA_COMPONENTS = [
  TravelAgendaListComponent
];

@NgModule({
  imports: [
    FileUploadModule,
    TravelAgendaRoutingModule
  ],
  declarations: [
    ...TRAVELAGENDA_COMPONENTS
  ],
  entryComponents: [TravelAgendaListComponent]
})
export class TravelAgendaModule {
}
