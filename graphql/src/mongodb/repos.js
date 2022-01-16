import AbstractRepo from './repo.js';
import client from './client.js';

const dbName = 'stocktrax';

const map = new Map([
  ['portfolio', new AbstractRepo({
    name: 'portfolio',
    client,
    dbName,
    collectionName: 'portfolios',
    collatableFields: ['name'],
  })],

  ['symbol', new AbstractRepo({
    name: 'symbol',
    client,
    dbName,
    collectionName: 'symbols',
    collatableFields: ['name', 'symbol'],
  })],
]);

export default {
  get: (key) => {
    if (!map.has(key)) throw new Error(`No repository found for ${key}`);
    return map.get(key);
  },
};
