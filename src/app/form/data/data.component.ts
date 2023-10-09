import { Component, OnInit, ChangeDetectorRef, Inject, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { environment as env } from "src/environments/environment";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { element } from 'protractor';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatPaginator } from '@angular/material';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';
import { platform } from 'os';
@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {


  constructor(private router: Router, private dataS: DataService, public dialog: MatDialog, public datepipe: DatePipe, private changeDetectorRefs: ChangeDetectorRef, private http: HttpClient) { }

  displayedColumns: string[] = ['index', 'name', 'field', 'date', 'dateCreated', 'edit', 'delete'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  res = {
    type: null,
    body: null,
    meta: null
  };

  query = {
    filter: null,
    per: 10,
    page: 1,
    current_page: null,
    last_page: null,
    index : null
  }

  current_page


  search(p) {

    this.query.page = p;
    this.dataS.getAllData(this.query, true)

  }

  data(d) {
    var result = [];
    d.forEach((e, i) => {
      let index = i + 1;
      let name = e.name;
      let dateCreated = this.datepipe.transform(e.created_at, 'yyyy/MM/dd HH:mm');
      let date = this.datepipe.transform(e.date, 'yyyy/MM/dd')
      let field = e.field;
      let id = e.id
      result.push(
        {
          id,
          index,
          name,
          field,
          dateCreated,
          date
        }
      );
    });
    return result;
  }

  deleteForm(e) {

    const dialogRef = this.dialog.open(DeleteDialog, {
      width: 'auto',
      data: {
        delete: null,
        element: e
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataS.deleteForm(e)
      }
    });
  }
  showForm(e) {

    let total = 0;
    this.res.body[(e.index - 1)].financials.forEach(el => {
      total += el.budget;
    });
    const dialogRef = this.dialog.open(ShowDialog, {
	width: '100vw',
	height: "90vh",
      data: {
        element: this.res.body[(e.index - 1)],
        total,
        host: env.host
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      switch (result) {
        case 'edit':
          this.router.navigate(['/edit', e.id]);
          break;
        case 'delete':
          this.deleteForm(e)
          break;

        default:
          break;
      }
    });
  }

  updateData() {
    this.dataS.getAllData(this.query, true)
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  toDate(id) {
    var result = new Date(parseInt(id.substring(0, 8), 16) * 1000)
    return result;
  }

  updateTable() {
    this.dataSource.data = this.data(this.res.body);
  }

  ngOnInit() {
    this.dataS.onDataUpdate.subscribe((data) => {
      this.res = data;
      this.query.current_page = data.meta.current_page;
      this.query.last_page = data.meta.last_page;
      this.query.index = data.meta.from - 1;
      this.updateTable();
    });
    this.search(1)
  }

}

@Component({
  selector: 'delete-dialog',
  templateUrl: 'delete.html',
})
export class DeleteDialog {

  constructor(
    public dialogRef: MatDialogRef<DeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data) { }

  action(state): void {
    this.data.delete = state
    this.dialogRef.close(this.data.delete);
  }
  validation = ''

}
@Component({
  selector: 'show-dialog',
  templateUrl: 'show.html',
  styleUrls: ['./show.css']

})
export class ShowDialog {


  constructor(public datepipe: DatePipe,
    public dialogRef: MatDialogRef<ShowDialog>,
    @Inject(MAT_DIALOG_DATA) public data) { }

  img(uri) {
    return env.api.form.images.dist(uri)
  }
  action(state): void {
    this.dialogRef.close(state);
  }

}
