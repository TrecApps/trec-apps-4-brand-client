import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  url: string = "/article";

  params: any | undefined;

  constructor() { }
}
