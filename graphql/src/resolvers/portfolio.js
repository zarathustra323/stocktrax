import repos from '../mongodb/repos.js';

export default {
  Portfolio: {
    id(doc) {
      return doc._id;
    },
  },

  Mutation: {
    newPortfolio(_, { input }) {
      return repos.get('portfolio').insertOne({
        doc: { name: input.name, type: input.type },
      });
    },
  },

  Query: {
    async portfolios() {
      const cursor = await repos.get('portfolio').find();
      return cursor.toArray();
    },
  },
};
