import { gql } from 'apollo-server-fastify';

export default gql`

extend type Query {
  symbols(input: QuerySymbolsInput = {}): [Symbol!]!
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

type Symbol {
  id: ObjectID!
  # The symbol represented in Nasdaq Integrated symbology (INET)
  symbol: String!
  # The name of the company or security
  name: String!
  # The common issue type
  type: SymbolType!
  # The exchange segment where the security is traded. Not applicable to mutual funds or crypto.
  exchange: String
  # The country code for the symbol using ISO 3166-1 alpha-2
  region: String
  # The currency the symbol is traded in using ISO 4217
  currency: String
  # Various security identifiers.
  identifiers: SymbolIdentifiers!
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
  "The country codes, in ISO 3166-1 alpha-2, to filter by."
  regions: [String!]! = []
  "The security types to filter by."
  types: [SymbolTypeEnum!]! = []
}

`;
