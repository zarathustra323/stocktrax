import merge from 'lodash.merge';
import GraphQLObjectId from '../scalars/object-id.js';
import GraphQLDateTime from '../scalars/date-time.js';

import exchange from './exchange.js';
import portfolio from './portfolio.js';
import symbol from './symbol.js';
import transaction from './transaction.js';

export default merge({
  DateTime: GraphQLDateTime,
  ObjectID: GraphQLObjectId,

  /**
   *
   */
  Mutation: {
    /**
     *
     */
    ping() {
      return 'pong';
    },
  },

  /**
   *
   */
  Query: {
    /**
     *
     */
    ping() {
      return 'pong';
    },
  },
}, exchange, portfolio, symbol, transaction);
