import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService, NavBarComponent, NavClickDetails, NavOption, NavOptionShow } from '@tc/tc-ngx-general';
import { BrandSearcherComponent } from '../brand-searcher/brand-searcher.component';
import { Router } from '@angular/router';
import { BrandInfoImg } from '../../model/BrandInfo';


@Component({
  selector: 'app-top-bar',
  imports: [CommonModule, NavBarComponent, BrandSearcherComponent],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.css'
})
export class TopBarComponent {
  authService: AuthService;

  navOptions: NavOption[];

  constructor(authService: AuthService, private router:Router){
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
