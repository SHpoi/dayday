import { NgModule } from '@angular/core';
import { TimepickerComponent } from './timepicker/timepicker';
import {IonicPageModule} from "ionic-angular";
import { TaskListComponent } from './task-list/task-list';
@NgModule({
	declarations: [TimepickerComponent,
    TaskListComponent],
	imports: [IonicPageModule.forChild(TimepickerComponent)],
	exports: [TimepickerComponent,
    TaskListComponent]
})
export class ComponentsModule {}
