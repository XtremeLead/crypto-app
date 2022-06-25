export interface ITickerPairsFlat {
    //[key: string]: string | number | number[];
    name: string;
    aclass_base: string;
    aclass_quote: string;
    altname: string;
    base: string;
    fee_volume_currency: string;
    wsname: string;
    lot: string;
    pair_decimals: number;
    lot_decimals: number;
    lot_multiplier: number;
    leverage_buy: number[];
    leverage_sell: number[];
    fees: number[];
    fees_maker: number[];
    margin_call: number;
    margin_stop: number;
    ordermin: number;
}
