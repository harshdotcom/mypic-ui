import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpEventType } from '@angular/common/http';
import { catchError, Observable, timeout, Subject, map, forkJoin } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  httpHeaders: any;
  removeNotesIconSub = new Subject<any>();
  removeNotesIconObs = this.removeNotesIconSub.asObservable();
  addNotesIconSub = new Subject<any>();
  addNotesIconObs = this.addNotesIconSub.asObservable();
  constructor(private httpClient: HttpClient) { }
  setHttpHeaders() {
    var token = localStorage.getItem("token");
    if (token) {
      this.httpHeaders = new HttpHeaders().set("Content-Type", "text/html;charset=utf-8")
        .set("Ocp-Apim-Subscription-Key", environment.ocpApiKey)
        .set("Authorization", "Bearer " + token)
    } else {
      this.httpHeaders = new HttpHeaders().set("Content-Type", "text/html;charset=utf-8")
        .set("Ocp-Apim-Subscription-Key", environment.ocpApiKey)
    }
    return this.httpHeaders;
  }
  reutrnHttpObj(url:any, metadata:any):Observable<any>{
    return this.httpClient.head(url, metadata)
  }
  getHttpParams(queryParams: any) {
    let parameters = new HttpParams();
    for (var key in queryParams) {
      parameters = parameters.append(key, queryParams[key])
    }
    return parameters;
  }
  get(url: string, queryParams = new Object()): Observable<any> {
    var httpHeaders: any = this.setHttpHeaders();
    var httpParams = this.getHttpParams(queryParams);
    return this.httpClient.get<any>(url, { headers: httpHeaders, params: httpParams })
      .pipe(catchError((err: any) => {
        this.errorHandler(err);
        throw err
      }));
  }
  post(url: string, queryParams = new Object(), data = new Object()): Observable<any> {
    var httpHeaders = this.setHttpHeaders();
    var httpParams = this.getHttpParams(queryParams);
    let reqParams: any = { headers: httpHeaders, params: httpParams }
    return this.httpClient.post<any>(url, data, reqParams).pipe(
      catchError((err: any) => {
        this.errorHandler(err);
        throw err
      }));
  }
  put(url: string, queryParams = new Object(), data = new Object()): Observable<any> {
    var httpHeaders: any = this.setHttpHeaders();
    var httpParams = this.getHttpParams(queryParams);
    return this.httpClient.put<any>(url, data, { headers: httpHeaders, params: httpParams }).pipe(catchError((err: any) => {
      this.errorHandler(err);
      throw err
    }));
  }
  putSaas(url: string, data: Blob | ArrayBuffer | Uint8Array, contentType?: string): Observable<any> {
    const inferredType =
      (data as File)?.type ||
      (data as any)?.type ||
      contentType ||
      'application/octet-stream';

    const headers = new HttpHeaders({
      'x-ms-blob-type': 'BlockBlob',
      'Content-Type': inferredType
    });

    return this.httpClient.put<any>(url, data, { headers }).pipe(
      catchError((err: any) => {
        this.errorHandler(err);
        throw err;
      })
    );
  }

  putSaasWithProgress(url: string, data: Blob | ArrayBuffer | Uint8Array, contentType?: string): Observable<any> {
    const inferredType =
      (data as File)?.type ||
      (data as any)?.type ||
      contentType ||
      'application/octet-stream';

    const headers = new HttpHeaders({
      'x-ms-blob-type': 'BlockBlob',
      'Content-Type': inferredType
    });

    return this.httpClient.put<any>(url, data, { 
      headers, 
      reportProgress: true, 
      observe: 'events' 
    }).pipe(
      map((event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          const progress = Math.round(100 * event.loaded / event.total);
          return { type: 'progress', progress };
        } else if (event.type === HttpEventType.Response) {
          return { type: 'response', response: event.body };
        }
        return event;
      }),
      catchError((err: any) => {
        this.errorHandler(err);
        throw err;
      })
    );
  }
  postWithStringResponse(url: string, queryParams = new Object(), data = new Object()): Observable<any> {
    var httpHeaders = this.setHttpHeaders();
    var httpParams = this.getHttpParams(queryParams);
    let reqData: any = { headers: httpHeaders, params: httpParams, responseType: 'text' }
    return this.httpClient.post<any>(url, data, reqData).pipe(catchError((err: any) => {
      this.errorHandler(err);
      throw err
    }));
  }
  delete(url: string, queryParams = new Object()): Observable<any> {
    var httpHeaders: any = this.setHttpHeaders();
    var httpParams = this.getHttpParams(queryParams);
    return this.httpClient.delete<any>(url, { headers: httpHeaders, params: httpParams }).pipe(catchError((err: any) => {
      this.errorHandler(err);
      throw err
    }));
  }

  fileUpload(url: string, queryParams = new Object(), data = new Object()): Observable<any> {
    var httpHeaders;
    var token = localStorage.getItem("token");
    if (token) {
      httpHeaders = new HttpHeaders()
        // .set("Content-Type", "multipart/form-data;boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW")
        .set("Ocp-Apim-Subscription-Key", environment.ocpApiKey)
        .set("Authorization", "Bearer " + token)
    } else {
      httpHeaders = new HttpHeaders()
        // .set("Content-Type", "multipart/form-data;boundary=--14737809831466499882746641449")
        .set("Ocp-Apim-Subscription-Key", environment.ocpApiKey)
    }
    var httpParams = this.getHttpParams(queryParams);
    const timeoutValue = 600000; // 10 minutes
    const requestOptions: any = {
      headers: httpHeaders,
      params: httpParams,
    };
    return this.httpClient.post<any>(url, data, requestOptions).pipe(
      timeout(timeoutValue),
      catchError((err: any) => {
        this.errorHandler(err);
        throw err
      }));
  }

  fileUploadWithProgress(url: string, queryParams = new Object(), data = new Object()): Observable<any> {
    var httpHeaders;
    var token = localStorage.getItem("token");
    if (token) {
      httpHeaders = new HttpHeaders()
        .set("Ocp-Apim-Subscription-Key", environment.ocpApiKey)
        .set("Authorization", "Bearer " + token)
    } else {
      httpHeaders = new HttpHeaders()
        .set("Ocp-Apim-Subscription-Key", environment.ocpApiKey)
    }
    var httpParams = this.getHttpParams(queryParams);
    const timeoutValue = 600000; // 10 minutes
    const requestOptions: any = {
      headers: httpHeaders,
      params: httpParams,
      reportProgress: true,
      observe: 'events'
    };
    return this.httpClient.post<any>(url, data, requestOptions).pipe(
      timeout(timeoutValue),
      map((event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          const progress = Math.round(100 * event.loaded / event.total);
          return { type: 'progress', progress };
        } else if (event.type === HttpEventType.Response) {
          return { type: 'response', response: event.body };
        }
        return event;
      }),
      catchError((err: any) => {
        this.errorHandler(err);
        throw err
      }));
  }

  errorHandler(e: any) {
  }

  getEPCDetails(url:string,queryParams= new Object()){
    var token = localStorage.getItem("token");
    var httpParams = this.getHttpParams(queryParams);
    if(token){
      var httpHeaders = new HttpHeaders()
      .set('Authorization',token)
      .set("Ocp-Apim-Subscription-Key",environment.ocpApiKey)
      .set('auth-token','Basic c3VyYWpAcGhpLWNpLmNvbTpiMWNmM2RkZDliYThhMTdmNjg4NDNjMjQxMDFiMzkyYjY1Nzg5NjM0')
    }
    else{
      var httpHeaders = new HttpHeaders()
      .set("Ocp-Apim-Subscription-Key",environment.ocpApiKey)
      .set('auth-token','Basic c3VyYWpAcGhpLWNpLmNvbTpiMWNmM2RkZDliYThhMTdmNjg4NDNjMjQxMDFiMzkyYjY1Nzg5NjM0')
    }
    return this.httpClient.get<any>(url,{headers:httpHeaders,params:httpParams})
    .pipe(catchError((err:any)=>{
       this.errorHandler(err);
       throw err
    }));
  }

  genAIPost(url: string, queryParams = new Object(), data = new Object()): Observable<any> {
    var genAIHeaders : any
    var token = localStorage.getItem("token");
    if (token) {
      genAIHeaders = new HttpHeaders().set("Content-Type", "text/html;charset=utf-8")
        .set("Ocp-Apim-Subscription-Key", environment.ocpApiKey)
        .set("GenAI-Subscription-Key" , environment.genAIocpApiKey)
        .set("Authorization", "Bearer " + token)
        .set("tenant", environment.tenantVariable);
    } else {
      genAIHeaders = new HttpHeaders().set("Content-Type", "text/html;charset=utf-8")
        .set("Ocp-Apim-Subscription-Key", environment.ocpApiKey)
    }
    var httpHeaders = genAIHeaders;
    var httpParams = this.getHttpParams(queryParams);
    let reqParams: any = { headers: httpHeaders, params: httpParams }
    return this.httpClient.post<any>(url, data, reqParams).pipe(
      catchError((err: any) => {
        this.errorHandler(err);
        throw err
      }));
  }

    getAndMergeGeoJson(list:any[]){
    var token = localStorage.getItem("token");
    if(token){
      var httpHeaders = new HttpHeaders()
      .set('Authorization',token)
      .set("Ocp-Apim-Subscription-Key",this.getOcpKey(""))
      .set('auth-token','Basic c3VyYWpAcGhpLWNpLmNvbTpiMWNmM2RkZDliYThhMTdmNjg4NDNjMjQxMDFiMzkyYjY1Nzg5NjM0')
    }
    else{
      var httpHeaders = new HttpHeaders()
      .set("Ocp-Apim-Subscription-Key",this.getOcpKey(""))
      .set('auth-token','Basic c3VyYWpAcGhpLWNpLmNvbTpiMWNmM2RkZDliYThhMTdmNjg4NDNjMjQxMDFiMzkyYjY1Nzg5NjM0')
    }
    // return of(list).pipe( mergeMap(res => {
    // // var httpParams = this.getHttpParams({ecode:res.boroughs[0].includedECodes[0]});
    //   return this.httpClient.get<any>(url,{headers:httpHeaders,params:httpParams})      //inner observable   
    // }));

    return forkJoin(list).pipe(catchError((err:any)=>{
      this.errorHandler(err);
      throw err
   }))
  }

    getOcpKey(url:string):string{
    // if(url.includes("/service/")){
    //   return environment.ocpApiKey
    // }
    // else if(url.includes("/py-service/")){
    //   return environment.ocpApiKeyPyService    }
    // else{
      return environment.ocpApiKey
    // }
  }
}
