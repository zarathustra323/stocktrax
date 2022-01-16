import merge from 'lodash.merge';
import GraphQLObjectId from '../scalars/object-id.js';
import GraphQLDateTime from '../scalars/date-time.js';

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
});
