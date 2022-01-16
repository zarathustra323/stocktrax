export default new Map([
  ['ref-data/symbols', {
    name: 'Symbols',
    buildFilter: (obj) => ({ symbol: obj.symbol }),
  }],
  ['ref-data/mutual-funds/symbols', {
    name: 'Mutual Fund Symbols',
    buildFilter: (obj) => ({ symbol: obj.symbol }),
  }],
  ['ref-data/crypto/symbols', {
    name: 'Cryptocurrency Symbols',
    buildFilter: (obj) => ({ symbol: obj.symbol }),
  }],
  ['ref-data/otc/symbols', {
    name: 'OTC Symbols',
    buildFilter: (obj) => ({ symbol: obj.symbol }),
  }],
  ['ref-data/market/us/exchanges', {
    name: 'U.S. Exchanges',
    buildFilter: (obj) => ({ mic: obj.mic }),
  }],
  ['ref-data/exchanges', {
    name: 'International Exchanges',
    buildFilter: (obj) => ({ segment: obj.segment }),
  }],
  ['ref-data/sectors', {
    name: 'Sectors',
    buildFilter: (obj) => ({ name: obj.name }),
  }],
  ['ref-data/tags', {
    name: 'Tags',
    buildFilter: (obj) => ({ name: obj.name }),
  }],
]);
