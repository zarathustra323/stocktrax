const { NumberFormat } = Intl;

export default {
  integer: (value) => new NumberFormat().format(parseInt(value, 10)),
  usd: (value, digits = 2) => new NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: digits }).format(value),
  percent: (value, digits = 2) => new NumberFormat('en-US', { style: 'percent', maximumFractionDigits: digits }).format(value),
};
