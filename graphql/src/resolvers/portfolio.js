export default {
  Portfolio: {
    id(doc) {
      return doc._id;
    },
  },

  Mutation: {
    newPortfolio(_, { input }, { repos }) {
      return repos.get('portfolio').insertOne({
        doc: { name: input.name, type: input.type },
      });
    },
  },

  Query: {
    async portfolios(_, __, { repos }) {
      const cursor = await repos.get('portfolio').find();
      return cursor.toArray();
    },
  },
};
