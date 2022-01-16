import repos from '../mongodb/repos.js';

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
    id(doc) {
      return doc._id;
    },
    exchange(doc) {
      return doc.exchangeSegment;
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
    async symbols(_, { input }) {
      const {
        currencies,
        exchanges,
        regions,
        types,
      } = input;

      const $and = [];
      if (currencies.length) $and.push({ currency: { $in: currencies } });
      if (exchanges.length) $and.push({ exchangeSegment: { $in: exchanges } });
      if (regions.length) $and.push({ region: { $in: regions } });
      if (types.length) $and.push({ type: { $in: types } });

      const query = {
        ...($and.length && { $and }),
      };

      const cursor = await repos.get('symbol').find({ query });
      return cursor.toArray();
    },
  },
};
