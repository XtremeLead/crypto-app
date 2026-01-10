import { Component, OnInit } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { CryptosService } from '../cryptos.service';
import { ITickers } from '../itickers';
import { ITicker } from '../iticker';
import { MatTableDataSource } from '@angular/material/table';
import { WebsocketService } from '../websocket.service';
import { TokenService } from '../token.service';
import { Router } from '@angular/router';
import { TradeprofitlossService } from '../tradeprofitloss.service';
import { log } from 'console';

@Component({
  selector: 'app-tradeprofitlosstable',
  templateUrl: './tradeprofitlosstable.component.html',
  styleUrls: ['./tradeprofitlosstable.component.css'],
  animations: [
    trigger('valueAnimation', [
      transition(':increment', [
        style({ color: 'limegreen' }),
        animate('0.4s linear', style('*')),
      ]),
      transition(':decrement', [
        style({ color: 'red' }),
        animate('0.4s linear', style('*')),
      ]),
    ]),
  ],
})
export class TradeprofitlosstableComponent implements OnInit {
  constructor(
    private cryptoService: CryptosService,
    private tokenService: TokenService,
    private websocketService: WebsocketService,
    private router: Router,
    private TradeprofitlossService: TradeprofitlossService
  ) {
    //receive data from / subscribe to data in service
    this.cryptoService.tickerData.subscribe((data: ITickers[]) => {
      console.log('received data', data);
      this.tickerdata.data = data;
    });
  }

  ngOnInit(): void {
    this.cryptoService.tickerData.subscribe((data: ITickers[]) => {
      const combinedData = this.combineLocalStorageWithData(data);
      this.tickerdata.data = combinedData;
    });
  }

  tickerdata = new MatTableDataSource<ITickers>();
  displayedColumns: string[] = [
    'name',
    'date',
    'price',
    'amount',
    'newprice',
    'total',
    'pctchange',
    'delete',
  ];
  edits: any = {};
  json: string = '';
  useRealtime: boolean = false;
  websocketError: any = undefined;
  path = this.router.url.replace('/', '');
  pltotal: number = 0;
  showCurrentPrice: boolean = true;
  importTradesJSON: string = '';
  importTradesCount: number = 0;

  combineLocalStorageWithData(data: any): any {
    //data is the array of subscribed pairs
    const completeData = [];
    try {
      const arrTickers: any = JSON.parse(
        localStorage.getItem(this.path + 'tickersjson')!
      );

      for (let i in arrTickers) {
        for (let j in data) {
          // console.log(arrTickers[i]['uniqueId'], data[j]['uniqueId']);

          if (arrTickers[i]['name'] == data[j]['name']) {
            // combine
            // data[j] = {
            //   ...data[j],
            //   ...arrTickers[i],
            // };
            completeData.push({
              ...data[j],
              ...arrTickers[i],
            });
          }
        }
      }
      return completeData;
    } catch (error) {
      return [];
    }
  }

  showCurrentPriceColumn(): void {
    localStorage.setItem(
      'tradeprofitlosShowCurrentPrice',
      this.showCurrentPrice.toString()
    );
  }

  processInput(event: any, ele: any, index: number): void {
    // update the localstorage
    this.updateLocalStorage(
      ele.uniqueId,
      `input${index + 1}`,
      event.target.value
    );

    // get the new localstorage
    const arrTickers: ITicker[] = JSON.parse(
      localStorage.getItem(this.path + 'tickersjson')!
    );

    this.combineAndSendData(arrTickers, ele);
  }

  combineAndSendData(arrTickers: ITicker[], ele: any): void {
    const newData: any = [];
    // loop through all selected tickers in localstorage
    arrTickers.forEach((ticker) => {
      // is this the ticker in localstorage we are updating?
      if (ticker.uniqueId === ele.uniqueId) {
        // Find the corresponding tivker
        const thisRealTimeTicker = this.tickerdata.filteredData.filter(
          (t) => t.uniqueId === ele.uniqueId
        )[0];

        // combine the updated ticker in localstorage with the realtime data
        const tmp = { ...thisRealTimeTicker, ...ticker };

        newData.push(tmp);
      } else {
        // keep the realtime ticker we diod not update
        const temp = this.tickerdata.filteredData.filter(
          (t) => t.uniqueId.toString() === ticker?.uniqueId?.toString()
        )[0];

        newData.push(temp);
      }
    });

    this.cryptoService.setTickerData(newData);

    this.removeDuplicatesFromTickerdata();
  }

  removeDuplicatesFromTickerdata(): void {
    const result = [];
    const seen = new Set();

    // loop through array backwards, because of all duplicate items in this.tickerdata.data
    // the last one is the empty needed one. The rest has duplicated values in the input1, 2 and 3.
    for (let i = this.tickerdata.data.length - 1; i >= 0; i--) {
      const item = this.tickerdata.data[i];
      if (!seen.has(item.uniqueId)) {
        seen.add(item.uniqueId);
        result.push(item);
      }
    }
    this.tickerdata.data = result.reverse();
  }

  updateLocalStorage(uniqueId: string, input: string, value: any): void {
    const arrTickers: Array<any> = JSON.parse(
      localStorage.getItem(this.path + 'tickersjson')!
    );

    for (let i in arrTickers) {
      if (arrTickers[i]['uniqueId'] == uniqueId) {
        arrTickers[i][input.toString()] = value;
      }
    }
    localStorage.setItem(this.path + 'tickersjson', JSON.stringify(arrTickers));
  }

  multiply(val1: number, val2: number) {
    if (isNaN(val1) || isNaN(val2)) return 0;
    return (val1 * val2).toFixed(2);
  }

  divide(val1: any, val2: any) {
    if (isNaN(val1) || isNaN(val2) || val1 == 0 || val2 == 0) return 0;
    return (val1 / val2).toFixed(2);
  }

  calculateTotal() {
    const total = this.tickerdata.filteredData.reduce((accum, curr) => {
      let oldprice: number = 0;
      let newprice: number = 0;
      let amount: number = 0;
      try {
        oldprice = parseFloat(curr.input1.toString());
        amount = parseFloat(curr.input2.toString());
        newprice = parseFloat(curr.c[0].toString());
      } catch (error) {}
      return accum + this.calculatePL(oldprice, newprice, amount);
    }, 0);
    this.sendTotaltoService(total);
    this.pltotal = total;
    return total;
  }
  calculateTotalPctChange() {
    const total = this.tickerdata.filteredData.reduce((accum, curr) => {
      let oldprice: number = 0;
      let amount: number = 0;

      try {
        oldprice = parseFloat(curr.input1.toString());
        amount = parseFloat(curr.input2.toString());
      } catch (error) {}
      return accum + oldprice * amount;
    }, 0);
    //this.sendTotaltoService(total);
    return (this.pltotal / total) * 100;
  }

  calculatePL(oldprice: number, newprice: number, amount: number): number {
    const pricediff = newprice - oldprice;
    return amount * pricediff;
  }

  calculatePctChange(oldprice: number, newprice: number): number {
    return ((newprice - oldprice) / oldprice) * 100;
  }

  sendTotaltoService(total: number): void {
    this.TradeprofitlossService.sendTotalMsg(total);
  }

  getDecimals(element: ITicker): number | undefined {
    const decimals = element.decimals;
    if (!decimals) return 2;
    return element.decimals == 1 ? 2 : element.decimals;
  }

  deleteItem(ticker: ITicker): void {
    const arrTickers: ITicker[] = JSON.parse(
      localStorage.getItem(this.path + 'tickersjson')!
    );
    const indexToDelete = arrTickers.findIndex(
      (t) => t.uniqueId === ticker.uniqueId
    );

    arrTickers.splice(indexToDelete, 1);
    localStorage.setItem(this.path + 'tickersjson', JSON.stringify(arrTickers));

    this.combineAndSendData(arrTickers, ticker);
    // this.cryptoService.setTickerData(arrTickers);
  }

  // Websocket stuff
  startStream(): void {
    this.checkWebsocketsStatus();
  }

  stopStream(): void {
    this.websocketService.stopWebsocket();
  }

  checkWebsocketsStatus(): void {
    // check if websocket endpoint is online and then get the authToken if needed
    this.tokenService.fetchStatus().subscribe((status: any[]) => {
      for (const k in status) {
        if (k == 'result') {
          this.websocketService.endpointStatus = status[k]['status'];
          if (this.websocketService.endpointStatus == 'online') {
            this.startWebsocketService();
          }
        }
        if (k == 'error') {
          const err: any[] = status[k];
          if (err.length > 0) {
            console.error(err);
          }
        }
      }
    });
  }
  startWebsocketService() {
    const arrTickers: any = JSON.parse(
      localStorage.getItem(this.path + 'tickersjson')!
    );
    let subTickers: string[] = [];
    for (let ticker in arrTickers) {
      subTickers.push(arrTickers[ticker].ticker);
    }

    this.websocketError = undefined;
    this.websocketService.pairs = subTickers;
    this.websocketService.startWebsocket();
    // subscribe to object in service
    this.websocketService.behaviorSubjectTickerData.subscribe((message) => {
      if (message.error) {
        this.websocketError = message.error;
        this.stopWebsocketService();
        return;
      }
      if (message.value) {
        const priceInfo: ITickerPriceInfo = {
          value: message.value,
          direction: '',
        };

        // console.log(priceInfo); // value, direction
        // console.log(this.tickerdata); // datasource
        // console.log(message.pair); // tickerpair i.e. XBT/EUR
        // //this.tickerdata[message.pair] = priceInfo;

        // push data to local object
        this.addPriceInfoToData(priceInfo, message);
      }
    });
  }

  addPriceInfoToData(priceInfo: ITickerPriceInfo, message: ITickerData): void {
    this.tickerdata.filteredData.forEach((item) => {
      if (item.ticker.toString() == message.pair.toString()) {
        const tmp1: any = item.c;
        const rnd = Math.floor(Math.random() * 100);
        const tmp2: any =
          +item.c[0] < +priceInfo.value ? 'up' + rnd : 'down' + rnd;
        item.direction = tmp2;
        tmp1[0] = priceInfo.value;
        item.c[0] = tmp1[0];
      }
    });
  }

  // hasData(pair: string): boolean {
  //   if(!this.tickerdata[pair]) return false;
  //   return this.tickerdata[pair].value !== '';
  // }
  stopWebsocketService() {
    this.websocketService.stopWebsocket();
  }

  websocketIsEnabled(isEnabled: boolean): any {
    if (isEnabled) return !this.websocketService.websocketIsStopped;
    if (!isEnabled) return this.websocketService.websocketIsStopped;
  }

  importTrades(): void {
    try {
      const trades: importDataArray = JSON.parse(this.importTradesJSON);
      let arrTickers: any;
      try {
        arrTickers = JSON.parse(
          localStorage.getItem(this.path + 'tickersjson')!
        );
      } catch (error) {
        arrTickers = [];
      }
      localStorage.setItem(
        this.path + 'tickersjson',
        JSON.stringify([...trades, ...arrTickers])
      );
    } catch (error) {
      console.log(error);
    }
    this.importTradesCount = 0;
    this.importTradesJSON = '';
  }

  readonly REQUIRED_KEYS: (keyof importData)[] = [
    'decimals',
    'input1',
    'input2',
    'input3',
    'name',
    'ticker',
    'uniqueId',
  ];

  validatedJSON(): boolean {
    try {
      const trades: importDataArray = JSON.parse(this.importTradesJSON);
      console.log(trades);

      if (this.isImportDataArray(trades)) {
        this.importTradesCount = trades.length;
        return true;
      } else {
        console.log('not');
      }
    } catch (error) {
      return false;
    }
    return false;
  }

  isImportData = (obj: any): obj is importData => {
    if (typeof obj !== 'object' || obj === null) {
      return false;
    }

    const keys = Object.keys(obj);

    // no more, no less
    if (keys.length !== this.REQUIRED_KEYS.length) {
      return false;
    }

    // must contain all keys
    for (const key of this.REQUIRED_KEYS) {
      if (!(key in obj)) {
        return false;
      }
    }

    // type checks
    return (
      typeof obj.decimals === 'number' &&
      typeof obj.input1 === 'string' &&
      typeof obj.input2 === 'string' &&
      typeof obj.input3 === 'string' &&
      typeof obj.name === 'string' &&
      typeof obj.uniqueId === 'string'
    );
  };
  isImportDataArray(data: unknown): data is importDataArray {
    const ret: boolean = Array.isArray(data) && data.every(this.isImportData);
    return ret;
  }
}
interface ISub {
  name: string;
}
interface ITickerData {
  pair: string;
  value: string;
  direction?: string;
}
interface ITickerPriceInfo {
  value: string;
  direction: string;
}
interface IAuthTokenMessage {
  error: any[];
  result: IAuthTokenMessageResult;
}
interface IAuthTokenMessageResult {
  expires: number;
  token: string;
}
interface importData {
  decimals: number;
  input1: string;
  input2: string;
  input3: string;
  name: string;
  ticker: string;
  uniqueId: string;
}
interface importDataArray extends Array<importData> {}
