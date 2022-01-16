import { iterateMongoCursor } from '@stocktrax/mongodb';
import mongodb from './mongodb.js';

const { log } = console;

const fields = [
  'exchange',
  'exchangeSuffix',
  'description',
  'mic',
  'region',
  'segmentDescription',
  'suffix',
];

export default async () => {
  const now = new Date();

  const name = 'ref-data/exchanges';
  const source = await mongodb.collection({ dbName: 'iexcloud', name });
  const destination = await mongodb.collection({ dbName: 'stocktrax', name: 'exchanges' });
  const cursor = await source.find();

  const ops = [];
  await iterateMongoCursor(cursor, (doc) => {
    const { description, segmentDescription } = doc;

    const nameParts = [description];
    if (segmentDescription && segmentDescription !== description) {
      nameParts.push(segmentDescription);
    }

    const filter = { segment: doc.segment };
    const update = {
      $setOnInsert: {
        ...filter,
        '_meta.source': name,
      },
      $set: fields.reduce((o, field) => ({
        ...o,
        [field]: doc[field] || null,
        '_meta.sourceLastProcessedAt': doc._meta.lastProcessedAt, // eslint-disable-line
      }), {
        name: nameParts.map((part) => part.trim()).join(' > '),
        '_meta.lastBuiltAt': now,
      }),
    };
    ops.push({ updateOne: { filter, update, upsert: true } });
  });
  log(' > Writing...');
  if (ops.length) await destination.bulkWrite(ops);
  log(` > Upserted ${ops.length} documents for ${name} `);
};
