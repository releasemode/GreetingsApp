import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  // ApiBasePath = "http://103.104.48.64:81/api/v1/";
  // imageBasePath = "http://103.104.48.64:81/uploads/";
  ApiBasePath = "http://24.199.66.226/api/v1/";
  imageBasePath = "http://24.199.66.226/uploads/";

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,DELETE,PUT,PATCH',
      'Cache-Control': 'No-Cache'
    })
  }
  constructor(
    private http: HttpClient, private route: Router,
  ) { }

  // Handle API errors
  handleError(error: HttpErrorResponse) {

    let errorMessage: any = {
      code: "",
      message: "",
      response: ""
    }
    if (error.error instanceof ErrorEvent) {
      errorMessage.code = "00000"
      errorMessage.message = error.message
    } else {
      errorMessage.code = error.status;
      errorMessage.message = error.message
      errorMessage.response = error.error
    }
    return throwError(() => errorMessage);
  };

  handlerMessage(errorCode: any) {
    switch (errorCode) {
      case ("00000"): this.httpErrorHandler("Please check network connection!", "");
        break;
      case (500): this.httpErrorHandler("Internal server error!", "");
        break;
      case (202): this.httpErrorHandler("Data incorrect!", "");
        break;
      case (404): this.httpErrorHandler("Not found.", "");
        break;
      case (405): this.httpErrorHandler("HTTP method incorrect.", "");
        break;
      case (0): this.httpErrorHandler("Service temporarily unavailable, Please try again later.", "");
        break;
      default: this.httpErrorHandler("new error - " + errorCode, "");
    }
  }

  httpErrorHandler(message: any, redirectTo: string) {
    Swal.fire({
      title: "Network error",
      text: message,
      icon: 'info',
    }).then((result) => {
      if (result) {
        if (redirectTo != "") {
          this.route.navigate([redirectTo]);
        }
      }
    })
  }

  //-------------------- user CRUD --------------------// 

  createProduct(body: object): Observable<any> {
    let apiUrl = this.ApiBasePath + 'product/create';
    return this.http.post(apiUrl, body, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getAllProducts(): Observable<any> {
    let apiUrl = this.ApiBasePath + 'product/getAll';
    return this.http.get(apiUrl, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getProductById(id: number): Observable<any> {
    let apiUrl = this.ApiBasePath + 'product/getById/' + id;
    return this.http.get(apiUrl, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateProductById(body:any): Observable<any> {
    let apiUrl = this.ApiBasePath + 'product/updateById';
    return this.http.put(apiUrl, body, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteProduct(id: number): Observable<any> {
    let apiUrl = this.ApiBasePath + 'product/deleteById/' + id;
    return this.http.delete(apiUrl, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  DocUpload(body: any) {
    let apiUrl = this.ApiBasePath + 'upload/productImage';
    var settings: any = {
      "method": "POST",
      "timeout": 0,
      "processData": false,
      "mimeType": "multipart/form-data",
      "contentType": false,
    };

    return this.http.post(apiUrl, body, settings)
      .pipe(
        catchError(this.handleError)
      )
  }
}
