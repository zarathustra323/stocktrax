import { gql } from 'apollo-server-fastify';

export default gql`

extend type Query {
  exchangeBySegment(input: QueryExchangeBySegmentInput!): Exchange
  exchanges(input: QueryExchangesInput = {}): QueryExchangesConnection!
}

enum QueryExchangesSortFieldEnum {
  ID
  DESCRIPTION
  FULL_NAME
  NAME
  SEGMENT
}

type Exchange {
  "The internal identifier."
  id: ObjectID! @project(field: "_id")
  "The Market Identifier Code using ISO 10383"
  mic: String! @project
  "The unique exchange segment identifier code (using a 'subset' of the MIC)"
  segment: String! @project
  "Parent of this exchange segment."
  parent: Exchange @project(field: "segment", needs: ["mic"])
  "Child segments of this exchange."
  children: [Exchange!]! @project(field: "segment", needs: ["mic"])
  "The exchange description. Will also include the segment name if set and different from the exchange name."
  description: String! @project(field: "fullDescription")
  "The exchange name. Will also include the segment name if set and different from the exchange name."
  name: String! @project
  "The full name. Will also include the segment name if set and different from the exchange name. Similar to full description but will use the US exchange name first."
  fullName: String! @project
  # The country code for the exchange using ISO 3166-1 alpha-2
  region: String @project
  "Suffix to be added for symbols on this exchange"
  suffix: String @project(field: "exchangeSuffix")
}

type QueryExchangesConnection @connectionProject(type: "Exchange") {
  "The total number of objects available for this connection."
  totalCount: Int!
  "The connection edges containing the related node and other related fields."
  edges: [QueryExchangesEdge!]!
  "The paging information for this connection."
  pageInfo: PageInfo!
}

type QueryExchangesEdge {
  "An opaque cursor for this node that is used with pagination."
  cursor: String!
  "The primary node/document."
  node: Exchange!
}

input QueryExchangeBySegmentInput {
  segment: String!
}

input QueryExchangesInput {
  "The MICs, in ISO 10383, to filter by."
  mics: [String!]! = []
  "Specifies how the results should be paginated."
  pagination: PaginationInput! = {}
  "The country codes, in ISO 3166-1 alpha-2, to filter by."
  regions: [String!]! = []
  "The unique exchanges segments to filter by."
  segments: [String!]! = []
  "Specifies the sort field and order."
  sort: QueryExchangesSortInput! = {}
}

input QueryExchangesSortInput {
  "The field to sort by."
  field: QueryExchangesSortFieldEnum! = NAME
  "The sort order."
  order: SortOrderEnum! = ASC
}

`;
