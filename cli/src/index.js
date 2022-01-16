import inquirer from 'inquirer';
import { immediatelyThrow } from '@stocktrax/utils';
import mongodb from './mongodb.js';
import {
  buildExchanges,
  buildSymbols,
  syncRefData,
} from './commands/index.js';
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
    {
      type: 'confirm',
      name: 'shouldBuildExchanges',
      message: 'Build exchanges collection?',
      default: false,
    },
    {
      type: 'confirm',
      name: 'shouldBuildSymbols',
      message: 'Build consolidated symbols collection?',
      default: false,
    },
  ];

  const {
    shouldBuildExchanges,
    shouldBuildSymbols,
    importIEXRefData,
    refDataTypes,
  } = await inquirer.prompt(questions);

  log('Connecting to MongoDB...');
  await mongodb.connect();
  log('MongoDB connected.');

  if (importIEXRefData) {
    await syncRefData(refDataTypes);
  }

  if (shouldBuildExchanges) {
    log('Building exchanges collection...');
    await buildExchanges();
    log('Exchanges built.');
  }

  if (shouldBuildSymbols) {
    log('Building symbols collection...');
    await buildSymbols();
    log('Symbols built.');
  }

  log('Closing from MongoDB...');
  await mongodb.close();
  log('MongoDB closed.');
})().catch(immediatelyThrow);
