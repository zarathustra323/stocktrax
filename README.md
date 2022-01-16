# Stocktrax

## General Resources / Concepts

### Market Identifier Code (MIC)
Links
- https://en.wikipedia.org/wiki/Market_Identifier_Code
- https://www.iso20022.org/market-identifier-codes
- http://www.iotafinance.com/en/ISO-10383-Market-Identification-Codes-MIC.html

## Open-Ended vs. Closed End Funds
Likely only need to care about open-ended funds (type: `oef`)

- https://www.investopedia.com/ask/answers/042315/what-are-primary-differences-between-closed-end-investment-and-open-end-investment.asp

## Nasdaq Integrated Symbology (INET)
- http://www.nasdaqtrader.com/trader.aspx?id=CQSsymbolconvention

## Legal Entity Identifier (LEI)
- https://www.treasury.gov/initiatives/wsr/ofr/documents/lei_faqs_august2012_final.pdf

## IEX Cloud
### Reference Data

#### Consolidated Symbols
Stored in the `stocktrax.symbols` collection. Sources data from the `iexcloud` raw data collections.

Unique key:
- `symbol` + `type`

Combines endpoints from `iexcloud`:
- `ref-data/symbols`
- `ref-data/crypto/symbols`
- `ref-data/mutual-funds/symbols`
  - filtered by `oef` (open-ended funds) only
- `ref-data/otc/symbols`

Symbol types:
- ad - ADR
- cs - Common Stock
- cef - Closed End Fund
- crypto - Cryptocurrency
- et - ETF
- oef - Open Ended Fund
- ps - Preferred Stock
- rt - Right
- struct - Structured Product
- ut - Unit
- wi - When Issued
- wt - Warrant
- empty - Other

Shape:
```js
const symbol = {
  _id: ObjectId(''),
  // Refers to the symbol represented in Nasdaq Integrated symbology (INET).
  symbol: 'A',
  // Refers to the common issue type
  type: 'cs',
  // CIK number for the security if available
  cik: '',
  // Refers to the currency the symbol is traded in using ISO 4217
  currency: '',
  // Refers to the date the symbol reference data was generated.
  date: '',

  // not-applicable for funds or crypto
  exchangeSegment: '',

  // OpenFIGI id for the security if available, or null
  figi: '',

  // Unique ID applied by IEX to track securities through symbol changes, or null
  iexId: '',

  // Will be true if the symbol is enabled for trading on IEX.
  isEnabled: true,

  // the global legal entity identifier, or null
  lei: '',

  // Refers to the name of the company or security.
  name: '',

  // Refers to the country code for the symbol using ISO 3166-1 alpha-2
  region: '',
};
```

To find unique type, currency and region values:
```js
db.getCollection('symbols').aggregate([
  {
    $group: {
      _id: null,
      type: { $addToSet: '$type' },
      currency: { $addToSet: '$currency' },
      region: { $addToSet: '$region' },
      exchangeSegment: { $addToSet: '$exchangeSegment' },
    },
  },
]);
```
