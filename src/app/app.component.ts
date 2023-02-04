import { Component, OnInit } from '@angular/core';
import { TokenService } from './token.service';
import { WebsocketService } from './websocket.service';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Scee Scaa Scratchen';

  constructor(
    private tokenService: TokenService,
    private websocketService: WebsocketService
  ) {}

  ngOnInit(): void {}
}
