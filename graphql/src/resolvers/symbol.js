import { getAsArray } from '@stocktrax/object-path';
import projectionForType from '../projection/get-for-type.js';
import projectionForConnection from '../projection/get-for-connection.js';

const symbolTypeMap = new Map([
  ['AD', 'ADR'],
  ['UT', 'Unit'],
  ['ET', 'Exchange Traded Fund (ETF)'],
  ['RT', 'Right'],
  ['CS', 'Common Stock'],
  ['CRYPTO', 'Cryptocurrency'],
  ['WT', 'Warrant'],
  ['PS', 'Preferred Stock'],
  ['OEF', 'Mutual Fund'],
  ['STRUCT', 'Structured Product'],
  ['EMTPY', 'Empty / Other'],
]);

export default {
  Symbol: {
    async companyInfo({ companyInfo, symbol }, _, { iexcloud, repos }) {
      if (companyInfo) return companyInfo.data;
      const data = await iexcloud.resource('stock').company({ symbol });
      await repos.get('symbol').updateOne({
        query: { symbol },
        update: {
          $set: { companyInfo: { data, lastRetrievedAt: new Date() } },
        },
      });
      return data;
    },

    async exchange({ exchangeSegment }, _, { repos }, info) {
      if (!exchangeSegment) return null;
      const loader = await repos.get('exchange').getDataloader();
      const projection = projectionForType(info);
      return loader.load({ foreignField: 'segment', value: exchangeSegment, projection });
    },

    identifiers(doc) {
      return doc;
    },

    async logoSrc({ symbol }) {
      return `https://storage.googleapis.com/iexcloud-hl37opg/api/logos/${symbol}.png`;
    },

    async peers({ peers, symbol }, _, { iexcloud, repos }, info) {
      let toLookup = peers ? peers.data : [];
      if (!peers) {
        const data = await iexcloud.resource('stock').peers({ symbol });
        await repos.get('symbol').updateOne({
          query: { symbol },
          update: {
            $set: { peers: { data, lastRetrievedAt: new Date() } },
          },
        });
        toLookup = data;
      }

      if (!toLookup.length) return [];
      const loader = await repos.get('symbol').getDataloader();
      const projection = projectionForType(info);
      return loader.loadMany({ foreignField: 'symbol', values: toLookup, projection });
    },
  },

  SymbolCompanyInfo: {
    ceo(info) {
      return info.CEO;
    },
    name(info) {
      return info.companyName;
    },
    tags(info) {
      return getAsArray(info.tags);
    },
    website({ website }) {
      return /^http/.test(website) ? website : `https://${website}`;
    },
  },

  SymbolIdentifiers: {
    iex(doc) {
      return doc.iexId;
    },
  },

  SymbolType: {
    id(type) {
      return type;
    },
    name(type) {
      return symbolTypeMap.get(type);
    },
  },

  Query: {
    async symbols(_, { input }, { repos }, info) {
      const {
        currencies,
        exchanges,
        pagination,
        regions,
        searchPhrase,
        types,
      } = input;

      const $and = [];
      if (currencies.length) $and.push({ currency: { $in: currencies } });
      if (exchanges.length) $and.push({ exchangeSegment: { $in: exchanges } });
      if (regions.length) $and.push({ region: { $in: regions } });
      if (types.length) $and.push({ type: { $in: types } });

      const query = {
        ...(searchPhrase && {
          $or: [
            { $text: { $search: searchPhrase } },
            { symbol: searchPhrase.toUpperCase() },
          ],
        }),
        ...($and.length && { $and }),
      };
      const projection = {
        ...projectionForConnection(info),
        ...(searchPhrase && { _score: { $meta: 'textScore' } }),
      };
      return repos.get('symbol').paginate({
        query,
        sort: searchPhrase ? { field: '_score', order: { $meta: 'textScore' } } : input.sort,
        projection,
        pagination,
      });
    },
  },
};
