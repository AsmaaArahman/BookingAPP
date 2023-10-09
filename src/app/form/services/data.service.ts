//TOTO(walid): find out the exact useage of res.type;

import { Injectable, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment as env } from 'src/environments/environment';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  onDataUpdate = new EventEmitter();
  onImg = new EventEmitter();
  onEdit = new EventEmitter();
  onRmImg = new EventEmitter();
  constructor(public datepipe: DatePipe, private router: Router, private http: HttpClient) { }

  upload(files) {

    let fd: FormData = new FormData();

    for (let i = 0; i < files.length; i++) {
      const el = files[i];
      fd.append("images[]", el, el.name);
    }

    this.http
      .post(env.api.form.images.post(), fd)
      .subscribe(response => {
        console.log(response);
        this.onImg.emit(response)
      }, err => {
        console.log(err);
      });

  }

  deleteFile(id) {
    let res;
    this.http
      .delete(env.api.form.images.delete(id))
      .subscribe(response => {
        console.log(response);
        res = response;
        res.uri = id;
        this.onRmImg.emit(res);
      }, err => {
        console.log(err);
        res = err
      });
    return res;
  }


  deleteForm(e) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let res = {
      type: null,
      body: null
    };
    let options = { headers: headers };
    this.http.delete(env.api.form.delete(e.id.toString()), options).toPromise().then((data: any) => {
      res.type = true;
      res.body = data;
      this.getAllData(null, true);
    }).catch((err) => {
      res.type = false;
      res.body = err;
      this.getAllData(null, true);

    })
  }


  getAllData(query, willSohw: boolean) {

    let link = env.api.form.getAll();



    if (query) {
      let par = []
      if (query.filter) {
        par.push(`q=${query.filter}`)
      }
      if (query.page) {
        par.push(`page=${query.page}`)
      }
      if (query.per) {
        par.push(`per=${query.per}`)
      }
      link += `?${par.join('&')}`
    } else {
      link += '?per=10'
    }

    console.log(link);


    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let options = { headers: headers };
    let res = {
      type: null,
      meta: null,
      body: null
    };
    this.http.get(link, options).toPromise().then((data: any) => {
      res.type = true;
      res.body = data.wrapper.data;
      delete data.wrapper.data;
      res.meta = data.wrapper;

      console.log(res);
      
      if (willSohw) {
        this.onDataUpdate.emit(res);
      } else {
        return res
      }
    }).catch((err) => {
      res.type = false;
      res.body = err;
      if (willSohw) {
        this.onDataUpdate.emit(res);
      } else {
        return res
      }
    })
  }

  getOne(id, forEdit): { body: string, type: any } {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    let options = { headers: headers };
    let res = {
      type: null,
      body: null
    }
    this.http.get(env.api.form.getOne(id), options).toPromise().then((data: any) => {
      res.type = true;
      res.body = data.wrapper[0];
      res.body.date = this.datepipe.transform(res.body.date, 'yyyy-MM-dd')
      if (forEdit) {
        this.onEdit.emit(res)
      } else {
        return res;
      }
    }).catch((err) => {
      res.type = false;
      res.body = err;
      if (forEdit) {
        this.onEdit.emit(res)
      } else {
        return res;
      }
    })
    return res

  }

  submitForm(isNew, data, redirect) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'/*,
      'Authorization': this.basic */
    });
    let options = { headers: headers };
    let res = {
      type: null,
      body: null
    }
    data.project.date = this.datepipe.transform(data.project.date, 'yyyy-MM-dd 00:00:00')
    console.log(data.project.date);
    let proj = { main_form: data.project }

    let url = isNew ? env.api.form.post() : env.api.form.update(data.id)

    this.http.post(url, proj, options).toPromise().then((data: any) => {
      res.type = true;
      res.body = data;
      if (redirect) {
          this.router.navigate(['/projects'])
      }
      this.getAllData(null, true)
    }).catch((data: any) => {
      res.type = false;
      res.body = data;
    })


    return res;
  }
}
