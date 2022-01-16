import { cleanPath } from '@stocktrax/utils';
import AbstractResource from './-abstract.js';

export default class StockResource extends AbstractResource {
  async company(params = {}) {
    const symbol = params.symbol.toLowerCase();
    const endpoint = StockResource.createEndpoint(`${symbol}/company`);
    return this.client.request({ endpoint });
  }

  async peers(params = {}) {
    const symbol = params.symbol.toLowerCase();
    const endpoint = StockResource.createEndpoint(`${symbol}/peers`);
    return this.client.request({ endpoint });
  }

  static createEndpoint(path) {
    return `stock/${cleanPath(path)}`;
  }
}
