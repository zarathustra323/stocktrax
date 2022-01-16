import DataLoader from 'dataloader';
import { asObject } from '@stocktrax/utils';
import { createQueryMap, reduceKeys } from './utils/index.js';

export default class MongoDBLoader {
  /**
   * @param {object} params
   * @param {Collection} params.collection The MongoDB collection to load data from
   * @param {object} [params.options] Options to send to the data loader
   */
  constructor({ collection, options } = {}) {
    this.collection = collection;
    this.loader = new DataLoader(this.batchLoadFn.bind(this), {
      ...options,
      cacheKeyFn: MongoDBLoader.cacheKeyFn,
    });
  }

  /**
   * @param {object} params
   * @param {string} [params.foreignField=_id] The foreign field to query.
   * @param {*} params.value The document id value to load
   * @param {object} [params.projection] The document projection object (e.g. the fields to return)
   */
  load({ foreignField = '_id', value, projection } = {}) {
    const { fields } = MongoDBLoader.prepare({ foreignField, projection });
    const key = { foreignField, value, fields };
    return this.loader.load(key);
  }

  /**
   * @private
   * @param {array} keys
   */
  async batchLoadFn(keys) {
    const idMap = reduceKeys(keys);
    const queryMap = createQueryMap(idMap);

    const promises = [];
    queryMap.forEach(({ foreignField, values, projection }) => {
      const query = { [foreignField]: { $in: values } };
      promises.push((async () => {
        const docs = await this.collection.find(query, { projection }).toArray();
        return { foreignField, docs };
      })());
    });
    // load all query results
    const resultSets = await Promise.all(promises);
    // reduce all result sets into a single map keyed by foreign field + lookup value
    const resultMap = new Map();
    resultSets.forEach(({ foreignField, docs }) => {
      docs.forEach((doc) => {
        const key = `${foreignField}:${doc[foreignField]}`;
        resultMap.set(key, doc);
      });
    });
    return keys.map(({ foreignField, value }) => {
      const key = `${foreignField}:${value}`;
      const doc = resultMap.get(key) || null;
      return doc;
    });
  }

  /**
   * @param {object} params
   * @param {string} params.foreignField
   * @param {*} params.value
   * @param {array} params.fields
   */
  static cacheKeyFn({ foreignField, value, fields }) {
    return JSON.stringify({ [foreignField]: value, fields });
  }

  /**
   * @param {object} params
   * @param {object} [params.projection]
   */
  static prepare({ foreignField, projection } = {}) {
    const projectKeys = new Set(Object.keys(asObject(projection)));
    // ensure `_id` is added when projected fields are set
    // this ensures that the project cache key will be consistent
    // also ensure the foreign field is projected
    if (projectKeys.size) {
      projectKeys.add('_id');
      projectKeys.add(foreignField);
    }
    // sort the fields for consistent cache key resolution
    const fields = [...projectKeys].sort();
    return { fields };
  }
}
