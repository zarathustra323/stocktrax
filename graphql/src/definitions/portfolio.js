import { gql } from 'apollo-server-fastify';

export default gql`

extend type Mutation {
  newPortfolio(input: MutateNewPortfolioInput!): Portfolio!
}

extend type Query {
  portfolios: [Portfolio!]!
}

enum PortfolioTypeEnum {
  BROKERAGE
  HSA
  IRA
  ROTH_IRA
  SIMPLE_IRA
}

type Portfolio {
  id: ObjectID!
  name: String!
  type: PortfolioTypeEnum!
}

input MutateNewPortfolioInput {
  name: String!
  type: PortfolioTypeEnum!
}

`;
