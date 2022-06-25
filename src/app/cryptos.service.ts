import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject  } from 'rxjs';
import { ITickerPairs } from './iticker-pairs';
import { ITickers } from './itickers';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CryptosService {
  private corsUrl       = 'https://m.waabaa.nl/php/cors.php';
  private pairsUrl      = 'https://api.kraken.com/0/public/AssetPairs';
  private tickerUrl     = 'https://api.kraken.com/0/public/Ticker';
  private tickerSuffix  = '?pair=';

  //create subscribable datasource
  private tickerDataSource  = new BehaviorSubject([]);
  tickerData                = this.tickerDataSource.asObservable();

  constructor(
    private http: HttpClient) { }
  
  fetchPairs(): Observable<ITickerPairs[]> {
    const params = new FormData();
    params.append('url', this.pairsUrl);
    params.append('objectKey', 'result')

    return this.http.post<ITickerPairs[]>(
      this.corsUrl,
      params
    ).pipe(
      tap(result => {
        //result.sort((a,b) => <any>a.wsname - <any>b.wsname);
        //console.log('fetching pairs done', result)
      }),
      //catchError(this.handleError)
    );
  }

  fetchTickerData(tickers: string): Observable<ITickers[]> {
    const params = new FormData();
    params.append('url', this.tickerUrl);
    params.append('objectKey', 'result');
    params.append('query', this.tickerSuffix + tickers);

    return this.http.post<ITickers[]>(
      this.corsUrl,
      params,
      ).pipe(
        tap(result => {
          console.log('fetching prices done', result)
        }),
        //catchError(this.handleError)
    );
  }

  setTickerData(data:any){
    //update subscribable datasource
    this.tickerDataSource.next(data)
  }

  getTickerData():any{
      return this.tickerData;
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };

}

