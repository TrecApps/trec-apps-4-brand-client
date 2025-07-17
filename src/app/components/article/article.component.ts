import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { ResourceService } from '../../services/resource.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MarkdownPipe } from '@tc/tc-ngx-general';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TopBarComponent } from "../top-bar/top-bar.component";

@Component({
  selector: 'app-article',
  imports: [CommonModule, FormsModule, MarkdownPipe, TopBarComponent],
  templateUrl: './article.component.html',
  styleUrl: './article.component.css'
})
export class ArticleComponent implements OnDestroy{
  resourceService: ResourceService;

  @Output()
  onSetEditer = new EventEmitter<void>();

  // Review Functionality
  showReview: boolean = false;
  isApproving: boolean = false;
  reviewComment: string = "";

  routeSubscription: Subscription;

  constructor(rs: ResourceService, private router: Router, private activatedRoute: ActivatedRoute ) {
    this.resourceService = rs;

    this.routeSubscription = router.events.subscribe((event) => {
      if(!(event instanceof NavigationEnd)) return;

      let navEvent = event as NavigationEnd;

      if(navEvent.url.startsWith('/article')){

        this.activatedRoute.queryParams.subscribe({
          next: (params: Params) => {
            this.resourceService.retrieveEntry(params['id'])
          }
        });

        //this.resourceService.retrieveEntry(activatedRoute.)
      }
    })

  }
  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  setEditingMode(){
    this.router.navigate(['/edit'], {
      queryParams: {
        id: this.resourceService.editEntry?.entry?.id
      }
    })
  }

  setReviewMode(mode: boolean){
    this.showReview = mode;
  }

  submitReview(){
    let id = this.resourceService.brandEntry?.id;
    if(id){
      let obs = this.resourceService.reviewEntry(id, this.isApproving, this.reviewComment);

      if(obs){
        obs.subscribe({
          next: (str: string)=> {
            if(str.includes("Confirmed")){
              if(this.resourceService.brandEntry){
                this.resourceService.brandEntry.reviewStage = "CONFIRMED";
                this.showReview = false;
              }
            }
            alert(str);
            
          },
          error: (e: String | Response) => {
            if(e instanceof String) {
              alert(e);
            } else {
              let re: Response = e;
    
              if(re.status == 401) {
                this.resourceService.commenceLogout();
              }
            }
          }
        })
      }

    } else {
      this.showReview = false;
    }
  }
}
