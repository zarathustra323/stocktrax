import { eachSeries, eachOfSeries } from 'async';
import { chunkArray } from '@stocktrax/utils';
import refDataMap from '../ref-data-map.js';
import iex from '../iexcloud.js';
import mongodb from '../mongodb.js';

const { log } = console;

export default async (refDataTypes) => {
  const now = new Date();

  await eachSeries(refDataTypes, async (endpoint) => {
    const ref = refDataMap.get(endpoint);
    const collection = await mongodb.collection({ dbName: 'iexcloud', name: endpoint });
    log(`Syncing data for ${ref.name}...`);
    const data = await iex.request({ endpoint });

    log(`Found ${data.length} records`);

    const chunks = chunkArray(data, 1000);

    await eachOfSeries(chunks, async (chunk, index) => {
      log(` > Processing chunk ${index + 1} of ${chunks.length}...`);
      const operations = chunk.map((obj) => {
        const filter = ref.buildFilter(obj);
        const update = {
          $set: {
            _meta: { lastProcessedAt: now },
            ...obj,
          },
        };
        return { updateOne: { filter, update, upsert: true } };
      });
      await collection.bulkWrite(operations);
    });

    log(`Data sync complete for ${ref.name}`);
  });
};
