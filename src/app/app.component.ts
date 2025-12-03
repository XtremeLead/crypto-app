import { Component, OnInit } from '@angular/core';
import { TokenService } from './token.service';
import { WebsocketService } from './websocket.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Scee Scaa Scratchen';

  constructor(
    private tokenService: TokenService,
    private websocketService: WebsocketService,
    private router: Router
  ) {}

  ngOnInit(): void {}
  getRoute(): String {
    const path = this.router.url.replace('/', '');
    if (path === 'profitloss') return 'P&L';
    if (path === 'tradeprofitloss') return 'Trade P&L';
    return path == '' ? 'Home' : this.capitalizeFirstLetter(path);
  }
  capitalizeFirstLetter(string: String) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}
