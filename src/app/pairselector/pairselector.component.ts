import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ITickerPairs } from '../iticker-pairs';
import { ITickers } from '../itickers';
import { CryptosService } from '../cryptos.service';
import { ITickerPairsFlat } from '../iticker-pairs-flat';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pairselector',
  templateUrl: './pairselector.component.html',
  styleUrls: ['./pairselector.component.css']
})
export class PairselectorComponent implements OnInit {
  constructor(private cryptoService: CryptosService, private router: Router) {}

  tickerPairs: ITickerPairs[] = [];
  selected: string = '';
  tickerData: ITickers[] = [];
  selectedTickers: Array<string> = [];
  sortedPairs: ITickerPairs[] = [];
  flattenedPairs: ITickerPairsFlat[] = [];
  arrTickers: Array<any> = [];

  @Output() otickerdata = new EventEmitter<any>();
  @Input() filter: string = '';

  ngOnInit(): void {
    this.getPairs();
    this.getSelectedTickers();
  }

  getPairs(): void {
    this.cryptoService.fetchPairs().subscribe(tickerpairs => {
      this.tickerPairs = tickerpairs;

      let tmpArray: Array<any> = [];
      for (const k in this.tickerPairs) {
        const vals: { [key: string]: any } = {
          name: k
        };
        for (const l in this.tickerPairs[k]) {
          vals[l] = this.tickerPairs[k][l];
        }

        tmpArray.push(vals);
      }

      //filter if a filter is passed to the component
      if (this.filter) {
        this.flattenedPairs = this.sortPairs(tmpArray).filter(
          pair => pair.wsname.indexOf('/' + this.filter) > 0
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

  saveToLocalStorage(value: Array<string>): void {
    let arrTickers: Array<any> = [];
    const path = this.router.url.replace('/', '');
    // add name property to selected items. value is i.e. ['1INCHEUR', '1INCHUSD', 'AAVEAUD', 'AAVEETH']
    for (const val in value) {
      let vals: { [key: string]: any } = {};
      vals['name'] = value[val];
      arrTickers.push(vals);
    }

    // add new items
    let existingInLocalstorage: Array<any> = this.getFromLocalStorage(
      path + 'tickersjson'
    );
    if (!existingInLocalstorage) existingInLocalstorage = [];
    let arrAddedTickers: Array<any> = [];
    // loop through selected items
    for (let val in value) {
      // find item in localstorage
      let found: boolean = false;

      if (existingInLocalstorage.length > 0) {
        found = existingInLocalstorage.find(({ name }) => name === value[val]);
      }
      let pairdata: any = this.flattenedPairs.find(
        ({ name }) => name === value[val]
      );

      // if not in localstorage, add to arrAddedTickers array
      if (!found) {
        let vals: { [key: string]: any } = {};
        vals['name'] = value[val];
        vals['ticker'] = pairdata['wsname'];
        arrAddedTickers.push(vals);
      }
    }

    // add temp array to existingInLocalstorage array
    for (let t in arrAddedTickers) {
      existingInLocalstorage.push(arrAddedTickers[t]);
    }

    // remove items that are no longer selected
    let arrRemovedTickers: Array<any> = [];
    // loop through existingInLocalstorage array
    for (let item in existingInLocalstorage) {
      // find item in selected items
      let found = value.find(
        name => name === existingInLocalstorage[item].name
      );
      if (!found) {
        // if not in selected items, add to arrRemovedTickers array
        arrRemovedTickers.push(existingInLocalstorage[item]);
      }
    }

    // loop through arrRemovedTickers array
    for (let rem in arrRemovedTickers) {
      // find removed item in existingInLocalstorage array
      const index = existingInLocalstorage.indexOf(arrRemovedTickers[rem]);
      if (index > -1) {
        // remove from existingInLocalstorage array
        existingInLocalstorage.splice(index, 1);
      }
    }

    localStorage.setItem(
      path + 'tickersjson',
      JSON.stringify(existingInLocalstorage)
    );
  }

  getFromLocalStorage(name: string): Array<any> {
    const json: string = localStorage.getItem(name)!;
    return JSON.parse(json);
  }

  getSelectedTickers(): void {
    const path = this.router.url.replace('/', '');
    const tickers = this.getFromLocalStorage(path + 'tickersjson');
    for (let t in tickers) {
      this.selectedTickers.push(tickers[t].name);
    }
  }

  getTickerData(event: any): void {
    //this.getSelectedTickers();

    if (!this.selectedTickers) return;

    let tickers: string = this.selectedTickers.toString();
    let tmpArray: Array<any> = [];

    this.cryptoService.fetchTickerData(tickers).subscribe(tickerdata => {
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
  onKey(event: any): void {
    console.log(event);
  }
}
