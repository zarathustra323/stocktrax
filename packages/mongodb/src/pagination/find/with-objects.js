import Joi from '@parameter1/joi';
import { validateAsync } from '@parameter1/joi/utils.js';
import { get } from '@stocktrax/object-path';
import sift from 'sift';
import { encodeCursor } from '../utils/index.js';
import schema from '../schema.js';

const applyCursorsToEdges = ({ allEdges, before, after }) => {
  if (after) {
    const afterEdgeIndex = allEdges.findIndex((edge) => edge.cursor === after);
    if (afterEdgeIndex === -1) return [];
    return allEdges.filter((_, index) => index > afterEdgeIndex);
  }
  if (before) {
    const beforeEdgeIndex = allEdges.findIndex((edge) => edge.cursor === before);
    if (beforeEdgeIndex === -1) return [];
    return allEdges.filter((_, index) => index < beforeEdgeIndex);
  }
  return allEdges;
};

const edgesToReturn = ({
  allEdges,
  before,
  after,
  first,
  last,
}) => {
  const edges = applyCursorsToEdges({ allEdges, before, after });
  if (first) return edges.slice(0, first);
  if (last) return edges.slice().reverse().slice(0, last).reverse(); // preserves the order
  return allEdges;
};

const hasPreviousPage = ({
  allEdges,
  before,
  after,
  last,
}) => {
  if (last) {
    const edges = applyCursorsToEdges({ allEdges, before, after });
    return edges.length > last;
  }
  if (after) {
    const targetEdgeIndex = allEdges.findIndex((edge) => edge.cursor === after);
    return allEdges.length - 1 > targetEdgeIndex;
  }
  return false;
};

const hasNextPage = ({
  allEdges,
  before,
  after,
  first,
}) => {
  if (first) {
    const edges = applyCursorsToEdges({ allEdges, before, after });
    return edges.length > first;
  }
  if (before) {
    const targetEdgeIndex = allEdges.findIndex((edge) => edge.cursor === before);
    if (!targetEdgeIndex) return false;
    return allEdges.length > targetEdgeIndex;
  }
  return false;
};

export default async (docs = [], params = {}) => {
  const {
    query,
    sort, // @todo add multi-field support
    limit,
    cursor,
    direction,
  } = await validateAsync(Joi.object({
    query: schema.query,
    sort: schema.sort.default({ field: 'node._id', order: 1 }), // need to use internal JS sort (how should collation work??)
    limit: schema.limit,
    cursor: schema.edgeCursor,
    direction: schema.cursorDirection,
  }), params);

  const allEdges = docs
    // filter based on the query
    .filter(sift(query))
    // then apply the cursor
    .map((edge) => ({ ...edge, cursor: encodeCursor(edge.node._id) }))
    // and sort before limiting/applying the cursor
    // @todo sort with `Intl.Collator`
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator
    .sort((edge1, edge2) => {
      const { field, order } = sort;
      const a = get(edge1, field);
      const b = get(edge2, field);
      if (a > b) return order;
      if (a < b) return order * -1;
      if (field === 'node._id') return 0;
      // also sort using the node id when the value is the same.
      const id1 = get(edge1, 'node._id');
      const id2 = get(edge2, 'node._id');
      if (id1 > id2) return order;
      if (id1 < id2) return order * -1;
      return 0;
    });

  const {
    first,
    after,
    last,
    before,
  } = {
    ...(direction === 'AFTER' && {
      first: limit,
      after: cursor,
    }),
    ...(direction === 'BEFORE' && {
      last: limit,
      before: cursor,
    }),
  };

  const toReturn = edgesToReturn({
    allEdges,
    before,
    after,
    first,
    last,
  });

  return {
    totalCount: allEdges.length,
    edges: toReturn,
    pageInfo: {
      hasPreviousPage: () => hasPreviousPage({
        allEdges,
        before,
        after,
        first,
        last,
      }),
      hasNextPage: () => hasNextPage({
        allEdges,
        before,
        after,
        first,
        last,
      }),
      endCursor: async () => {
        const lastEdge = toReturn[toReturn.length - 1];
        return lastEdge ? lastEdge.cursor : '';
      },
      startCursor: async () => {
        const [firstEdge] = toReturn;
        return firstEdge ? firstEdge.cursor : '';
      },
    },
  };
};
