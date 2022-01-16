export default {
  Exchange: {
    name({ name, usExchangeInfo }) {
      if (usExchangeInfo) return usExchangeInfo.name;
      return name;
    },
  },
};
