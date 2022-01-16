import { UserInputError } from 'apollo-server-fastify';
import projectionForType from '../projection/get-for-type.js';

const typeMap = new Map([
  ['BUY', 'Buy'],
  ['CAPITAL_GAIN_LONG', 'Capital Gain (Short)'],
  ['CAPITAL_GAIN_SHORT', 'Capital Gain (Long)'],
  ['DIVIDEND', 'Dividend Reinvestment'],
  ['SELL', 'Sell'],
]);

export default {
  Transaction: {
    async portfolio({ portfolio }, _, { repos }, info) {
      const loader = await repos.get('portfolio').getDataloader();
      const projection = projectionForType(info);
      return loader.load({ value: portfolio._id, projection });
    },

    async symbol({ symbol }, _, { repos }, info) {
      const loader = await repos.get('symbol').getDataloader();
      const projection = projectionForType(info);
      return loader.load({ foreignField: 'symbol', value: symbol, projection });
    },

    type({ type }) {
      return type;
    },
  },

  TransactionType: {
    id(type) {
      return type;
    },
    name(type) {
      return typeMap.get(type);
    },
  },

  Mutation: {
    async newTransaction(_, { input }, { repos }) {
      const { shares, price } = input;
      const symbol = input.symbol.trim().toUpperCase();
      const [portfolio] = await Promise.all([
        repos.get('portfolio').findById({
          id: input.portfolioId,
          options: { strict: true, projection: { _id: 1 } },
        }),
        repos.get('symbol').findOne({
          query: { symbol },
          options: { strict: true, projection: { _id: 1 } },
        }),
      ]);

      if (shares < 0) throw new UserInputError('The shares must be greater than zero.');
      if (price < 0) throw new UserInputError('The price must be greater than zero.');

      const doc = {
        type: input.type,
        symbol,
        portfolio,
        date: input.date,
        shares,
        price,
        totalAmount: shares * price,
      };
      return repos.get('transaction').insertOne({ doc });
    },
  },
};
