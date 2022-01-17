import { gql } from 'apollo-server-fastify';

export default gql`

extend type Mutation {
  newTransaction(input: MutateNewTransactionInput!): Transaction!
}

extend type Query {
  transactions(input: QueryTransactionsInput = {}): QueryTransactionsConnection!
}

enum QueryTransactionsSortFieldEnum {
  ID
  DATE
  SYMBOL
}

enum TransactionTypeEnum {
  BUY
  CAPITAL_GAIN_LONG
  CAPITAL_GAIN_SHORT
  DIVIDEND
  SELL
}

type QueryTransactionsConnection @connectionProject(type: "Transaction") {
  "The total number of objects available for this connection."
  totalCount: Int!
  "The connection edges containing the related node and other related fields."
  edges: [QueryTransactionsEdge!]!
  "The paging information for this connection."
  pageInfo: PageInfo!
}

type QueryTransactionsEdge {
  "An opaque cursor for this node that is used with pagination."
  cursor: String!
  "The primary node/document."
  node: Transaction!
}

type Transaction {
  id: ObjectID! @project(field: "_id")
  type: TransactionType! @project
  symbol: Symbol! @project
  date: DateTime! @project
  shares: Float! @project
  price: Float! @project
  totalAmount: Float! @project
  portfolio: Portfolio! @project(field: "portfolio._id")
}

type TransactionType {
  id: TransactionTypeEnum!
  name: String!
}

input MutateNewTransactionInput {
  type: TransactionTypeEnum!
  symbol: String!
  date: DateTime!
  shares: Float!
  price: Float!
  portfolioId: ObjectID!
}

input QueryTransactionsInput {
  "Specifies how the results should be paginated."
  pagination: PaginationInput! = {}
  "Specifies the sort field and order."
  sort: QueryTransactionsSortInput! = {}
}

input QueryTransactionsSortInput {
  "The field to sort by."
  field: QueryTransactionsSortFieldEnum! = DATE
  "The sort order."
  order: SortOrderEnum! = DESC
}

`;
