import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

import { CryptosComponent } from './cryptos/cryptos.component';
import { PairselectorComponent } from './pairselector/pairselector.component';
import { PricetableComponent } from './pricetable/pricetable.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { PortfoliotableComponent } from './portfoliotable/portfoliotable.component';
import { ProfitlossComponent } from './profitloss/profitloss.component';
import { ProfitlosstableComponent } from './profitlosstable/profitlosstable.component';

@NgModule({
  declarations: [
    AppComponent,
    CryptosComponent,
    PairselectorComponent,
    PricetableComponent,
    PortfolioComponent,
    PortfoliotableComponent,
    ProfitlossComponent,
    ProfitlosstableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatSelectModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatTableModule,
    MatInputModule,
    MatMenuModule,
    MatIconModule
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule {}
