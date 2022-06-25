import { Component, OnInit } from '@angular/core';
import { CryptosService } from '../cryptos.service';
import { ITicker } from '../iticker';
import { ITickers } from '../itickers';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-pricetable',
  templateUrl: './pricetable.component.html',
  styleUrls: ['./pricetable.component.css']
})
export class PricetableComponent implements OnInit {

  constructor(
    private cryptoService: CryptosService
  ) { 
    //receive data from / subscribe to data in service
    //this.cryptoService.tickerData.subscribe(tickerdata => this.tickerdata = tickerdata);

    this.cryptoService.tickerData.subscribe((data: ITickers[]) => {
      console.log('received data');
      this.tickerdata.data = data;
    });
  }

  //tickerdata:       ITickers[]  = [];
  tickerdata = new MatTableDataSource<ITickers>();
  displayedColumns: string[]    = ['name','price', 'input1', 'input2', 'total', 'total2'];
  edits: any = {};
  json: string = '';
  

  ngOnInit(): void {
    //receive data from / subscribe to data in service
    //this.cryptoService.tickerData.subscribe(tickerdata => this.tickerdata = tickerdata)
    this.cryptoService.tickerData.subscribe((data: ITickers[]) => {
      const combinedData = this.combineLocalStorageWithData(data);
 
      this.tickerdata.data = combinedData;
    });
  }
  
  processInput(event: any, ele: any, index: number): void {
    //let inputId: string = `${ ele.name }-${ row }-${ index + 1 }`;
    //let newValues:{ [key: string]: any } = ele;

    ///newValues[col] = this.edits[inputId];
    //newValues[col] = event.target.value;

    ///this.updateLocalStorage(ele.name, `input${ index + 1 }`, this.edits[inputId]);
    this.updateLocalStorage(ele.name, `input${ index + 1 }`, event.target.value);


    // let newData: any = [];
    //console.log(this.tickerdata.filteredData);
    // console.log(this.cryptoService.getTickerData().source.value);
    //console.log(this.cryptoService.getTickerData().source.value)
    const combinedData = this.combineLocalStorageWithData(this.tickerdata.filteredData);
    //this.cryptoService.setTickerData(this.tickerdata.filteredData);

    
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
}
