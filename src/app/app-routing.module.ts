import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ProjectsComponent} from "./projects/projects.component";
import {AddComponent} from "./form/add/add.component";

const routes: Routes = [
    {
	path: "projects",
	component: ProjectsComponent
    },
    {
	path: "add",
	component: AddComponent
    },
    {
        path: 'edit/:id',
        component: AddComponent
    },
    {
        path: 'edit',
        component: AddComponent
    }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
