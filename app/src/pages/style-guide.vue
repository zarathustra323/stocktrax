<template>
  <div class="p-10">
    <div class="space-y-6">
      <div>
        <button-element>
          Action
        </button-element>
      </div>

      <div>
        <button-element :icon="SaveIcon">
          Action
        </button-element>
      </div>

      <div>
        <button-element :loading="true">
          Action
        </button-element>
      </div>

      <div>
        <error-element :error="error" />
      </div>
    </div>
  </div>
</template>

<script>
import { SaveIcon } from '@heroicons/vue/solid';
import ButtonElement from '../components/button.vue';
import ErrorElement from '../components/error.vue';

export default {
  name: 'IndexPage',

  components: {
    ButtonElement,
    ErrorElement,
  },

  data: () => ({
    error: new Error('A fatal error has occured. Please contact support.'),
    SaveIcon,
  }),
};
</script>
