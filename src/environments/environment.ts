// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiPublicEndpoint: 'wss://ws.kraken.com',
  apiPrivateEndpoint: 'wss://ws-auth.kraken.com',
  apiStatusUrl: 'https://api.kraken.com/0/public/SystemStatus',
  apiKey: 'B9hopzyUC4orQ7+vkGg8xyHA/uu2YKvQDhrY12J4gGzF7wZDb52KmK19',
  privKey: 'RG3p5S/yCOg9YaDYnsT1tVB2NZDyN12L5seWQt19quh6JRQzX3+/wbgtdHySnOpSAgYs/UzmbTFy4CCeF18eyg==',
  usePrivateEndpoint: false,
  corsUrl: 'https://m.waabaa.nl/php/KrakenAuthToken.php'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
