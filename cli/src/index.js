import inquirer from 'inquirer';
import { chunkArray, immediatelyThrow } from '@stocktrax/utils';
import { eachSeries, eachOfSeries } from 'async';
import iex from './iexcloud.js';
import mongodb from './mongodb.js';
import refDataMap from './ref-data-map.js';

process.on('unhandledRejection', immediatelyThrow);

const { log } = console;

(async () => {
  const questions = [
    {
      type: 'confirm',
      name: 'importIEXRefData',
      message: 'Import reference data from iexcloud.io?',
      default: false,
    },
    {
      type: 'checkbox',
      name: 'refDataTypes',
      message: 'Which import segments should run?',
      choices: [...refDataMap].map(([endpoint, o]) => ({ value: endpoint, name: o.name })),
      when: ({ importIEXRefData }) => importIEXRefData,
    },
  ];

  const {
    importIEXRefData,
    refDataTypes,
  } = await inquirer.prompt(questions);

  if (!importIEXRefData) return;

  log('Connecting to MongoDB...');
  await mongodb.connect();
  log('MongoDB connected.');

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

  log('Closing from MongoDB...');
  await mongodb.close();
  log('MongoDB closed.');
})().catch(immediatelyThrow);
