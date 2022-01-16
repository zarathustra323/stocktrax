import { cleanPath } from '@stocktrax/utils';
import AbstractResource from './-abstract.js';

export default class StockResource extends AbstractResource {
  async peers(params = {}) {
    const symbol = params.symbol.toLowerCase();
    const endpoint = StockResource.createEndpoint(`${symbol}/peers`);
    return this.client.request({ endpoint });
  }

  static createEndpoint(path) {
    return `stock/${cleanPath(path)}`;
  }
}
