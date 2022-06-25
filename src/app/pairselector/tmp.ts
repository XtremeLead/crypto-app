    //this.selectedTickers = tickers.split(',');
    // const arrTickers = tickers.split(',');
    // for(const val in arrTickers) {
    //   vals['name'] = val;
    // }
    //localStorage.setItem('tickers', value);







    import { Component, OnInit, EventEmitter, Output } from '@angular/core';
    import { ITickerPair } from '../iticker-pair';
    import { ITickerPairs } from '../iticker-pairs';
    import { ITicker } from '../iticker';
    import { ITickers } from '../itickers';
    import { CryptosService } from '../cryptos.service';
    import { ITickerPairsFlat } from '../iticker-pairs-flat';
    
    
    
    @Component({
      selector: 'app-pairselector',
      templateUrl: './pairselector.component.html',
      styleUrls: ['./pairselector.component.css']
    })
    export class PairselectorComponent implements OnInit {
    
      constructor(
        private cryptoService: CryptosService
      ) { }
    
      tickerpairs:      ITickerPairs[]      = [];
      selected:         string              = "";
      tickerdata:       ITickers[]          = [];
      selectedTickers:  Array<string>       = [];
      sortedpairs:      ITickerPairs[]      = [];
      flattenedpairs:   ITickerPairsFlat[]  = [];
      
    
      @Output() otickerdata = new EventEmitter<any>();
    
      ngOnInit(): void {
        this.getPairs();
        this.getSelectedTickers();
      }
    
      getPairs(): void {
        this.cryptoService.fetchPairs()
          .subscribe(tickerpairs => {
            this.tickerpairs = tickerpairs;
            let tmpArray:Array<any> = [];
            for (const k in this.tickerpairs){
              const vals: { [key: string]: any} = {
                'name': k
              };
              //vals['name'] = k;
              for (const l in this.tickerpairs[k]) {
                vals[l] = this.tickerpairs[k][l];
              }
              tmpArray.push(vals);
            }
            this.flattenedpairs = this.sortPairs(tmpArray);
          })
      }
      
      sortPairs(array:Array<any>): Array<any>{
        array.sort((a, b) => {
          if(a.altname < b.altname) {
            return -1;
          }else if(a.altname > b.altname) {
            return 1;
          }else return 0;
        });
        return array;
      }
    
      saveToLocalStorage(value:string): void {
        localStorage.setItem('tickers', value);
      }
    
      getFromLocalStorage(name: string): string{
        return <string>localStorage.getItem(name);
      }
    
      getSelectedTickers(): void {
        let tickers: string = this.getFromLocalStorage('tickers');
        this.selectedTickers = tickers.split(',');
      }
    
      getTickerData(event: any): void {
          this.getSelectedTickers();
    
          if(!this.selectedTickers) return;
    
          let tickers:string = this.selectedTickers.toString();
          let tmpArray:Array<any> = [];
    
          this.cryptoService.fetchTickerData(tickers)
            .subscribe(tickerdata => {
              this.tickerdata = tickerdata;
    
              for (const k in this.tickerdata){
                const vals: { [key: string]: any} = {};
                vals['name'] = k;
                for (const l in this.tickerdata[k]) {
                  vals[l] = this.tickerdata[k][l];
                }
                tmpArray.push(vals);
              }
    
              this.tickerdata = tmpArray;
    
              //send data to service
              this.cryptoService.setTickerData(this.tickerdata)
            })
      }
    
      // getPrice(ticker: any): ITicker {
      //   console.log(<ITicker>ticker.c[0]);
        
      //   return <ITicker>ticker.c[0];
      // }
    
      // mytype(obj: any) {
      //   return typeof(obj);
      // }
    
      // instanceIfIPair(obj: any): obj is ITickerPair{
      //   return 'altname' in obj;
      // }
      // instanceIfIPairs(obj: any): obj is ITickerPairs{
      //   return '1INCHEUR' in obj;
      // }
    
      // getWsname(obj: any):string{
      //   return  obj.wsname;
      // }
    
      
    }
    interface Foo {
      [key: string]: any;
    }
    