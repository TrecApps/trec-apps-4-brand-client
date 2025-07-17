import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { AuthService, NavBarComponent, NavClickDetails, NavOption, NavOptionShow, ProfileItemGroup } from '@tc/tc-ngx-general';
import { BrandSearcherComponent } from '../brand-searcher/brand-searcher.component';
import { ActivatedRoute, ParamMap, Route, Router } from '@angular/router';
import { BrandInfoImg } from '../../model/BrandInfo';
import { UrlService } from '../../services/url.service';
import { Subscription } from 'rxjs';

interface LooseObject {
    [key: string]: any
}

@Component({
  selector: 'app-top-bar',
  imports: [CommonModule, NavBarComponent, BrandSearcherComponent],
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
          item: 'logout',
          displayItem: 'Logout'
        }
      ]
    }
  ]

  onProfilePanelSelect(item:string) {
    if(item == 'logout'){
      this.authService.logout(undefined);
    }
  }

  routeSubscription: Subscription;

  constructor(authService: AuthService, private router:Router, private route: ActivatedRoute, private urlService: UrlService){
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
