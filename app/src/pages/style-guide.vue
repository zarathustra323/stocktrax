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
    </div>
  </div>
</template>

<script>
import { SaveIcon } from '@heroicons/vue/solid';
import ButtonElement from '../components/button.vue';

export default {
  name: 'IndexPage',

  components: {
    ButtonElement,
  },

  data: () => ({
    SaveIcon,
  }),
};
</script>
