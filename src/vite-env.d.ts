/// <reference types="vite/client" />
declare module 'big.js' {
  export default class Big {
    constructor(value: string | number | Big)
    times(value: string | number | Big): Big
    toFixed(digits: number): string
  }
}
