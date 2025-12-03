/*
a = ask array(<price>, <whole lot volume>, <lot volume>)
b = bid array(<price>, <whole lot volume>, <lot volume>)
c = last trade closed array(<price>, <lot volume>)
v = volume array(<today>, <last 24 hours>)
p = volume weighted average price array(<today>, <last 24 hours>)
t = number of trades array(<today>, <last 24 hours>)
l = low array(<today>, <last 24 hours>)
h = high array(<today>, <last 24 hours>)
o = today’s opening price
*/

export interface ITicker {
  a: string[];
  b: string[];
  c: string[];
  h: string[];
  l: string[];
  o: string;
  p: string[];
  t: number[];
  v: string[];
  name?: string;
  input1?: any;
  input2?: any;
  input3?: any;
  ticker?: string;
  decimals?: number;
  uniqueId: string;
}
