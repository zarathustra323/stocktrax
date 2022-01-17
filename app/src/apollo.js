import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client/core';

export default new ApolloClient({
  link: createHttpLink({ uri: import.meta.env.VITE_GRAPHQL_URL }),
  cache: new InMemoryCache(),
});
