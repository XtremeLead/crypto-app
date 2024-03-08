import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { CryptosComponent } from './cryptos/cryptos.component';
import { ProfitlossComponent } from './profitloss/profitloss.component';

const routes: Routes = [
  { path: 'portfolio', component: PortfolioComponent },
  { path: 'profitloss', component: ProfitlossComponent },
  { path: '', component: CryptosComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
