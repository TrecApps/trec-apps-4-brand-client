import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { AuthService, HttpContentType, NavBarComponent, NavClickDetails, NavOption, NavOptionShow, PopupComponent, ProfileItemGroup, ResponseObj, StylesService } from '@tc/tc-ngx-general';
import { BrandSearcherComponent } from '../brand-searcher/brand-searcher.component';
import { ActivatedRoute, ParamMap, Route, Router } from '@angular/router';
import { BrandInfoImg } from '../../model/BrandInfo';
import { UrlService } from '../../services/url.service';
import { Subscription } from 'rxjs';
import { ColorOption, ColorPanelComponent } from "../color-panel/color-panel.component";
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environment/environment';

interface LooseObject {
    [key: string]: any
}

@Component({
  selector: 'app-top-bar',
  imports: [CommonModule, NavBarComponent, BrandSearcherComponent, PopupComponent, ColorPanelComponent],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.css'
})
export class TopBarComponent implements OnDestroy{
  authService: AuthService;

  navOptions: NavOption[];

  profileItemGroups: ProfileItemGroup[] = [
    {
      itemList: [
        {
          item: 'cStyle',
          displayItem: 'App Style'
        },
        {
          item: 'logout',
          displayItem: 'Logout'
        }
      ]
    }
  ]

  onProfilePanelSelect(item:string) {
    if(item == 'logout'){
      this.authService.logout(undefined);
    } else if(item == 'cStyle'){
      this.showStylePopup = true;
    }
  }

  showStylePopup: boolean = false;
  styleUpdating: boolean = false;

  updateStyle(){

    if(this.styleUpdating) return;
      this.styleUpdating = true;

    this.client.patch<ResponseObj>(`${environment.USER_SERVICE_URL}Users/styles`, {
        style: this.ss.style,
        useDark: this.ss.isDark
    
    }, {
      params: new HttpParams().append("app", environment.app_name),
      headers: this.authService.getHttpHeaders2(HttpContentType.JSON)
    }).subscribe({
      next: (val: ResponseObj) => {
        this.styleUpdating = false;
        this.colorChanged = false;
      },
      error: ()=> {
        this.styleUpdating = false;
        this.colorChanged = false;
      }
    })
  }

    colorList: ColorOption[] = [
    {
      colorStyle: '#d1d1d1',
      styleName: 'default'
    },{
      colorStyle: '#ff0000ff',
      styleName: 'red'
    },{
      colorStyle: 'rgb(0, 171, 255)',
      styleName: 'blue'
    },{
      colorStyle: 'rgb(8, 223, 41)',
      styleName: 'green'
    },{
      colorStyle: 'rgb(255, 239, 1)',
      styleName: 'yellow'
    },{
      colorStyle: 'rgb(255, 120, 1)',
      styleName: 'orange'
    },{
      colorStyle: 'rgb(221, 99, 255)',
      styleName: 'purple'
    },{
      colorStyle: 'rgb(255, 59, 243)',
      styleName: 'pink'
    }
  ]

  colorChanged: boolean = false;

  onColorSelect(styleColor: string){
    this.ss.setStyle(styleColor);
    this.colorChanged = true;
  }
  onUseDarkChecked(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.colorChanged = true;

    this.ss.setDarkMode(checkbox.checked);
  }

  routeSubscription: Subscription;

  ss:StylesService;

  constructor(
    authService: AuthService, 
    private router:Router, 
    private route: ActivatedRoute, 
    private urlService: UrlService, 
    private client: HttpClient,
    styleService: StylesService){
      this.ss = styleService;
    this.authService = authService;

    this.navOptions = [
      // {
      //   displayText: 'Welcome',
      //   title: 'Welcome',
      //   showOption: NavOptionShow.BASIC_DESKTOP
      // },
      // {
      //   displayText: 'Factchecks',
      //   title: 'factchecks-search',
      //   showOption: NavOptionShow.BASIC_DESKTOP
      // },
      // {
      //   displayText: 'Falsehoods',
      //   title: 'falsehoods-search',
      //   showOption: NavOptionShow.BASIC_DESKTOP
      // }
      // ,
      // {
      //   displayText: 'Welcome',
      //   title: 'Welcome',
      //   showOption: NavOptionShow.BASIC_DESKTOP
      // }
    ]

    this.routeSubscription = this.route.queryParamMap.subscribe((value: ParamMap) => {
      let params: LooseObject = {};
      for(let key of value.keys){
        params[key] = value.get(key)
      }

      this.urlService.url='/article';
      this.urlService.params = params;
      
    })
    
  }
  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }



  onNavigate(details: NavClickDetails){
    this.router.navigateByUrl('/' + (details.navLink || details.title));
  }

  prepLogin(){

    this.router.navigateByUrl('/Logon')

    
  }

  onBrandSelected(brand: BrandInfoImg){
    this.router.navigate(['/article'], {
      queryParams: {
        id: brand.brandInfo.id
      }
    })
  }
}
