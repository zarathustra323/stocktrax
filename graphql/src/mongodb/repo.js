import { Repo } from '@stocktrax/mongodb';
import { get } from '@stocktrax/object-path';
import { withCursor, withOffset, withObjects } from '@stocktrax/mongodb/pagination/find';
import MongoDBLoader from '@stocktrax/dataloader';

export default class AbstractRepo extends Repo {
  /**
   *
   */
  constructor({
    name,
    collectionName,
    client,
    dbName,
    collatableFields = [],
  } = {}) {
    super({
      name,
      collectionName,
      dbName,
      client,
    });
    this.collatableFields = Array.isArray(collatableFields)
      ? collatableFields.reduce((o, field) => ({ ...o, [field]: true }), {})
      : {};
  }

  /**
   * Initializes and returns the dataloader instance for this repo.
   */
  async getDataloader() {
    if (this.dataloaderPromise) return this.dataloaderPromise;
    this.dataloaderPromise = (async () => {
      const collection = await this.collection();
      return new MongoDBLoader({ collection });
    })();
    return this.dataloaderPromise;
  }

  /**
   * Loads a single document using the `find` dataloader.
   *
   * @param {object} params
   * @param {object} [params.currentDoc] The current document. If the doc
   *                                     is present, and satisifies the projection, the query
   *                                     will be skipped and the current doc will be returned.
   * @param {string} [params.foreignField=_id] The foreign field to query.
   * @param {*} params.value The document id value to load
   * @param {object} [params.projection] The document projection object (e.g. the fields to return)
   */
  async loaderFindOne({
    currentDoc,
    foreignField = '_id',
    value,
    projection,
  } = {}) {
    const canReturn = AbstractRepo.canReturnCurrentDoc({
      currentDoc,
      foreignField,
      value,
      projection,
    });
    if (canReturn) return currentDoc;
    const loader = await this.getDataloader();
    return loader.load({ foreignField, value, projection });
  }

  /**
   * @param {object} params
   */
  async paginate({
    query,
    sort,
    projection,
    pagination,
  } = {}) {
    const [collection, dataloader] = await Promise.all([
      this.collection(),
      this.getDataloader(),
    ]);
    const sortField = get(sort, 'field');

    const params = {
      query,
      sort,
      limit: get(pagination, 'limit'),
      projection,
      collate: this.collatableFields[sortField],
    };

    const type = get(pagination, 'using', 'cursor');
    if (type === 'cursor') {
      return withCursor(collection, {
        ...params,
        cursor: get(pagination, 'cursor.value'),
        direction: get(pagination, 'cursor.direction'),
        dataloader,
      });
    }
    return withOffset(collection, {
      ...params,
      skip: get(pagination, 'offset.value'),
    });
  }

  /**
   *
   * @param {object} params
   * @returns
   */
  async paginateEdges({ // eslint-disable-line class-methods-use-this
    edges = [],
    query,
    sort,
    pagination,
  } = {}) {
    return withObjects(edges, {
      query,
      sort,
      limit: get(pagination, 'limit'),
      cursor: get(pagination, 'cursor.value'),
      direction: get(pagination, 'cursor.direction'),
    });
  }

  /**
   * @todo how would this work with an entire edge, not just a single node??
   */
  static canReturnCurrentDoc({
    currentDoc,
    foreignField = '_id',
    value,
    projection,
  } = {}) {
    if (!currentDoc) return false;
    // ensure the ID values match
    if (`${get(currentDoc, foreignField)}` !== `${value}`) return false;

    // empty fields requires a full projection. must query.
    const { fields } = MongoDBLoader.prepare({ foreignField, projection });
    if (!fields.length) return false;

    // ensure the doc has all the projected fields.
    return fields.every((key) => {
      const v = get(currentDoc, key, undefined);
      return typeof v !== 'undefined';
    });
  }
}
