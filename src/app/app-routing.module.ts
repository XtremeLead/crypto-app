import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { CryptosComponent } from './cryptos/cryptos.component';

const routes: Routes = [
  { path: 'portfolio', component: PortfolioComponent },
  { path: '', component: CryptosComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
