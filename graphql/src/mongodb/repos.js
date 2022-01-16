import { Repo } from '@stocktrax/mongodb';
import client from './client.js';

const dbName = 'stocktrax';

const map = new Map([
  ['portfolio', new Repo({
    name: 'portfolio',
    client,
    dbName,
    collectionName: 'portfolios',
  })],
]);

export default {
  get: (key) => {
    if (!map.has(key)) throw new Error(`No repository found for ${key}`);
    return map.get(key);
  },
};
