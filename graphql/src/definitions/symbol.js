import { gql } from 'apollo-server-fastify';

export default gql`

extend type Query {
  symbols(input: QuerySymbolsInput = {}): QuerySymbolsConnection!
}

enum QuerySymbolsSortFieldEnum {
  ID
  NAME
  SYMBOL
}

enum SymbolTypeEnum {
  "ADR"
  AD
  "Unit"
  UT
  "Exchange Traded Fund (ETF)"
  ET
  "Right"
  RT
  "Common Stock"
  CS
  "Cryptocurrency"
  CRYPTO
  "Warrant"
  WT
  "Preferred Stock"
  PS
  "Mutual Fund"
  OEF
  "Structured Product"
  STRUCT
  "Empty / Other"
  EMPTY
}

type QuerySymbolsConnection @connectionProject(type: "Symbol") {
  "The total number of objects available for this connection."
  totalCount: Int!
  "The connection edges containing the related node and other related fields."
  edges: [QuerySymbolsEdge!]!
  "The paging information for this connection."
  pageInfo: PageInfo!
}

type QuerySymbolsEdge {
  "An opaque cursor for this node that is used with pagination."
  cursor: String!
  "The primary node/document."
  node: Symbol!
}

type Symbol {
  "The internal identifier."
  id: ObjectID! @project(field: "_id")
  # The symbol represented in Nasdaq Integrated symbology (INET)
  symbol: String! @project
  # The name of the company or security
  name: String! @project
  # The common issue type
  type: SymbolType! @project
  # The exchange segment where the security is traded. Not applicable to mutual funds or crypto.
  exchange: Exchange @project(field: "exchangeSegment")
  # The country code for the symbol using ISO 3166-1 alpha-2
  region: String @project
  # The currency the symbol is traded in using ISO 4217
  currency: String @project
  # Various security identifiers.
  identifiers: SymbolIdentifiers! @project(needs: ["cik", "figi", "iexId", "lei"])
  # Peers of this symbol.
  peers: [Symbol!]! @project(needs: ["symbol"])
}

type SymbolIdentifiers {
  "CIK number for the security if available"
  cik: String
  "OpenFIGI id for the security if available"
  figi: String
  "Unique ID applied by IEX to track securities through symbol changes"
  iex: String
  "The global legal entity identifier if available"
  lei: String
}

type SymbolType {
  "The symbol type identifier code."
  id: SymbolTypeEnum!
  "The symbol type name."
  name: String!
}

input QuerySymbolsInput {
  "The currencies, in ISO 4217, to filter by."
  currencies: [String!]! = []
  "The exchange segments to filter by. Will exclude crypto and mutual funds if set."
  exchanges: [String!]! = []
  "Specifies how the results should be paginated."
  pagination: PaginationInput! = {}
  "The country codes, in ISO 3166-1 alpha-2, to filter by."
  regions: [String!]! = []
  "A phrase to search symbols by. When set, the sort is set to relevancy."
  searchPhrase: String
  "Specifies the sort field and order."
  sort: QuerySymbolsSortInput! = {}
  "The security types to filter by."
  types: [SymbolTypeEnum!]! = []
}

input QuerySymbolsSortInput {
  "The field to sort by."
  field: QuerySymbolsSortFieldEnum! = SYMBOL
  "The sort order."
  order: SortOrderEnum! = ASC
}

`;
