import projectionForConnection from '../projection/get-for-connection.js';

export default {
  Exchange: {
    async children(doc, __, { repos }, info) {
      if (doc.mic !== doc.segment) return [];
      const query = { mic: doc.mic, _id: { $ne: doc._id } };
      const projection = projectionForConnection(info);
      const cursor = await repos.get('exchange').find({ query, options: { projection } });
      return cursor.toArray();
    },

    parent(doc, __, { repos }, info) {
      if (doc.mic === doc.segment) return null;
      const query = { mic: doc.mic, segment: doc.mic };
      const projection = projectionForConnection(info);
      return repos.get('exchange').findOne({ query, options: { projection } });
    },
  },

  Query: {
    exchangeBySegment(_, { input }, { repos }, info) {
      const query = { segment: input.segment };
      const projection = projectionForConnection(info);
      return repos.get('exchange').findOne({
        query,
        options: { projection },
      });
    },

    async exchanges(_, { input }, { repos }, info) {
      const {
        mics,
        pagination,
        regions,
        segments,
        sort,
      } = input;

      const $and = [];
      if (mics.length) $and.push({ mic: { $in: mics } });
      if (regions.length) $and.push({ region: { $in: regions } });
      if (segments.length) $and.push({ region: { $in: segments } });

      const query = { ...($and.length && { $and }) };
      const projection = projectionForConnection(info);
      return repos.get('exchange').paginate({
        query,
        sort,
        projection,
        pagination,
      });
    },
  },
};
