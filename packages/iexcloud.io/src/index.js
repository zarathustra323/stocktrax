import fetch from 'node-fetch';
import { cleanPath } from '@stocktrax/utils';

import StockResource from './resources/stock.js';

export default class IEXCloudApiClient {
  constructor({ publishableToken, version = 'stable' } = {}) {
    this.publishableToken = publishableToken;
    this.version = version;

    this.resources = new Map([
      ['stock', new StockResource({ client: this })],
    ]);
  }

  get baseUrl() {
    return `https://cloud.iexapis.com/${cleanPath(this.version)}`;
  }

  resource(key) {
    const resource = this.resources.get(key);
    if (!resource) throw new Error(`No API resource found for ${key}`);
    return resource;
  }

  async request({
    endpoint,
    method = 'GET',
    query = {},
  } = {}) {
    const params = new URLSearchParams({ ...query, token: this.publishableToken });
    const url = `${this.baseUrl}/${cleanPath(endpoint)}?${params}`;
    const res = await fetch(url, { method });
    const json = await res.json();
    if (!res.ok) throw new Error('Bad response: implement better error handling!');
    return json;
  }
}
