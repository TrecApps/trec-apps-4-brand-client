import { Routes } from '@angular/router';
import { LoginComponent } from '@tc/tc-ngx-general';
import { EditComponent } from './components/edit/edit.component';
import { ArticleComponent } from './components/article/article.component';

export const routes: Routes = [
     {path: "Logon", component: LoginComponent},
     {path: "article", component: ArticleComponent},
     
     {path: "edit", component: EditComponent}
];
