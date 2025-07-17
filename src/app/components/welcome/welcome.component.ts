import { Component } from '@angular/core';
import { TopBarComponent } from "../top-bar/top-bar.component";

@Component({
  selector: 'app-welcome',
  imports: [TopBarComponent],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {

}
