import { gql } from 'apollo-server-fastify';

export default gql`


scalar DateTime
scalar ObjectID

type Query {
  "A simple ping/pong query."
  ping: String!
}

type Mutation {
  "A simple ping/pong mutation."
  ping: String!
}

`;