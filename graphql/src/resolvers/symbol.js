import repos from '../mongodb/repos.js';
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
    async exchange({ exchangeSegment }, _, __, info) {
      if (!exchangeSegment) return null;
      const loader = await repos.get('exchange').getDataloader();
      const projection = projectionForType(info);
      console.log({ projection });
      return loader.load({ foreignField: 'segment', value: exchangeSegment, projection });
    },
    identifiers(doc) {
      return doc;
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
    async symbols(_, { input }, __, info) {
      const {
        currencies,
        exchanges,
        pagination,
        regions,
        sort,
        types,
      } = input;

      const $and = [];
      if (currencies.length) $and.push({ currency: { $in: currencies } });
      if (exchanges.length) $and.push({ exchangeSegment: { $in: exchanges } });
      if (regions.length) $and.push({ region: { $in: regions } });
      if (types.length) $and.push({ type: { $in: types } });

      const query = { ...($and.length && { $and }) };
      const projection = projectionForConnection(info);
      return repos.get('symbol').paginate({
        query,
        sort,
        projection,
        pagination,
      });
    },
  },
};
