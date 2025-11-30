import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ITickerPairs } from '../iticker-pairs';
import { ITickers } from '../itickers';
import { CryptosService } from '../cryptos.service';
import { ITickerPairsFlat } from '../iticker-pairs-flat';
import { Router } from '@angular/router';
import { PortfolioTotalService } from '../portfolio-total.service';
import { ProfitlossService } from '../profitloss.service';
import { trigger, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-singlepairselector',
  templateUrl: './singlepairselector.component.html',
  styleUrls: ['./singlepairselector.component.css'],
})
export class SinglepairselectorComponent implements OnInit {
  constructor(
    private cryptoService: CryptosService,
    private router: Router,
    private portfolioTotalService: PortfolioTotalService,
    private profitlossService: ProfitlossService
  ) {}

  tickerPairs: ITickerPairs[] = [];
  selected: string = '';
  tickerData: ITickers[] = [];
  selectedTickers: Array<string> = [];
  selectedTicker: string = '';
  sortedPairs: ITickerPairs[] = [];
  flattenedPairs: ITickerPairsFlat[] = [];
  arrTickers: Array<any> = [];
  portfolioTotal: number = 0;
  profitlossTotal: number = 0;
  path: String = '';
  selectedPair = '';

  @Output() otickerdata = new EventEmitter<any>();
  @Input() filter: string = '';

  ngOnInit(): void {
    this.getPairs();
    this.getSelectedTickers();
    this.getTickerData(null);
    // this.portfolioTotalService.totalMsg$.subscribe((message) => {
    //   this.portfolioTotal = message;
    // });
    // this.profitlossService.totalMsg$.subscribe((message) => {
    //   this.profitlossTotal = message;
    // });
  }
  getPairs(): void {
    this.cryptoService.fetchPairs().subscribe((tickerpairs) => {
      this.tickerPairs = tickerpairs;

      let tmpArray: Array<any> = [];
      for (const k in this.tickerPairs) {
        const vals: { [key: string]: any } = {
          name: k,
        };
        for (const l in this.tickerPairs[k]) {
          vals[l] = this.tickerPairs[k][l];
        }

        tmpArray.push(vals);
      }

      //filter if a filter is passed to the component
      if (this.filter) {
        this.flattenedPairs = this.sortPairs(tmpArray).filter(
          (pair) => pair.wsname.indexOf('/' + this.filter) > 0
        );
      } else {
        this.flattenedPairs = this.sortPairs(tmpArray);
      }
    });
  }

  sortPairs(array: Array<any>): Array<any> {
    array.sort((a, b) => {
      if (a.altname < b.altname) {
        return -1;
      } else if (a.altname > b.altname) {
        return 1;
      } else return 0;
    });
    return array;
  }

  saveToLocalStorage(value: string): void {
    let arrTickers: Array<any> = [];
    this.path = this.router.url.replace('/', '');
    // add name property to selected items. value is i.e. ['1INCHEUR', '1INCHUSD', 'AAVEAUD', 'AAVEETH']
    // for (const val in value) {
    //   let vals: { [key: string]: any } = {};
    //   vals['name'] = value[val];
    //   arrTickers.push(vals);
    // }

    // add new items
    let currentItemsInLocalStorage: Array<any> = this.getFromLocalStorage(
      this.path + 'tickersjson'
    );
    if (!currentItemsInLocalStorage) currentItemsInLocalStorage = [];
    let arrAddedTickers: Array<any> = [];
    // loop through selected items

    // find item in localstorage
    let found: boolean = false;

    // if (currentItemsInLocalStorage.length > 0) {
    //   found =
    //     currentItemsInLocalStorage.find(({ name }) => name === value) !==
    //     undefined;
    // }
    let pairdata: any = this.flattenedPairs.find(({ name }) => name === value);

    // if not in localstorage, add to arrAddedTickers array
    // if (!found) {
    let vals: { [key: string]: any } = {};
    vals['uniqueId'] = crypto.randomUUID();
    vals['name'] = value;
    vals['ticker'] = pairdata['wsname'];
    vals['decimals'] = pairdata['pair_decimals'];
    arrAddedTickers.push(vals);
    // }

    // add temp array to currentItemsInLocalStorage array
    for (let t in arrAddedTickers) {
      currentItemsInLocalStorage.push(arrAddedTickers[t]);
    }

    localStorage.setItem(
      this.path + 'tickersjson',
      JSON.stringify(currentItemsInLocalStorage)
    );
  }

  getFromLocalStorage(name: string): Array<any> {
    const json: string = localStorage.getItem(name)!;
    return JSON.parse(json);
  }

  getSelectedTickers(): void {
    this.path = this.router.url.replace('/', '');
    const tickers = this.getFromLocalStorage(this.path + 'tickersjson');
    for (let t in tickers) {
      this.selectedTickers.push(tickers[t].name);
    }
  }

  addRow(event: any) {
    this.saveToLocalStorage(this.selectedPair);
    // fill this.selectedTickers
    this.getSelectedTickers();

    this.getTickerData(event);
  }

  getTickerData(event: any): void {
    //this.getSelectedTickers();

    if (!this.selectedTickers) return;

    let tickers: string = this.selectedTickers.toString();
    let tmpArray: Array<any> = [];

    this.cryptoService.fetchTickerData(tickers).subscribe((tickerdata) => {
      this.tickerData = tickerdata;

      // adding name property
      for (const k in this.tickerData) {
        const vals: { [key: string]: any } = {};
        vals['name'] = k;
        for (const l in this.tickerData[k]) {
          vals[l] = this.tickerData[k][l];
        }

        tmpArray.push(vals);
      }

      this.tickerData = tmpArray;

      //send data to service
      this.cryptoService.setTickerData(this.tickerData);
    });
    //this.cryptoService.fetchOhlcData(this.selectedTickers);
  }
}
