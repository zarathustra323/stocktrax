<template>
  <alert-element
    v-if="error"
    color="amber"
    :icon="XCircleIcon"
    :header="header"
  >
    {{ error.message }}
  </alert-element>
</template>

<script>
import { XCircleIcon } from '@heroicons/vue/solid';
import AlertElement from './alert.vue';

export default {
  name: 'ErrorAlert',

  components: {
    AlertElement,
  },

  props: {
    error: {
      type: Error,
      default: null,
    },

    header: {
      type: String,
      default: 'Uh-Oh',
    },
  },

  data: () => ({
    XCircleIcon,
  }),
};
</script>
