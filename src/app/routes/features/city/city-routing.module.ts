import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CityListComponent } from './components/list/city.list.component';

const routes: Routes = [{
  path: '', component: CityListComponent // , data: { title: 'City', titleI18n: 'City' }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CityRoutingModule {
}
