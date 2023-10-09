import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import {DataComponent} from "./form/data/data.component";
import {FormComponent} from "./form/form.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'youth';
}
