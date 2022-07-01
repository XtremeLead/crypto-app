import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject} from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';
import * as Forge from 'node-forge';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(
    private http: HttpClient) { }

    statusUrl = environment.apiStatusUrl;
    tokenUrl      = 'https://api.kraken.com/0/private/GetWebSocketsToken';
    corsUrl       = environment.corsUrl; // your server on same domain, because CORS

    fetchStatus(): Observable<IStatus[]> {
      return this.http.get<IStatus[]>(
        this.statusUrl
      ).pipe(
        tap(result => {}),
      );
    }

    fetchAuthToken(): Observable<IAuthTokenMessage> {
      const api_key     = environment.apiKey;
      const api_secret  = environment.privKey;
      const api_path    = new URL(this.tokenUrl).pathname;
      const api_nonce   = (new Date).getTime().toString();
      const api_post    = 'nonce='+api_nonce;
      
      const hash = Forge.md.sha256.create();
      const api_sha256: Forge.util.ByteStringBuffer = hash.update(
        Forge.util.encodeUtf8(api_nonce) + Forge.util.encodeUtf8(api_post)
        ).digest();
  
      const hmac = Forge.hmac.create();
      hmac.start('sha512', Forge.util.decode64(api_secret));
      hmac.update(Forge.util.encodeUtf8(api_path) + api_sha256.bytes());
  
      const hmacByteBuffer  = hmac.digest();
      const hmacByteString  = hmacByteBuffer.bytes();
      const api_signature   = Forge.util.encode64(hmacByteString);
      const headers = new HttpHeaders({
        'API-Key': api_key,
        'API-Sign': api_signature,
        'API-Url': this.tokenUrl,
        'API-Qs': api_post
      });
      const requestOptions = { headers: headers };
      
      // let result: any;
      // this.http
      //     .get(this.corsUrl, requestOptions)
      //     .subscribe((res: any) => {
      //         result = res;
      //     });
      // return result;
      return this.http.get<IAuthTokenMessage>(
          this.corsUrl, requestOptions
        ).pipe(
          tap(result => {}),
        );
    }
}
 interface IToken {
   event: string;
   subscription: any[];
 }
 interface IStatus {
  result: any[];
  error: any[];  
}
interface IAuthTokenMessage{
  error: any[];
  result: IAuthTokenMessageResult
}
interface IAuthTokenMessageResult{
  expires: number,
  token: string
}