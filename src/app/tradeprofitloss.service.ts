import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class TradeprofitlossService {
  constructor() {}
  private _totalMsgSource = new Subject<number>();
  totalMsg$ = this._totalMsgSource.asObservable();

  sendTotalMsg(message: number) {
    this._totalMsgSource.next(message);
  }
}
