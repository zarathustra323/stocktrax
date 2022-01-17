import gql from 'graphql-tag';

// eslint-disable-next-line
export const LIST_TRANSACTIONS = gql`
  query ListTransactions($input: QueryTransactionsInput = {}) {
    transactions(input: $input) {
      totalCount
      edges {
        node {
          id
          type {
            id
            name
          }
          date
          symbol {
            id
            symbol # @todo rename to security
            name
            exchange { id name }
          }
          shares
          price
          totalAmount
          portfolio { id name }
        }
      }
      pageInfo { endCursor }
    }
  }
`;
