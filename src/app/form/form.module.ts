import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { FormRoutingModule } from './form-routing.module';
import { FormComponent } from './form.component';
import { MaterialModule } from '../material.module';
import { AddComponent, DeleteImgDialog } from './add/add.component';
import { DataComponent, DeleteDialog, ShowDialog } from './data/data.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    FormComponent,
    AddComponent,
    DataComponent,
    DeleteDialog,
    ShowDialog,
    DeleteImgDialog
  ],
  imports: [
    CommonModule,
    FormRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ], exports: [DataComponent],
  providers: [DatePipe],
  entryComponents: [ShowDialog,DeleteDialog,DeleteImgDialog]
})
export class FormModule { }
