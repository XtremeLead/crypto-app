import { Component, OnInit } from '@angular/core';
import { trigger, style, transition, animate, keyframes, query, stagger, state, group } from '@angular/animations';
import { CryptosService } from '../cryptos.service';
import { ITickers } from '../itickers';
import { MatTableDataSource } from '@angular/material/table';
import { WebsocketService } from '../websocket.service';
import { TokenService } from '../token.service';


@Component({
  selector: 'app-pricetable',
  templateUrl: './pricetable.component.html',
  styleUrls: ['./pricetable.component.css'],
  animations: [
    trigger('valueAnimation', [
      transition(':increment', [
          style({ color: 'limegreen' }),
          animate('0.4s linear', style('*'))
        ]
      ),
      transition(':decrement', [
          style({ color: 'red' }),
          animate('0.4s linear', style('*'))
        ]
      )
    ])
  ]
})
export class PricetableComponent implements OnInit {

  constructor(
    private cryptoService: CryptosService,
    private tokenService: TokenService,
    private websocketService: WebsocketService
  ) { 
    //receive data from / subscribe to data in service
    this.cryptoService.tickerData.subscribe((data: ITickers[]) => {
      console.log('received data');
      this.tickerdata.data = data;
    });
  }

  tickerdata = new MatTableDataSource<ITickers>();
  displayedColumns: string[]    = ['name','price', 'input1', 'input2', 'total', 'total2'];
  edits: any = {};
  json: string = '';
  useRealtime: boolean = false;
  websocketError: any = undefined;

  ngOnInit(): void {
    //receive data from / subscribe to data in service
    this.cryptoService.tickerData.subscribe((data: ITickers[]) => {
      const combinedData = this.combineLocalStorageWithData(data);
 
      this.tickerdata.data = combinedData;
    });
  }
  

  processInput(event: any, ele: any, index: number): void {
    this.updateLocalStorage(ele.name, `input${ index + 1 }`, event.target.value);
    const combinedData = this.combineLocalStorageWithData(this.tickerdata.filteredData);
    this.cryptoService.setTickerData(combinedData);
  }

  updateLocalStorage(name: string, input: string, value:any): void {
    const arrTickers: Array<any> = JSON.parse(localStorage.getItem('tickersjson')!);

    for(let i in arrTickers) {
      if(arrTickers[i]['name'] == name) {
        arrTickers[i][input.toString()] = value;
      }
    }
    localStorage.setItem('tickersjson', JSON.stringify(arrTickers));
  }

  combineLocalStorageWithData(data: any): any{
    const arrTickers: any = JSON.parse(localStorage.getItem('tickersjson')!);
    for(let i in arrTickers) {
      for(let j in data) {
        if(arrTickers[i]['name'] == data[j]['name']) {
          // combine
          data[j] = {
            ...data[j], 
            ...arrTickers[i]
          }
          
        }
      }
    }
    return data;
  }

  multiply(val1: number, val2: number) {
    if(isNaN(val1) || isNaN(val2)) return 0;
    return (val1 * val2).toFixed(2);
  }

  divide(val1:any, val2:any) {
    if(isNaN(val1) || isNaN(val2) || val1 == 0 || val2 == 0) return 0;
    return (val1 / val2).toFixed(2);
  }

  // Websocket stuff
  startStream(): void {
    this.checkWebsocketsStatus();
  }

  checkWebsocketsStatus(): void {
    // check if websocket endpoint is online and then get the authToken if needed
    this.tokenService.fetchStatus().subscribe((status: any[]) => {
      for(const k in status) {
        if(k == 'result') {
          this.websocketService.endpointStatus = status[k]['status'];
          if(this.websocketService.endpointStatus == 'online') {
            this.startWebsocketService();
          }
        }
        if(k == 'error') {
          const err:any[] = status[k];
          if(err.length > 0) {
            console.error(err);
          }
        }
      }
    });
  }
  startWebsocketService() {
    const arrTickers: any = JSON.parse(localStorage.getItem('tickersjson')!);
    let subTickers: string[] = [];
    for(let ticker in arrTickers) {
      subTickers.push(arrTickers[ticker].ticker);
    }

    this.websocketError = undefined;
    this.websocketService.pairs = subTickers;
    this.websocketService.startWebsocket();
    // subscribe to object in service
    this.websocketService.behaviorSubjectTickerData.subscribe(message => {
      if(message.error) {
        this.websocketError = message.error;
        this.stopWebsocketService();
        return;
      }
      if(message.value){
        const priceInfo: ITickerPriceInfo = {
          value: message.value, 
          direction: ''
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

  addPriceInfoToData(priceInfo: ITickerPriceInfo, message:ITickerData): void{
    this.tickerdata.filteredData.forEach(item => {
      if(item.ticker.toString() == message.pair.toString()) {
        const tmp1: any = item.c;
        const rnd = Math.floor(Math.random() * 100);
        const tmp2: any = (+item.c[0] < +priceInfo.value) ? 'up'+rnd : 'down'+rnd;
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

  websocketIsEnabled(isEnabled: boolean): any{
    if(isEnabled) return !this.websocketService.websocketIsStopped;
    if(!isEnabled) return this.websocketService.websocketIsStopped;
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
interface IAuthTokenMessage{
  error: any[];
  result: IAuthTokenMessageResult
}
interface IAuthTokenMessageResult{
  expires: number,
  token: string
}