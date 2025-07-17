import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService, HttpContentType } from '@tc/tc-ngx-general';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';
import { BrandInfoImg, BrandInfo, ResourceMetadata, BrandInfoEntry, ReviewEntry } from '../model/BrandInfo';
import { NavigationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  // Creting a new Entry
  editEntry: BrandInfoEntry | undefined;

  // Accessing an exiting Entry
  brandEntry: BrandInfo | undefined;
  contents: string = "";
  metadata: ResourceMetadata | undefined;
  editing: boolean = false;

  entryList: BrandInfoImg[] = [];

  hasPermission: boolean = false;

  isLoggedIn: boolean = false;

  authService: AuthService;

  userId: string = "";
  userName: string = "";

  onLoginByRefresh(){
    if(this.authService.loginToken){
      this.isLoggedIn = true;
      this.assessPermission();
    }
  }
  

  constructor(authService: AuthService, private client: HttpClient, private router: Router) {

    this.authService = authService;

    this.router.events.subscribe((event) => {
      if(event instanceof NavigationEnd){
        if(!event.url.endsWith("/article")){
          return;
        }

        let authToken = this.authService.getAuthorization();
        if(!authToken){
          this.hasPermission = false;
          this.isLoggedIn = false;
          console.log("Auth Token Not Detected!");
          return;
        } else {
          this.isLoggedIn = true;
          
          console.log("Auth Token Detected!");
          this.assessPermission();
        }

        
      }
    })

    // this.editing = true;
    // this.editEntry = new BrandInfoEntry();
  }

  commenceLogout(){
    if(!this.editing || confirm("You are in the Middle of editing an entry. Are you sure you want to lose your work and log out?")){
      this.authService.logout(undefined);
      this.editEntry = undefined;
      this.editing = false;
      this.isLoggedIn = false;
      this.hasPermission = false;
      this.userId = "";
      this.userName = "";
    }
  }

  assessPermission(){
    this.client.get<string[]>(
      `${environment.USER_SERVICE_URL}Auth/permissions`, 
      {headers: this.authService.getHttpHeaders2(HttpContentType.NONE)}
    ).subscribe({
      next: (results: string[]) => {
        this.hasPermission = results.includes("RESOURCE_EMPLOYEE");
        console.log("Retrieved Permissions: ", results);

        this.userId = this.authService.tcUser?.id?.toString() || "";
        this.userName = this.authService.tcUser?.displayName?.toString() || "";
      }
    })
  }

  ///
  /// Search Functionality
  ///

  searchByName(name: string){
    let params = new HttpParams().append("all", this.hasPermission);

    this.client.get<BrandInfoImg[]>(`${environment.RESOURCE_URL}search/resources/${name}`, {
      params, headers: this.authService.getHttpHeaders2(HttpContentType.NONE)
    }).subscribe({
      next: (results: BrandInfoImg[]) => {
        this.entryList = results;
      }
    })
  }

  searchByNameAndType(name:string, type: string){
    let params = new HttpParams().append("name", name);

    this.client.get<BrandInfoImg[]>(`${environment.RESOURCE_URL}search/resourceByType/${type}`, {
      params
    }).subscribe({
      next: (results: BrandInfoImg[]) => {
        this.entryList = results;
      }
    })
  }

  getList(){
    let params = new HttpParams().append("all", this.hasPermission);

    this.client.get<BrandInfoImg[]>(`${environment.RESOURCE_URL}search/resourceList`, {
      params, headers: this.authService.getHttpHeaders2(HttpContentType.NONE)
    }).subscribe({
      next: (results: BrandInfoImg[]) => {
        this.entryList = results;
      }
    })
  }

  selectEntry(bi: BrandInfo){
    this.brandEntry = bi;

    this.editEntry = undefined;
    this.editing = false;
    this.entryList = [];

    this.client.get(`${environment.RESOURCE_URL}search/resourceContent/${bi.id}`, {responseType: "text"}).subscribe({
      next: (contents: string) => {
        this.contents = contents || " ";
        
      }
    })

    this.client.get<ResourceMetadata>(`${environment.RESOURCE_URL}search/resourceMetaData/${bi.id}`).subscribe({
      next: (md: ResourceMetadata) => {
        this.metadata = md;
      }
    })
  }

  retrieveEntry(id: string) {
    this.editEntry = undefined;
    this.editing = false;
    this.entryList = [];
    this.client.get<BrandInfoEntry>(`${environment.RESOURCE_URL}search/v2/${id}`).subscribe({
      next: (resource: BrandInfoEntry) => {
        this.brandEntry = resource.entry;
        this.contents = resource.contents;
        this.metadata = resource.metaData;
      }
    })
  }

  ///
  /// Edit Functionality
  ///

  submitEntry(metaData: Map<string, string>){
    if(!this.editEntry){
      return;
    }

    let metaObject = this.editEntry.metaData.metadata;

    metaData.forEach((value: string, key: string) => {
      metaObject[key] = value;
    })

    this.client.post(`${environment.RESOURCE_URL}Update/submit`, this.editEntry, {
      headers: this.authService.getHttpHeaders2(HttpContentType.JSON), responseType: "text"
    }).subscribe({
      next: (v: string) => {
        alert(v);
        this.editing = false;
        this.editEntry = undefined;
      },
      error: (v: string) => {
        alert(v);
      }
    })
  }

  updateContents(){
    this.client.put(`${environment.RESOURCE_URL}Update/contents`, this.contents, {
      headers: this.authService.getHttpHeaders2(HttpContentType.NONE).append("Content-Type", "text/plain"), responseType: "text"
    }).subscribe({
      next: (v: string) => {
        alert(v);
        if(this.brandEntry){
          this.selectEntry(this.brandEntry)
        }
      },
      error: (v: string) => {
        alert(v);
      }
    })
  }

  updateName(){

    if(!this.brandEntry?.id) return;

    let body = new ReviewEntry(this.brandEntry.id.toString(), true, this.brandEntry.name)

    this.client.put(`${environment.RESOURCE_URL}Update/name`, body, {
      headers: this.authService.getHttpHeaders2(HttpContentType.NONE), responseType: "text"
    }).subscribe({
      next: (v: string) => {
        alert(v);
        if(this.brandEntry){
          this.selectEntry(this.brandEntry)
        }
      },
      error: (v: string) => {
        alert(v);
      }
    })
  }

  updateMetaData(metaData: Map<string, string>){
    console.log("Updating Metadata!", metaData);
    if(!this.metadata || !this.brandEntry?.id){
      return;
    }
    let metaObject = this.metadata.metadata;

    metaData.forEach((value: string, key: string) => {
      metaObject[key] = value;
    })

    let params = new HttpParams().append('resourceId', this.brandEntry?.id);

    this.client.put(`${environment.RESOURCE_URL}Update/metadata`, this.metadata, {
      headers: this.authService.getHttpHeaders2(HttpContentType.JSON), responseType: "text", params
    }).subscribe({
      next: (v: string) => {
        alert(v);
        if(this.brandEntry){
          this.selectEntry(this.brandEntry)
        }
      },
      error: (v: string) => {
        alert(v);
      }
    })
  }


  setEditingMode(editMode: boolean){
    this.editing = editMode;
  }

  reviewEntry(id: string, approving: boolean, comment: string): Observable<string> | undefined {

    if(!this.brandEntry) return;
    let be: BrandInfo = this.brandEntry;

    let reviewEntry: ReviewEntry = new ReviewEntry(id, approving, comment);
    return this.client.post(`${environment.RESOURCE_URL}Update/review`, reviewEntry, {
      headers: this.authService.getHttpHeaders2(HttpContentType.JSON), responseType: 'text'
    })
  }
}
