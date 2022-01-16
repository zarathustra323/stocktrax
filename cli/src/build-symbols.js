import { eachSeries } from 'async';
import { iterateMongoCursor } from '@stocktrax/mongodb';
import mongodb from './mongodb.js';

const { log } = console;

export default async () => {
  const sourceMap = new Map([
    ['ref-data/symbols', {}],
    ['ref-data/crypto/symbols', {}],
    ['ref-data/mutual-funds/symbols', {
      query: { type: 'oef' },
    }],
    ['ref-data/otc/symbols', {}],
  ]);

  const fields = [
    'cik',
    'currency',
    'date',
    'exchangeSegment',
    'figi',
    'iexId',
    'isEnabled',
    'lei',
    'name',
    'region',
  ];

  const now = new Date();

  await eachSeries(sourceMap, async ([name, { query }]) => {
    log(` > Handling ${name}...`);
    const source = await mongodb.collection({ dbName: 'iexcloud', name });
    const destination = await mongodb.collection({ dbName: 'stocktrax', name: 'symbols' });
    const cursor = await source.find(query);
    const count = await cursor.count();
    log(`  > Found ${count} documents to upsert`);

    const ops = [];
    await iterateMongoCursor(cursor, (doc) => {
      const filter = { symbol: doc.symbol, type: doc.type.toUpperCase() };
      const update = {
        $setOnInsert: {
          ...filter,
          '_meta.source': name,
        },
        $set: fields.reduce((o, field) => ({
          ...o,
          [field]: doc[field] || null,
          '_meta.sourceLastProcessedAt': doc._meta.lastProcessedAt, // eslint-disable-line
        }), { '_meta.lastBuiltAt': now }),
      };
      ops.push({ updateOne: { filter, update, upsert: true } });
    });
    log('  > Writing...');
    if (ops.length) await destination.bulkWrite(ops);
    log(`  > Upserted ${ops.length} documents for ${name} `);
  });
};
