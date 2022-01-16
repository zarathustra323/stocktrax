import { gql } from 'apollo-server-fastify';

export default gql`

extend type Mutation {
  newTransaction(input: MutateNewTransactionInput!): Transaction!
}

enum TransactionTypeEnum {
  BUY
  SELL
}

type Transaction {
  id: ObjectID! @project(field: "_id")
  type: TransactionTypeEnum! @project
  symbol: Symbol! @project
  date: DateTime! @project
  shares: Float! @project
  price: Float! @project
  totalAmount: Float! @project
  portfolio: Portfolio! @project(field: "portfolio._id")
}

input MutateNewTransactionInput {
  type: TransactionTypeEnum!
  symbol: String!
  date: DateTime!
  shares: Float!
  price: Float!
  portfolioId: ObjectID!
}

`;
