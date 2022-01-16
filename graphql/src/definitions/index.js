import { gql } from 'apollo-server-fastify';

import exchange from './exchange.js';
import pagination from './pagination.js';
import portfolio from './portfolio.js';
import symbol from './symbol.js';
import transaction from './transaction.js';

export default gql`

scalar DateTime
scalar ObjectID

directive @connectionProject(type: String!) on OBJECT
directive @project(field: String, needs: [String!]! = []) on FIELD_DEFINITION

enum SortOrderEnum {
  "Sorts results by ascending values."
  ASC
  "Sorts results by descending values."
  DESC
}

type Query {
  "A simple ping/pong query."
  ping: String!
}

type Mutation {
  "A simple ping/pong mutation."
  ping: String!
}

${exchange}
${pagination}
${portfolio}
${symbol}
${transaction}

`;
