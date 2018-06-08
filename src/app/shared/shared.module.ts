import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DelonABCModule } from '@delon/abc';
import { DelonACLModule } from '@delon/acl';
import { DelonFormModule } from '@delon/form';
import { AlainThemeModule } from '@delon/theme';
import { AMapComponent } from '@shared/components/a-map/a-map.component';
import { InformationWindowComponent } from '@shared/components/a-map/information-window/information-window.component';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { AutofocusDirective } from '@shared/directives/autofocus.directive';
import { DragulaDirective } from '@shared/directives/dragula.directive';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CountdownModule } from 'ngx-countdown';
import { RateComponent } from '@shared/components/a-map/rate/rate.component';
import { ViewPointMarkerComponent } from '@shared/components/a-map/viewpoint-marker/viewpoint-marker.component';

// delon
// region: third libs
const THIRDMODULES = [
  NgZorroAntdModule,
  CountdownModule
];
// endregion

// region: your componets & directives
const COMPONENTS = [ModalComponent, InformationWindowComponent, AMapComponent, RateComponent, ViewPointMarkerComponent];
const DIRECTIVES = [AutofocusDirective, DragulaDirective];
const ENTRIES = [InformationWindowComponent, ViewPointMarkerComponent, ModalComponent];
// endregion

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    AlainThemeModule.forChild(),
    DelonABCModule,
    DelonACLModule,
    DelonFormModule,
    // third libs
    ...THIRDMODULES
  ],
  declarations: [
    // your components
    ...COMPONENTS,
    ...DIRECTIVES
  ],
  entryComponents: [
    ...ENTRIES
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AlainThemeModule,
    DelonABCModule,
    DelonACLModule,
    DelonFormModule,
    // third libs
    ...THIRDMODULES,
    // your components
    ...COMPONENTS,
    ...DIRECTIVES
  ]
})
export class SharedModule { }
