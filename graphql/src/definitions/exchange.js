import { gql } from 'apollo-server-fastify';

export default gql`

type Exchange {
  "The internal identifier."
  id: ObjectID! @project(field: "_id")
  "The Market Identifier Code using ISO 10383"
  mic: String! @project
  "The unique exchange segment (using a 'subset' of the MIC)"
  segment: String! @project
  "The exchange name. Will also include the segment name if set and different from the exchange name."
  name: String! @project(needs: ["usExchangeInfo.name"])
  # The country code for the exchange using ISO 3166-1 alpha-2
  region: String @project
  "Suffix to be added for symbols on this exchange"
  suffix: String @project(field: "exchangeSuffix")
}

`;
