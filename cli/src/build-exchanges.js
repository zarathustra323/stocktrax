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

  const usExchangeMap = await (async () => {
    const collection = await mongodb.collection({ dbName: 'iexcloud', name: 'ref-data/market/us/exchanges' });
    const cursor = await collection.find();
    const docs = await cursor.toArray();
    return docs.reduce((map, doc) => {
      map.set(doc.mic, doc);
      return map;
    }, new Map());
  })();

  const name = 'ref-data/exchanges';
  const source = await mongodb.collection({ dbName: 'iexcloud', name });
  const destination = await mongodb.collection({ dbName: 'stocktrax', name: 'exchanges' });
  const cursor = await source.find();

  const docs = await cursor.toArray();
  const micToSegmentsMap = new Map();
  const segmentsToMicMap = new Map();

  docs.forEach((doc) => {
    const { mic, segment } = doc;
    if (!micToSegmentsMap.has(mic)) micToSegmentsMap.set(mic, new Set());
    segmentsToMicMap.set(segment, mic);
    micToSegmentsMap.get(mic).add(doc.segment);
  });

  const micsToUSExchangeMap = new Map();
  segmentsToMicMap.forEach((mic, segment) => {
    const info = usExchangeMap.get(segment);
    if (info) micsToUSExchangeMap.set(mic, info);
  });
  micToSegmentsMap.forEach((_, mic) => {
    const info = usExchangeMap.get(mic);
    if (info) micsToUSExchangeMap.set(mic, info);
  });

  const ops = [];
  docs.forEach((doc) => {
    const { description, segmentDescription } = doc;
    const usExchangeInfo = micsToUSExchangeMap.get(doc.mic);

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
        ...(usExchangeInfo && { usExchangeInfo }),
      }), {
        name: usExchangeInfo ? usExchangeInfo.name : nameParts.map((part) => part.trim()).join(' > '),
        '_meta.lastBuiltAt': now,
      }),
    };
    ops.push({ updateOne: { filter, update, upsert: true } });
  });
  log(' > Writing...');
  if (ops.length) await destination.bulkWrite(ops);
  log(` > Upserted ${ops.length} documents for ${name} `);
};
