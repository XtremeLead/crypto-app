import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  subject!: WebSocketSubject<any>;
  endpointStatus!: string;
  sub: ISub = {
    name: 'ticker'
  };
  pairs: Array<string> = [];
  subscriptionMessage: ISubMsg = {
    event: 'subscribe',
    subscription: this.sub,
    pair: this.pairs
  };
  websocketIsStopped: boolean = true;
  authToken!: string;

  // provide subscribable object
  private stream: any = [];
  behaviorSubjectTickerData: BehaviorSubject<ITickerData> = new BehaviorSubject<
    ITickerData
  >(this.stream);

  constructor(private tokenService: TokenService) {}

  whichEndpoint(): string {
    return environment.usePrivateEndpoint
      ? environment.apiPrivateEndpoint
      : environment.apiPublicEndpoint;
  }

  startWebsocket(): void {
    if (this.endpointStatus == 'online') {
      this.subject = <WebSocketSubject<any>>webSocket(this.whichEndpoint());

      if (environment.usePrivateEndpoint) {
        this.subscriptionMessage = {
          event: 'subscribe',
          subscription: {
            name: 'ownTrades',
            token: this.authToken
          }
        };
      } else {
        this.subscriptionMessage = {
          event: 'subscribe',
          subscription: this.sub,
          pair: this.pairs
        };
      }

      console.log('start ws');

      this.subject.subscribe(data => {
        this.parseMessage(data);
      });
      this.subject.next(this.subscriptionMessage);
      this.websocketIsStopped = false;
    } else {
      console.log('endpoint offline?');
    }
  }

  parseMessage(data: any) {
    if (
      data.event != 'heartbeat' &&
      data[2] == 'ticker' &&
      data.status != 'error'
    ) {
      const tickerdata: ITickerData = {
        pair: data[3],
        value: data[1]['c'][0]
      };
      // push new data to subscribable object
      this.behaviorSubjectTickerData.next(tickerdata);
    }
    if (data.status == 'error') {
      console.error(data.errorMessage);
      const tickerdata: ITickerData = {
        pair: '-',
        value: '-',
        error: data.errorMessage
      };
      // push error data to subscribable object
      this.behaviorSubjectTickerData.next(tickerdata);
    }
  }

  stopWebsocket(): void {
    console.log('stop ws');
    this.subject.complete();
    this.websocketIsStopped = true;
  }
}

interface ISubMsg {
  event: string;
  subscription: ISub;
  pair?: Array<string>;
}
interface ISub {
  name: string;
  token?: string;
}
interface ITickerData {
  pair: string;
  value: string;
  error?: string;
}
