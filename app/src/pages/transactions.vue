<template>
  <div class="space-x-6">
    <h1 class="text-2xl font-bold">
      Transactions
      <span v-if="isLoading" class="text-base">
        (loading)
      </span>
    </h1>

    <table class="w-full">
      <thead>
        <tr>
          <th class="p-1 text-left">
            Date
          </th>
          <th class="p-1 text-left">
            Type
          </th>
          <th class="p-1 text-left">
            Security
          </th>
          <th class="p-1 text-left">
            Shares
          </th>
          <th class="p-1 text-left">
            Price
          </th>
          <th class="p-1 text-left">
            Amount
          </th>
          <th class="p-1 text-left">
            Portfolio
          </th>
        </tr>
      </thead>
      <tbody>
        <list-item v-for="node in nodes" :key="node.id" :node="node" />
      </tbody>
    </table>

    <error-element :error="error" />
  </div>
</template>

<script>
import ErrorElement from '../components/error.vue';
import ListItem from '../components/transaction/list-item.vue';

import { LIST_TRANSACTIONS } from '../graphql/queries';
import GraphQLError from '../graphql/error';

export default {
  name: 'TransactionsPage',

  components: {
    ErrorElement,
    ListItem,
  },

  apollo: {
    transactions: {
      query: LIST_TRANSACTIONS,
      fetchPolicy: 'cache-and-network',
      variables() {
        return {};
      },
      error(e) { this.error = new GraphQLError(e); },
      watchLoading(isLoading) {
        this.isLoading = isLoading;
        if (isLoading) this.error = null;
      },
    },
  },

  data: () => ({
    error: null,
    isLoading: false,
    transactions: {
      totalCount: 0,
      edges: [],
      pageInfo: {},
    },
  }),

  computed: {
    nodes() {
      return this.transactions.edges.map((edge) => edge.node);
    },
  },
};
</script>
