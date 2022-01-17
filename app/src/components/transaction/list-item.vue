<template>
  <tr>
    <td class="p-1">
      {{ date }}
    </td>
    <td class="p-1">
      {{ node.type.name }}
    </td>
    <td class="p-1 flex items-center">
      <img :src="node.symbol.logoSrc" :class="imageClasses">
      {{ node.symbol.name }} ({{ node.symbol.symbol }})
    </td>
    <td class="p-1">
      {{ node.shares }}
    </td>
    <td class="p-1">
      {{ price }}
    </td>
    <td class="p-1">
      {{ totalAmount }}
    </td>
    <td class="p-1">
      {{ node.portfolio.name }}
    </td>
  </tr>
</template>

<script>
import dayjs from 'dayjs';
import formatNumber from '../../utils/format-number';

export default {
  props: {
    node: {
      type: Object,
      required: true,
    },
  },

  data: () => ({
    imageClasses: [
      'bg-white',
      'mr-3',
      'w-8',
      'h-8',
      'shadow',
      'rounded-full',
      'object-contain',
    ],
  }),

  computed: {
    date() {
      // @todo fix timezones
      return dayjs(this.node.date).format('MM/DD/YYYY');
    },
    price() {
      return formatNumber.usd(this.node.price, 3);
    },

    totalAmount() {
      return formatNumber.usd(this.node.totalAmount, 3);
    },
  },
};
</script>
