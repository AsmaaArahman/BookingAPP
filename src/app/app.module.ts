import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import {FormModule} from "./form/form.module";
import { ProjectsComponent } from './projects/projects.component';

@NgModule({
    declarations: [
	AppComponent,
	ProjectsComponent
    ],
    imports: [
	AppRoutingModule,
	BrowserModule,
	BrowserAnimationsModule,
	FormModule,
	FormsModule,
	ReactiveFormsModule,
	MaterialModule,
	HttpClientModule
    ],
    providers: [DatePipe],
    bootstrap: [AppComponent]
})
export class AppModule { }
