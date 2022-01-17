<template>
  <div
    :class="containerClasses"
    role="alert"
  >
    <div class="flex">
      <div v-if="icon" class="flex-shrink-0">
        <component :is="icon" :class="iconClasses" />
      </div>
      <div>
        <slot name="header">
          <h3
            v-if="header"
            :class="headerClasses"
          >
            {{ header }}
          </h3>
        </slot>
        <div :class="bodyClasses">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AlertElement',

  props: {
    header: {
      type: String,
      default: null,
    },
    color: {
      type: String,
      default: 'amber',
      validator: (value) => ['amber'].includes(value),
    },
    icon: {
      type: Function,
      default: null,
    },
  },

  computed: {
    alertColor() {
      if (this.color === 'amber') return 'text-amber-400/90';
      return 'text-slate-300';
    },

    containerClasses() {
      return [
        'p-4',
        'rounded-md',
        'shadow',
        'bg-slate-800/80',
        'border',
        'border-slate-400/20',
      ];
    },

    iconClasses() {
      return [this.alertColor, 'h-7', 'w-7', '-ml-1', 'mr-3'];
    },

    headerClasses() {
      return [this.alertColor, 'text-base', 'leading-5', 'font-semibold'];
    },

    bodyClasses() {
      const classes = ['text-slate-400', 'text-sm', 'leading-5'];
      if (this.header) classes.push('mt-2');
      return classes;
    },
  },
};
</script>
