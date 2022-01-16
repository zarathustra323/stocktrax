import inquirer from 'inquirer';
import { immediatelyThrow } from '@stocktrax/utils';
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

  log(refDataTypes);

  log('Closing from MongoDB...');
  await mongodb.close();
  log('MongoDB closed.');
})().catch(immediatelyThrow);
